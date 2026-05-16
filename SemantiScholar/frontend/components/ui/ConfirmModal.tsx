"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";
import Button from "./Button";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isConfirming = false,
}: ConfirmModalProps) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={!isConfirming ? onClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-dark-card shadow-2xl border border-surface-200 dark:border-dark-border pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-surface-100 dark:border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <AlertTriangle size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  disabled={isConfirming}
                  className="rounded-full p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300 transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 bg-surface-50 dark:bg-surface-900/50 border-t border-surface-100 dark:border-surface-800">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isConfirming}
                  className="w-full sm:w-auto"
                >
                  {cancelText}
                </Button>
                <button
                  onClick={onConfirm}
                  disabled={isConfirming}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 transition-all"
                >
                  {isConfirming && <Loader2 size={16} className="animate-spin" />}
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
