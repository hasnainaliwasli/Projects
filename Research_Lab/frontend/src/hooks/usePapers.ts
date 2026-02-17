'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Paper, SimilarPaper, PaginatedResponse, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export function usePapers(params?: { projectId?: string; search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['papers', params],
        queryFn: async () => {
            const { data } = await api.get<PaginatedResponse<Paper>>('/papers', { params });
            return data;
        },
    });
}

export function usePaper(id: string) {
    return useQuery({
        queryKey: ['paper', id],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Paper>>(`/papers/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

export function useUploadPaper() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await api.post('/papers/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Paper uploaded successfully');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Upload failed'),
    });
}

export function useDeletePaper() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => { await api.delete(`/papers/${id}`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers'] });
            toast.success('Paper deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });
}

export function useBulkDeletePapers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: string[]) => { await api.post('/papers/bulk-delete', { ids }); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers'] });
            toast.success('Papers deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });
}

export function useSimilarPapers(paperId: string) {
    return useQuery({
        queryKey: ['similar-papers', paperId],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<SimilarPaper[]>>(`/papers/${paperId}/similar`);
            return data.data;
        },
        enabled: !!paperId,
    });
}

export function useRegenerateSummary() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post(`/papers/${id}/regenerate-summary`);
            return data.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['paper', id] });
            toast.success('Summary regenerated');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to regenerate'),
    });
}
