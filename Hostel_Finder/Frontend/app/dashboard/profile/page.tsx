"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { modifyUser, removeUser } from "@/lib/slices/userSlice";
import { logout } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ProfileImageUploader from "@/components/ProfileImageUploader";

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName || "",
        email: currentUser?.email || "",
        phoneNumbers: currentUser?.phoneNumbers || [""],
        homeAddress: currentUser?.homeAddress || "",
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!currentUser) {
        return null;
    }

    const handleAddPhone = () => {
        setFormData({
            ...formData,
            phoneNumbers: [...formData.phoneNumbers, ""],
        });
    };

    const handleRemovePhone = (index: number) => {
        setFormData({
            ...formData,
            phoneNumbers: formData.phoneNumbers.filter((_, i) => i !== index),
        });
    };

    const handlePhoneChange = (index: number, value: string) => {
        const newPhones = [...formData.phoneNumbers];
        newPhones[index] = value;
        setFormData({ ...formData, phoneNumbers: newPhones });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Send only the fields that should be updated (profileImage is handled separately)
        const updatedUser = {
            id: currentUser.id,
            fullName: formData.fullName,
            email: formData.email,
            phoneNumbers: formData.phoneNumbers.filter(p => p.trim() !== ""),
            homeAddress: formData.homeAddress,
        };

        try {
            await dispatch(modifyUser(updatedUser)).unwrap();
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(typeof error === 'string' ? error : "Failed to update profile");
        }
    };

    const handleDeleteAccount = async (deleteData: boolean) => {
        if (currentUser) {
            try {
                await dispatch(removeUser({ userId: currentUser.id, deleteData })).unwrap();
                dispatch(logout());
                router.push("/");
                toast.success("Account deleted successfully");
            } catch (error: any) {
                toast.error(typeof error === 'string' ? error : "Failed to delete account");
            }
        }
    };

    return (
        <DashboardLayout role={currentUser.role}>
            <div className="max-w-3xl space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">Profile Settings</h1>
                    <p className="text-muted-foreground">Manage your account information</p>
                </div>

                {/* Profile Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl font-bold mb-1">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Profile Image */}
                            <div className="space-y-2">
                                <Label>Profile Image</Label>
                                <ProfileImageUploader currentImage={currentUser?.profileImage} />
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Phone Numbers */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Phone Numbers</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddPhone}>
                                        + Add Phone
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.phoneNumbers.map((phone, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                type="tel"
                                                placeholder="+92xxxxxxxxxx"
                                                value={phone}
                                                onChange={(e) => handlePhoneChange(index, e.target.value)}
                                            />
                                            {formData.phoneNumbers.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleRemovePhone(index)}
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Home Address */}
                            <div className="space-y-2">
                                <Label htmlFor="homeAddress">Home Address</Label>
                                <Input
                                    id="homeAddress"
                                    value={formData.homeAddress}
                                    onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                                    placeholder="Enter your home address"
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl font-bold mb-2">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Role</span>
                            <span className="font-semibold capitalize">{currentUser.role}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Member Since</span>
                            <span className="font-medium">
                                {new Date(currentUser.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!showDeleteConfirm ? (
                            <div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        ) : (
                            <div className="p-4 bg-destructive/10 rounded-md border border-destructive">
                                <p className="text-sm font-medium mb-4">
                                    Are you absolutely sure? This will archive your account.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteAccount(true)}
                                            className="w-full justify-start"
                                        >
                                            Yes, Delete Account & All My Data (Hostels/Reviews)
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleDeleteAccount(false)}
                                            className="w-full justify-start hover:bg-destructive/20 text-destructive"
                                        >
                                            Yes, Delete Account Only (Keep Data)
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="w-full"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
