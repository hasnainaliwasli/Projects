import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { MapPin, Users, Star, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">

            <main className="container  mx-auto px-4 py-10 max-w-5xl">
                {/* Hero Section */}
                <section className=" shadow-sm backdrop-blur  rounded-lg p-6 text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                        About Hostel Finder
                    </h1>

                    <p className="text-muted-foreground max-w-2xl mx-auto my-5 text-sm md:text-base">
                        A dedicated platform to help students and professionals discover
                        safe, affordable, and verified hostel accommodations across cities.
                    </p>
                </section>

                {/* Highlight Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <Card className="border-border/60 bg-card/80 ">
                        <CardContent className="py-4 flex flex-col items-center gap-1">
                            <Users className="h-6 w-6 text-primary mb-1" />
                            <p className="text-sm font-semibold">Student–First</p>
                            <p className="text-xs text-muted-foreground text-center">
                                Designed around real student needs and challenges.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/80 backdrop-blur">
                        <CardContent className="py-4 flex flex-col items-center gap-1">
                            <MapPin className="h-6 w-6 text-primary mb-1" />
                            <p className="text-sm font-semibold">City-Wide Coverage</p>
                            <p className="text-xs text-muted-foreground text-center">
                                Discover hostels across multiple areas and cities.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/80 backdrop-blur">
                        <CardContent className="py-4 flex flex-col items-center gap-1">
                            <Star className="h-6 w-6 text-primary mb-1" />
                            <p className="text-sm font-semibold">Verified Reviews</p>
                            <p className="text-xs text-muted-foreground text-center">
                                Ratings and feedback from real, verified tenants.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Main About Card */}
                <Card className="border-border/70 shadow-sm bg-card/90 backdrop-blur">
                    <CardContent className="p-6 md:p-8 space-y-8">
                        {/* Intro */}
                        <section className="space-y-3">
                            <CardTitle className="text-xl md:text-2xl font-semibold">
                                Who We Are
                            </CardTitle>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                Hostel Finder is a comprehensive platform built to connect
                                students and professionals with quality hostel accommodations.
                                We understand how stressful it can be to find an affordable,
                                safe, and comfortable place to live—especially when you are new
                                to a city and don’t know where to start.
                            </p>
                        </section>

                        {/* Mission + What we offer in two columns on desktop */}
                        <section className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Our Mission
                                </h2>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Our mission is to simplify the hostel search process by
                                    offering a transparent and user-friendly platform. Students
                                    can discover, compare, and review hostels with confidence,
                                    while hostel owners can reach their ideal audience in a
                                    professional and structured way.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-lg md:text-xl font-semibold">What We Offer</h2>
                                <ul className="text-sm md:text-base text-muted-foreground space-y-2 list-disc pl-5">
                                    <li>Detailed hostel profiles with real photos and amenities</li>
                                    <li>Advanced filters for budget, location, and facilities</li>
                                    <li>Genuine reviews and ratings from verified tenants</li>
                                    <li>Easy-to-use interface for both students and owners</li>
                                    <li>Location-based search across multiple areas and cities</li>
                                    <li>Price comparison to help you stay within budget</li>
                                </ul>
                            </div>
                        </section>

                        {/* Students & Owners */}
                        <section className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-lg md:text-xl font-semibold">For Students</h2>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Find a hostel that matches your preferences, budget, and
                                    lifestyle. Save your favorite listings, explore verified
                                    reviews from other students, and make informed decisions
                                    before you move in—no more guessing or random recommendations.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-lg md:text-xl font-semibold">For Hostel Owners</h2>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    List your hostel, showcase your rooms with high-quality photos,
                                    and share accurate details about facilities and pricing.
                                    Manage your availability, respond to reviews, and build trust
                                    with a community that is actively looking for accommodation.
                                </p>
                            </div>
                        </section>
                    </CardContent>
                </Card>

                {/* CTA */}
                <section className="text-center mt-10">
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                        Ready to explore hostels or list your own?
                    </p>
                    <Link href="/register">
                        <Button size="lg" className="rounded-full px-8">
                            Get Started Today
                        </Button>
                    </Link>
                </section>
            </main>
        </div>
    );
}
