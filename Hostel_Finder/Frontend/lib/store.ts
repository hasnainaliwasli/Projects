import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import hostelReducer from "./slices/hostelSlice";
import reviewReducer from "./slices/reviewSlice";
import userReducer from "./slices/userSlice";
import reportReducer from "./slices/reportSlice";
import notificationReducer from './slices/notificationSlice';
import chatReducer from './slices/chatSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            hostel: hostelReducer,
            review: reviewReducer,
            user: userReducer,
            reports: reportReducer,
            notification: notificationReducer,
            chat: chatReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
