"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, ChevronLeft, Calendar, File, Plus, Trash2 } from "lucide-react";
import { Container, Card, Button } from "@/components/ui";
import api from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import UploadPaper from "@/components/papers/UploadPaper";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}`);
      return res.data.data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (paperId: string) => {
      return await api.post(`/projects/${projectId}/papers`, { paperId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      setIsUploading(false);
      toast.success("Document added to project successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign document");
    },
  });

  const handleUploadSuccess = (paperId?: string) => {
    if (paperId) {
      assignMutation.mutate(paperId);
    } else {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      setIsUploading(false);
    }
  };

  const [paperToRemove, setPaperToRemove] = useState<string | null>(null);

  const removePaperMut = useMutation({
    mutationFn: async (paperId: string) => {
      await api.delete(`/projects/${projectId}/papers/${paperId}`);
      await api.delete(`/papers/${paperId}`);
    },
    onSuccess: () => {
      toast.success("Paper deleted");
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      setPaperToRemove(null);
    },
    onError: () => {
      toast.error("Failed to delete paper");
      setPaperToRemove(null);
    },
  });

  const handleRemovePaper = (e: React.MouseEvent, paperId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPaperToRemove(paperId);
  };

  const confirmRemovePaper = () => {
    if (paperToRemove) {
      removePaperMut.mutate(paperToRemove);
    }
  };

  if (isLoading) {
    return (
      <Container size="xl" className="py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/4 bg-surface-200 dark:bg-surface-800 rounded"></div>
          <div className="h-32 w-full bg-surface-100 dark:bg-surface-800 rounded-2xl"></div>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container size="xl" className="py-8 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link href="/dashboard/projects" className="text-primary-500 hover:underline mt-4 inline-block">
          Return to Projects
        </Link>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors mb-4">
          <ChevronLeft size={16} /> Back to Projects
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <Folder size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="mt-1 text-surface-500 dark:text-surface-400 max-w-2xl">
              {project.description || "No description provided for this project."}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} className="text-surface-400" />
              Assigned Documents
            </h2>
            <Button size="sm" onClick={() => setIsUploading(!isUploading)} className="gap-2">
               {isUploading ? "Cancel" : <><Plus size={16} /> Add Document</>}
            </Button>
          </div>
          
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-4 bg-primary-50/50 dark:bg-primary-950/10 border-primary-100 dark:border-primary-900/30">
                  <h3 className="text-sm font-semibold mb-3 text-primary-800 dark:text-primary-300">Upload & Assign New Document</h3>
                  <UploadPaper onUploadSuccess={handleUploadSuccess} />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          {project.papers && project.papers.length > 0 ? (
            <div className="space-y-3">
              {project.papers.map((paper: any, i: number) => (
                <motion.div
                  key={paper._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/dashboard/documents/${paper._id}`} className="block">
                    <Card hoverable className="p-4 flex items-start gap-4 group">
                      <div className="p-3 bg-surface-100 text-surface-500 dark:bg-surface-800 rounded-xl">
                        <File size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-surface-900 dark:text-surface-100 truncate">
                          {paper.fileName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-xs text-surface-500">
                          <Calendar size={12} />
                          Uploaded {new Date(paper.createdAt).toLocaleDateString()}
                        </div>
                        {paper.notes && (
                          <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-lg text-sm text-surface-700 dark:text-surface-300 border border-primary-100 dark:border-primary-900/30">
                            <span className="font-semibold text-xs uppercase tracking-wider text-primary-600 dark:text-primary-400 block mb-1">Notes snippet</span>
                            {paper.notes.length > 150 ? paper.notes.substring(0, 150) + "..." : paper.notes}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleRemovePaper(e, paper._id)}
                        className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all shrink-0"
                        title="Remove from project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-2xl bg-surface-50 dark:bg-surface-900/20">
               <FileText size={32} className="mx-auto text-surface-400 mb-4" />
               <p className="text-surface-500">No documents assigned to this project yet.</p>
               <p className="text-sm text-surface-400 mt-2">You can assign papers from the Documents tab. (API ready)</p>
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Project Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-800">
                <span className="text-sm text-surface-500">Created</span>
                <span className="text-sm font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-800">
                <span className="text-sm text-surface-500">Total Documents</span>
                <span className="text-sm font-medium">{project.papers?.length || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!paperToRemove}
        onClose={() => setPaperToRemove(null)}
        onConfirm={confirmRemovePaper}
        title="Delete Paper"
        message="Are you sure you want to permanently delete this paper? It will be removed from the project and entirely destroyed. This action cannot be undone."
        confirmText="Delete Paper"
        isConfirming={removePaperMut.isPending}
      />
    </Container>
  );
}
