import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/chat";

import { UserRole } from "../types";

export interface User {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
    role?: UserRole;
}

export interface Chat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: User[];
    latestMessage?: Message;
    groupAdmin?: User;
    createdAt: string;
}

export interface Message {
    _id: string;
    sender: User;
    content: string;
    chat: Chat;
    createdAt: string;
    isDeleted?: boolean;
    isEdited?: boolean;
    readBy?: string[];
}

interface ChatState {
    chats: Chat[];
    currentChat: Chat | null;
    messages: Message[];
    loading: boolean;
    error: string | null;
    notifications: Message[]; // For unread badges
}

const initialState: ChatState = {
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null,
    notifications: [],
};

// Access or Create Chat
export const accessChat = createAsyncThunk(
    "chat/accessChat",
    async (userId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(API_URL, { userId }, config);
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

// Fetch all chats
export const fetchChats = createAsyncThunk(
    "chat/fetchChats",
    async (_, { rejectWithValue }) => {
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

// Fetch Messages for a chat
export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (chatId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_URL}/${chatId}`, config);
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

// Send Message
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ content, chatId }: { content: string; chatId: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${API_URL}/message`, { content, chatId }, config);
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

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        addNotification: (state, action) => {
            // Only add if not already in notifications
            if (!state.notifications.find(n => n?._id === action.payload._id)) {
                state.notifications.push(action.payload);
            }
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n.chat._id !== action.payload);
        },
        clearChatError: (state) => {
            state.error = null;
        },
        updateMessage: (state, action) => {
            const index = state.messages.findIndex(m => m._id === action.payload._id);
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
            // Also update latest message if applicable
            const chatIndex = state.chats.findIndex(c => c.latestMessage && c.latestMessage._id === action.payload._id);
            if (chatIndex !== -1 && state.chats[chatIndex].latestMessage) {
                state.chats[chatIndex].latestMessage = action.payload; // Type safety might be loose here but okay
            }
        },
        removeMessage: (state, action) => {
            // action.payload = { messageId, mode, ... }
            // If mode is 'everyone', we update content. If 'me', we filter it out?
            // Actually, for real-time:
            // If 'message deleted' event (everyone): replace content with "deleted".
            // If 'message deleted' event (me): filter out.

            // However, the backend event sends: { messageId, mode, deletedBy, isDeleted, updatedContent }
            const { messageId, mode, updatedContent } = action.payload;

            if (mode === 'everyone') {
                const index = state.messages.findIndex(m => m._id === messageId);
                if (index !== -1) {
                    state.messages[index].content = updatedContent || "This message was deleted";
                    // We can add a flag property to Message interface later if needed for styling
                }
                // Update preview
                const chatIndex = state.chats.findIndex(c => c.latestMessage && c.latestMessage._id === messageId);
                if (chatIndex !== -1 && state.chats[chatIndex].latestMessage) {
                    state.chats[chatIndex].latestMessage.content = updatedContent || "This message was deleted";
                }
            } else if (mode === 'me') {
                // Simply remove from view
                state.messages = state.messages.filter(m => m._id !== messageId);
            }
        },
        removeChat: (state, action) => {
            state.chats = state.chats.filter(c => c._id !== action.payload);
            if (state.currentChat && state.currentChat._id === action.payload) {
                state.currentChat = null;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Access Chat
            .addCase(accessChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChat = action.payload;
                // Add to chats list if not exists
                if (!state.chats.find((c) => c._id === action.payload._id)) {
                    state.chats.unshift(action.payload);
                }
            })
            .addCase(accessChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Chats
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
                // If we have a current chat (e.g. from accessChat) that isn't in the fetched list, add it
                if (state.currentChat && !state.chats.find(c => c._id === state.currentChat?._id)) {
                    state.chats.unshift(state.currentChat);
                }
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Messages
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Send Message
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            })
            // Edit Message
            .addCase(editMessage.fulfilled, (state, action) => {
                // Handled by socket usually, but good to have immediate feedback
                const index = state.messages.findIndex(m => m._id === action.payload._id);
                if (index !== -1) state.messages[index] = action.payload;
            })
            // Delete Message
            .addCase(deleteMessage.fulfilled, (state, action) => {
                const { messageId, mode } = action.payload;
                // Immediate feedback logic same as removeMessage reducer
                if (mode === 'everyone') {
                    const index = state.messages.findIndex(m => m._id === messageId);
                    if (index !== -1) {
                        state.messages[index].content = "This message was deleted";
                    }
                } else {
                    state.messages = state.messages.filter(m => m._id !== messageId);
                }
            })
            // Delete Chat
            .addCase(deleteChat.fulfilled, (state, action) => {
                const { chatId } = action.payload;
                state.chats = state.chats.filter(c => c._id !== chatId);
                if (state.currentChat && state.currentChat._id === chatId) {
                    state.currentChat = null;
                }
            })
            // Mark Chat as Read
            // Mark Chat as Read
            .addCase(markChatAsRead.fulfilled, (state, action) => {
                const { chatId, userId } = action.payload;
                // remove notifications for this chat
                state.notifications = state.notifications.filter(n => n.chat._id !== chatId);

                // Update latest message read status in chat list to reflect change immediately in UI
                const chatIndex = state.chats.findIndex(c => c._id === chatId);
                if (chatIndex !== -1 && state.chats[chatIndex].latestMessage) {
                    if (!state.chats[chatIndex].latestMessage.readBy) {
                        state.chats[chatIndex].latestMessage.readBy = [];
                    }
                    // Ensure we don't duplicate
                    if (userId && !state.chats[chatIndex].latestMessage.readBy.includes(userId)) {
                        state.chats[chatIndex].latestMessage.readBy.push(userId);
                    }
                }
            });
    },
});

// Edit Message
export const editMessage = createAsyncThunk(
    "chat/editMessage",
    async ({ content, messageId }: { content: string; messageId: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_URL}/message/${messageId}`, { content }, config);
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

// Delete Message
export const deleteMessage = createAsyncThunk(
    "chat/deleteMessage",
    async ({ messageId, mode }: { messageId: string; mode: 'everyone' | 'me' }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { mode }
            };
            const response = await axios.delete(`${API_URL}/message/${messageId}`, config);
            return { messageId, mode, ...response.data };
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Delete Chat
export const deleteChat = createAsyncThunk(
    "chat/deleteChat",
    async ({ chatId, mode }: { chatId: string; mode: 'everyone' | 'me' }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { mode }
            };
            const response = await axios.delete(`${API_URL}/${chatId}`, config);
            return { chatId, mode, ...response.data };
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Mark Messages as Read
export const markChatAsRead = createAsyncThunk(
    "chat/markChatAsRead",
    async (chatId: string, { rejectWithValue, getState }) => {
        try {
            const token = localStorage.getItem("token");
            const { auth } = getState() as any; // Access auth state to get userId
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_URL}/${chatId}/read`, {}, config);
            return { chatId, userId: auth.currentUser?.id, ...response.data };
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const { setCurrentChat, addMessage, updateMessage, removeMessage, removeChat, addNotification, removeNotification, clearChatError } = chatSlice.actions;

export default chatSlice.reducer;
