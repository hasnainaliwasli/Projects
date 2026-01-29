"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchHostels } from "@/lib/slices/hostelSlice";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, BedDouble, Star, Activity, Plus, List, MapPin } from "lucide-react";

export default function OwnerDashboardPage() {
    const dispatch = useAppDispatch();
    const { hostels } = useAppSelector((state) => state.hostel);
    const { currentUser } = useAppSelector((state) => state.auth);
    const { reviews } = useAppSelector((state) => state.review);

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(fetchHostels({ owner: currentUser.id }));
        }
    }, [dispatch, currentUser]);

    const myAllHostels = hostels.filter((h) => h.ownerId === currentUser?.id);
    const myActiveHostels = myAllHostels.filter(h => h.status === 'approved' || !h.status); // Fallback for legacy
    const myPendingHostels = myAllHostels.filter(h => h.status === 'pending');

    const totalBeds = myActiveHostels.reduce((sum, h) => sum + h.availableBeds, 0);

    return (
        <DashboardLayout role="owner">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Welcome, {currentUser?.fullName}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's an overview of your property listings and performance.
                    </p>
                </div>

                {/* Stats Cards */}
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Hostels
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{myActiveHostels.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Currently listed
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending Approval
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{myPendingHostels.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Under review
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Available Beds
                            </CardTitle>
                            <BedDouble className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalBeds}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all hostels
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg Rating
                            </CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {myActiveHostels.length > 0
                                    ? (myActiveHostels.reduce((sum, h) => sum + h.rating, 0) / myActiveHostels.length).toFixed(1)
                                    : "0.0"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tenant satisfaction
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <Card className="md:col-span-1 border-none shadow-md h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Link href="/dashboard/owner/hostels/add" className="w-full">
                                <Button className="w-full justify-start gap-2 h-12 text-base" size="lg">
                                    <Plus className="h-4 w-4" /> Add New Hostel
                                </Button>
                            </Link>

                            <Link href="/dashboard/owner/hostels" className="w-full">
                                <Button variant="outline" className="w-full justify-start gap-2 h-12" size="lg">
                                    <List className="h-4 w-4" /> Manage Listings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Your Hostels Preview */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold">Your Properties</h2>

                        {myAllHostels.length > 0 ? (
                            <div className="space-y-4">
                                {myAllHostels.slice(0, 3).map((hostel) => (
                                    <div key={hostel.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
                                        <div className="w-full sm:w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                                            {hostel.images[0] ? (
                                                <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <Building2 className="h-8 w-8 opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                <h3 className="font-semibold text-lg truncate">{hostel.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit mx-auto sm:mx-0 ${hostel.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    hostel.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {hostel.status || 'Active'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mb-2">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {hostel.location.city}, {hostel.location.area}
                                            </p>
                                            <div className="flex items-center justify-center sm:justify-start gap-4 text-sm">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <BedDouble className="h-4 w-4 text-muted-foreground" />
                                                    {hostel.availableBeds} beds free
                                                </span>
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Star className="h-4 w-4 text-yellow-500" />
                                                    {hostel.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/dashboard/owner/hostels/${hostel.id}`}>
                                            <Button variant="ghost" size="sm">Manage</Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Card className="border-dashed shadow-none bg-muted/30">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <Building2 className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-medium text-lg">No properties listed</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mt-1 mb-4">
                                        You haven't added any hostels yet. Start by adding your first property.
                                    </p>
                                    <Link href="/dashboard/owner/hostels/add">
                                        <Button>Add New Hostel</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
