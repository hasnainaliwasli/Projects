"use client";

import { useState } from "react";
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

    const handleDeleteHostel = (hostelId: string, hostelName: string) => {
        if (confirm(`Are you sure you want to delete "${hostelName}"?`)) {
            dispatch(removeHostel(hostelId) as any);
            toast.success("Hostel deleted successfully");
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

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">Manage Hostels</h1>
                    <p className="text-muted-foreground h-6">
                        {isLoading ? (
                            <span className="inline-block w-24 h-4 bg-muted animate-pulse rounded align-middle" />
                        ) : (
                            `${filteredHostels.length} hostel${filteredHostels.length !== 1 ? "s" : ""} found`
                        )}
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Search</Label>
                                <Input
                                    placeholder="Search by name or city"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>City</Label>
                                <select
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="all">All Cities</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCityFilter("all");
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="pending" value={statusTab} onValueChange={setStatusTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pending">Pending </TabsTrigger>
                        <TabsTrigger value="approved">Approved </TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
                                    <CardTitle className="text-lg">{hostel.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {hostel.location.area}, {hostel.location.city}
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
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

                                    <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t">
                                        <div className="flex gap-2 w-full sm:w-auto flex-1">
                                            <Link href={`/hostels/${hostel.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/owner/hostels/edit/${hostel.id}`} className="flex-1">
                                                <Button variant="secondary" className="w-full" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>

                                        {hostel.status === 'pending' && (
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <Button size="sm" className="flex-1 sm:flex-none" onClick={() => handleStatusUpdate(hostel.id, 'approved')}>
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" className="flex-1 sm:flex-none" onClick={() => handleStatusUpdate(hostel.id, 'rejected')}>
                                                    Reject
                                                </Button>
                                            </div>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full border border-destructive sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => handleDeleteHostel(hostel.id, hostel.name)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
