"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background">
            {/* Hero Section */}
            <section className="relative bg-[#020817] text-white pt-24 pb-28 md:pt-32 md:pb-40 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute top-20 left-10 md:left-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px]" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent text-balance">
                        Get In Touch
                    </h1>
                    <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed text-balance">
                        Have questions about finding the perfect hostel or listing your property?
                        Our team is here to help you every step of the way.
                    </p>
                </div>
            </section>

            {/* Main Content (Overlapping Hero) */}
            <div className="container mx-auto px-4 -mt-12 md:-mt-20 relative z-20 pb-16 md:pb-20">
                <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-2xl border-0 ring-1 ring-border/50 bg-background/95 backdrop-blur-sm overflow-hidden">
                            {isSubmitted ? (
                                <CardContent className="text-center py-16 md:py-20 px-6 animate-in fade-in zoom-in-95">
                                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Message Sent!</h2>
                                    <p className="text-muted-foreground mb-8 text-base md:text-lg max-w-md mx-auto">
                                        Thank you for reaching out. We've received your message and will get back to you shortly.
                                    </p>
                                    <Link href="/">
                                        <Button size="lg" className="rounded-full px-8">
                                            Return Home
                                        </Button>
                                    </Link>
                                </CardContent>
                            ) : (
                                <div className="p-0 md:p-2">
                                    <CardHeader className="pb-2 px-4 pt-6 md:px-6 md:pt-6">
                                        <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                            Send us a message
                                        </CardTitle>
                                        <CardDescription className="text-sm md:text-base">
                                            Fill out the form below and we'll respond within 24 hours.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6 px-4 pb-6 md:px-6 md:pb-6">
                                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="h-10 md:h-11 bg-muted/30"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="h-10 md:h-11 bg-muted/30"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder="How can we help?"
                                                className="h-10 md:h-11 bg-muted/30"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                rows={6}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="resize-none bg-muted/30 min-h-[120px] md:min-h-[150px]"
                                                placeholder="Tell us more about your inquiry..."
                                                required
                                            />
                                        </div>

                                        <Button
                                            onClick={handleSubmit}
                                            className="w-full h-10 md:h-12 text-sm md:text-base rounded-lg"
                                            disabled={isLoading}
                                            size="lg"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                    Sending Message...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Column: Contact Info */}
                    <div className="space-y-4 md:space-y-6 lg:pt-10">
                        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm hover:translate-x-1 transition-transform duration-300">
                            <CardContent className="p-4 md:p-6 flex items-start gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-bold mb-1">Email Us</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                                        For general inquiries and support
                                    </p>
                                    <a href="mailto:support@hostelfinder.com" className="text-primary hover:underline font-medium block text-sm md:text-base">
                                        support@hostelfinder.com
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm hover:translate-x-1 transition-transform duration-300 delay-100">
                            <CardContent className="p-4 md:p-6 flex items-start gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-bold mb-1">Call Us</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                                        Mon-Fri from 9am to 6pm
                                    </p>
                                    <a href="tel:+923001234567" className="text-primary hover:underline font-medium block text-sm md:text-base">
                                        +92 300 1234567
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm hover:translate-x-1 transition-transform duration-300 delay-200">
                            <CardContent className="p-4 md:p-6 flex items-start gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-bold mb-1">Visit Us</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                                        Come say hello at our HQ
                                    </p>
                                    <p className="text-sm md:text-base font-medium">
                                        123 Hostel Street, Tech Hub<br />
                                        Lahore, Pakistan
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}