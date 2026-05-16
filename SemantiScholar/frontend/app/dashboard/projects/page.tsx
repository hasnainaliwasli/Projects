"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, Folder, Loader2, FileText, ChevronRight, Trash2 } from "lucide-react";
import { Container, Button, Card } from "@/components/ui";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  name: string;
  description: string;
  papers: any[];
  createdAt: string;
}

export default function ProjectsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data.data as Project[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/projects", {
        name: newProjectName,
        description: newProjectDesc,
      });
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreating(false);
      setNewProjectName("");
      setNewProjectDesc("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create project");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    createMutation.mutate();
  };

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      toast.success("Project and its papers deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      setProjectToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete project");
      setProjectToDelete(null);
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete);
    }
  };

  return (
    <Container size="xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Projects</h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            Organize your research papers into focused workspaces.
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="shrink-0 gap-2">
          {isCreating ? "Cancel" : <><FolderPlus size={18} /> New Project</>}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-primary-50 dark:bg-primary-950/20 border-primary-200 mb-5 dark:border-primary-900">
              <form onSubmit={handleCreate} className="space-y-4">
                <h3 className="font-semibold text-primary-900 dark:text-primary-100 text-lg">Create New Project</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Project Name</label>
                    <input
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="e.g., Computer Vision Thesis"
                      className="w-full h-10 rounded-xl border border-surface-200 bg-white px-3 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-dark-card dark:focus:ring-primary-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description (Optional)</label>
                    <input
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      placeholder="Brief details about this project..."
                      className="w-full h-10 rounded-xl border border-surface-200 bg-white px-3 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-dark-card dark:focus:ring-primary-900 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={createMutation.isPending} disabled={!newProjectName.trim()}>
                    Save Project
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-40 bg-surface-100 dark:bg-surface-800 border-none" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/projects/${project._id}`} className="block h-full">
                <Card hoverable className="h-full flex flex-col group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 group-hover:scale-105 transition-transform">
                      <Folder size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
                      <p className="text-sm text-surface-500 line-clamp-1 mt-0.5">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-surface-600 dark:text-surface-400">
                      <FileText size={16} />
                      {project.papers?.length || 0} Papers
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(e, project._id)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all z-10"
                        title="Delete project"
                      >
                        <Trash2 size={15} />
                      </button>
                      <ChevronRight size={18} className="text-surface-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-3xl bg-surface-50 dark:bg-surface-900/20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-surface-500">
            <Folder size={32} />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">No projects yet</h3>
          <p className="mt-2 text-surface-500 max-w-sm mx-auto">
            Create your first project to start organizing your research papers and annotations.
          </p>
          <Button onClick={() => setIsCreating(true)} className="mt-6">
            Create Project
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project? All associated papers and annotations will be destroyed. This action cannot be undone."
        confirmText="Delete Project"
        isConfirming={deleteMutation.isPending}
      />
    </Container>
  );
}
