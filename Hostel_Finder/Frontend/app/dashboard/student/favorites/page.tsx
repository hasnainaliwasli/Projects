"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { toggleFavorite } from "@/lib/slices/userSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function StudentFavoritesPage() {
    const dispatch = useAppDispatch();
    const { hostels } = useAppSelector((state) => state.hostel);
    const { currentUser } = useAppSelector((state) => state.auth);

    const favoriteHostels = hostels.filter((h) =>
        currentUser?.favoriteHostels?.includes(h.id)
    );

    const handleRemoveFavorite = (hostelId: string) => {
        if (currentUser) {
            dispatch(toggleFavorite({
                userId: currentUser.id,
                hostelId,
                isAdding: false
            }));
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">My Favorites</h1>
                    <p className="text-muted-foreground">
                        You have {favoriteHostels.length} saved hostel{favoriteHostels.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {favoriteHostels.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-md text-muted-foreground mb-4">You haven&apos;t saved any hostels yet</p>
                            <Link href="/hostels">
                                <Button>Browse Hostels</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {favoriteHostels.map((hostel) => (
                            <Card key={hostel.id}>
                                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                                    {hostel.images[0] && (
                                        <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">{hostel.name}</CardTitle>
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-primary">Rs. {hostel.rent.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">per bed/month</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                            <span className="font-medium">{hostel.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/hostels/${hostel.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full">View Details</Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleRemoveFavorite(hostel.id)}
                                        >
                                            Remove
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
