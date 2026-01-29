"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { toggleFavorite } from "@/lib/slices/userSlice";
import { createReview, fetchReviews, updateReview, deleteReview } from "@/lib/slices/reviewSlice";
import { fetchHostels } from "@/lib/slices/hostelSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
    Heart,
    Share2,
    MapPin,
    ArrowLeft,
    Star,
    CheckCircle2,
    XCircle,
    Phone,
    User,
    Building2,
    BedDouble,
    LayoutDashboard,
    MessageSquare,
    Trash2
} from "lucide-react";
import { accessChat } from "@/lib/slices/chatSlice";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("@/components/map-components").then(mod => mod.MapViewer), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full rounded-md bg-muted animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function HostelDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const hostelId = params.id as string;

    const { hostels, loading } = useAppSelector((state) => state.hostel);
    const { reviews } = useAppSelector((state) => state.review);
    const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);

    const hostel = hostels.find((h) => h.id === hostelId);
    const hostelReviews = reviews.filter((r) => r.hostelId === hostelId);
    const isFavorite = currentUser?.favoriteHostels?.includes(hostelId) || false;

    const [selectedImage, setSelectedImage] = useState(0);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: "",
    });
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch hostels and reviews when component mounts
    useEffect(() => {
        const fetchData = async () => {
            // Guard: If we already have the hostel loaded, don't trigger a global re-fetch
            // This prevents the "loading" flash when currentUser updates (e.g. toggling favorites)
            const hasHostel = hostels.some(h => h.id === hostelId);

            if (hasHostel) {
                setInitialLoadDone(true);
                if (hostelId) dispatch(fetchReviews(hostelId));
                return;
            }

            if (currentUser?.role === 'admin') {
                await dispatch(fetchHostels({ mode: 'admin' }));
            } else if (currentUser?.role === 'owner') {
                await dispatch(fetchHostels({ owner: currentUser.id }));
            } else {
                await dispatch(fetchHostels({}));
            }
            setInitialLoadDone(true);
            if (hostelId) {
                dispatch(fetchReviews(hostelId));
            }
        };
        fetchData();
    }, [dispatch, hostelId, currentUser, hostels]);

    // Show loading state while fetching data for the first time
    if (!initialLoadDone || loading) {
        return <Loader fullScreen text="Loading Hostel Details..." />;
    }

    if (!hostel) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
                <div className="text-center space-y-4">
                    <div className="bg-muted p-4 rounded-full inline-block">
                        <Building2 className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Hostel Not Found</h1>
                    <Link href="/hostels">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hostels
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleFavoriteToggle = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (currentUser) {
            try {
                await dispatch(toggleFavorite({
                    userId: currentUser.id,
                    hostelId,
                    isAdding: !isFavorite
                })).unwrap();
                toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
            } catch (error) {
                console.error("Failed to toggle favorite:", error);
                toast.error("Failed to update favorites. Please try again.");
            }
        }
    };

    const handleDeleteReviewClick = (reviewId: string) => {
        setReviewToDelete(reviewId);
        setShowDeleteModal(true);
    };

    const confirmDeleteReview = async () => {
        if (!reviewToDelete) return;
        try {
            await dispatch(deleteReview(reviewToDelete)).unwrap();
            toast.success("Review deleted successfully");
            setShowDeleteModal(false);
            setReviewToDelete(null);
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !currentUser) {
            router.push("/login");
            return;
        }

        try {
            if (editingReviewId) {
                await dispatch(updateReview({
                    id: editingReviewId,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment,
                })).unwrap();
                toast.success("Review updated successfully");
                setEditingReviewId(null);
            } else {
                await dispatch(createReview({
                    hostelId,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment,
                })).unwrap();
                toast.success("Review posted successfully");
            }

            setReviewForm({ rating: 5, comment: "" });
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Failed to submit review");
            console.error("Failed to submit review:", error);
        }
    };

    const handleChatWithOwner = async () => {
        if (!isAuthenticated || !currentUser) {
            router.push("/login");
            return;
        }

        if (currentUser.id === hostel.ownerId) {
            toast.error("You cannot chat with yourself");
            return;
        }

        try {
            await dispatch(accessChat(hostel.ownerId)).unwrap();
            router.push(`/dashboard/chat?userId=${hostel.ownerId}`);
        } catch (error) {
            toast.error("Failed to access chat");
            console.error("Failed to access chat:", error);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: hostel?.name || "Check out this hostel!",
            text: `Check out ${hostel?.name} on Hostel Finder!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);

            if ((error as Error).name !== 'AbortError') {
                toast.error("Failed to share. Link copied to clipboard instead.");
                await navigator.clipboard.writeText(window.location.href);
            }
        }
    };

    console.log("hostelReviews =============", hostelReviews)
    console.log("hostelId =============", hostelId)

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Sticky Modern Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        {isAuthenticated && (
                            <Link href={
                                currentUser?.role === "owner" ? "/dashboard/owner" :
                                    currentUser?.role === "admin" ? "/dashboard/admin" :
                                        "/dashboard/student"
                            }>
                                <Button variant="ghost" size="sm" className="gap-1 border border-1" title="Dashboard">
                                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                                </Button>
                            </Link>
                        )}
                        <Button variant="ghost" className="border border-1" size="sm" title="Share" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                        {currentUser?.role !== "admin" && (
                            <Button
                                type="button"
                                variant={isFavorite ? "secondary" : "outline"}
                                size="sm"
                                onClick={handleFavoriteToggle}
                                className={cn("gap-2", isFavorite && "text-red-500 bg-red-50 hover:bg-red-100")}
                            >
                                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                                <span className="hidden sm:inline">{isFavorite ? "Saved" : "Save"}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 pb-32 lg:pb-8">
                <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">

                    {/* Left Column: Media & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
                                {hostel.images[selectedImage] ? (
                                    <img
                                        src={hostel.images[selectedImage]}
                                        alt={hostel.name}
                                        className="h-full w-full object-cover transition-all duration-300"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        <Building2 className="h-16 w-16 opacity-20" />
                                    </div>
                                )}
                            </div>
                            {hostel.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto p-1 scrollbar-hide">
                                    {hostel.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={cn(
                                                "relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border transition-all hover:opacity-100",
                                                selectedImage === idx ? "ring-2 ring-primary ring-offset-2 opacity-100" : "opacity-60 hover:opacity-80"
                                            )}
                                        >
                                            <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Main Info Card */}
                        <Card className="border-none shadow-none sm:border sm:shadow-sm">
                            <CardHeader className="px-0 sm:px-6">
                                <div className="flex flex-col gap-4">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Badge variant={hostel.isFor === "boys" ? "default" : "secondary"} className="rounded-full px-3">
                                                {hostel.isFor === "boys" ? "Boys Hostel" : "Girls Hostel"}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-full px-3 border-transparent",
                                                    hostel.availability === "available" ? "bg-green-100 text-green-700" :
                                                        hostel.availability === "limited" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                                )}
                                            >
                                                {hostel.availability === "available" ? "Available" :
                                                    hostel.availability === "limited" ? "Limited Spots" : "Fully Booked"}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-sm font-medium ml-auto">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span>{hostel.rating}</span>
                                                <span className="text-muted-foreground font-normal">({hostelReviews.length} reviews)</span>
                                            </div>
                                        </div>

                                        <CardTitle className="text-2xl lg:text-3xl font-bold tracking-tight">{hostel.name}</CardTitle>

                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                            <p>{hostel.location.address}, {hostel.location.area}, {hostel.location.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="px-0 sm:px-6 space-y-8">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        About this hostel
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {hostel.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Facilities</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.entries(hostel.facilities).map(([facility, available]) => (
                                            <div
                                                key={facility}
                                                className={cn(
                                                    "flex items-center gap-2 p-2 rounded-lg border text-sm transition-colors",
                                                    available ? "bg-secondary/30 border-secondary" : "opacity-50 border-transparent bg-muted/30"
                                                )}
                                            >
                                                {available ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                                )}
                                                <span className="capitalize font-medium">{facility}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <BedDouble className="h-5 w-5 text-primary" />
                                            Room Details
                                        </h3>
                                        <div className="space-y-3">
                                            {hostel.rooms.map((room, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-secondary/20">
                                                    <span className="font-medium">{room.type}</span>
                                                    <span className="font-bold text-primary">Rs. {room.rentPerBed || room.rentPerRoom}<span className="text-xs text-muted-foreground font-normal">/bed</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-primary" />
                                            Property Info
                                        </h3>
                                        <dl className="space-y-3 text-sm">
                                            <div className="flex justify-between py-1 border-b border-dashed">
                                                <dt className="text-muted-foreground">Total Floors</dt>
                                                <dd className="font-medium">{hostel.floors}</dd>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-dashed">
                                                <dt className="text-muted-foreground">Available Beds</dt>
                                                <dd className="font-medium">{hostel.availableBeds}</dd>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-dashed">
                                                <dt className="text-muted-foreground">Owner</dt>
                                                <dd className="font-medium">{hostel.ownerName}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Map */}
                        <Card className="border-none shadow-none sm:border sm:shadow-sm">
                            <CardHeader className="px-0 sm:px-6">
                                <CardTitle className="flex text-xl items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <MapViewer
                                    latitude={hostel.location.latitude}
                                    longitude={hostel.location.longitude}
                                    name={hostel.name}
                                />
                                <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">Address</p>
                                    <p>{hostel.location.address}, {hostel.location.area}, {hostel.location.city}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews Section */}
                        <Card className="border-none shadow-none sm:border sm:shadow-sm">
                            <CardHeader className="px-0 sm:px-6">
                                <CardTitle className="flex text-xl items-center gap-2">
                                    Reviews
                                    <Badge variant="secondary" className="rounded-full">{hostelReviews.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 sm:px-6 space-y-8">
                                {isAuthenticated ? (
                                    <form onSubmit={handleReviewSubmit} className="space-y-4 p-4 rounded-xl bg-muted/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium">{editingReviewId ? "Edit Your Review" : "Write a Review"}</h4>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "h-6 w-6",
                                                                star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <Textarea
                                            placeholder="Share your experience with this hostel..."
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            required
                                            className="bg-background resize-none"
                                            rows={3}
                                        />
                                        <div className="flex justify-end gap-2">
                                            {editingReviewId && (
                                                <Button type="button" variant="outline" onClick={() => {
                                                    setEditingReviewId(null);
                                                    setReviewForm({ rating: 5, comment: "" });
                                                }}>
                                                    Cancel
                                                </Button>
                                            )}
                                            <Button type="submit">{editingReviewId ? "Update Review" : "Post Review"}</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-center p-8 rounded-xl border border-dashed bg-muted/20">
                                        <p className="text-muted-foreground mb-4">Please login to share your experience</p>
                                        <Link href="/login">
                                            <Button variant="outline">Login to Review</Button>
                                        </Link>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {hostelReviews.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground">
                                            <div className="mb-2">💬</div>
                                            No reviews yet. Be the first to share your thoughts!
                                        </div>
                                    ) : (
                                        hostelReviews.map((review) => (
                                            <div key={review.id} className="group">
                                                <div className="flex gap-4">
                                                    <Avatar className="h-10 w-10 border">
                                                        <AvatarImage src={review.userImage} alt={review.userName} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                            {review.userName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-semibold text-sm">{review.userName}</h5>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-0.5 mb-1">
                                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                                            {review.comment}
                                                        </p>
                                                        {review.proof && (
                                                            <div className="mt-3">
                                                                <img src={review.proof} alt="Proof" className="rounded-md h-20 w-auto object-cover border" />
                                                            </div>
                                                        )}
                                                        {currentUser && (currentUser.id === review.userId || currentUser.role === 'admin') && (
                                                            <div className="flex gap-2 mt-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 text-xs"
                                                                    onClick={() => {
                                                                        setReviewForm({ rating: review.rating, comment: review.comment });
                                                                        setEditingReviewId(review.id);
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleDeleteReviewClick(review.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <Separator className="mt-6 group-last:hidden" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-2 border-primary/10 shadow-lg overflow-hidden">
                                <CardHeader className="bg-primary/5 pb-6">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Starting Price</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-primary">Rs. {hostel.rent.toLocaleString()}</span>
                                        <span className="text-sm text-muted-foreground font-medium">/month</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Booking Status</span>
                                            <Badge variant={hostel.availability === "available" ? "default" : "secondary"}>
                                                {hostel.availability}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Bed Availability</span>
                                            <span className="font-semibold flex items-center gap-1">
                                                <User className="h-4 w-4" /> {hostel.availableBeds} left
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {currentUser?.role !== "admin" && (
                                            <>
                                                <Button className="w-full gap-2 justify-center items-center text-md shadow-md hover:shadow-lg transition-all" onClick={handleChatWithOwner}>
                                                    <MessageSquare className="h-4 w-4" />
                                                    Chat with Owner
                                                </Button>
                                                {/* {currentUser?.role !== "owner" && (
                                                    <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5" onClick={handleChatWithOwner}>
                                                        <MessageSquare className="h-4 w-4" />
                                                        Chat with Owner
                                                    </Button>
                                                )} */}
                                            </>
                                        )}
                                    </div>

                                    <div className="text-center text-xs text-muted-foreground">
                                        No booking fees charged
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                            <User className="h-5 w-5 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Hostel Owner</p>
                                            <p className="text-sm text-muted-foreground">{hostel.ownerName}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        {hostel.contactNumber.map((number, idx) => (
                                            <a
                                                key={idx}
                                                href={`tel:${number}`}
                                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                                            >
                                                <Phone className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                                <span className="font-medium text-sm">{number}</span>
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-50 lg:hidden safe-area-bottom">
                <div className="flex gap-3 items-center">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Rent per month</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-primary">Rs. {hostel.rent.toLocaleString()}</span>
                        </div>
                    </div>
                    {currentUser?.role !== "admin" && (
                        <Button className="flex-1 gap-2 shadow-lg" size="lg" onClick={handleChatWithOwner}>
                            <MessageSquare className="h-4 w-4" />
                            Chat
                        </Button>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0 shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-5 w-5" />
                                Delete Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete this review?
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                This action is permanent and cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setReviewToDelete(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmDeleteReview}
                                    variant="destructive"
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}