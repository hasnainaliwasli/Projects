import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, User, loginCredentials } from "@/lib/types";
import api from "@/lib/api";
import { LogsIcon } from "lucide-react";

export const login = createAsyncThunk<User, loginCredentials>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('token', data.token);
            return { ...data, id: data._id };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Login failed');
        }
    }
);



export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            return { ...data, id: data._id };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }
            const { data } = await api.get('/auth/me');
            return data;
        } catch (error: any) {
            localStorage.removeItem('token');
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Session expired');
        }
    }
);

const initialState: AuthState = {
    isAuthenticated: false,
    currentUser: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.isAuthenticated = false;
            state.currentUser = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.currentUser = action.payload; // Backend returns user object
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.currentUser = action.payload;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Load User
        builder
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.currentUser = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.currentUser = null;
            });
    },
});

export const { logout, clearError, updateCurrentUser } = authSlice.actions;

export default authSlice.reducer;
