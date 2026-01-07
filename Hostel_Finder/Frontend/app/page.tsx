"use client";

import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import {
  Search,
  Shield,
  Star,
  Users,
  Building2,
  CheckCircle2,
  TrendingUp,
  Heart,
  MessageSquare,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Advanced filters to find exactly what you need - location, price, amenities, and more.",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All hostels are verified with real photos and authentic information you can trust.",
      color: "text-green-500"
    },
    {
      icon: Star,
      title: "Genuine Reviews",
      description: "Read honest reviews from real students to make informed decisions.",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "Large Community",
      description: "Join thousands of students and hostel owners on our trusted platform.",
      color: "text-purple-500"
    }
  ];

  const stats = [
    { label: "Active Hostels", value: "500+", icon: Building2 },
    { label: "Happy Students", value: "10K+", icon: Users },
    { label: "Cities Covered", value: "50+", icon: CheckCircle2 },
    { label: "Success Rate", value: "95%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">


      {/* Hero Section with Background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-14 md:py-16">
        {/* Soft Warm Top-Left Blob */}
        <div className="absolute -top-28 -left-28 w-[520px] h-[520px] rounded-full bg-amber-100/85 dark:bg-amber-900/20 blur-[120px] opacity-95 transform-gpu -rotate-12 pointer-events-none will-change-transform"></div>

        {/* Pale Teal Top-Right Blob */}
        <div className="absolute top-10 right-8 w-[420px] h-[420px] rounded-full bg-teal-50/85 dark:bg-teal-900/20 blur-[100px] opacity-90 mix-blend-multiply dark:mix-blend-normal pointer-events-none will-change-transform"></div>

        {/* Center Frosted Highlight (glass shine) */}
        <div className="absolute inset-0 mx-auto w-11/12 max-w-5xl h-[420px] bg-gradient-to-tr from-white/70 via-white/40 to-transparent dark:from-white/5 dark:via-white/5 dark:to-transparent opacity-70 blur-[18px] rounded-3xl shadow-2xl pointer-events-none"></div>

        {/* Subtle Rose Accent below center */}
        <div className="absolute left-1/2 -translate-x-1/2 top-28 w-[760px] h-[240px] bg-gradient-to-t from-rose-50/70 via-transparent to-transparent dark:from-rose-900/10 rounded-full blur-[140px] opacity-65 pointer-events-none"></div>

        {/* Decorative faint rounded card shape with thin border */}
        {/* <div className="absolute bottom-12 right-12 w-[340px] h-[200px] rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl transform-gpu rotate-2 pointer-events-none"></div> */}

        {/* Paper noise texture for tactile feel (optional file) */}
        <div className="absolute inset-0 bg-[url('/noise-light.png')] opacity-[0.06] mix-blend-overlay dark:mix-blend-soft-light pointer-events-none"></div>

        {/* Very subtle grid / mesh to add depth */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none"></div>

        {/* Floating soft shadow under content */}
        <div className="absolute inset-x-0 top-[55%] -translate-y-1/2 flex justify-center pointer-events-none">
          <div className="w-[760px] h-6 rounded-full bg-gradient-to-r from-white/60 to-transparent dark:from-white/10 opacity-30 blur-xl"></div>
        </div>

        {/* Content wrapper (place your hero elements here) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Content */}
          <div className="mx-auto max-w-4xl text-center space-y-6 md:space-y-8 lg:space-y-10">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 text-indigo-600 text-sm font-medium shadow-sm ring-1 ring-indigo-50">
              <span className="h-2 w-2 rounded-full bg-indigo-500/90 inline-block" />
              <span>Verified listings · Trusted hosts</span>
            </div> */}

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-green-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-400 dark:to-green-400">
                Hostel Home
              </span>
            </h1>

            {/* Quote */}
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 italic">
              &quot;Your comfort is our priority. Discover verified hostels with real reviews, transparent pricing,
              and facilities that feel like home.&quot;
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 md:pt-4">
              <Link href="/hostels" className="group">
                <Button className="inline-flex items-center justify-center gap-1 px-8 py-3 rounded-xl text-md font-semibold shadow-lg bg-gradient-to-r from-primary to-secondary text-white transition-transform transform hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30">
                  <Search className="h-4 w-4" />
                  Browse Hostels
                  <ArrowRight className="h-4 ml-2 w-4" />
                </Button>
              </Link>

              {!isAuthenticated && (
                <Link href="/register" className="group">
                  <Button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-md font-semibold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-slate-700 dark:text-slate-200 transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/20">
                    List Your Hostel
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 duration-300"
                  >
                    <div className="flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                      <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-400 bg-clip-text text-transparent dark:from-indigo-400 dark:via-pink-400 dark:to-amber-300">
                        {stat.value}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              Why Choose Hostel Finder?
            </h3>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              We make finding and managing hostels simple, transparent, and trustworthy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/80">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${index === 0 ? 'from-blue-500 to-blue-600' :
                      index === 1 ? 'from-green-500 to-green-600' :
                        index === 2 ? 'from-yellow-500 to-yellow-600' :
                          'from-purple-500 to-purple-600'
                      } flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm">
                FOR STUDENTS
              </div>
              <h2 className="text-responsive-lg font-bold">
                Find Your Ideal Living Space
              </h2>
              <p className="text-lg text-muted-foreground">
                Search from hundreds of verified hostels, compare amenities, read genuine reviews,
                and make informed decisions about your accommodation.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Advanced Filtering</h3>
                    <p className="text-sm text-muted-foreground">Find hostels by budget, location, gender type, and facilities</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Save Favorites</h3>
                    <p className="text-sm text-muted-foreground">Create a shortlist and compare your top choices</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Share Reviews</h3>
                    <p className="text-sm text-muted-foreground">Help others with honest feedback about your experience</p>
                  </div>
                </div>
              </div>

              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Join as Student
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/student-life.png"
                  alt="Student Life"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* For Hostel Owners Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/hostel-owner.png"
                  alt="Hostel Owner"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10"></div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                FOR HOSTEL OWNERS
              </div>
              <h2 className="text-responsive-lg font-bold">
                Grow Your Business
              </h2>
              <p className="text-lg text-muted-foreground">
                List your hostels for free, manage bookings easily, and connect with students
                actively searching for accommodation.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Easy Listing Management</h3>
                    <p className="text-sm text-muted-foreground">Update availability, prices, and details anytime</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Reach More Students</h3>
                    <p className="text-sm text-muted-foreground">Get discovered by thousands of potential tenants</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Build Your Reputation</h3>
                    <p className="text-sm text-muted-foreground">Earn trust through verified reviews and ratings</p>
                  </div>
                </div>
              </div>

              <Link href="/register">
                <Button size="lg" variant="outline" className="gap-2 border-2">
                  Join as Owner
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="text-center p-12">
              <h2 className="text-responsive-lg font-bold mb-4">
                Ready to Find Your Perfect Hostel?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who have found their ideal accommodation through our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/hostels">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary">
                    Start Searching
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-2">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
     <footer className="border-t bg-card">
  <div className="container mx-auto px-4 py-12">
    
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      
      {/* Brand */}
      <div className="col-span-2 lg:col-span-1 text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Hostel Finder</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Your trusted platform for finding and managing hostel accommodations.
        </p>
      </div>

      {/* Students */}
      <div className="text-center lg:text-left">
        <h3 className="font-semibold mb-4">For Students</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/hostels">Browse Hostels</Link></li>
          <li><Link href="/register">Create Account</Link></li>
        </ul>
      </div>

      {/* Owners */}
      <div className="text-center lg:text-left">
        <h3 className="font-semibold mb-4">For Owners</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/register">List Your Hostel</Link></li>
          <li><Link href="/login">Owner Login</Link></li>
        </ul>
      </div>

      {/* Support */}
      <div className="text-center lg:text-left">
        <h3 className="font-semibold mb-4">Support</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link href="/about">About Us</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/report">Report Issue</Link></li>
        </ul>
      </div>

    </div>

    <div className="pt-8 border-t text-center text-sm text-muted-foreground">
      <p>Hasnain Ali &copy; All rights reserved. Made with ❤️ for students.</p>
    </div>

  </div>
</footer>

    </div>
  );
}
