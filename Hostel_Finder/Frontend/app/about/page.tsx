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
            <section className="relative bg-[#020817] text-white pt-20 pb-16 md:pt-32 md:pb-28 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute top-20 right-0 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px]" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge variant="secondary" className="mb-4 md:mb-6 bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-sm px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium">
                        Innovating Student Housing
                    </Badge>
                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent text-balance">
                        Redefining How You Find<br className="hidden md:block" /> Your Next Home
                    </h1>
                    <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed text-balance">
                        Hostel Finder connects students with verified, safe, and affordable accommodations, making the transition to campus life seamless and stress-free.
                    </p>
                </div>
            </section>

            {/* Stats / Features Strip */}
            <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                    {[
                        { icon: Users, title: "Student-First", desc: "Built specifically for student needs" },
                        { icon: Shield, title: "Verified Listings", desc: "100% authentic property details" },
                        { icon: MapPin, title: "City-Wide", desc: "Coverage across major education hubs" }
                    ].map((item, i) => (
                        <Card key={i} className="bg-background/95 backdrop-blur-sm border shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                            <CardContent className="p-4 md:p-6 flex items-start gap-4">
                                <div className="p-2 md:p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                                    <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                        <div className="space-y-6 md:space-y-8">
                            <div className="space-y-3 md:space-y-4">
                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Our Mission</h2>
                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                    Finding a reliable hostel shouldn't be a struggle. We aim to eliminate the chaos of unverified brokers, confusing pricing, and safety concerns.
                                </p>
                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                    By creating a transparent digital marketplace, we empower students to make informed decisions and help hostel owners maximize their occupancy with verified tenants.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                {[
                                    "Direct Booking",
                                    "Zero Brokerage",
                                    "Real Reviews",
                                    "Secure Platform"
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 bg-secondary/30 p-2.5 md:p-3 rounded-lg">
                                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                                        <span className="font-medium text-sm md:text-base">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden bg-muted border shadow-sm mt-4 md:mt-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center mt-0 pt-0 justify-center">
                                <Home className="h-24 w-24 md:h-32 md:w-32 text-primary/20" />
                            </div>
                            {/* Placeholder for an actual image if user adds one later */}
                            <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 p-3 md:p-6 bg-background/90 backdrop-blur-md rounded-xl md:rounded-2xl border shadow-lg">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="h-9 w-9 md:h-12 md:w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Star className="h-4 w-4 md:h-6 md:w-6 text-primary fill-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm md:text-lg leading-tight">Trusted by 500+ Students</p>
                                        <p className="text-[10px] md:text-sm text-muted-foreground">Rated 4.8/5 for ease of use</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            {/* How It Works */}
            <section className="py-12 md:py-24 bg-muted/30 border-y">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">Built for Everyone</h2>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">Whether you're looking for a place to stay or listing your property, we've got you covered.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                            <CardContent className="p-6 md:p-10 space-y-4 md:space-y-6">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <Search className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-xl md:text-2xl font-bold">For Students</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm md:text-lg">
                                        Browse high-quality photos, filter by amenities like WiFi and AC, and contact verified owners directly. No more hidden surprises or last-minute cancellations.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                            <CardContent className="p-6 md:p-10 space-y-4 md:space-y-6">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                    <Home className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-xl md:text-2xl font-bold">For Owners</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm md:text-lg">
                                        Showcase your property to thousands of students. Manage inquiries, maintain your reputation with reviews, and fill your rooms faster than ever.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 p-6 md:p-16 rounded-2xl md:rounded-[2rem] bg-[#020817] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />

                        <div className="relative z-10 space-y-6 md:space-y-8">
                            <div className="space-y-3 md:space-y-4">
                                <h2 className="text-2xl md:text-5xl font-bold tracking-tight">Ready to find your place?</h2>
                                <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed text-balance">
                                    Join our community today and make hostel hunting effortless.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="rounded-full px-6 md:px-8 text-sm md:text-base h-10 md:h-12 w-full sm:w-auto shadow-lg shadow-primary/20">
                                        Get Started Now
                                    </Button>
                                </Link>
                                <Link href="/hostels">
                                    <Button size="lg" variant="outline" className="rounded-full px-6 md:px-8 text-sm md:text-base h-10 md:h-12 w-full sm:w-auto bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white backdrop-blur-sm">
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
