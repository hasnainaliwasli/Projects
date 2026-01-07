"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import HostelCard from "@/components/hostel-card";
import { fetchHostels } from "@/lib/slices/hostelSlice";
import {
    Search,
    SlidersHorizontal,
    X,
    MapPin,
    Filter,
    Star,
    Check,
    BedDouble,
    Wifi,
    ShieldCheck,
    Utensils,
    Zap,
    Trash
} from "lucide-react";
import { Loader } from "@/components/ui/loader";

export default function HostelsPage() {
    const dispatch = useAppDispatch();
    const { hostels, loading } = useAppSelector((state) => state.hostel);

    useEffect(() => {
        dispatch(fetchHostels({}));
    }, [dispatch]);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        searchQuery: "",
        city: "",
        genderType: "",
        minRent: "",
        maxRent: "",
        rating: 0,
        roomTypes: {
            Single: false,
            Double: false,
            Triple: false,
        },
        facilities: {
            wifi: false,
            fridge: false,
            laundry: false,
            parking: false,
            security: false,
            meals: false,
            water: false,
            electricity: false,
        },
    });

    // Get unique cities
    const cities = useMemo(() => Array.from(new Set(hostels.map((h) => h.location.city))), [hostels]);

    // 2. Enhanced Filter Logic
    const filteredHostels = useMemo(() => {
        return hostels.filter((hostel) => {
            // Search query (Name, City, Area)
            if (
                filters.searchQuery &&
                !hostel.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
                !hostel.location.city.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
                !hostel.location.area.toLowerCase().includes(filters.searchQuery.toLowerCase())
            ) {
                return false;
            }

            // City filter
            if (filters.city && hostel.location.city !== filters.city) {
                return false;
            }

            // Gender filter
            if (filters.genderType && hostel.isFor !== filters.genderType) {
                return false;
            }

            // Rent Range Filter (Checks if hostel rent falls within range)
            const rent = hostel.rent;
            if (filters.minRent && rent < parseInt(filters.minRent)) return false;
            if (filters.maxRent && rent > parseInt(filters.maxRent)) return false;

            // Rating Filter
            if (filters.rating > 0 && hostel.rating < filters.rating) {
                return false;
            }

            // Room Type Filter
            // Checks if the hostel has AT LEAST one of the selected room types
            const selectedRoomTypes = Object.entries(filters.roomTypes)
                .filter(([_, enabled]) => enabled)
                .map(([type]) => type);

            if (selectedRoomTypes.length > 0) {
                // Look inside the hostel's rooms array
                const hasMatchingRoom = hostel.rooms.some(room =>
                    selectedRoomTypes.includes(room.type)
                );
                if (!hasMatchingRoom) return false;
            }

            // Facilities filter (Strict: Must have ALL selected)
            const selectedFacilities = Object.entries(filters.facilities)
                .filter(([_, enabled]) => enabled)
                .map(([name]) => name);

            if (selectedFacilities.length > 0) {
                const hasAllFacilities = selectedFacilities.every(
                    (facility) => hostel.facilities[facility as keyof typeof hostel.facilities]
                );
                if (!hasAllFacilities) return false;
            }

            return true;
        });
    }, [hostels, filters]);

    const clearFilters = () => {
        setFilters({
            searchQuery: "",
            city: "",
            genderType: "",
            minRent: "",
            maxRent: "",
            rating: 0,
            roomTypes: { Single: false, Double: false, Triple: false },
            facilities: {
                wifi: false, fridge: false, laundry: false, parking: false,
                security: false, meals: false, water: false, electricity: false
            },
        });
    };

    // Count active filters for the badge
    const activeFilterCount = [
        filters.city,
        filters.genderType,
        filters.minRent,
        filters.maxRent,
        filters.rating > 0,
        ...Object.values(filters.facilities).filter(Boolean),
        ...Object.values(filters.roomTypes).filter(Boolean),
    ].filter(Boolean).length;

    if (loading && hostels.length === 0) {
        return <Loader fullScreen text="Loading hostels..." />;
    }

    return (
        <div className="min-h-screen bg-background">


            {/* --- Filter Modal Overlay --- */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl animate-in mt-16 zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5" />
                                All Filters
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <CardContent className="p-6 space-y-8">
                            {/* Section 1: Price Range */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Price Range (PKR)</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 space-y-1">
                                        <span className="text-xs text-muted-foreground">Min Rent</span>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={filters.minRent}
                                            onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                                        />
                                    </div>
                                    <span className="pt-4">-</span>
                                    <div className="flex-1 space-y-1">
                                        <span className="text-xs text-muted-foreground">Max Rent</span>
                                        <Input
                                            type="number"
                                            placeholder="Any"
                                            value={filters.maxRent}
                                            onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Section 2: Room Types */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <BedDouble className="h-4 w-4" /> Room Type
                                    </Label>
                                    <div className="space-y-2">
                                        {Object.keys(filters.roomTypes).map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors border">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 h-4 w-4 text-primary focus:ring-primary"
                                                    checked={filters.roomTypes[type as keyof typeof filters.roomTypes]}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        roomTypes: { ...filters.roomTypes, [type]: e.target.checked }
                                                    })}
                                                />
                                                <span className="text-sm font-medium">{type} Bed</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 3: Star Rating */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <Star className="h-4 w-4" /> Rating
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[3, 4, 4.5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => setFilters({ ...filters, rating: filters.rating === rating ? 0 : rating })}
                                                className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm transition-all
                          ${filters.rating === rating
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "hover:bg-muted"}`}
                                            >
                                                {rating}+ <Star className="h-3 w-3 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Facilities */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Zap className="h-4 w-4" /> Amenities & Facilities
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {Object.keys(filters.facilities).map((facility) => (
                                        <label key={facility} className={`
                      flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                      ${filters.facilities[facility as keyof typeof filters.facilities]
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "hover:border-primary/50"}
                    `}>
                                            <input
                                                type="checkbox"
                                                className="hidden" // Hiding default checkbox for cleaner UI
                                                checked={filters.facilities[facility as keyof typeof filters.facilities]}
                                                onChange={(e) => setFilters({
                                                    ...filters,
                                                    facilities: { ...filters.facilities, [facility]: e.target.checked }
                                                })}
                                            />
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                        ${filters.facilities[facility as keyof typeof filters.facilities]
                                                    ? "bg-primary border-primary"
                                                    : "border-gray-400"}`}>
                                                {filters.facilities[facility as keyof typeof filters.facilities] &&
                                                    <Check className="h-3 w-3 text-white" />
                                                }
                                            </div>
                                            <span className="text-sm capitalize">{facility}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <div className="sticky bottom-0 bg-card border-t p-4 flex gap-4 z-10">
                            <Button variant="outline" className="flex-1" onClick={clearFilters}>
                                Clear All
                            </Button>
                            <Button className="flex-1" onClick={() => setIsFilterModalOpen(false)}>
                                Show {filteredHostels.length} Hostels
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Hero Section with Search */}
            <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <h1 className="text-3xl md:text-5xl font-bold">Discover Your Perfect Hostel</h1>
                        <p className="text-muted-foreground">
                            Browse through {hostels.length} verified hostels and find your ideal accommodation
                        </p>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                            <input
                                value={filters.searchQuery}
                                onChange={(e) =>
                                    setFilters({ ...filters, searchQuery: e.target.value })
                                }
                                placeholder="Search hostels..."
                                className="w-full pl-11 pr-11 py-2 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                            {filters.searchQuery && (
                                <X
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground"
                                    onClick={() => setFilters({ ...filters, searchQuery: "" })}
                                />
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">

                {/* Top Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-card p-4 rounded-xl border shadow-sm top-4 z-30">

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        {/* Quick Filter: City */}
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="h-10 px-3 rounded-md border bg-background text-sm focus:ring-2 ring-primary outline-none"
                        >
                            <option value="">All Cities</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        {/* Quick Filter: Gender */}
                        <select
                            value={filters.genderType}
                            onChange={(e) => setFilters({ ...filters, genderType: e.target.value })}
                            className="h-10 px-3 rounded-md border bg-background text-sm focus:ring-2 ring-primary outline-none"
                        >
                            <option value="">All Genders</option>
                            <option value="boys">Boys</option>
                            <option value="girls">Girls</option>
                        </select>

                        {/* Quick Filter: Rating */}
                        <select
                            value={filters.rating}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    rating: Number(e.target.value),
                                })
                            }
                            className="h-10 px-3 rounded-md border bg-background text-sm focus:ring-2 ring-primary outline-none"
                        >
                            <option value={0}>Any rating</option>
                            <option value={3}>3+ stars</option>
                            <option value={4}>4+ stars</option>
                            <option value={4.5}>4.5+ stars</option>
                        </select>


                        {/* The Modal Trigger Button */}
                        <Button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="gap-2 w-full md:w-auto"
                            variant={activeFilterCount > 0 ? "default" : "outline"}
                        >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </div>

                </div>

                {/* Results Grid */}
                <div className="space-y-6 ">
                    <div className="flex items-center gap-5">
                        <div className="text-sm font-semibold text-muted-foreground hidden md:inline">
                            {filteredHostels.length} results found
                        </div>
                        {activeFilterCount > 0 && <div onClick={clearFilters} className="items-center gap-1 text-green-500/100 hover:bg-muted-foreground/20 rounded-full p-1 cursor-pointer text-sm font-semibold hidden md:flex">
                            <X className="h-4 w-4" /> Clear Filters
                        </div>}
                    </div>
                    {filteredHostels.length === 0 ? (
                        <Card className="border-2 border-dashed bg-muted/20">
                            <CardContent className="text-center py-16">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                                    <Search className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No hostels match your filters</h3>
                                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                                    We couldn't find any hostels matching your specific criteria. Try removing some filters or expanding your search.
                                </p>
                                <Button onClick={clearFilters} size="lg">
                                    Clear All Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 mt-2  xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                            {filteredHostels.map((hostel) => (
                                <HostelCard key={hostel.id} hostel={hostel} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}