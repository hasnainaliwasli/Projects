"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { removeHostel, updateHostelStatus, fetchHostels, setViewMode } from "@/lib/slices/hostelSlice";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, MoreVertical, Eye, Edit, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminHostelsPage() {
    const dispatch = useAppDispatch();
    const { hostels, loading, viewMode, error } = useAppSelector((state) => state.hostel);

    useEffect(() => {
        dispatch(setViewMode('admin'));
        dispatch(fetchHostels({ mode: 'admin' }));
    }, [dispatch]);

    const isLoading = (loading || (viewMode !== 'admin' && hostels.length > 0)) && !error;

    if (error) {
        return (
            <DashboardLayout role="admin">
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <p className="text-red-500 font-medium">Failed to load hostels</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button onClick={() => dispatch(fetchHostels({ mode: 'admin' }))}>
                        Retry
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [cityFilter, setCityFilter] = useState<string>("all");
    const [statusTab, setStatusTab] = useState("pending");
    const [hostelToDelete, setHostelToDelete] = useState<{ id: string, name: string } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Get unique cities
    const cities = Array.from(new Set(hostels.map((h) => h.location.city)));

    // Filter hostels
    const filteredHostels = hostels.filter((hostel) => {
        // Search filter
        if (searchQuery && !hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !hostel.location.city.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // City filter
        if (cityFilter !== "all" && hostel.location.city !== cityFilter) {
            return false;
        }

        // Status filter (fallback for legacy data: undefined status = approved)
        const status = hostel.status || 'approved';
        if (statusTab === "pending" && status !== "pending") return false;
        if (statusTab === "approved" && status !== "approved") return false;
        if (statusTab === "rejected" && status !== "rejected") return false;

        return true;
    });

    const handleDeleteClick = (hostelId: string, hostelName: string) => {
        setHostelToDelete({ id: hostelId, name: hostelName });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (hostelToDelete) {
            dispatch(removeHostel(hostelToDelete.id) as any);
            toast.success("Hostel deleted successfully");
            setShowDeleteModal(false);
            setHostelToDelete(null);
        }
    };

    const handleStatusUpdate = async (hostelId: string, status: 'approved' | 'rejected') => {
        try {
            await dispatch(updateHostelStatus({ id: hostelId, status })).unwrap();
            toast.success(`Hostel ${status} successfully`);
        } catch (error: any) {
            toast.error("Failed to update status");
        }
    };

    const hostelCount = useMemo(() => {
        let pending = 0
        let rejected = 0
        let approved = 0

        for (const hostel of hostels) {
            const status = hostel.status || 'approved'

            if (status === "pending") pending++
            else if (status === "rejected") rejected++
            else if (status === "approved") approved++
        }
        return { pending, rejected, approved }
    }, [hostels])

    console.log(hostelCount.pending)

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">Manage Hostels</h1>
                    <p className="text-muted-foreground h-6">
                        {isLoading ? (
                            <span className="inline-block w-24 h-4 bg-muted animate-pulse rounded align-middle" />
                        ) : (
                            `${filteredHostels.length} hostel${filteredHostels.length !== 1 ? "s" : ""} found`
                        )}
                    </p>
                </div>

                {/* Filters Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl shadow-sm border border-border/40">
                    <div className="relative w-full md:w-auto flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background/50 border-border/60"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-background/50 border border-border/60 rounded-md px-3 h-10 w-full md:w-[200px]">
                            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <Select value={cityFilter} onValueChange={setCityFilter}>
                                <SelectTrigger className="w-full h-full border-none bg-transparent focus:ring-0 focus:ring-offset-0 px-1 text-sm">
                                    <SelectValue placeholder="All Cities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery || cityFilter !== "all") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery("");
                                    setCityFilter("all");
                                }}
                                className="text-muted-foreground hover:text-foreground shrink-0"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="pending" value={statusTab} onValueChange={setStatusTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pending">Pending <span className="text-xs ml-2 text-muted-foreground">({hostelCount.pending})</span> </TabsTrigger>
                        <TabsTrigger value="approved">Approved <span className="text-xs ml-2 text-muted-foreground">({hostelCount.approved})</span> </TabsTrigger>
                        <TabsTrigger value="rejected">Rejected <span className="text-xs ml-2 text-muted-foreground">({hostelCount.rejected})</span> </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Hostels Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-video bg-muted animate-pulse" />
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
                                        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredHostels.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-lg text-muted-foreground">No hostels found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHostels.map((hostel) => (
                            <Card key={hostel.id}>
                                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                                    {hostel.images[0] && (
                                        <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{hostel.name}</CardTitle>
                                            <p className="text-sm mb-0 pb-0 text-muted-foreground">
                                                {hostel.location.area}, {hostel.location.city}
                                            </p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" side="bottom">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/hostels/${hostel.id}`} className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4 text-slate/80" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/owner/hostels/edit/${hostel.id}`} className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4 text-slate" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                {hostel.status === 'pending' && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(hostel.id, 'approved')} className="text-green-600 focus:text-white focus:bg-green-900 cursor-pointer">
                                                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(hostel.id, 'rejected')} className="cursor-pointer">
                                                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDeleteClick(hostel.id, hostel.name)} className="text-red-600 focus:text-white focus:bg-red-900 cursor-pointer">
                                                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={hostel.isFor === "boys" ? "default" : "secondary"}>
                                            {hostel.isFor === "boys" ? "Boys" : "Girls"}
                                        </Badge>
                                        <Badge variant={hostel.availability === "available" ? "default" : "secondary"}>
                                            {hostel.availability}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Owner</p>
                                            <p className="font-medium truncate">{hostel.ownerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Beds</p>
                                            <p className="font-medium">{hostel.availableBeds}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Rating</p>
                                            <p className="font-medium">{hostel.rating} ⭐</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Reviews</p>
                                            <p className="font-medium">{hostel.reviewIds.length}</p>
                                        </div>
                                    </div>


                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && hostelToDelete && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0 shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-5 w-5" />
                                Delete Hostel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete <strong>{hostelToDelete.name}</strong>?
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                This action is permanent and cannot be undone. All associated data will be removed.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setHostelToDelete(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmDelete}
                                    variant="destructive"
                                >
                                    Delete Hostel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
}
