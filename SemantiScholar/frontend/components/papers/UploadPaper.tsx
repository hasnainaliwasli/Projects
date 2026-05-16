"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UploadPaperProps {
  onUploadSuccess?: (paperId?: string) => void;
}

export default function UploadPaper({ onUploadSuccess }: UploadPaperProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setUploadStatus("idle");
      } else {
        toast.error("Only PDF files are allowed");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setUploadStatus("idle");
      } else {
        toast.error("Only PDF files are allowed");
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadStatus("idle");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("uploading");
    setProgress(0);

    try {
      const response = await api.post("/papers/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
          setProgress(percentCompleted);
        },
      });

      setUploadStatus("success");
      toast.success("Document processed successfully");
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      
      if (onUploadSuccess) onUploadSuccess(response.data.data._id);
      
      setTimeout(() => {
        clearFile();
      }, 3000);
      
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.response?.data?.message || "Failed to upload document");
      toast.error("Failed to process document");
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all ${
              dragActive
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                : "border-surface-300 hover:border-primary-400 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/30"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleChange}
            />
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 cursor-pointer">
              <div className="w-12 h-12 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <UploadCloud size={24} />
              </div>
              <p className="mb-2 text-sm text-surface-600 dark:text-surface-300">
                <span className="font-semibold text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                PDF documents only (max 10MB)
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full border border-surface-200 dark:border-surface-700 rounded-2xl p-6 bg-white dark:bg-dark-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 line-clamp-1">
                    {file.name}
                  </h4>
                  <p className="text-xs text-surface-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {uploadStatus === "idle" && (
                <button
                  onClick={clearFile}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {uploadStatus === "uploading" && (
              <div className="w-full mb-4">
                <div className="flex justify-between text-xs mb-1.5 text-surface-600 dark:text-surface-400">
                  <span>Uploading & Extracting text...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center gap-2 text-sm text-error mb-4 bg-error/10 p-3 rounded-lg border border-error/20">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex items-center gap-2 text-sm text-success mb-4 bg-success/10 p-3 rounded-lg border border-success/20">
                <CheckCircle size={16} />
                <span>Document successfully extracted and chunked!</span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              {uploadStatus !== "uploading" && uploadStatus !== "success" && (
                <>
                  <button
                    onClick={clearFile}
                    className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-colors"
                  >
                    Process Document
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
