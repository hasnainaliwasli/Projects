
"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { removeHostel, fetchHostels, setViewMode } from "@/lib/slices/hostelSlice";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // import added

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OwnerHostelsPage() {
    const { hostels, loading, viewMode, error } = useAppSelector((state) => state.hostel);
    const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [statusTab, setStatusTab] = useState("active");

    const myHostels = hostels.filter((h) => h.ownerId === currentUser?.id);

    // Filter based on tab
    const filteredHostels = myHostels.filter(h => {
        const status = h.status || 'approved'; // Default compatibility
        if (statusTab === "active") return status === 'approved';
        if (statusTab === "pending") return status === 'pending';
        if (statusTab === "rejected") return status === 'rejected';
        return true;
    });

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(setViewMode('owner'));
            dispatch(fetchHostels({ owner: currentUser.id }));
        }
    }, [dispatch, currentUser?.id]);


    const isLoading = (loading || (viewMode !== 'owner' && hostels.length > 0)) && !error;

    if (error) {
        return (
            <DashboardLayout role="owner">
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <p className="text-red-500 font-medium">Failed to load your hostels</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button onClick={() => currentUser?.id && dispatch(fetchHostels({ owner: currentUser.id }))}>
                        Retry
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleRemoveHostel = async (hostelId: string) => {
        if (confirm("Are you sure you want to remove this hostel?")) {
            try {
                await dispatch(removeHostel(hostelId)).unwrap();
                toast.success("Hostel removed successfully");
            } catch (error: any) {
                toast.error(typeof error === 'string' ? error : "Failed to remove hostel");
            }
        }
    };

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold mb-2">My Hostels</h1>
                        <p className="text-muted-foreground">
                            Manage your hostel listings
                        </p>
                    </div>
                    <Link href="/dashboard/owner/hostels/add">
                        <Button className="mt-0">Add New Hostel</Button>
                    </Link>
                </div>

                <Tabs defaultValue="active" value={statusTab} onValueChange={setStatusTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
                        <TabsTrigger value="active">
                            Active {isLoading ? '...' : `(${myHostels.filter(h => (h.status || 'approved') === 'approved').length})`}
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending {isLoading ? '...' : `(${myHostels.filter(h => h.status === 'pending').length})`}
                        </TabsTrigger>
                        <TabsTrigger value="rejected">
                            Rejected {isLoading ? '...' : `(${myHostels.filter(h => h.status === 'rejected').length})`}
                        </TabsTrigger>
                    </TabsList>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="overflow-hidden">
                                    <div className="aspect-[3/2] bg-muted animate-pulse" />
                                    <CardContent className="p-4 space-y-2">
                                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                                        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredHostels.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-lg text-muted-foreground mb-4">No hostels in this category</p>
                                {statusTab === "active" && (
                                    <Link href="/dashboard/owner/hostels/add">
                                        <Button>Add Your First Hostel</Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredHostels.map((hostel) => (
                                <Card key={hostel.id} className="overflow-hidden bg-card hover:bg-accent/5 transition-colors">
                                    <div className="flex h-full flex-col">
                                        <div className="relative aspect-[3/2] w-full overflow-hidden">
                                            {hostel.images[0] && (
                                                <img
                                                    src={hostel.images[0]}
                                                    alt={hostel.name}
                                                    className={`h-full w-full object-cover transition-transform duration-300 hover:scale-105 ${hostel.status === 'rejected' || hostel.status === 'pending' ? 'grayscale' : ''}`}
                                                />
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <Badge variant={
                                                    hostel.status === "pending" ? "outline" :
                                                        hostel.status === "rejected" ? "destructive" :
                                                            "default"
                                                } className="bg-background/80 backdrop-blur-sm">
                                                    {hostel.status || "Active"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <CardTitle className="text-md font-semibold line-clamp-1" title={hostel.name}>
                                                    {hostel.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-1 text-sm font-medium text-amber-500 shrink-0">
                                                    <span>★</span>
                                                    {hostel.rating}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {hostel.location.area}, {hostel.location.city}
                                            </p>
                                        </CardHeader>

                                        <CardContent className="p-4 pt-2 flex-1">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <Badge variant="secondary" className="text-[12px] p-3 h-5 px-1.5 font-normal">
                                                    {hostel.isFor === "boys" ? "Boys" : "Girls"}
                                                </Badge>
                                                <Badge variant="outline" className="text-[12px] p-3 h-5 px-1.5 font-normal border-green-200 text-green-700 bg-green-50">
                                                    {hostel.availableBeds} beds
                                                </Badge>
                                            </div>

                                            <div className="flex gap-2 mt-auto">
                                                <Link href={`/hostels/${hostel.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full h-8 text-xs">View</Button>
                                                </Link>
                                                <Link href={`/dashboard/owner/hostels/edit/${hostel.id}`} className="flex-1">
                                                    <Button size="sm" className="w-full h-8 text-xs">
                                                        {hostel.status === 'rejected' ? 'Fix' : 'Edit'}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 border border-destructive text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleRemoveHostel(hostel.id)}
                                                    title="Delete"
                                                >
                                                    <span className="sr-only">Delete</span>
                                                    ×
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
