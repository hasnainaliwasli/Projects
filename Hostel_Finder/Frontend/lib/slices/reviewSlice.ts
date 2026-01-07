import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "@/lib/types";
import api from "@/lib/api";

interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchReviews = createAsyncThunk(
    'reviews/fetchByHostel',
    async (hostelId: string, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/reviews/hostel/${hostelId}`);
            // Normalize: map _id to id, user to userId, hostel to hostelId
            return data.map((r: any) => ({ ...r, id: r._id, userId: r.user, hostelId: r.hostel }));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/create',
    async (reviewData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/reviews', reviewData);
            // Normalize response
            return { ...data, id: data._id, userId: data.user, hostelId: data.hostel };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to post review');
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/update',
    async (reviewData: any, { rejectWithValue }) => {
        try {
            const { id, ...data } = reviewData;
            const response = await api.put(`/reviews/${id}`, data);
            return { ...response.data, id: response.data._id, userId: response.data.user, hostelId: response.data.hostel };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/reviews/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete review');
        }
    }
);

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            // Create
            .addCase(createReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload);
            })
            // Update
            .addCase(updateReview.fulfilled, (state, action) => {
                const index = state.reviews.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(r => r.id !== action.payload);
            });
    },
});

export default reviewSlice.reducer;
