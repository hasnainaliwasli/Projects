import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types";
import api from "@/lib/api";
import { updateCurrentUser } from "./authSlice";

interface UserState {
    users: User[];
    archivedUsers: User[];
    blockedUsers: any[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    archivedUsers: [],
    blockedUsers: [],
    loading: false,
    error: null,
};

export const toggleFavorite = createAsyncThunk(
    'user/toggleFavorite',
    async ({ userId, hostelId, isAdding }: { userId: string, hostelId: string, isAdding: boolean }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/users/favorites/${hostelId}`);
            const normalizedFavorites = data.map((id: any) => typeof id === 'string' ? id : id.toString());
            dispatch(updateCurrentUser({ favoriteHostels: normalizedFavorites }));
            return { userId, hostelId, isAdding };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to toggle favorite');
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'user/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users');
            // Normalize: map _id to id
            return data.map((u: any) => ({ ...u, id: u._id }));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const modifyUser = createAsyncThunk(
    'user/modifyUser',
    async (userData: Partial<User>, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/users/${userData.id}`, userData);
            // Normalize response: map _id to id
            const normalized = { ...data, id: data._id };
            dispatch(updateCurrentUser(normalized));
            return normalized;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const removeUser = createAsyncThunk(
    'user/removeUser',
    async ({ userId, deleteData }: { userId: string, deleteData: boolean }, { rejectWithValue }) => {
        try {
            await api.delete(`/users/${userId}`, { data: { deleteData } });
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete account');
        }
    }
);

export const fetchArchivedUsers = createAsyncThunk(
    'user/fetchArchived',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/archived');
            return data.map((u: any) => ({ ...u, id: u._id }));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch archived users');
        }
    }
);

export const permanentDeleteUser = createAsyncThunk(
    'user/permanentDelete',
    async (userId: string, { rejectWithValue }) => {
        try {
            await api.delete(`/users/permanent/${userId}`);
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to permanently delete user');
        }
    }
);



export const restoreUser = createAsyncThunk(
    'user/restoreUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            await api.put(`/users/restore/${userId}`);
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to restore user');
        }
    }
);

export const fetchBlockedUsers = createAsyncThunk(
    'user/fetchBlocked',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/block');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch blocked users');
        }
    }
);

export const blockUser = createAsyncThunk(
    'user/blockUser',
    async ({ email, reason }: { email: string, reason?: string }, { rejectWithValue }) => {
        try {
            await api.post('/users/block', { email, reason });
            return { email, reason };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to block user');
        }
    }
);

export const unblockUser = createAsyncThunk(
    'user/unblockUser',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/users/block/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to unblock user');
        }
    }
);

export const uploadProfileImage = createAsyncThunk(
    'user/uploadProfileImage',
    async (imageBlob: Blob, { dispatch, rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('profileImage', imageBlob, 'profile.jpg');

            const { data } = await api.post('/users/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch(updateCurrentUser({ profileImage: data.profileImage }));
            return data.profileImage;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to upload profile image');
        }
    }
);

export const deleteProfileImage = createAsyncThunk(
    'user/deleteProfileImage',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.delete('/users/profile-image');
            dispatch(updateCurrentUser({ profileImage: data.profileImage }));
            return data.profileImage;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete profile image');
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            })
            // Fetch Archived
            .addCase(fetchArchivedUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchArchivedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.archivedUsers = action.payload;
            })
            .addCase(fetchArchivedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Permanent Delete
            .addCase(permanentDeleteUser.fulfilled, (state, action) => {
                state.archivedUsers = state.archivedUsers.filter(u => u.id !== action.payload);
            })
            // Restore User
            .addCase(restoreUser.fulfilled, (state, action) => {
                state.archivedUsers = state.archivedUsers.filter(u => u.id !== action.payload);
                // We don't need to add to users list manually as fetching users again will handle it, 
                // but we could if we wanted immediate update without refetch.
                // For simplicity/consistency, let's just remove from archived.
            })
            // Fetch Blocked
            .addCase(fetchBlockedUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.blockedUsers = action.payload;
            })
            .addCase(fetchBlockedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Block User
            .addCase(blockUser.fulfilled, (state, action) => {
                // If we have the full object returned from backend we could append, but we just returned inputs
                // Re-fetching might be safer or constructing a partial object
            })
            // Unblock User
            .addCase(unblockUser.fulfilled, (state, action) => {
                state.blockedUsers = state.blockedUsers.filter(u => u._id !== action.payload);
            });
    },
});

export default userSlice.reducer;
