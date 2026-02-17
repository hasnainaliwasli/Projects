'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Note, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export function useNotes(params?: { projectId?: string; paperId?: string }) {
    return useQuery({
        queryKey: ['notes', params],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Note[]>>('/notes', { params });
            return data.data;
        },
    });
}

export function useNote(id: string) {
    return useQuery({
        queryKey: ['note', id],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Note>>(`/notes/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

export function useCreateNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (note: Partial<Note>) => {
            const { data } = await api.post('/notes', note);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            toast.success('Note created');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}

export function useUpdateNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, sections }: { id: string; sections: any }) => {
            const { data } = await api.put(`/notes/${id}`, { sections });
            return data.data;
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['note', vars.id] });
        },
    });
}

export function useDeleteNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => { await api.delete(`/notes/${id}`); },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            toast.success('Note deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
}

export function useNoteVersions(id: string) {
    return useQuery({
        queryKey: ['note-versions', id],
        queryFn: async () => {
            const { data } = await api.get(`/notes/${id}/versions`);
            return data.data;
        },
        enabled: !!id,
    });
}
