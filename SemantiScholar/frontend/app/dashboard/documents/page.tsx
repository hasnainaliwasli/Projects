"use client";

import { Container } from "@/components/ui";
import { motion } from "framer-motion";
import UploadPaper from "@/components/papers/UploadPaper";
import PaperList from "@/components/papers/PaperList";

export default function DocumentsPage() {
  return (
    <Container size="xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Documents
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Upload and manage your research papers.
        </p>
      </motion.div>

      <div className="grid gap-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-surface-200 dark:border-dark-border p-6">
            <h2 className="text-lg font-semibold mb-4 text-surface-900 dark:text-surface-100">
              Upload New Document
            </h2>
            <UploadPaper />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Document Library
            </h2>
          </div>
          <PaperList />
        </motion.section>
      </div>
    </Container>
  );
}
