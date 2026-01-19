"use client";

import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchChats, fetchMessages, sendMessage, editMessage, deleteMessage, deleteChat, setCurrentChat, addMessage, updateMessage, removeMessage, removeChat, addNotification, accessChat, markChatAsRead } from "@/lib/slices/chatSlice";
import { useSocket } from "@/context/SocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Menu, MessageSquare, MoreVertical, Phone, Video, Pencil, Trash2, X, Check, MoreHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ChatPage() {
    const dispatch = useAppDispatch();
    const { chats, currentChat, messages, loading } = useAppSelector((state) => state.chat);
    const { currentUser } = useAppSelector((state) => state.auth);
    const { socket } = useSocket();
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    // Edit State
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    // Delete State
    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
    const [deleteMessageDialogOpen, setDeleteMessageDialogOpen] = useState(false);

    // Delete Chat State
    const [deleteChatDialogOpen, setDeleteChatDialogOpen] = useState(false);

    // Fetch chats on mount and handle deep linking
    useEffect(() => {
        dispatch(fetchChats());

        const startChatUserId = searchParams.get("userId");
        if (startChatUserId) {
            dispatch(accessChat(startChatUserId));
        }
    }, [dispatch, searchParams]);

    // Handle Socket Events
    useEffect(() => {
        if (!socket) return;

        socket.on("message received", (newMessageReceived: any) => {
            if (!currentChat || currentChat._id !== newMessageReceived.chat._id) {
                // Give notification
                dispatch(addNotification(newMessageReceived));
            } else {
                dispatch(addMessage(newMessageReceived));
            }
        });

        socket.on("message updated", (updatedMessage: any) => {
            dispatch(updateMessage(updatedMessage));
        });

        socket.on("message deleted", (deletedEvent: any) => {
            dispatch(removeMessage(deletedEvent));
        });

        return () => {
            socket.off("message received");
            socket.off("message updated");
            socket.off("message deleted");
        };

    }, [socket, currentChat, dispatch]);

    // Fetch messages when current chat changes
    useEffect(() => {
        if (currentChat) {
            dispatch(fetchMessages(currentChat._id));
            dispatch(markChatAsRead(currentChat._id));
            socket?.emit("join chat", currentChat._id);
            setShowSidebar(false); // On mobile, hide sidebar when chat opens
        }
    }, [currentChat, dispatch, socket]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat || isSending) return;

        setIsSending(true);
        try {
            const resultFn = await dispatch(sendMessage({
                content: newMessage,
                chatId: currentChat._id
            }));

            if (sendMessage.fulfilled.match(resultFn)) {
                setNewMessage("");
                socket?.emit("new message", resultFn.payload);
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleEditMessage = async () => {
        if (!editingMessageId || !editContent.trim()) return;

        try {
            const result = await dispatch(editMessage({
                messageId: editingMessageId,
                content: editContent
            }));

            if (editMessage.fulfilled.match(result)) {
                setEditingMessageId(null);
                setEditContent("");
                toast.success("Message updated");
            }
        } catch (error) {
            toast.error("Failed to update message");
        }
    };

    const handleDeleteMessage = async (mode: 'everyone' | 'me') => {
        if (!deletingMessageId) return;

        try {
            const result = await dispatch(deleteMessage({
                messageId: deletingMessageId,
                mode
            }));

            if (deleteMessage.fulfilled.match(result)) {
                setDeleteMessageDialogOpen(false);
                setDeletingMessageId(null);
                toast.success("Message deleted");
            }
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const handleDeleteChat = async (mode: 'everyone' | 'me') => {
        if (!currentChat) return;

        try {
            const result = await dispatch(deleteChat({
                chatId: currentChat._id,
                mode
            }));

            if (deleteChat.fulfilled.match(result)) {
                setDeleteChatDialogOpen(false);
                toast.success(mode === 'everyone' ? "Chat deleted for everyone" : "Chat deleted");
            }
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    };

    const startEditing = (msg: any) => {
        setEditingMessageId(msg._id);
        setEditContent(msg.content);
    };

    const openDeleteDialog = (msgId: string) => {
        setDeletingMessageId(msgId);
        setDeleteMessageDialogOpen(true);
    };

    const getChatDetails = (chat: any, currentUser: any) => {
        if (!chat || !currentUser) return { name: "Unknown", image: null };
        if (chat.isGroupChat) return { name: chat.chatName, image: null };

        // Admin view of other's chats
        if (currentUser.role === 'admin') {
            const isParticipant = chat.users.some((u: any) => u._id === currentUser.id);
            if (!isParticipant) {
                if (chat.users.length >= 2) {
                    return {
                        name: `${chat.users[0].fullName} & ${chat.users[1].fullName}`,
                        image: chat.users[0].profileImage || null
                    };
                }
                // Fallback if admin views a broken chat
                return { name: "Invalid Chat", image: null };
            }
        }

        // Standard 1-on-1 logic
        const u0 = chat.users[0];
        const u1 = chat.users[1];

        if (!u0) return { name: "Unknown User", image: null };

        const partner = (u0._id === currentUser.id)
            ? u1
            : u0;

        if (!partner) return { name: "Deleted User", image: null };

        return {
            name: partner.fullName || "Unknown",
            image: partner.profileImage || null
        };
    };

    if (!currentUser) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <DashboardLayout role={currentUser?.role as any}>
            <div className="flex h-[calc(100vh-140px)] gap-4 rounded-lg overflow-hidden bg-background border shadow-sm">
                {/* Sidebar - Conversation List */}
                <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r bg-muted/10`}>
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Messages ({chats.length})
                        </h2>

                    </div>

                    <ScrollArea className="flex-1">
                        <div className="flex flex-col p-2 gap-1">
                            {(() => {
                                // Ensure currentChat is in the list
                                let displayChats = [...chats];
                                if (currentChat && !displayChats.find(c => c._id === currentChat._id)) {
                                    displayChats.unshift(currentChat);
                                }
                                return displayChats.map((chat) => {
                                    const details = getChatDetails(chat, currentUser);
                                    const isUnread = chat.latestMessage &&
                                        !chat.latestMessage.readBy?.includes(currentUser?.id || "") &&
                                        chat.latestMessage.sender?._id !== currentUser?.id;

                                    return (
                                        <div
                                            key={chat._id}
                                            onClick={() => dispatch(setCurrentChat(chat))}
                                            role="button"
                                            tabIndex={0}
                                            className={`w-full flex items-center gap-3 p-3 cursor-pointer rounded-lg text-left transition-colors ${currentChat?._id === chat._id
                                                ? "bg-primary/10 hover:bg-primary/15"
                                                : "hover:bg-muted"
                                                }`}
                                        >
                                            <div className="relative">
                                                <Avatar>
                                                    <AvatarImage src={details.image || undefined} />
                                                    <AvatarFallback>{details.name[0]}</AvatarFallback>
                                                </Avatar>
                                                {isUnread && (
                                                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                                                )}
                                            </div>

                                            <div className="flex w-full items-start gap-2 overflow-hidden">
                                                {/* Left content */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className={`truncate ${isUnread ? "font-bold text-foreground" : "font-medium"}`}>
                                                            {details.name}
                                                        </h4>

                                                        {chat.latestMessage && (
                                                            <span className={`ml-2 text-[10px] shrink-0 ${isUnread ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                                                {format(new Date(chat.latestMessage.createdAt), "HH:mm")}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {chat.latestMessage && (
                                                        <p className={`text-xs truncate ${isUnread ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                                                            <span className="font-medium">
                                                                {chat.latestMessage.sender?.fullName}:
                                                            </span>{" "}
                                                            {chat.latestMessage.content}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* NOW it will be at the extreme right */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="ml-auto h-6 w-6 shrink-0 text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteChatDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>

                                    );
                                });
                            })()}
                        </div>
                    </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-background`}>
                    {currentChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b flex items-center justify-between bg-card">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSidebar(true)}>
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                    <Avatar>
                                        <AvatarImage src={getChatDetails(currentChat, currentUser).image || undefined} />
                                        <AvatarFallback>{getChatDetails(currentChat, currentUser).name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">
                                            {getChatDetails(currentChat, currentUser).name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Verified User
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" disabled>
                                        <Phone className="w-5 h-5 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" disabled>
                                        <Video className="w-5 h-5 text-muted-foreground" />
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setDeleteChatDialogOpen(true)} className="text-destructive focus:text-destructive">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Chat
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Messages List */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="flex flex-col gap-6">
                                    {messages.map((m, i) => {
                                        const sender = m.sender || { _id: "unknown", fullName: "Unknown", profileImage: null, role: "user" };
                                        const isMyMessage = sender._id === currentUser?.id;
                                        const isEditing = editingMessageId === m._id;

                                        return (
                                            <div
                                                key={m._id}
                                                className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"} group relative`}
                                            >
                                                {!isMyMessage && (
                                                    <Avatar className="w-8 h-8 mr-2 mt-1">
                                                        <AvatarImage src={sender.profileImage || undefined} />
                                                        <AvatarFallback>{sender.fullName?.[0] || "?"}</AvatarFallback>
                                                    </Avatar>
                                                )}

                                                <div className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"} max-w-[70%]`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {!isMyMessage && (
                                                            <span className="text-xs font-medium text-muted-foreground ml-1">
                                                                {sender.fullName}
                                                            </span>
                                                        )}
                                                        {sender.role === 'admin' && !isMyMessage && (
                                                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                                                                ADMIN
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>


                                                    <div
                                                        className={`relative px-4 py-3 rounded-2xl text-sm shadow-sm
                                                            ${isMyMessage
                                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                                : "bg-muted rounded-bl-none"
                                                            }
                                                            ${m.isDeleted ? "italic text-muted-foreground/80 bg-muted/50 border border-muted" : ""}
                                                            ${sender.role === 'admin' && !isMyMessage ? "border-2 border-primary/20" : ""}
                                                        `}
                                                    >
                                                        {isEditing ? (
                                                            <div className="flex items-center gap-2 min-w-[200px]">
                                                                <Input
                                                                    value={editContent}
                                                                    onChange={(e) => setEditContent(e.target.value)}
                                                                    className="h-8 bg-background/20 border-primary-foreground/30 text-inherit placeholder:text-primary-foreground/50"
                                                                    autoFocus
                                                                />
                                                                <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/20" onClick={handleEditMessage}>
                                                                    <Check className="w-4 h-4" />
                                                                </Button>
                                                                <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/20" onClick={() => setEditingMessageId(null)}>
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                                                                {m.isEdited && !m.isDeleted && (
                                                                    <span className="text-[10px] opacity-70 block text-right mt-1 select-none">
                                                                        (edited)
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}

                                                        {/* Actions Dropdown */}
                                                        {isMyMessage && !m.isDeleted && !isEditing && (
                                                            <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background border shadow-sm">
                                                                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => startEditing(m)}>
                                                                            <Pencil className="w-4 h-4 mr-2" />
                                                                            Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => openDeleteDialog(m._id)} className="text-destructive focus:text-destructive">
                                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t bg-card flex items-center gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 rounded-full pl-4"
                                    disabled={isSending}
                                />
                                <Button type="submit" size="icon" className="rounded-full h-10 w-10 shrink-0" disabled={isSending}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>

                            {/* Delete Message Dialog */}
                            <Dialog open={deleteMessageDialogOpen} onOpenChange={setDeleteMessageDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Message</DialogTitle>
                                        <DialogDescription>
                                            Who do you want to delete this message for?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button variant="secondary" onClick={() => handleDeleteMessage('me')}>Delete for Me</Button>
                                        <Button variant="destructive" onClick={() => handleDeleteMessage('everyone')}>Delete for Everyone</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Delete Chat Dialog */}
                            <Dialog open={deleteChatDialogOpen} onOpenChange={setDeleteChatDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Chat</DialogTitle>
                                        <DialogDescription>
                                            {currentUser?.role === 'admin'
                                                ? "Admin Action: You can delete this chat for yourself or permanently for everyone."
                                                : "Are you sure you want to delete this chat? It will be removed from your list."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                                        {currentUser?.role === 'admin' ? (
                                            <>
                                                <Button variant="secondary" onClick={() => handleDeleteChat('me')}>Delete for Me</Button>
                                                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDeleteChat('everyone')}>
                                                    Delete for Everyone (Permanent)
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" onClick={() => setDeleteChatDialogOpen(false)}>Cancel</Button>
                                                <Button variant="destructive" onClick={() => handleDeleteChat('me')}>Delete Chat</Button>
                                            </>
                                        )}
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    ) : (
                        // ... Empty State
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <div className="p-6 bg-muted/20 rounded-full">
                                <MessageSquare className="w-12 h-12 stroke-1" />
                            </div>
                            <h3 className="text-xl font-semibold">Select a conversation</h3>
                            <p>Choose a chat from the sidebar to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
