"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks";
import { Hostel } from "@/lib/types";
import { MapPin, Users, Star, Wifi, Car, Shield, Utensils, Heart, ArrowRight, Zap, Coffee } from "lucide-react";

interface HostelCardProps {
    hostel: Hostel;
}

export default function HostelCard({ hostel }: HostelCardProps) {
    const { currentUser } = useAppSelector((state) => state.auth);
    const isFavorite = currentUser?.favoriteHostels?.includes(hostel.id) || false;

    // Enhanced facility mapping
    const facilityIcons: { [key: string]: any } = {
        wifi: Wifi,
        parking: Car,
        security: Shield,
        meals: Utensils,
        laundry: Zap, // Placeholder for laundry if needed
        ac: Coffee,   // Placeholder for AC if needed
    };

    const topFacilities = Object.entries(hostel.facilities)
        .filter(([_, enabled]) => enabled)
        .slice(0, 4) // Show up to 4 facilities
        .map(([name]) => name);

    return (
        <Link href={`/hostels/${hostel.id}`} className="block h-full">
            <Card className="group h-full overflow-hidden border-border/50 bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {hostel.images[0] ? (
                        <img
                            src={hostel.images[0]}
                            alt={hostel.name}
                            className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 origin-center"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/10">
                            <Users className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                    )}

                    {/* Top Overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                        <Badge
                            className={`shadow-sm backdrop-blur-md border-0 ${hostel.availability === "available" ? "bg-green-500/90 hover:bg-green-600/90" :
                                hostel.availability === "limited" ? "bg-yellow-500/90 hover:bg-yellow-600/90" :
                                    "bg-red-500/90 hover:bg-red-600/90"
                                }`}
                        >
                            {hostel.availability === "available" ? "Available" :
                                hostel.availability === "limited" ? "Limited Spots" : "Full"}
                        </Badge>
                        {isFavorite && (
                            <div className="p-2 rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </div>
                        )}
                    </div>

                    {/* Bottom Gradient for Text Readability (optional if text overlays image) */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Corner Tag */}
                    <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-black/90 text-xs text-black font-bold dark:text-white font-medium">
                            {hostel.isFor === "boys" ? "Boys Hostel" : "Girls Hostel"}
                        </Badge>
                    </div>
                </div>

                <CardContent className="flex-1 p-5 space-y-4">
                    {/* Header */}
                    <div>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                            {hostel.isFor === 'boys' ? 'Boys Hostel' : 'Girls Hostel'}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-sm">{hostel.rating}</span>
                            <span className="text-muted-foreground text-xs">({hostel.reviewIds.length})</span>
                        </div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
                            {hostel.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                            <span className="line-clamp-1">{hostel.location.area}, {hostel.location.city}</span>
                        </div>
                    </div>

                    {/* Facilities Tags */}
                    {/* {topFacilities.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {topFacilities.map((facility) => {
                                const Icon = facilityIcons[facility] || Shield;
                                return (
                                    <div
                                        key={facility}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-medium border border-secondary/20"
                                    >
                                        <Icon className="h-3 w-3" />
                                        <span className="capitalize">{facility}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )} */}
                </CardContent>

                <CardFooter className="p-5 pt-0 mt-auto border-t border-border/50 bg-muted/20">
                    <div className="w-full flex items-center justify-between pt-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Rent starts from</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-primary">Rs. {hostel.rent.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">/mo</span>
                            </div>
                        </div>
                        <Button size="sm" className="rounded-full px-4 shadow-sm group-hover:translate-x-1 transition-transform">
                            View
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
