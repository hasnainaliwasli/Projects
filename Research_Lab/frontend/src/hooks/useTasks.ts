'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Task, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export function useTasks(params?: { projectId?: string; status?: string }) {
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Task[]>>('/tasks', { params });
            return data.data;
        },
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task: Partial<Task>) => {
            const { data } = await api.post('/tasks', task);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task created');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string } & Partial<Task>) => {
            const { data } = await api.put(`/tasks/${id}`, updates);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task updated');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await api.patch(`/tasks/${id}/status`, { status });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => { await api.delete(`/tasks/${id}`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}
