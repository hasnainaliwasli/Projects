"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Loader2, ShieldAlert, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createReport } from "@/lib/slices/reportSlice";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ReportPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading } = useAppSelector((state) => state.reports);
    const { currentUser } = useAppSelector((state) => state.auth);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cnic: "",
        evidence: "",
        hostelName: "",
        type: "fraud",
        description: "",
    });

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.fullName || "",
                email: currentUser.email || ""
            }));
        }
    }, [currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("You must be logged in to submit a report");
            router.push('/login');
            return;
        }

        try {
            await dispatch(createReport(formData)).unwrap();
            setIsSubmitted(true);
            toast.success("Report submitted successfully!");
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

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-background">
            {/* Hero Section */}
            <section className="relative bg-[#020817] text-white pt-32 pb-40 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-6 backdrop-blur-sm">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-sm font-medium">Trust & Safety</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                        Report an Issue
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Help us maintain a safe community. If you encounter fraud, scams, or suspicious activity, please report it immediately.
                    </p>
                </div>
            </section>

            {/* Main Form Section */}
            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-20 max-w-3xl">
                <Card className="shadow-2xl border-0 ring-1 ring-border/50 bg-background/95 backdrop-blur-sm">
                    {!isSubmitted ? (
                        <>
                            <CardHeader className="border-b bg-muted/20 px-8 py-6">
                                <CardTitle className="text-2xl font-bold">Submit a Report</CardTitle>
                                <CardDescription className="text-base">
                                    Your report will be reviewed confidentially by our trust & safety team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Personal Info */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Your Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-muted/30"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Your Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                readOnly
                                                className="bg-muted text-muted-foreground cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* ID & Type */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="cnic">CNIC Number <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="cnic"
                                                placeholder="e.g. 35202-1234567-1"
                                                value={formData.cnic}
                                                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                                className="bg-muted/30"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Issue Type <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.type}
                                                onValueChange={(val) => setFormData({ ...formData, type: val })}
                                            >
                                                <SelectTrigger className="bg-muted/30 text-start">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fraud">Fraud / Scam</SelectItem>
                                                    <SelectItem value="fake">Fake Listing</SelectItem>
                                                    <SelectItem value="safety">Safety Concern</SelectItem>
                                                    <SelectItem value="harassment">Harassment</SelectItem>
                                                    <SelectItem value="spam">Spam / Misleading</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Hostel Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="hostelName">Associated Hostel (Optional)</Label>
                                        <Input
                                            id="hostelName"
                                            placeholder="Enter hostel name or ID if applicable"
                                            value={formData.hostelName}
                                            onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                                            className="bg-muted/30"
                                        />
                                    </div>

                                    {/* Evidence */}
                                    <div className="space-y-2">
                                        <Label htmlFor="evidence">Evidence Link (Optional)</Label>
                                        <div className="relative">
                                            <UploadCloud className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="evidence"
                                                type="url"
                                                placeholder="https://drive.google.com/..."
                                                value={formData.evidence}
                                                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                                                className="pl-9 bg-muted/30"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Provide a link to images, screenshots, or documents supporting your claim.
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Detailed Description <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="description"
                                            rows={6}
                                            required
                                            placeholder="Please describe the incident in detail..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="resize-none bg-muted/30 focus:ring-red-500/20"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="flex gap-4 pt-4 border-t">
                                        <Link href="/" className="flex-1">
                                            <Button type="button" variant="outline" className="w-full h-11">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                                    Submit Report
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="text-center py-24 px-6 animate-in fade-in zoom-in-95">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Report Submitted</h2>
                            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                                Thank you for helping keep our community safe. Your report ID has been generated and our team will review it within 24 hours.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link href="/">
                                    <Button variant="outline" size="lg">Return Home</Button>
                                </Link>
                                <Button size="lg" onClick={() => setIsSubmitted(false)}>Submit Another</Button>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
