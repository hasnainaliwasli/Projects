'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Experiment, ExperimentRun, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export function useExperiments(params?: { projectId?: string }) {
    return useQuery({
        queryKey: ['experiments', params],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Experiment[]>>('/experiments', { params });
            return data.data;
        },
    });
}

export function useExperiment(id: string) {
    return useQuery({
        queryKey: ['experiment', id],
        queryFn: async () => {
            const { data } = await api.get(`/experiments/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

export function useCreateExperiment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (exp: Partial<Experiment>) => {
            const { data } = await api.post('/experiments', exp);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
            toast.success('Experiment created');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}

export function useDeleteExperiment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => { await api.delete(`/experiments/${id}`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
            toast.success('Experiment deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}

export function useCreateExperimentRun() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await api.post('/experiments/runs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiment'] });
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
            toast.success('Run recorded');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}
