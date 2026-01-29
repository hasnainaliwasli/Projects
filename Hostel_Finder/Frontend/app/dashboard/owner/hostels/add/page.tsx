"use client";

import { useState, useEffect } from "react";
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
import HostelImageUploader from "@/components/HostelImageUploader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function AddHostelPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        genderType: "boys" as "boys" | "girls" | "mixed",
        city: "",
        area: "",
        address: "",
        latitude: 0,
        longitude: 0,

        images: [] as (string | File)[],
        rent: 0,

        floors: 1,
        roomsPerFloor: 1,
        availableBeds: 0,
        availability: "available" as "available" | "limited" | "full",
        isFor: "boys" as "boys" | "girls",
        contactNumbers: currentUser?.phoneNumbers?.length ? currentUser.phoneNumbers : [""],
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

    useEffect(() => {
        if (currentUser?.phoneNumbers?.length) {
            setFormData(prev => ({
                ...prev,
                contactNumbers: currentUser.phoneNumbers
            }));
        }
    }, [currentUser]);

    if (!currentUser || currentUser.role !== "owner") {
        return null;
    }

    const handleImagesChange = (newImages: (string | File)[]) => {
        setFormData({ ...formData, images: newImages });
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

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("ownerId", currentUser.id);
        data.append("ownerName", currentUser.fullName);
        data.append("genderType", formData.genderType);

        data.append("location", JSON.stringify({
            city: formData.city,
            area: formData.area,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
        }));

        data.append("rooms", JSON.stringify([
            { type: "Single", capacity: 1, rentPerRoom: formData.rent },
            { type: "Double", capacity: 2, rentPerBed: formData.rent * 0.7 },
        ]));

        data.append("floors", formData.floors.toString());
        data.append("roomsPerFloor", formData.roomsPerFloor.toString());
        data.append("rent", formData.rent.toString());
        data.append("facilities", JSON.stringify(formData.facilities));
        data.append("availableBeds", formData.availableBeds.toString());
        data.append("availability", formData.availability);
        data.append("contactNumber", JSON.stringify(formData.contactNumbers.filter(c => c.trim() !== "")));
        data.append("isFor", formData.isFor);

        console.log("Submitting form with images count:", formData.images.length);
        let fileCount = 0;
        formData.images.forEach((image) => {
            if (image instanceof File) {
                data.append("images", image);
                fileCount++;
                console.log(`Appending file: ${image.name} size: ${image.size}`);
            } else {
                console.log("Skipping non-file image:", image);
            }
        });
        console.log(`Total files appended to FormData: ${fileCount}`);


        try {
            setIsSubmitting(true);
            setUploadProgress(0);

            // Simulate progress since we don't have real upload progress from thunk
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 500);

            await dispatch(addHostel(data)).unwrap();

            clearInterval(interval);
            setUploadProgress(100);

            toast.success("Hostel added successfully!");
            router.push("/dashboard/owner/hostels");
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to add hostel. Please try again.");
            console.error("Add hostel error:", error);
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    }

    return (
        <DashboardLayout role="owner">
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">Add New Hostel</h1>
                    <p className="text-muted-foreground">Fill in the details to list your hostel</p>
                </div>

                <Dialog open={isSubmitting} onOpenChange={() => { }}>
                    <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Uploading Hostel</DialogTitle>
                            <DialogDescription>
                                Please wait while we process your request. Do not close this window.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <Progress value={uploadProgress} className="w-full" />
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{uploadProgress < 100 ? "Uploading files..." : "Finalizing..."}</span>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="area">Area *</Label>
                                    <Input
                                        id="area"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        required
                                        disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                            <CardTitle className="text-lg md:text-xl">Hostel Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <HostelImageUploader
                                images={formData.images}
                                onImagesChange={handleImagesChange}
                                maxImages={5}
                            />
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                            disabled={isSubmitting}
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
                            <CardTitle className="text-lg md:text-xl">Contact #</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground mb-3">
                                Contact numbers are automatically filled from your profile.
                            </p>
                            {formData.contactNumbers.map((contact, index) => (
                                <div key={index}>
                                    <Input
                                        type="tel"
                                        value={contact}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            ))}
                            {formData.contactNumbers.length === 0 || (formData.contactNumbers.length === 1 && !formData.contactNumbers[0]) ? (
                                <p className="text-sm text-destructive">
                                    No phone numbers found. Please add phone numbers in your profile first.
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? "Adding Hostel..." : "Add Hostel"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
