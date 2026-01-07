"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createReport } from "@/lib/slices/reportSlice";

export default function ReportPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading } = useAppSelector((state) => state.reports);
    const { currentUser } = useAppSelector((state) => state.auth);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cnic: "", // New Field
        evidence: "", // New Field
        hostelName: "",
        type: "fraud",
        description: "",
    });

    useEffect(() => {
        if (!currentUser) {
            router.push('/login');
        } else {
            setFormData(prev => ({
                ...prev,
                name: currentUser.fullName || "",
                email: currentUser.email || ""
            }));
        }
    }, [currentUser, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createReport(formData)).unwrap();
            setIsSubmitted(true);
            toast.success("Report submitted successfully!");
            // Reset form but keep user info
            setFormData({
                name: currentUser?.fullName || "",
                email: currentUser?.email || "",
                cnic: "",
                evidence: "",
                hostelName: "",
                type: "fraud",
                description: "",
            });
        } catch (error: any) {
            toast.error(error || "Failed to submit report");
        }
    };

    if (!currentUser) return null; // Avoid flashing content before redirect

    return (
        <div className="min-h-screen bg-background">

            <div className="container mx-auto px-4 py-16 max-w-3xl">
                {!isSubmitted ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
                            <p className="text-muted-foreground text-md">
                                Help us maintain a safe and trustworthy platform. Report fraud, scams, or any suspicious activity.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Submit a Report</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Your Name *</Label>
                                            <Input
                                                id="name"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Your Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                readOnly
                                                className="bg-muted text-muted-foreground"
                                                value={formData.email}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cnic">CNIC Number *</Label>
                                        <Input
                                            id="cnic"
                                            placeholder="e.g., 12345-1234567-1"
                                            required
                                            value={formData.cnic}
                                            onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="evidence">Evidence URL (Optional)</Label>
                                        <Input
                                            id="evidence"
                                            type="url"
                                            placeholder="Link to image or video proof"
                                            value={formData.evidence}
                                            onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            You can provide a link to an image or video (e.g., Google Drive, Imgur).
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hostelName">Hostel Name (if applicable)</Label>
                                        <Input
                                            id="hostelName"
                                            placeholder="Enter hostel name"
                                            value={formData.hostelName}
                                            onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Report Type *</Label>
                                        <select
                                            id="type"
                                            required
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="fraud">Fraud / Scam</option>
                                            <option value="fake">Fake Listing</option>
                                            <option value="safety">Safety Concern</option>
                                            <option value="harassment">Harassment</option>
                                            <option value="spam">Spam</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            rows={6}
                                            required
                                            placeholder="Please provide detailed information about the issue..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Include as many details as possible to help us investigate.
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Note:</strong> All reports are confidential and will be reviewed by our admin team within 24-48 hours.
                                            We take all reports seriously and will take appropriate action.
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="submit" className="flex-1" disabled={loading}>
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Submit Report
                                        </Button>
                                        <Link href="/" className="flex-1">
                                            <Button type="button" variant="outline" className="w-full">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                                <CheckCircle2 className="h-8 w-8 text-secondary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Report Submitted Successfully!</h2>
                            <p className="text-muted-foreground mb-6">
                                Thank you for helping us maintain a safe platform. Your report has been sent to our admin team
                                and will be reviewed shortly. We&apos;ll contact you at <strong>{formData.email}</strong> if we need
                                additional information.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link href="/">
                                    <Button>Back to Home</Button>
                                </Link>
                                <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                                    Submit Another Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
