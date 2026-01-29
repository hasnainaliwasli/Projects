"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateReview, deleteReview } from "@/lib/slices/reviewSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function StudentReviewsPage() {
    const dispatch = useAppDispatch();
    const { reviews } = useAppSelector((state) => state.review);
    const { currentUser } = useAppSelector((state) => state.auth);
    const { hostels } = useAppSelector((state) => state.hostel);

    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        rating: 5,
        comment: "",
    });
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const myReviews = reviews.filter((r) => r.userId === currentUser?.id);

    const handleEditClick = (review: any) => {
        setEditingReviewId(review.id);
        setEditForm({
            rating: review.rating,
            comment: review.comment,
        });
    };

    const handleSaveEdit = async (reviewId: string) => {
        const review = reviews.find((r) => r.id === reviewId);
        if (!review) return;

        const updatedReview = {
            id: review.id,
            rating: editForm.rating,
            comment: editForm.comment,
        };

        try {
            await dispatch(updateReview(updatedReview)).unwrap();
            toast.success("Review updated successfully!");
            setEditingReviewId(null);
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to update review");
        }
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
    };

    const handleDeleteClick = (reviewId: string) => {
        setReviewToDelete(reviewId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!reviewToDelete) return;

        try {
            await dispatch(deleteReview(reviewToDelete)).unwrap();
            toast.success("Review deleted successfully!");
            setShowDeleteModal(false);
            setReviewToDelete(null);
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to delete review");
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">My Reviews</h1>
                    <p className="text-muted-foreground">
                        You have written {myReviews.length} review{myReviews.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {myReviews.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-md text-muted-foreground">You haven&apos;t written any reviews yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {myReviews.map((review) => {
                            const hostel = hostels.find((h) => h.id === review.hostelId);
                            const isEditing = editingReviewId === review.id;

                            return (
                                <Card key={review.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle>{hostel?.name || "Unknown Hostel"}</CardTitle>
                                                {!isEditing && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex items-center">
                                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                                <span key={i} className="text-yellow-500">⭐</span>
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {!isEditing && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditClick(review)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(review.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Rating</Label>
                                                    <div className="flex items-center gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setEditForm({ ...editForm, rating: star })}
                                                                className="text-2xl"
                                                            >
                                                                {star <= editForm.rating ? "⭐" : "☆"}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Comment</Label>
                                                    <Textarea
                                                        value={editForm.comment}
                                                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                                        rows={4}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => handleSaveEdit(review.id)}>
                                                        Save Changes
                                                    </Button>
                                                    <Button variant="outline" onClick={handleCancelEdit}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm">{review.comment}</p>
                                                {review.proof && (
                                                    <img src={review.proof} alt="Review proof" className="mt-4 rounded-md max-w-sm" />
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
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
                                        onClick={confirmDelete}
                                        variant="destructive"
                                    >
                                        Delete Review
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
