"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface HostelImageUploaderProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    maxSizeMB?: number;
}

export default function HostelImageUploader({
    images,
    onImagesChange,
    maxImages = 5,
    maxSizeMB = 2,
}: HostelImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        const remainingSlots = maxImages - images.length;

        if (files.length > remainingSlots) {
            toast.error(`You can only add ${remainingSlots} more image(s). Maximum is ${maxImages}.`);
            return;
        }

        setUploading(true);
        const newImages: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
                toast.error(`${file.name}: Only JPEG, PNG, and WebP images are allowed`);
                continue;
            }

            // Validate file size
            if (file.size > maxSizeMB * 1024 * 1024) {
                toast.error(`${file.name}: Image size must be less than ${maxSizeMB}MB`);
                continue;
            }

            // Convert to base64
            try {
                const base64 = await fileToBase64(file);
                newImages.push(base64);
            } catch (error) {
                toast.error(`${file.name}: Failed to process image`);
            }
        }

        if (newImages.length > 0) {
            onImagesChange([...images, ...newImages]);
        }

        setUploading(false);
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const canAddMore = images.length < maxImages;

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                                src={image}
                                alt={`Hostel image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                                {index + 1}/{images.length}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {canAddMore && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                    <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground">Processing images...</p>
                            </>
                        ) : (
                            <>
                                <ImagePlus className="w-8 h-8 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Click to upload images</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        JPEG, PNG, WebP up to {maxSizeMB}MB each • {images.length}/{maxImages} images
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || !canAddMore}
            />

            {/* Max reached message */}
            {!canAddMore && (
                <p className="text-xs text-muted-foreground text-center">
                    Maximum of {maxImages} images reached. Remove existing images to add new ones.
                </p>
            )}
        </div>
    );
}
