"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchHostels } from "@/lib/slices/hostelSlice";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Building2, Star, Bed, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
    const dispatch = useAppDispatch();
    const { hostels } = useAppSelector((state) => state.hostel);
    const { users } = useAppSelector((state) => state.user);
    const { reviews } = useAppSelector((state) => state.review);

    useEffect(() => {
        dispatch(fetchHostels({ mode: 'admin' }));
    }, [dispatch]);

    const students = users.filter((u) => u.role === "student");
    const owners = users.filter((u) => u.role === "owner");

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage all platform resources</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{users.length>0? users.length-1 : 0}</div>
                            <p className="text-xs text-blue-100/80 mt-1">
                                {students.length} students • {owners.length} owners
                            </p>
                            <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl pointer-events-none" />
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-100">
                                Total Hostels
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-indigo-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{hostels.length}</div>
                            <p className="text-xs text-indigo-100/80 mt-1">
                                Across {new Set(hostels.map(h => h.location.city)).size} cities
                            </p>
                            <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl pointer-events-none" />
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-orange-400 to-orange-500 text-white card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100">
                                Total Reviews
                            </CardTitle>
                            <Star className="h-4 w-4 text-orange-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{reviews.length}</div>
                            <p className="text-xs text-orange-100/80 mt-1">
                                Avg Rating: {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                            </p>
                            <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl pointer-events-none" />
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white card-hover">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">
                                Available Beds
                            </CardTitle>
                            <Bed className="h-4 w-4 text-emerald-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {hostels.reduce((sum, h) => sum + h.availableBeds, 0)}
                            </div>
                            <p className="text-xs text-emerald-100/80 mt-1">
                                In {hostels.length} active hostels
                            </p>
                            <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl pointer-events-none" />
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl font-bold mb-2">Admin Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center">
                        <Link href="/dashboard/admin/users" className="w-full">
                            <Button className="w-full">Manage Users</Button>
                        </Link>

                        <Link href="/dashboard/admin/hostels" className="w-full">
                            <Button variant="outline" className="w-full">
                                Manage Hostels
                            </Button>
                        </Link>

                        <Link href="/dashboard/admin/reviews" className="w-full">
                            <Button variant="outline" className="w-full">
                                Manage Reviews
                            </Button>
                        </Link>
                    </CardContent>

                </Card>

                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl">Recent Hostels</CardTitle>
                            <Link href="/dashboard/admin/hostels" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View All <ArrowRight className="h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {hostels.slice(0, 5).map((hostel) => (
                                    <div key={hostel.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all border border-transparent hover:border-border/60">
                                        <div className="h-10 w-10 z-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                            <Building2 className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{hostel.name}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                {hostel.location.city} • {hostel.availableBeds} beds available
                                            </p>
                                        </div>
                                        <Link href={`/hostels/${hostel.id}`}>
                                            <Button variant="ghost" size="sm" className="hidden sm:flex">View</Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl">Recent Reviews</CardTitle>
                            <Link href="/dashboard/admin/reviews" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View All <ArrowRight className="h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reviews.slice(0, 5).map((review) => (
                                    <div key={review.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all border border-transparent hover:border-border/60">
                                        <div className="h-10 w-10 z-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                            <span className="text-orange-700 font-bold">{review.userName.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-sm">{review.userName}</p>
                                                <div className="flex items-center bg-yellow-100 px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold">
                                                    <Star className="h-3 w-3 fill-current mr-1" />
                                                    {review.rating}
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded italic">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
