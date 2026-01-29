"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Star, Shield, ArrowRight, Home, Search, Heart, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative bg-[#020817] text-white pt-32 pb-24 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge variant="secondary" className="mb-6 bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-sm px-4 py-1.5">
                        Innovating Student Housing
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                        Redefining How You Find<br />Your Next Home
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Hostel Finder connects students with verified, safe, and affordable accommodations, making the transition to campus life seamless and stress-free.
                    </p>
                </div>
            </section>

            {/* Stats / Features Strip */}
            <div className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Users, title: "Student-First", desc: "Built specifically for student needs" },
                        { icon: Shield, title: "Verified Listings", desc: "100% authentic property details" },
                        { icon: MapPin, title: "City-Wide", desc: "Coverage across major education hubs" }
                    ].map((item, i) => (
                        <Card key={i} className="bg-background/95 backdrop-blur-sm border shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tighter">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Finding a reliable hostel shouldn't be a struggle. We aim to eliminate the chaos of unverified brokers, confusing pricing, and safety concerns.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                By creating a transparent digital marketplace, we empower students to make informed decisions and help hostel owners maximize their occupancy with verified tenants.
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {[
                                    "Direct Booking",
                                    "Zero Brokerage",
                                    "Real Reviews",
                                    "Secure Platform"
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span className="font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-muted border">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <Home className="h-32 w-32 text-primary/40" />
                            </div>
                            {/* Placeholder for an actual image if user adds one later */}
                            <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/80 backdrop-blur-md rounded-xl border shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Star className="h-6 w-6 text-primary fill-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Trusted by 500+ Students</p>
                                        <p className="text-sm text-muted-foreground">Rated 4.8/5 for ease of use</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-muted/30 border-y">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl font-bold mb-12">Built for Everyone</h2>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Search className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">For Students</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Browse high-quality photos, filter by amenities like WiFi and AC, and contact verified owners directly. No more hidden surprises or last-minute cancellations.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <Home className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">For Owners</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Showcase your property to thousands of students. Manage inquiries, maintain your reputation with reviews, and fill your rooms faster than ever.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-[#020817] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">Ready to find your place?</h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Join our community today and make hostel hunting effortless.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/register">
                                    <Button size="lg" className="rounded-full px-8 text-base h-12">
                                        Get Started Now
                                    </Button>
                                </Link>
                                <Link href="/hostels">
                                    <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12 bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white">
                                        Browse Hostels
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
