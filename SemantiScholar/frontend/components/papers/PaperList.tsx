"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { FileText, Eye, Clock, Loader2, ChevronRight, Save, ExternalLink, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Paper {
  _id: string;
  fileName: string;
  createdAt: string;
}

export default function PaperList() {
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const deletePaperMut = useMutation({
    mutationFn: (id: string) => api.delete(`/papers/${id}`),
    onSuccess: (_, deletedId) => {
      toast.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      if (selectedPaperId === deletedId) setSelectedPaperId(null);
      setDocumentToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete document");
      setDocumentToDelete(null);
    },
  });

  const handleDeletePaper = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDocumentToDelete(id);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deletePaperMut.mutate(documentToDelete);
    }
  };

  const { data: papers, isLoading } = useQuery({
    queryKey: ["papers"],
    queryFn: async () => {
      const res = await api.get("/papers");
      return res.data.data as Paper[];
    },
  });

  const { data: paperDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["papers", selectedPaperId],
    queryFn: async () => {
      if (!selectedPaperId) return null;
      const res = await api.get(`/papers/${selectedPaperId}`);
      return res.data.data;
    },
    enabled: !!selectedPaperId,
  });

  useEffect(() => {
    if (paperDetails) {
      setNotes(paperDetails.notes || "");
    }
  }, [paperDetails]);

  const handleSaveNotes = async () => {
    if (!selectedPaperId) return;
    setIsSaving(true);
    try {
      await api.put(`/papers/${selectedPaperId}/notes`, { notes });
      toast.success("Notes saved successfully");
      queryClient.invalidateQueries({ queryKey: ["papers", selectedPaperId] });
    } catch (error) {
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!papers || papers.length === 0) {
    return (
      <div className="text-center p-12 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-2xl bg-surface-50 dark:bg-surface-900/20">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-surface-500">
          <FileText size={24} />
        </div>
        <h3 className="text-sm font-medium text-surface-900 dark:text-surface-100">No documents yet</h3>
        <p className="mt-1 text-sm text-surface-500">Upload your first PDF to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List Column */}
      <div className="col-span-1 lg:col-span-1 border border-surface-200 dark:border-surface-800 rounded-2xl bg-white dark:bg-dark-card overflow-hidden flex flex-col max-h-[700px]">
        <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
          <h3 className="font-medium text-sm text-surface-700 dark:text-surface-300">Your Documents</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {papers.map((paper) => (
            <div
              key={paper._id}
              onClick={() => setSelectedPaperId(paper._id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left group cursor-pointer ${
                selectedPaperId === paper._id
                  ? "bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30"
                  : "hover:bg-surface-50 dark:hover:bg-surface-800/50 border-transparent"
              } border`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                selectedPaperId === paper._id 
                  ? "bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400" 
                  : "bg-surface-100 text-surface-500 dark:bg-surface-800"
              }`}>
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  selectedPaperId === paper._id ? "text-primary-700 dark:text-primary-300" : "text-surface-700 dark:text-surface-300"
                }`}>
                  {paper.fileName}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-surface-400">
                  <Clock size={10} />
                  {new Date(paper.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => handleDeletePaper(e, paper._id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all"
                  title="Delete document"
                >
                  <Trash2 size={14} />
                </button>
                <ChevronRight size={16} className={`shrink-0 ${
                  selectedPaperId === paper._id ? "text-primary-500 opacity-100" : "text-surface-300 opacity-0 group-hover:opacity-100"
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Column */}
      <div className="col-span-1 lg:col-span-2 border border-surface-200 dark:border-surface-800 rounded-2xl bg-white dark:bg-dark-card overflow-hidden flex flex-col max-h-[700px]">
        {selectedPaperId ? (
          <>
            {isLoadingDetails ? (
              <div className="flex-1 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : paperDetails ? (
              <>
                <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
                      <Eye size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">{paperDetails.fileName}</h3>
                      <p className="text-xs text-surface-500">
                        Processed into {paperDetails.chunks?.length || 0} chunks
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/documents/${selectedPaperId}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                  >
                    <ExternalLink size={14} />
                    Open Viewer
                  </Link>
                </div>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Extracted Text */}
                  <div className="flex-1 overflow-y-auto p-6 text-sm text-surface-700 dark:text-surface-300 leading-relaxed font-serif whitespace-pre-wrap border-b border-surface-200 dark:border-surface-800">
                    <div className="mb-4 font-semibold text-surface-900 dark:text-surface-100 sans-serif">Extracted Content</div>
                    {paperDetails.extractedText}
                  </div>

                  {/* Annotations/Notes Area */}
                  <div className="h-64 flex flex-col bg-surface-50 dark:bg-surface-900/30">
                    <div className="flex items-center justify-between px-6 py-3 border-b border-surface-200 dark:border-surface-800">
                      <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Personal Notes</h4>
                      <button
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Notes
                      </button>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your annotations and research notes here..."
                      className="flex-1 w-full p-6 resize-none bg-transparent outline-none text-sm text-surface-800 dark:text-surface-200 placeholder:text-surface-400"
                    />
                  </div>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-surface-50 dark:bg-surface-900/30 flex items-center justify-center text-surface-300 dark:text-surface-600">
              <Eye size={32} />
            </div>
            <p className="text-surface-500">Select a document from the list to preview its extracted text.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message="Are you sure you want to permanently delete this document? This action cannot be undone."
        confirmText="Delete Document"
        isConfirming={deletePaperMut.isPending}
      />
    </div>
  );
}
