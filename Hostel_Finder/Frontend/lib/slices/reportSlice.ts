import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/reports";

export interface Report {
    _id: string;
    cnic: string;
    evidence?: string;
    userId: string;
    name: string;
    email: string;
    hostelName: string;
    type: string;
    description: string;
    status: 'unread' | 'read' | 'resolved';
    createdAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
    currentReport: Report | null;
}

const initialState: ReportState = {
    reports: [],
    loading: false,
    error: null,
    currentReport: null,
};

// Fetch all reports (Admin)
export const fetchReports = createAsyncThunk(
    "reports/fetchReports",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(API_URL, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Fetch user reports
export const fetchUserReports = createAsyncThunk(
    "reports/fetchUserReports",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_URL}/my-reports`, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Submit a new report (Private)
export const createReport = createAsyncThunk(
    "reports/createReport",
    async (reportData: Partial<Report>, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(API_URL, reportData, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Update report status (Admin)
export const updateReportStatus = createAsyncThunk(
    "reports/updateReportStatus",
    async ({ id, status }: { id: string; status: string }, { getState, rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.patch(`${API_URL}/${id}/status`, { status }, config);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Delete a report (Admin)
export const deleteReport = createAsyncThunk(
    "reports/deleteReport",
    async (id: string, { getState, rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${API_URL}/${id}`, config);
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const reportSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {
        clearReportError: (state) => {
            state.error = null;
        },
        setCurrentReport: (state, action) => {
            state.currentReport = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reports
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch User Reports
            .addCase(fetchUserReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchUserReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create Report
            .addCase(createReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReport.fulfilled, (state, action) => {
                state.loading = false;
                // Optimistically add the new report to the list if the backend returns it
                if (action.payload) {
                    state.reports.unshift(action.payload);
                }
            })
            .addCase(createReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Report Status
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                const updatedReport = action.payload;
                state.reports = state.reports.map((report) =>
                    report._id === updatedReport._id ? updatedReport : report
                );
                if (state.currentReport && state.currentReport._id === updatedReport._id) {
                    state.currentReport = updatedReport;
                }
            })

            // Delete Report
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.reports = state.reports.filter((report) => report._id !== action.payload);
                if (state.currentReport && state.currentReport._id === action.payload) {
                    state.currentReport = null;
                }
            });
    },
});

export const { clearReportError, setCurrentReport } = reportSlice.actions;

export default reportSlice.reducer;
