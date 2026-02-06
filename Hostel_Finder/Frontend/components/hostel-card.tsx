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
        <Link href={`/hostels/${hostel.id}`} className="block h-full group">
            <Card className="h-full overflow-hidden border-border/40 bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {hostel.images[0] ? (
                        <img
                            src={hostel.images[0]}
                            alt={hostel.name}
                            className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/10">
                            <Users className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                    )}

                    {/* Top Overlays */}
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-10">
                        <Badge
                            variant="secondary"
                            className={`backdrop-blur-md border-0 text-[10px] px-2 h-5 ${hostel.availability === "available" ? "bg-green-500/90 text-white" :
                                hostel.availability === "limited" ? "bg-yellow-500/90 text-white" :
                                    "bg-red-500/90 text-white"
                                }`}
                        >
                            {hostel.availability === "available" ? "Available" :
                                hostel.availability === "limited" ? "Limited Spots" : "Full"}
                        </Badge>

                        <div className="flex gap-2">
                            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white md:px-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{hostel.rating}</span>
                            </div>
                            {isFavorite && (
                                <div className="p-1.5 rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
                                    <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Type Badge on Image */}
                    <div className="absolute bottom-2 left-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
                            {hostel.isFor === "boys" ? "Boys" : "Girls"}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <CardContent className="flex-1 p-3 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
                            {hostel.name}
                        </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary/70" />
                        <span className="truncate">{hostel.location.area}, {hostel.location.city}</span>
                    </div>

                    {/* Facilities Preview */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-border/50">
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {topFacilities.slice(0, 3).map((facility, i) => {
                                const Icon = facilityIcons[facility] || Shield;
                                return (
                                    <div key={i} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-background border border-border text-muted-foreground" title={facility}>
                                        <Icon className="h-2.5 w-2.5" />
                                    </div>
                                )
                            })}
                            {topFacilities.length > 3 && (
                                <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted border border-border text-[8px] font-medium text-muted-foreground">
                                    +{topFacilities.length - 3}
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">Amenities included</span>
                    </div>

                </CardContent>

                <CardFooter className="p-3 pt-0 mt-auto flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-primary">Rs {hostel.rent.toLocaleString()}</span>
                            <span className="text-[10px] text-muted-foreground">/mo</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0 hover:bg-primary hover:text-primary-foreground">
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
