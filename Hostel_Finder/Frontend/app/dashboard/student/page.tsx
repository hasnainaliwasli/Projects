"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Home, Search, Star, ExternalLink, MapPin } from "lucide-react";

export default function StudentDashboardPage() {
    const { hostels } = useAppSelector((state) => state.hostel);
    const { currentUser } = useAppSelector((state) => state.auth);
    const { reviews } = useAppSelector((state) => state.review);

    const favoriteHostels = hostels.filter((h) =>
        currentUser?.favoriteHostels?.includes(h.id)
    );

    const approvedHostels = hostels.filter(h => h.status === 'approved' || !h.status);

    const myReviews = reviews.filter((r) => r.userId === currentUser?.id);

    return (
        <DashboardLayout role="student">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Welcome back, {currentUser?.fullName}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your hostel search.
                    </p>
                </div>

                {/* Stats Cards */}
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Favorite Hostels
                            </CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{favoriteHostels.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Saved for later
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                My Reviews
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{myReviews.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Helpful contributions
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Available Hostels
                            </CardTitle>
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{approvedHostels.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Ready for booking
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
                            <Link href="/hostels" className="w-full">
                                <Button className="w-full justify-start gap-2 h-12 text-base" size="lg">
                                    <Search className="h-4 w-4" /> Browse Hostels
                                </Button>
                            </Link>

                            <Link href="/dashboard/student/favorites" className="w-full">
                                <Button variant="outline" className="w-full justify-start gap-2 h-12" size="lg">
                                    <Heart className="h-4 w-4" /> View Favorites
                                </Button>
                            </Link>

                            <Link href="/dashboard/student/reviews" className="w-full">
                                <Button variant="outline" className="w-full justify-start gap-2 h-12" size="lg">
                                    <Star className="h-4 w-4" /> My Reviews
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Recent Favorites or Featured */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Your Favorites</h2>
                            {favoriteHostels.length > 0 && (
                                <Link href="/dashboard/student/favorites" className="text-primary hover:underline text-sm flex items-center gap-1">
                                    View All <ExternalLink className="h-3 w-3" />
                                </Link>
                            )}
                        </div>

                        {favoriteHostels.length > 0 ? (
                            <div className="space-y-4">
                                {favoriteHostels.slice(0, 3).map((hostel) => (
                                    <Link key={hostel.id} href={`/hostels/${hostel.id}`}>
                                        <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
                                            <div className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4">
                                                <div className="w-full sm:w-32 h-32 sm:h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                                                    {hostel.images[0] ? (
                                                        <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            <Home className="h-8 w-8 opacity-20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                                                {hostel.name}
                                                            </h3>
                                                            <div className="font-bold text-primary whitespace-nowrap">
                                                                Rs. {hostel.rent.toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            {hostel.location.city}, {hostel.location.area}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                                                        <div className="flex items-center gap-1 text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {hostel.rating}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full capitalize">
                                                            {hostel.genderType} Hostel
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Card className="border-dashed shadow-none bg-muted/30">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <Heart className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-medium text-lg">No favorites yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mt-1 mb-4">
                                        Explore hostels and save them here to quickly access them later.
                                    </p>
                                    <Link href="/hostels">
                                        <Button>Find Hostels</Button>
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
