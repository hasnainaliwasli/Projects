import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Hostel, HostelFilters } from "@/lib/types";
import api from "@/lib/api";

interface HostelState {
    hostels: Hostel[];
    searchResults: Hostel[];
    loading: boolean;
    error: string | null;
    viewMode: 'public' | 'owner' | 'admin' | null;
}

const initialState: HostelState = {
    hostels: [],
    searchResults: [],
    loading: false,
    error: null,
    viewMode: null,
};

// Async Thunks
export const fetchHostels = createAsyncThunk(
    'hostels/fetchAll',
    async (filters: any = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (filters.city) params.append('city', filters.city);
            if (filters.isFor) params.append('isFor', filters.isFor);
            if (filters.owner) params.append('owner', filters.owner); // For owner dashboard
            if (filters.mode) params.append('mode', filters.mode); // For admin dashboard

            const { data } = await api.get(`/hostels?${params.toString()}`);
            // Map backend _id to frontend id, owner to ownerId, and reviews to reviewIds
            return data.map((h: any) => ({ ...h, id: h._id, ownerId: h.owner, reviewIds: h.reviews || [] }));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch hostels');
        }
    }
);

export const addHostel = createAsyncThunk(
    'hostels/add',
    async (hostelData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/hostels', hostelData);
            return { ...data, id: data._id, ownerId: data.owner, reviewIds: data.reviews || [] };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to add hostel');
        }
    }
);

export const modifyHostel = createAsyncThunk(
    'hostels/modify',
    async (hostelData: any, { rejectWithValue }) => {
        try {
            const { id, ...data } = hostelData;
            const response = await api.put(`/hostels/${id}`, data);
            return { ...response.data, id: response.data._id, ownerId: response.data.owner, reviewIds: response.data.reviews || [] };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update hostel');
        }
    }
);

export const removeHostel = createAsyncThunk(
    'hostels/remove',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/hostels/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete hostel');
        }
    }
);
// Status update thunks
export const updateHostelStatus = createAsyncThunk(
    'hostels/updateStatus',
    async ({ id, status }: { id: string, status: 'approved' | 'rejected' }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/hostels/${id}/status`, { status });
            return { ...data, id: data._id, ownerId: data.owner, reviewIds: data.reviews || [] };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update hostel status');
        }
    }
);

const hostelSlice = createSlice({
    name: "hostel",
    initialState,
    reducers: {
        setHostels: (state, action: PayloadAction<Hostel[]>) => {
            state.hostels = action.payload;
            state.searchResults = action.payload;
        },
        setViewMode: (state, action: PayloadAction<'public' | 'owner' | 'admin'>) => {
            state.viewMode = action.payload;
        },
        searchHostels: (state, action: PayloadAction<HostelFilters>) => {
            // Client-side filtering fallback, ideally this logic is moved to backend (fetchHostels)
            const filters = action.payload;
            state.searchResults = state.hostels.filter((hostel) => {
                if (filters.city && !hostel.location.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
                if (filters.area && !hostel.location.area.toLowerCase().includes(filters.area.toLowerCase())) return false;
                if (filters.minPrice && hostel.rent < filters.minPrice) return false;
                if (filters.maxPrice && hostel.rent > filters.maxPrice) return false;
                if (filters.isFor && hostel.isFor !== filters.isFor) return false;
                if (filters.availability && hostel.availability !== filters.availability) return false;
                if (filters.roomType && !hostel.rooms.some((r) => r.type === filters.roomType)) return false;
                return true;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchHostels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHostels.fulfilled, (state, action) => {
                state.loading = false;
                state.hostels = action.payload;
                state.searchResults = action.payload;
                state.error = null;

                // Determine view mode based on fetch arguments
                const filters = action.meta.arg || {};
                if (filters.owner) {
                    state.viewMode = 'owner';
                } else if (filters.mode === 'admin') {
                    state.viewMode = 'admin';
                } else {
                    state.viewMode = 'public';
                }
            })
            .addCase(fetchHostels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addHostel.fulfilled, (state, action) => {
                state.hostels.push(action.payload);
                state.searchResults.push(action.payload);
            })
            // Update
            .addCase(modifyHostel.fulfilled, (state, action) => {
                const index = state.hostels.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.hostels[index] = action.payload;
                    // Also update searchResults if present
                    const searchIndex = state.searchResults.findIndex(h => h.id === action.payload.id);
                    if (searchIndex !== -1) {
                        state.searchResults[searchIndex] = action.payload;
                    }
                }
            })
            // Remove
            .addCase(removeHostel.fulfilled, (state, action) => {
                state.hostels = state.hostels.filter(h => h.id !== action.payload);
                state.searchResults = state.searchResults.filter(h => h.id !== action.payload);
            })
            // Status update
            .addCase(updateHostelStatus.fulfilled, (state, action) => {
                const index = state.hostels.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.hostels[index] = action.payload;
                    const searchIndex = state.searchResults.findIndex(h => h.id === action.payload.id);
                    if (searchIndex !== -1) {
                        state.searchResults[searchIndex] = action.payload;
                    }
                }
            });
    },
});

export const { setHostels, searchHostels, setViewMode } = hostelSlice.actions;
export default hostelSlice.reducer;
