"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { deleteReview, updateReview } from "@/lib/slices/reviewSlice"; // Updated import
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // Added
import { toast } from "sonner";
import { useState } from "react"; // Added
import { Star } from "lucide-react";

export default function AdminReviewsPage() {
    const dispatch = useAppDispatch();
    const { reviews } = useAppSelector((state) => state.review);
    const { hostels } = useAppSelector((state) => state.hostel);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ rating: 0, comment: "" });

    const handleDeleteReview = async (reviewId: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            try {
                await dispatch(deleteReview(reviewId)).unwrap();
                toast.success("Review deleted successfully");
            } catch (error: any) {
                toast.error(typeof error === 'string' ? error : "Failed to delete review");
            }
        }
    };

    const startEdit = (review: any) => {
        setEditingId(review.id);
        setEditForm({ rating: review.rating, comment: review.comment });
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        try {
            await dispatch(updateReview({
                id: editingId,
                rating: editForm.rating,
                comment: editForm.comment
            })).unwrap();
            toast.success("Review updated");
            setEditingId(null);
        } catch (error: any) {
            toast.error("Failed to update review");
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">Manage Reviews</h1>
                    <p className="text-muted-foreground">
                        {reviews.length} total review{reviews.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {reviews.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-lg text-muted-foreground">No reviews found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => {
                            const hostel = hostels.find((h) => h.id === review.hostelId);
                            const isEditing = editingId === review.id;

                            return (
                                <Card key={review.id} className={`transition-all ${isEditing ? 'ring-2 ring-primary border-primary shadow-lg' : ''}`}>
                                    {isEditing ? (
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Editing Review</h3>
                                                <span className="text-sm text-muted-foreground">{hostel?.name}</span>
                                            </div>

                                            <div className="bg-muted/30 p-4 rounded-lg space-y-4 border">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Rating</label>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setEditForm({ ...editForm, rating: star })}
                                                                className={`p-1 rounded-full transition-colors hover:bg-muted ${editForm.rating >= star ? "text-yellow-500" : "text-muted-foreground/40"}`}
                                                            >
                                                                <Star className={`h-6 w-6 ${editForm.rating >= star ? "fill-current" : ""}`} />
                                                            </button>
                                                        ))}
                                                        <span className="ml-2 text-sm text-muted-foreground font-medium w-8">{editForm.rating}/5</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Comment</label>
                                                    <Textarea
                                                        value={editForm.comment}
                                                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                                        className="min-h-[120px] bg-background resize-none focus-visible:ring-offset-0"
                                                        placeholder="Write a review comment..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-2">
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                                <Button size="sm" onClick={handleUpdate}>Save Changes</Button>
                                            </div>
                                        </CardContent>
                                    ) : (
                                        <>
                                            <CardHeader>
                                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                                    <div className="flex-1 w-full">
                                                        <CardTitle className="text-lg mb-1">
                                                            {hostel?.name || "Unknown Hostel"}
                                                        </CardTitle>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                                    {review.userName.charAt(0)}
                                                                </div>
                                                                <span>{review.userName}</span>
                                                            </div>
                                                            <span className="hidden sm:inline">•</span>
                                                            <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-100 text-xs font-medium dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/40">
                                                                <span className="mr-1">{review.rating}</span>
                                                                <Star className="h-3 w-3 fill-current" />
                                                            </div>
                                                            <span className="hidden sm:inline">•</span>
                                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto sm:mt-0">
                                                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8" onClick={() => startEdit(review)}>Edit</Button>
                                                        <Button variant="destructive" size="sm" className="flex-1 sm:flex-none h-8 bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent shadow-none" onClick={() => handleDeleteReview(review.id)}>Delete</Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm leading-relaxed text-foreground/90">{review.comment}</p>
                                                {review.proof && (
                                                    <div className="mt-4">
                                                        <img
                                                            src={review.proof}
                                                            alt="Review proof"
                                                            className="rounded-lg border shadow-sm max-w-xs object-cover max-h-48"
                                                        />
                                                    </div>
                                                )}
                                            </CardContent>
                                        </>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
