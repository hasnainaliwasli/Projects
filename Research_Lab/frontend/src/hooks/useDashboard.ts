'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats, ApiResponse } from '@/types';

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
            return data.data;
        },
    });
}
