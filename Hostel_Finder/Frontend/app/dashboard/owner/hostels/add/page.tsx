"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/map-components").then(mod => mod.MapPicker), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full rounded-md bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
});
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { addHostel } from "@/lib/slices/hostelSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddHostelPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        genderType: "boys" as "boys" | "girls" | "mixed",
        city: "",
        area: "",
        address: "",
        latitude: 0,
        longitude: 0,
        images: [""],
        rent: 0,
        floors: 1,
        roomsPerFloor: 1,
        availableBeds: 0,
        availability: "available" as "available" | "limited" | "full",
        isFor: "boys" as "boys" | "girls",
        contactNumbers: [""],
        facilities: {
            fridge: false,
            water: false,
            electricity: false,
            wifi: false,
            laundry: false,
            parking: false,
            security: false,
            meals: false,
        },
    });

    if (!currentUser || currentUser.role !== "owner") {
        return null;
    }

    const handleAddImage = () => {
        setFormData({
            ...formData,
            images: [...formData.images, ""],
        });
    };

    const handleRemoveImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleAddContact = () => {
        setFormData({
            ...formData,
            contactNumbers: [...formData.contactNumbers, ""],
        });
    };

    const handleRemoveContact = (index: number) => {
        setFormData({
            ...formData,
            contactNumbers: formData.contactNumbers.filter((_, i) => i !== index),
        });
    };

    const handleContactChange = (index: number, value: string) => {
        const newContacts = [...formData.contactNumbers];
        newContacts[index] = value;
        setFormData({ ...formData, contactNumbers: newContacts });
    };

    const handleFacilityChange = (facility: string) => {
        setFormData({
            ...formData,
            facilities: {
                ...formData.facilities,
                [facility]: !formData.facilities[facility as keyof typeof formData.facilities],
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const hostelData = {
            name: formData.name,
            description: formData.description,
            ownerId: currentUser.id,
            ownerName: currentUser.fullName,
            genderType: formData.genderType,
            location: {
                city: formData.city,
                area: formData.area,
                address: formData.address,
                latitude: formData.latitude,
                longitude: formData.longitude,
            },
            images: formData.images.filter(img => img.trim() !== ""),
            rooms: [
                { type: "Single", capacity: 1, rentPerRoom: formData.rent },
                { type: "Double", capacity: 2, rentPerBed: formData.rent * 0.7 },
            ],
            floors: formData.floors,
            roomsPerFloor: formData.roomsPerFloor,
            rent: formData.rent,
            facilities: formData.facilities,
            availableBeds: formData.availableBeds,
            availability: formData.availability,
            contactNumber: formData.contactNumbers.filter(c => c.trim() !== ""),
            isFor: formData.isFor,
        };

        try {
            await dispatch(addHostel(hostelData)).unwrap();
            toast.success("Hostel added successfully!");
            router.push("/dashboard/owner/hostels");
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to add hostel. Please try again.");
            console.error("Add hostel error:", error);
        }
    };

    return (
        <DashboardLayout role="owner">
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">Add New Hostel</h1>
                    <p className="text-muted-foreground">Fill in the details to list your hostel</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Hostel Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="genderType">Gender Type *</Label>
                                    <select
                                        id="genderType"
                                        value={formData.genderType}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            genderType: e.target.value as any,
                                            isFor: e.target.value as any
                                        })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="boys">Boys</option>
                                        <option value="girls">Girls</option>
                                        <option value="mixed">Mixed</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rent">Base Rent (per bed) *</Label>
                                    <Input
                                        id="rent"
                                        type="number"
                                        value={formData.rent}
                                        onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="area">Area *</Label>
                                    <Input
                                        id="area"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address *</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label>Location on Map *</Label>
                                <div className="text-muted-foreground text-sm mb-2">Click on the map to set the exact location of your hostel.</div>
                                <MapPicker
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                    onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                                />
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="text-xs text-muted-foreground">Lat: {formData.latitude.toFixed(6)}</div>
                                    <div className="text-xs text-muted-foreground">Lng: {formData.longitude.toFixed(6)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg md:text-xl">Hostel Images</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                                    + Add Image
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {formData.images.map((image, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={image}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                    />
                                    {formData.images.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            ×
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Building Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Building Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="floors">Number of Floors *</Label>
                                    <Input
                                        id="floors"
                                        type="number"
                                        min="1"
                                        value={formData.floors}
                                        onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="roomsPerFloor">Rooms per Floor</Label>
                                    <Input
                                        id="roomsPerFloor"
                                        type="number"
                                        min="1"
                                        value={formData.roomsPerFloor}
                                        onChange={(e) => setFormData({ ...formData, roomsPerFloor: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="availableBeds">Available Beds *</Label>
                                    <Input
                                        id="availableBeds"
                                        type="number"
                                        min="0"
                                        value={formData.availableBeds}
                                        onChange={(e) => setFormData({ ...formData, availableBeds: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="availability">Availability Status *</Label>
                                <select
                                    id="availability"
                                    value={formData.availability}
                                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="available">Available</option>
                                    <option value="limited">Limited</option>
                                    <option value="full">Full</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Facilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Facilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.keys(formData.facilities).map((facility) => (
                                    <label key={facility} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.facilities[facility as keyof typeof formData.facilities]}
                                            onChange={() => handleFacilityChange(facility)}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm capitalize">{facility}</span>
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Numbers */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg md:text-xl">Contact #</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddContact}>
                                    + Add More
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {formData.contactNumbers.map((contact, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        type="tel"
                                        placeholder="+92xxxxxxxxxx"
                                        value={contact}
                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                    />
                                    {formData.contactNumbers.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleRemoveContact(index)}
                                        >
                                            ×
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button type="submit" size="lg" className="flex-1">
                            Add Hostel
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
