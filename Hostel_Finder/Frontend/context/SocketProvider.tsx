"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/slices/authSlice";
import { addNotification } from "@/lib/slices/chatSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ENDPOINT = "http://localhost:5000";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            const socketInstance = io(ENDPOINT);

            socketInstance.emit("setup", currentUser);

            socketInstance.on("connected", () => {
                setIsConnected(true);
            });

            socketInstance.on("user blocked", () => {
                dispatch(logout());
                toast.error("Your account has been blocked by the administrator.");
                window.location.href = "/login";
            });

            socketInstance.on("message received", (newMessageReceived: any) => {
                // We dispatch notification regardless of page, Redux handles duplicates
                // Ideally, we check if we are on chat page and in that chat, but that state is local to ChatPage or Redux
                // For now, simple approach: always add notification to Redux
                // If user is on ChatPage, ChatPage listener will ALSO fire. 
                // We should rely on Redux to deduplicate or check currentChat

                // Better approach: Let ChatPage handle "Message Added" (read status), 
                // SocketProvider handles "Notification" (badge).
                // Actually, ChatPage handles both if active. 
                // If we are NOT on chat page, only SocketProvider logic runs.

                dispatch(addNotification(newMessageReceived));
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [currentUser, dispatch]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
