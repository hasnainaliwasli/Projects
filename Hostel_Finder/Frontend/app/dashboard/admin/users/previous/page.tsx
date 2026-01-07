"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchArchivedUsers, permanentDeleteUser, restoreUser } from "@/lib/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Trash2, RefreshCw, Archive, RotateCcw, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ArchivedUsersPage() {
    const dispatch = useAppDispatch();
    const { archivedUsers, loading } = useAppSelector((state) => state.user);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchArchivedUsers());
    }, [dispatch]);

    const handleRestoreUser = async (userId: string) => {
        if (confirm("Are you sure you want to restore this user?")) {
            try {
                await dispatch(restoreUser(userId)).unwrap();
                toast.success("User restored successfully");
            } catch (error) {
                toast.error("Failed to restore user");
            }
        }
    };

    const handleDelete = async (userId: string) => {
        if (confirm("Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.")) {
            setIsDeleting(userId);
            try {
                await dispatch(permanentDeleteUser(userId)).unwrap();
                toast.success("User permanently deleted");
            } catch (error: any) {
                toast.error("Failed to delete user");
            } finally {
                setIsDeleting(null);
            }
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                            <Archive className="h-6 w-6 hidden md:block md:h-8 md:w-8 text-primary" />
                            Archived Users
                        </h1>
                        <p className="text-muted-foreground">Manage previously deleted accounts</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => dispatch(fetchArchivedUsers())}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                </div>

                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-md flex items-center gap-2">
                                <UserX className="h-5 w-5 text-muted-foreground" />
                                Deleted Accounts
                            </CardTitle>
                            <Badge variant="secondary" className="bg-muted flex text-muted-foreground border-border">
                                {archivedUsers.length}<span className="ml-2">Archived</span>
                            </Badge>
                        </div>
                    </CardHeader>
                    <div className="rounded-md border border-border/40 m-4 overflow-hidden">
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Archived Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading && archivedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                <Loader className="mx-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ) : archivedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                No archived users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        archivedUsers.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-border/50">
                                                            <AvatarImage src={user.profileImage || ""} alt={user.fullName} />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                                {user.fullName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm">{user.fullName}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize bg-muted/50">
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {(user as any).archivedAt ? new Date((user as any).archivedAt).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRestoreUser(user.id)}
                                                            className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <RotateCcw className="h-4 w-4 mr-1" /> Restore
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={isDeleting === user.id}
                                                            onClick={() => handleDelete(user.id)}
                                                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            {isDeleting === user.id ? (
                                                                <Loader size="sm" />
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-4 p-4 bg-muted/10">
                            {loading && archivedUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <Loader className="mx-auto" />
                                </div>
                            ) : archivedUsers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No archived users found.
                                </div>
                            ) : (
                                archivedUsers.map((user) => (
                                    <Card key={user.id} className="bg-card shadow-sm border overflow-hidden">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-border/50">
                                                        <AvatarImage src={user.profileImage || ""} alt={user.fullName} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                            {user.fullName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">{user.fullName}</div>
                                                        <Badge variant="outline" className="capitalize text-xs px-1.5 py-0 h-5">
                                                            {user.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-sm text-muted-foreground border-t pt-3 mt-3 space-y-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Email</span>
                                                    <span className="text-foreground break-all">{user.email}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-1">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Archived</span>
                                                    <span className="font-medium">{(user as any).archivedAt ? new Date((user as any).archivedAt).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-100"
                                                    onClick={() => handleRestoreUser(user.id)}
                                                >
                                                    <RotateCcw className="h-4 w-4 mr-2" /> Restore
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                                    disabled={isDeleting === user.id}
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    {isDeleting === user.id ? (
                                                        <Loader size="sm" />
                                                    ) : (
                                                        <>
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
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
        </DashboardLayout>
    );
}
