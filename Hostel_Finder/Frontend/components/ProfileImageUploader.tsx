"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload, Trash2, X } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { uploadProfileImage, deleteProfileImage } from "@/lib/slices/userSlice";
import { toast } from "sonner";

interface ProfileImageUploaderProps {
    currentImage?: string;
    defaultImage?: string;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default function ProfileImageUploader({ currentImage, defaultImage = "https://cdn-icons-png.flaticon.com/512/9203/9203764.png" }: ProfileImageUploaderProps) {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isDefaultImage = !currentImage || currentImage === defaultImage;

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validate file type
            if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
                toast.error("Only JPEG, PNG, and WebP images are allowed");
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgSrc(reader.result?.toString() || "");
                setIsOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    }, []);

    const getCroppedImage = useCallback(async (): Promise<string | null> => {
        if (!imgRef.current || !completedCrop) return null;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

        // Set canvas size to desired output (e.g., 256x256 for profile pics)
        const outputSize = 256;
        canvas.width = outputSize;
        canvas.height = outputSize;

        ctx.drawImage(
            imgRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            outputSize,
            outputSize
        );

        return canvas.toDataURL("image/jpeg", 0.9);
    }, [completedCrop]);

    const handleUpload = async () => {
        const croppedImage = await getCroppedImage();
        if (!croppedImage) {
            toast.error("Please select a crop area");
            return;
        }

        setUploading(true);
        try {
            await dispatch(uploadProfileImage(croppedImage)).unwrap();
            toast.success("Profile image updated successfully!");
            setIsOpen(false);
            setImgSrc("");
            setCrop(undefined);
            setCompletedCrop(undefined);
        } catch (error: any) {
            toast.error(typeof error === "string" ? error : "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await dispatch(deleteProfileImage()).unwrap();
            toast.success("Profile image removed");
        } catch (error: any) {
            toast.error(typeof error === "string" ? error : "Failed to remove image");
        } finally {
            setDeleting(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setImgSrc("");
        setCrop(undefined);
        setCompletedCrop(undefined);
    };

    return (
        <div className="space-y-4">
            {/* Current Image Preview */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={currentImage || defaultImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                    </Button>
                    {!isDefaultImage && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deleting ? "Removing..." : "Remove"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={onSelectFile}
                className="hidden"
            />

            {/* Crop Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Crop Profile Image</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                        {imgSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    className="max-h-[400px]"
                                />
                            </ReactCrop>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={uploading || !completedCrop}>
                            {uploading ? "Uploading..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
