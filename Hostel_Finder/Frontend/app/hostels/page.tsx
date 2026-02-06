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
    Filter,
    Star,
    Check,
    BedDouble,
    Zap,
    MapPin,
    Building2
} from "lucide-react";
import { Loader } from "@/components/ui/loader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function HostelsPage() {
    const dispatch = useAppDispatch();
    const { hostels, loading } = useAppSelector((state) => state.hostel);

    useEffect(() => {
        dispatch(fetchHostels({}));
    }, [dispatch]);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        searchQuery: "",
        city: "All Cities",
        genderType: "All Genders",
        minRent: "",
        maxRent: "",
        rating: "0",
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

    // Enhanced Filter Logic
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
            if (filters.city && filters.city !== "All Cities" && hostel.location.city !== filters.city) {
                return false;
            }

            // Gender filter
            if (filters.genderType && filters.genderType !== "All Genders" && hostel.isFor !== filters.genderType) {
                return false;
            }

            // Rent Range Filter
            const rent = hostel.rent;
            if (filters.minRent && rent < parseInt(filters.minRent)) return false;
            if (filters.maxRent && rent > parseInt(filters.maxRent)) return false;

            // Rating Filter
            if (parseInt(filters.rating) > 0 && hostel.rating < parseInt(filters.rating)) {
                return false;
            }

            // Room Type Filter
            const selectedRoomTypes = Object.entries(filters.roomTypes)
                .filter(([_, enabled]) => enabled)
                .map(([type]) => type);

            if (selectedRoomTypes.length > 0) {
                const hasMatchingRoom = hostel.rooms.some(room =>
                    selectedRoomTypes.includes(room.type)
                );
                if (!hasMatchingRoom) return false;
            }

            // Facilities filter
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
            city: "All Cities",
            genderType: "All Genders",
            minRent: "",
            maxRent: "",
            rating: "0",
            roomTypes: { Single: false, Double: false, Triple: false },
            facilities: {
                wifi: false, fridge: false, laundry: false, parking: false,
                security: false, meals: false, water: false, electricity: false
            },
        });
    };

    const activeFilterCount = [
        filters.city !== "All Cities",
        filters.genderType !== "All Genders",
        filters.minRent,
        filters.maxRent,
        parseInt(filters.rating) > 0,
        ...Object.values(filters.facilities).filter(Boolean),
        ...Object.values(filters.roomTypes).filter(Boolean),
    ].filter(Boolean).length;

    if (loading && hostels.length === 0) {
        return <Loader fullScreen text="Finding the best spots..." />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background">
            {/* --- Filter Modal Overlay --- */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl mt-15 max-h-[75vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b bg-muted/30">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                                    Advanced Filters
                                </h2>
                                <p className="text-sm text-muted-foreground">Refine your search results</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(false)} className="rounded-full hover:bg-muted">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Mobile-only visible filters (City, Type, Rating) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-border/50">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Select value={filters.city} onValueChange={(val) => setFilters({ ...filters, city: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="City" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All Cities">All Cities</SelectItem>
                                            {cities.map((city) => (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Hostel Type</Label>
                                    <Select value={filters.genderType} onValueChange={(val) => setFilters({ ...filters, genderType: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All Genders">All Types</SelectItem>
                                            <SelectItem value="boys">Boys Hostel</SelectItem>
                                            <SelectItem value="girls">Girls Hostel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Minimum Rating</Label>
                                    <Select value={filters.rating} onValueChange={(val) => setFilters({ ...filters, rating: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Any Rating</SelectItem>
                                            <SelectItem value="3">3+ Stars</SelectItem>
                                            <SelectItem value="4">4+ Stars</SelectItem>
                                            <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Price Range (PKR)</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">Min</span>
                                        <Input
                                            type="number"
                                            className="pl-12"
                                            placeholder="0"
                                            value={filters.minRent}
                                            onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                                        />
                                    </div>
                                    <span className="text-muted-foreground font-medium">-</span>
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">Max</span>
                                        <Input
                                            type="number"
                                            className="pl-12"
                                            placeholder="Any"
                                            value={filters.maxRent}
                                            onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Room Types */}
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <BedDouble className="h-4 w-4 text-primary" /> Room Options
                                    </Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.keys(filters.roomTypes).map((type) => (
                                            <label key={type} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${filters.roomTypes[type as keyof typeof filters.roomTypes] ? "border-primary bg-primary/5" : ""}`}>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filters.roomTypes[type as keyof typeof filters.roomTypes] ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                                                    {filters.roomTypes[type as keyof typeof filters.roomTypes] && <Check className="h-3.5 w-3.5 text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={filters.roomTypes[type as keyof typeof filters.roomTypes]}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        roomTypes: { ...filters.roomTypes, [type]: e.target.checked }
                                                    })}
                                                />
                                                <span className="font-medium">{type} Bed</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-primary" /> Key Amenities
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.keys(filters.facilities).slice(0, 6).map((facility) => (
                                            <label key={facility} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors hover:bg-muted ${filters.facilities[facility as keyof typeof filters.facilities] ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.facilities[facility as keyof typeof filters.facilities] ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                                                    {filters.facilities[facility as keyof typeof filters.facilities] && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={filters.facilities[facility as keyof typeof filters.facilities]}
                                                    onChange={(e) => setFilters({
                                                        ...filters,
                                                        facilities: { ...filters.facilities, [facility]: e.target.checked }
                                                    })}
                                                />
                                                <span className="text-sm capitalize">{facility}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t bg-muted/30 flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={clearFilters}>
                                Reset Filters
                            </Button>
                            <Button className="flex-1" onClick={() => setIsFilterModalOpen(false)}>
                                Apply Filters ({activeFilterCount})
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- Hero Section --- */}
            <div className="relative bg-[#020817] text-white pt-24 pb-20 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 mb-4 px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-sm text-xs sm:text-sm">
                        ✨ Over {hostels.length} verified listings
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent px-2">
                        Find Your Perfect Student Home
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Discover comfortable, safe, and affordable hostels near your university.
                        Book instantly with trusted owners.
                    </p>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="container mx-auto px-4 -mt-8 relative z-20 pb-20">
                {/* Search & Filter Bar */}
                <div className="bg-background rounded-xl shadow-lg border p-4 flex flex-col md:flex-row gap-4 items-center">

                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                            placeholder="Search by name, area, or city..."
                            className="w-full pl-10 pr-4 h-10 sm:h-12 rounded-lg border bg-muted/30 focus:bg-background transition-all focus:ring-2 ring-primary/20 outline-none text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex w-full md:w-auto gap-2 md:gap-3 items-center">
                        {/* Desktop Filters (Hidden on Mobile) */}
                        <div className="hidden md:flex gap-3">
                            {/* City Select */}
                            <Select value={filters.city} onValueChange={(val) => setFilters({ ...filters, city: val })}>
                                <SelectTrigger className="w-[140px] h-10 sm:h-12 text-sm sm:text-base">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="City" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Cities">All Cities</SelectItem>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Gender Select */}
                            <Select value={filters.genderType} onValueChange={(val) => setFilters({ ...filters, genderType: val })}>
                                <SelectTrigger className="w-[140px] h-10 sm:h-12 text-sm sm:text-base">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Genders">All Types</SelectItem>
                                    <SelectItem value="boys">Boys Hostel</SelectItem>
                                    <SelectItem value="girls">Girls Hostel</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Rating Select */}
                            <Select value={filters.rating} onValueChange={(val) => setFilters({ ...filters, rating: val })}>
                                <SelectTrigger className="w-[130px] h-10 sm:h-12 text-sm sm:text-base">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Rating" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Any Rating</SelectItem>
                                    <SelectItem value="3">3+ Stars</SelectItem>
                                    <SelectItem value="4">4+ Stars</SelectItem>
                                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Filters Button (Visible always, but primary on mobile) */}
                        <Button
                            variant="outline"
                            className={`h-10 sm:h-12 px-4 gap-2 w-full md:w-auto ${activeFilterCount > 0 ? "border-primary text-primary bg-primary/5" : "border-dashed"}`}
                            onClick={() => setIsFilterModalOpen(true)}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="md:inline">Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Results Stats */}
                <div className="mt-8 mb-6 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                        Available Hostels
                        <span className="ml-2 text-xs sm:text-sm font-normal text-muted-foreground">({filteredHostels.length} found)</span>
                    </h2>

                    {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                            Clear all filters
                        </Button>
                    )}
                </div>

                {/* Grid */}
                {filteredHostels.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-background rounded-xl border border-dashed text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold">No hostels found</h3>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-md mt-2 mb-6 px-4">
                            We couldn't find any hostels matching your criteria. Try adjusting your filters or search for a different city.
                        </p>
                        <Button onClick={clearFilters}>Reset Search</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredHostels.map((hostel, index) => (
                            <div key={hostel.id} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards" style={{ animationDelay: `${index * 50}ms` }}>
                                <HostelCard hostel={hostel} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}