"use client";

import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
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
  ArrowRight,
  MapPin,
  Coffee,
  Wifi
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const stats = [
    { label: "Active Hostels", value: "500+", icon: Building2 },
    { label: "Happy Students", value: "10K+", icon: Users },
    { label: "Cities Covered", value: "50+", icon: MapPin },
    { label: "Success Rate", value: "98%", icon: TrendingUp }
  ];

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Filter by price, location, and amenities to find your perfect match instantly.",
      color: "bg-blue-500"
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Every hostel is physically verified to ensure safety and authenticity.",
      color: "bg-green-500"
    },
    {
      icon: Star,
      title: "Real Reviews",
      description: "Unbiased reviews from verified students who have actually lived there.",
      color: "bg-yellow-500"
    },
    {
      icon: Wifi,
      title: "Modern Amenities",
      description: "Detailed info on WiFi, backup power, food, and laundry facilities.",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden font-sans">

      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div> */}

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-15 md:pt-38 pb-25 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            // src="https://img.freepik.com/free-photo/cinematic-film-location-decor_23-2151918969.jpg?semt=ais_hybrid&w=740&q=80"
            src="https://cdn.qwenlm.ai/output/3e5c29e8-48be-4933-bc7d-19c7556beefe/t2i/3516911f-1a2a-4882-a6b3-2423830fc051/1769163268.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiM2U1YzI5ZTgtNDhiZS00OTMzLWJjN2QtMTljNzU1NmJlZWZlIiwicmVzb3VyY2VfaWQiOiIxNzY5MTYzMjY4IiwicmVzb3VyY2VfY2hhdF9pZCI6IjJiYzUxNjVkLTJlMmEtNDNlNC1iMDBhLTk0ZmY4NDFmMjJhNSJ9.gVyd3NhBjHtJvByhypPgAzZfF1yt7iOJaQjMh7Unhko"
            alt="background"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-yellow-500/15 to-green-500/20" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-semibold tracking-tight leading-tight text-white drop-shadow-2xl">

              Find Home <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-white">
                Away From Home
              </span>
            </h1>

            <p className="text-lg tracking-wide text-blue-100 max-w-2xl mx-auto leading-relaxed  drop-shadow-md">
              Connecting students with <span className="font-medium text-white">safe</span>, <span className="font-medium text-white">comfortable</span>, and <span className="font-medium text-white">affordable</span> hostels.
              Experience premium living with verified listings and zero hassle.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link
              href="/hostels"
              className="group relative px-7 py-3.5 rounded-xl font-semibold text-base
               bg-gradient-to-r from-white to-blue-50 text-blue-900
               shadow-[0_10px_30px_-10px_rgba(255,255,255,0.6)]
               hover:shadow-[0_15px_40px_-10px_rgba(255,255,255,0.9)]
               hover:-translate-y-0.5
               transition-all duration-300 ease-out
               flex items-center justify-center gap-2
               focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <Search className="w-4 h-4" />
              <span>Start Searching</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>

            {/* SECONDARY CTA */}
            {!isAuthenticated && (
              <Link
                href="/register"
                className="group px-7 py-3.5 rounded-xl font-medium text-base text-white
                 bg-white/10 backdrop-blur-lg
                 border border-white/20
                 hover:bg-white/20 hover:border-white/40
                 transition-all duration-300 ease-out
                 flex items-center justify-center gap-2
                 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Building2 className="w-4 h-4 text-blue-200 group-hover:scale-105 transition-transform" />
                <span>List Your Property</span>
              </Link>
            )}

          </div>


          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-26 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center p-4 gap-1 rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/40 hover:bg-black/20 transition-colors group">
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-6 h-6 text-blue-300 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We're revolutionizing the way students find accommodation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color} opacity-5 rounded-bl-full pointer-events-none`}></div>
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- FOR STUDENTS & OWNERS SPLIT --- */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

          {/* Students Row */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl rotate-3 opacity-20 blur-lg"></div>
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2670&auto=format&fit=crop"
                alt="Happy Students"
                className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px] hover:rotate-1 transition-transform duration-500"
              />

              {/* Floating Card 1 */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Favorites</div>
                  <div className="font-bold text-gray-900 dark:text-white">Saved Hostels</div>
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-bold tracking-wide uppercase">
                For Students
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Live Your Best <br />Student Life
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Struggling to find a place? We make it easy. Compare prices, check distance from your university,
                and see what other students are saying before you book.
              </p>
              <ul className="space-y-4">
                {[
                  "Verify availability in real-time",
                  "Compare amenities (AC, WiFi, Mess)",
                  "Direct chat with hostel owners"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="mt-4 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
                  Join for Free <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Owners Row */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-bold tracking-wide uppercase">
                For Hostel Owners
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Fill Your Rooms <br />Faster Than Ever
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Stop relying on posters and word of-mouth. List your property on Hostel Finder
                and get direct inquiries from thousands of students looking for a place right now.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
                  <h4 className="font-bold text-purple-700 dark:text-purple-300 text-lg mb-1">Zero Fees</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">List your property for free. No hidden charges.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                  <h4 className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-1">Direct Chat</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Talk directly to students. No middlemen.</p>
                </div>
              </div>

              <Link href="/register">
                <button className="mt-4 px-8 py-3.5 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all flex items-center gap-2">
                  List Property <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-600 to-blue-600 rounded-3xl -rotate-3 opacity-20 blur-lg"></div>
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop"
                alt="Hostel Owner Dashboard"
                className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px] hover:rotate-1 transition-transform duration-500"
              />
              {/* Floating Card 2 */}
              <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Weekly Views</div>
                  <div className="font-bold text-gray-900 dark:text-white">1.2k+ Students</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-xl text-gray-900 dark:text-white">HostelFinder</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                The most trusted platform for students to find affordable and safe hostels near their universities.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"></div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/hostels" className="hover:text-blue-600 transition-colors">Browse Hostels</Link></li>
                <li><Link href="/map" className="hover:text-blue-600 transition-colors">Map View</Link></li>
                <li><Link href="/register" className="hover:text-blue-600 transition-colors">List Property</Link></li>
                <li><Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-blue-600 transition-colors">Safety Guide</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>123 University Road, Islamabad, Pakistan</span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>support@hostelfinder.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Hostel Finder. Made with ❤️ for Students.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
