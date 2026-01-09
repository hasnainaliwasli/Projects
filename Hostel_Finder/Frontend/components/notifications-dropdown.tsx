"use client";

import { useState } from "react";
import { Bell, Check, Info, Star, AlertTriangle, Building2, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { markNotificationRead, markAllNotificationsRead, clearAllNotifications } from "@/lib/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";


export function NotificationsDropdown() {
    const dispatch = useAppDispatch();
    const { notifications, unreadCount, loading } = useAppSelector((state) => state.notification);
    const [open, setOpen] = useState(false);
    const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);

    const handleMarkAsRead = (id: string) => {
        dispatch(markNotificationRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsRead());
    };

    const handleClearAll = () => {
        dispatch(clearAllNotifications());
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'HOSTEL_STATUS': return <Building2 className="h-4 w-4 text-blue-500" />;
            case 'NEW_REVIEW': return <Star className="h-4 w-4 text-amber-500" />;
            case 'NEW_REPORT': return <ShieldAlert className="h-4 w-4 text-red-500" />;
            case 'NEW_HOSTEL_REQUEST': return <Building2 className="h-4 w-4 text-green-500" />;
            default: return <Info className="h-4 w-4 text-gray-500" />;
        }
    };

    const getLink = (notification: any) => {
        switch (notification.type) {
            case 'HOSTEL_STATUS': return `/hostels/${notification.relatedId}`;
            case 'NEW_REVIEW': return `/dashboard/${currentUser?.role}/reviews`;
            case 'NEW_REPORT': return `/dashboard/${currentUser?.role}/reports`;
            case 'NEW_HOSTEL_REQUEST': return `/dashboard/${currentUser?.role}/hostels`;
            default: return '#';
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <div className="flex gap-1">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-auto p-1 text-muted-foreground hover:text-primary"
                                onClick={handleMarkAllAsRead}
                                title="Mark all as read"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-auto p-1 text-muted-foreground hover:text-destructive"
                                onClick={handleClearAll}
                                title="Clear all"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                            <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={cn(
                                        "p-4 hover:bg-muted/50 transition-colors relative group",
                                        !notification.isRead && "bg-primary/5"
                                    )}
                                >
                                    <Link
                                        href={getLink(notification)}
                                        className="flex gap-3"
                                        onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-sm font-medium leading-none", !notification.isRead && "text-primary")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </Link>
                                    {!notification.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification._id);
                                            }}
                                            title="Mark as read"
                                        >
                                            <Check className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
