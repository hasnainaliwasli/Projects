"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { removeUser, fetchUsers, blockUser, unblockUser, fetchBlockedUsers } from "@/lib/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Search,
    Filter,
    MoreHorizontal,
    MoreVertical,
    Trash2,
    Shield,
    ShieldAlert,
    UserX,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    User,
    ArrowLeft
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminUsersPage() {
    const dispatch = useAppDispatch();
    const { users, blockedUsers } = useAppSelector((state) => state.user);
    const { currentUser } = useAppSelector((state) => state.auth);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Block state
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState("");

    // Unblock state
    const [showUnblockModal, setShowUnblockModal] = useState(false);
    const [unblockTarget, setUnblockTarget] = useState<{ id: string, email: string } | null>(null);

    // Fetch all users when component mounts
    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchBlockedUsers());
    }, [dispatch]);

    // Filter users
    const filteredUsers = users.filter((user) => {
        // Don't show current admin user
        if (user.id === currentUser?.id) return false;

        // Search filter
        if (searchQuery && !user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Role filter
        if (roleFilter !== "all" && user.role !== roleFilter) {
            return false;
        }

        return true;
    });

    const handleDeleteUser = (userId: string) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async (deleteData: boolean) => {
        if (!userToDelete) return;

        try {
            await dispatch(removeUser({ userId: userToDelete, deleteData })).unwrap();
            toast.success("User deleted successfully");
            if (selectedUser === userToDelete) {
                setSelectedUser(null);
            }
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to delete user");
        }
    };

    const handleBlockToggle = async () => {
        if (!selectedUser) return;

        const user = users.find(u => u.id === selectedUser);
        if (!user) return;

        const isBlocked = blockedUsers.some((u: any) => u.email === user.email);

        if (isBlocked) {
            // Find blocked user ID
            const blockedRecord = blockedUsers.find((u: any) => u.email === user.email);
            if (!blockedRecord) return; // Should not happen given check above

            setUnblockTarget({ id: blockedRecord._id, email: user.email });
            setShowUnblockModal(true);
        } else {
            // Show block modal
            setShowBlockModal(true);
        }
    };

    const handleConfirmUnblock = async () => {
        if (!unblockTarget) return;

        try {
            await dispatch(unblockUser(unblockTarget.id)).unwrap();
            toast.success("User unblocked successfully");
            dispatch(fetchBlockedUsers()); // Refresh list
            setShowUnblockModal(false);
            setUnblockTarget(null);
        } catch (error: any) {
            toast.error("Failed to unblock user");
        }
    };

    const handleBlockUser = async () => {
        if (!selectedUser) return;

        const user = users.find(u => u.id === selectedUser);
        if (!user) return;

        try {
            await dispatch(blockUser({ email: user.email, reason: blockReason })).unwrap();
            toast.success("User blocked successfully");
            setShowBlockModal(false);
            setBlockReason("");
            dispatch(fetchBlockedUsers()); // Refresh list
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to block user");
        }
    };

    const userDetails = selectedUser ? users.find(u => u.id === selectedUser) : null;
    const isUserDetailsBlocked = userDetails ? blockedUsers.some((u: any) => u.email === userDetails.email) : false;

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6 ">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">Manage Users</h1>
                    <p className="text-muted-foreground">
                        {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
                    </p>
                </div>

                {/* Filters Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl shadow-sm border border-border/40">
                    <div className="relative w-full md:w-auto md:min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background/50 border-border/60"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-background/50 border border-border/60 rounded-md px-3">
                            <Filter className="h-4 w-4 text-muted-foreground" />

                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger
                                    className="h-8 w-[140px] border-none bg-transparent text-sm !outline-none 
                                    !ring-0 !ring-offset-0 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 
                                    focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 
                                    data-[state=open]:!ring-0 data-[state=open]:!ring-offset-0"
                                >
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>

                                <SelectContent align="start" className="rounded-md">
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="student">Students</SelectItem>
                                    <SelectItem value="owner">Owners</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearchQuery("");
                                setRoleFilter("all");
                            }}
                            className="text-muted-foreground border hover:text-white"
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                <div className="flex border rounded-lg flex-col lg:grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
                    {/* Users Table - Hidden on mobile if user selected */}
                    <div className={`lg:col-span-2 overflow-hidden flex flex-col ${selectedUser ? 'hidden lg:flex' : 'flex'}`}>
                        <Card className="border-none shadow-md overflow-hidden flex flex-col flex-1">
                            <CardHeader className="bg-muted/30 pb-1 shrink-0">
                                <CardTitle className="text-lg">All Users</CardTitle>
                            </CardHeader>
                            <div className="rounded-md border border-border/40 m-4 mt-0 overflow-auto flex-1">
                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader className="bg-muted/50 sticky top-0 bg-background z-10">
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                        No users found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredUsers.map((user) => {
                                                    const isBlocked = blockedUsers.some((u: any) => u.email === user.email);

                                                    return (
                                                        <TableRow
                                                            key={user.id}
                                                            className={`cursor-pointer transition-colors ${selectedUser === user.id ? "bg-primary/5" : "hover:bg-muted/30"}`}
                                                            onClick={() => setSelectedUser(user.id)}
                                                        >
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
                                                                <Badge variant={user.role === "admin" ? "secondary" : "outline"}
                                                                    className={`capitalize ${user.role === "admin" ? "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200" :
                                                                        user.role === "owner" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200" :
                                                                            "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                                                                        }`}
                                                                >
                                                                    {user.role}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {isBlocked ? (
                                                                    <Badge variant="destructive" className="flex w-fit items-center gap-1 text-[10px] h-5">
                                                                        <ShieldAlert className="h-3 w-3" /> Blocked
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="flex w-fit items-center gap-1 text-[10px] h-5 bg-green-50 text-green-700 border-green-200">
                                                                        <CheckCircle className="h-3 w-3" /> Active
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3 p-1">
                                    {filteredUsers.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No users found
                                        </div>
                                    ) : (
                                        filteredUsers.map((user) => {
                                            const isBlocked = blockedUsers.some((u: any) => u.email === user.email);

                                            return (
                                                <div
                                                    key={user.id}
                                                    className={`p-4 rounded-lg border bg-card shadow-sm active:scale-[0.98] transition-transform ${selectedUser === user.id ? "ring-2 ring-primary border-primary" : ""}`}
                                                    onClick={() => setSelectedUser(user.id)}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10 border border-border/50">
                                                                <AvatarImage src={user.profileImage || ""} alt={user.fullName} />
                                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                                    {user.fullName[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-semibold text-base">{user.fullName}</div>
                                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t">
                                                        <div className="flex gap-2">
                                                            <Badge variant={user.role === "admin" ? "secondary" : "outline"}
                                                                className={`capitalize px-2 py-0.5 h-6 text-xs ${user.role === "admin" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                                                    user.role === "owner" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                                        "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                                    }`}
                                                            >
                                                                {user.role}
                                                            </Badge>

                                                            {isBlocked ? (
                                                                <Badge variant="destructive" className="flex items-center gap-1 text-[10px] h-6 px-2">
                                                                    <ShieldAlert className="h-3 w-3" /> Blocked
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="flex items-center gap-1 text-[10px] h-6 px-2 bg-green-50 text-green-700 border-green-200">
                                                                    <CheckCircle className="h-3 w-3" /> Active
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground font-medium ps-2 flex items-center gap-1">
                                                            Tap to view <ArrowLeft className="h-3 w-3 rotate-180" />
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* User Details - Hidden on mobile if no user selected */}
                    <div className={`lg:col-span-1 flex flex-col h-full ${!selectedUser ? 'hidden lg:flex' : 'flex'}`}>
                        {userDetails ? (
                            <Card className="sticky top-20 border-none shadow-md overflow-hidden flex flex-col h-full lg:h-auto">
                                <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 relative shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 left-2 text-white hover:bg-white/20 hover:text-white lg:hidden z-10"
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                                    </Button>
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                        <div className="relative">
                                            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                                <AvatarImage src={userDetails.profileImage || ""} />
                                                <AvatarFallback className="text-2xl font-bold bg-muted">
                                                    {userDetails.fullName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isUserDetailsBlocked ? (
                                                <div className="absolute bottom-0 right-0 bg-destructive text-white p-1 rounded-full border-2 border-background" title="Blocked">
                                                    <ShieldAlert className="h-4 w-4" />
                                                </div>
                                            ) : (
                                                <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full border-2 border-background" title="Active">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="pt-12 pb-6 px-6 text-center overflow-y-auto flex-1">
                                    <h3 className="font-bold text-xl">{userDetails.fullName}</h3>
                                    <p className="text-sm text-muted-foreground capitalize flex items-center justify-center gap-1 mt-1">
                                        {userDetails.role === "admin" && <Shield className="h-3 w-3" />}
                                        {userDetails.role}
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3 text-left">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Contact Info</p>

                                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                                            <div className="bg-primary/10 p-2 rounded-md">
                                                <Mail className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Email Address</p>
                                                <p className="text-sm font-medium truncate">{userDetails.email}</p>
                                            </div>
                                        </div>

                                        {userDetails.phoneNumbers.length > 0 && (
                                            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                                                <div className="bg-primary/10 p-2 rounded-md">
                                                    <Phone className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Phone</p>
                                                    <p className="text-sm font-medium truncate">{userDetails.phoneNumbers[0]}</p>
                                                </div>
                                            </div>
                                        )}

                                        {userDetails.homeAddress && (
                                            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                                                <div className="bg-primary/10 p-2 rounded-md">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Location</p>
                                                    <p className="text-sm font-medium truncate">{userDetails.homeAddress}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                                            <div className="bg-primary/10 p-2 rounded-md">
                                                <Calendar className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Joined On</p>
                                                <p className="text-sm font-medium truncate">{new Date(userDetails.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                        <Button
                                            variant={isUserDetailsBlocked ? "outline" : "secondary"}
                                            onClick={handleBlockToggle}
                                            className={isUserDetailsBlocked ? "border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400"}
                                        >
                                            {isUserDetailsBlocked ? (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Unblock
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldAlert className="mr-2 h-4 w-4" /> Block
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none border border-destructive/20"
                                            onClick={() => handleDeleteUser(userDetails.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed border-2 bg-transparent shadow-none h-full hidden lg:flex">
                                <CardContent className="text-center py-12 flex flex-col items-center justify-center opacity-60 h-full">
                                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <User className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-lg">Select a user</p>
                                    <p className="text-sm text-muted-foreground">View detailed information and actions</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0">
                        <CardHeader>
                            <CardTitle>Delete User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                How would you like to delete this user?
                            </p>
                            <div className="space-y-4">
                                <div className="border p-4 rounded-md space-y-2 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => confirmDelete(false)}>
                                    <h4 className="font-semibold">Archive Only (Recommended)</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Soft deletes the user account but keeps their hostels and reviews visible on the platform.
                                    </p>
                                    <Button variant="outline" className="w-full mt-2">Archive User Only</Button>
                                </div>

                                <div className="border border-destructive/20 bg-destructive/5 p-4 rounded-md space-y-2 hover:bg-destructive/10 transition-colors cursor-pointer" onClick={() => confirmDelete(true)}>
                                    <h4 className="font-semibold text-destructive">Archive & Delete Data</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Soft deletes the user AND permanently deletes all their hostels and reviews. This cannot be undone.
                                    </p>
                                    <Button variant="destructive" className="w-full mt-2">Delete Everything</Button>
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-2 border-t flex justify-end">
                            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Block User Modal */}
            {showBlockModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0">
                        <CardHeader>
                            <CardTitle>Block User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Are you sure you want to block this user? They will not be able to log in.
                            </p>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="blockReason">Reason (Optional)</Label>
                                    <Input
                                        id="blockReason"
                                        placeholder="Violation of terms..."
                                        value={blockReason}
                                        onChange={(e) => setBlockReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <Button variant="ghost" onClick={() => setShowBlockModal(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleBlockUser}>Confirm Block</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* Unblock Confirmation Modal */}
            {showUnblockModal && unblockTarget && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0 shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                Unblock User
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to unblock <strong>{unblockTarget.email}</strong>?
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                They will explicitly regain access to login and use platform features.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowUnblockModal(false);
                                        setUnblockTarget(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmUnblock}
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
