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
        let socketInstance: Socket | null = null;

        if (currentUser) {
            socketInstance = io(ENDPOINT);
            socketInstance.emit("setup", currentUser);
            socketInstance.on("connected", () => setIsConnected(true));
            setSocket(socketInstance);
        }

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [currentUser]);

    useEffect(() => {
        if (!socket) return;

        socket.on("user blocked", () => {
            dispatch(logout());
            toast.error("Your account has been blocked by the administrator.");
            window.location.href = "/login";
        });

        socket.on("message received", (newMessageReceived: any) => {
            console.log("Socket: Message Received", newMessageReceived);
            // toast.info("New message received"); // Optional: verify if notification works
            dispatch(addNotification(newMessageReceived));
        });

        return () => {
            socket.off("user blocked");
            socket.off("message received");
        };
    }, [socket, dispatch]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
