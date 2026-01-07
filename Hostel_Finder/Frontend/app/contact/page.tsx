"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from "lucide-react";

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
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-foreground">
                        Get In Touch
                    </h1>
                    <p className="text-md text-muted-foreground max-w-2xl mx-auto">
                        Have questions about finding the perfect hostel? We're here to help you every step of the way.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {isSubmitted ? (
                            <Card className="shadow-lg border-border">
                                <CardContent className="text-center py-16 px-6">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-foreground">
                                        Message Sent Successfully!
                                    </h2>
                                    <p className="text-muted-foreground mb-8">
                                        Thank you for reaching out. Our team will get back to you within 24 hours.
                                    </p>
                                    <Link href="/">
                                        <Button className="px-8">
                                            Back to Home
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-lg border-border">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl font-bold">
                                        Send us a message
                                    </CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll respond as soon as possible
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
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
                                                placeholder="How can we help you?"
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
                                                className="resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                                required
                                            />
                                        </div>

                                        <Button
                                            onClick={handleSubmit}
                                            className="w-full"
                                            disabled={isLoading}
                                            size="lg"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-10 h-10 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Email Us</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Send us an email anytime
                                </p>
                                <a href="mailto:support@hostelfinder.com" className="text-primary hover:underline font-medium">
                                    support@hostelfinder.com
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-10 h-10 mb-4 rounded-lg bg-secondary/10 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-secondary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Call Us</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Mon-Fri from 9am to 6pm
                                </p>
                                <a href="tel:+923001234567" className="text-primary hover:underline font-medium">
                                    +92 300 1234567
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-10 h-10 mb-4 rounded-lg bg-accent/10 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Visit Us</h3>
                                <p className="text-sm text-muted-foreground">
                                    123 Hostel Street<br />
                                    Lahore, Punjab<br />
                                    Pakistan
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}