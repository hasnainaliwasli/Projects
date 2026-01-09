"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchHostels } from "@/lib/slices/hostelSlice";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

    const myHostelIds = myAllHostels.map((h) => h.id);
    const myReviews = reviews.filter((r) => myHostelIds.includes(r.hostelId));

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome, {currentUser?.fullName}!</h1>
                    <p className="text-muted-foreground">Manage your hostel listings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Hostels
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{myActiveHostels.length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending Approval
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{myPendingHostels.length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Available Beds
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{totalBeds}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {myActiveHostels.length > 0
                                    ? (myActiveHostels.reduce((sum, h) => sum + h.rating, 0) / myActiveHostels.length).toFixed(1)
                                    : "0.0"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center flex-wrap gap-3">
                        <Link href="/dashboard/owner/hostels/add">
                            <Button>Add New Hostel</Button>
                        </Link>
                        <Link href="/dashboard/owner/hostels">
                            <Button variant="outline">View My Hostels</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity or generic placeholder can go here if needed */}
                <div className="text-muted-foreground text-sm">
                    <p>Navigate to "My Hostels" to manage your listings.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
