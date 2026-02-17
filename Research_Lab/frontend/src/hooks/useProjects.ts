'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, PaginatedResponse, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export function useProjects(params?: { status?: string; search?: string; page?: number }) {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: async () => {
            const { data } = await api.get<PaginatedResponse<Project>>('/projects', { params });
            return data;
        },
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (project: Partial<Project>) => {
            const { data } = await api.post('/projects', project);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project created successfully');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create project'),
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string } & Partial<Project>) => {
            const { data } = await api.put(`/projects/${id}`, updates);
            return data.data;
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', vars.id] });
            toast.success('Project updated');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update project'),
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete project'),
    });
}
