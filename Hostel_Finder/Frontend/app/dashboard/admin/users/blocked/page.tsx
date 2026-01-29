"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchBlockedUsers, unblockUser, blockUser } from "@/lib/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ShieldAlert, Plus, Unlock, Trash2, Calendar, Mail, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BlockedUsersPage() {
    const dispatch = useAppDispatch();
    const { blockedUsers, loading } = useAppSelector((state) => state.user);
    const [isUnblocking, setIsUnblocking] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUnblockModal, setShowUnblockModal] = useState(false);
    const [userToUnblock, setUserToUnblock] = useState<{ id: string, email: string } | null>(null);

    // Form state
    const [email, setEmail] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        dispatch(fetchBlockedUsers());
    }, [dispatch]);

    const handleUnblockClick = (id: string, email: string) => {
        setUserToUnblock({ id, email });
        setShowUnblockModal(true);
    };

    const confirmUnblock = async () => {
        if (!userToUnblock) return;

        setIsUnblocking(userToUnblock.id);
        try {
            await dispatch(unblockUser(userToUnblock.id)).unwrap();
            toast.success("User unblocked successfully");
            setShowUnblockModal(false);
            setUserToUnblock(null);
        } catch (error: any) {
            toast.error("Failed to unblock user");
        } finally {
            setIsUnblocking(null);
        }
    };

    const handleBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(blockUser({ email, reason })).unwrap();
            toast.success("User blocked successfully");
            setShowAddModal(false);
            setEmail("");
            setReason("");
            // Refresh list
            dispatch(fetchBlockedUsers());
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to block user");
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                            Blocked Users
                        </h1>
                        <p className="text-muted-foreground">Manage blocked emails and users</p>
                    </div>
                    <Button size="sm" onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Block User
                    </Button>
                </div>

                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-destructive/5 pb-4 border-b border-destructive/10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-destructive text-md flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5" /> Blocked List
                            </CardTitle>
                            <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/5">
                                {blockedUsers.length} Blocked
                            </Badge>
                        </div>
                    </CardHeader>
                    <div className="rounded-md border border-border/40 overflow-hidden">
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead>Email Address</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Blocked Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading && blockedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                <Loader className="mx-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ) : blockedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                No blocked users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        blockedUsers.map((user: any) => (
                                            <TableRow key={user._id} className="hover:bg-destructive/5 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <div className="p-1.5 rounded-full bg-muted">
                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {user.reason ? (
                                                        <span className="text-sm text-foreground/80">{user.reason}</span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">No reason provided</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={isUnblocking === user._id}
                                                        onClick={() => handleUnblockClick(user._id, user.email)}
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    >
                                                        {isUnblocking === user._id ? (
                                                            <Loader size="sm" />
                                                        ) : (
                                                            <>
                                                                <Unlock className="h-4 w-4 mr-2" />
                                                                Unblock
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-4 p-4 bg-muted/10">
                            {loading && blockedUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <Loader className="mx-auto" />
                                </div>
                            ) : blockedUsers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No blocked users found.
                                </div>
                            ) : (
                                blockedUsers.map((user: any) => (
                                    <Card key={user._id} className="bg-card shadow-sm border overflow-hidden">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2 text-destructive font-medium">
                                                    <ShieldAlert className="h-4 w-4" />
                                                    <span className="text-sm">Blocked</span>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </Badge>
                                            </div>

                                            <div className="text-sm text-muted-foreground border-t pt-3 mt-3 space-y-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Email</span>
                                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                        <span className="break-all">{user.email}</span>
                                                    </div>
                                                </div>

                                                {user.reason && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Reason</span>
                                                        <p className="text-sm text-foreground/80 italic ml-1 border-l-2 border-border pl-2">
                                                            {user.reason}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                    disabled={isUnblocking === user._id}
                                                    onClick={() => handleUnblockClick(user._id, user.email)}
                                                >
                                                    {isUnblocking === user._id ? (
                                                        <Loader size="sm" />
                                                    ) : (
                                                        <>
                                                            <Unlock className="h-4 w-4 mr-2" />
                                                            Unblock User
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Block User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0">
                        <CardHeader>
                            <CardTitle>Block User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleBlock} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">This email will be prevented from logging in or registering.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reason">Reason (Optional)</Label>
                                    <Input
                                        id="reason"
                                        placeholder="Violation of terms..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 justify-end pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                                    <Button type="submit" variant="destructive">Block Email</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Unblock Confirmation Modal */}
            {showUnblockModal && userToUnblock && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0 shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <Unlock className="h-5 w-5" />
                                Unblock User
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to unblock <strong>{userToUnblock.email}</strong>?
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                They will explicitly regain access to login and use platform features.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowUnblockModal(false);
                                        setUserToUnblock(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmUnblock}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Unblock User
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
}
