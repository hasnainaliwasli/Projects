"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
    const { hostels } = useAppSelector((state) => state.hostel);
    const { currentUser } = useAppSelector((state) => state.auth);
    const { reviews } = useAppSelector((state) => state.review);

    const favoriteHostels = hostels.filter((h) =>
        currentUser?.favoriteHostels?.includes(h.id)
    );

    const myReviews = reviews.filter((r) => r.userId === currentUser?.id);

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl  font-bold mb-2">Welcome, {currentUser?.fullName}!</h1>
                    <p className="text-muted-foreground">Manage your favorites and reviews</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Favorite Hostels
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{favoriteHostels.length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                My Reviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{myReviews.length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Available Hostels
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{hostels.length}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center">
                        <Link href="/hostels" className="w-full">
                            <Button className="w-full">Browse Hostels</Button>
                        </Link>

                        <Link href="/dashboard/student/favorites" className="w-full">
                            <Button variant="outline" className="w-full">
                                View Favorites
                            </Button>
                        </Link>

                        <Link href="/dashboard/student/reviews" className="w-full">
                            <Button variant="outline" className="w-full">
                                My Reviews
                            </Button>
                        </Link>
                    </CardContent>

                </Card>

                {/* Recent Favorites */}
                {favoriteHostels.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Favorites</CardTitle>
                                <Link href="/dashboard/student/favorites">
                                    <Button variant="ghost" size="sm">View All</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {favoriteHostels.slice(0, 3).map((hostel) => (
                                    <Link key={hostel.id} href={`/hostels/${hostel.id}`}>
                                        <div className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors">
                                            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                                {hostel.images[0] && (
                                                    <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{hostel.name}</p>
                                                <p className="text-sm text-muted-foreground">{hostel.location.city}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-primary">Rs. {hostel.rent.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">per bed</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
