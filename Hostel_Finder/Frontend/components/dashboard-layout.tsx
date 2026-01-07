"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/protected-route";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { fetchHostels } from "@/lib/slices/hostelSlice";
import { fetchNotifications } from "@/lib/slices/notificationSlice";
import {
    LayoutDashboard,
    Heart,
    Star,
    User,
    Building2,
    PlusCircle,
    Users,
    Archive,
    ShieldAlert,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    Flag,
    MessageSquare
} from "lucide-react";

interface DashboardLayoutProps {
    children: ReactNode;
    role: "student" | "owner" | "admin";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);
    const pathname = usePathname();

    const handleLogout = () => {
        dispatch(logout());
        router.push("/");
    };

    useEffect(() => {
        // Skip global fetch if we are on a page that manages its own hostel data
        if (pathname.includes('/hostels')) return;
        dispatch(fetchHostels({}));
    }, [dispatch, pathname]);

    const getNavLinks = () => {
        if (role === "student") {
            return [
                { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
                { href: "/dashboard/student/favorites", label: "Favorites", icon: Heart },
                { href: "/dashboard/student/reviews", label: "My Reviews", icon: Star },
                { href: "/dashboard/my-reports", label: "My Reports", icon: Flag },
                { href: "/dashboard/chat", label: "Messages", icon: MessageSquare },
                { href: "/dashboard/profile", label: "Profile", icon: User },
            ];
        } else if (role === "owner") {
            return [
                { href: "/dashboard/owner", label: "Dashboard", icon: LayoutDashboard },
                { href: "/dashboard/owner/hostels", label: "My Hostels", icon: Building2 },
                { href: "/dashboard/owner/hostels/add", label: "Add Hostel", icon: PlusCircle },
                { href: "/dashboard/owner/favorites", label: "Favorites", icon: Heart },
                { href: "/dashboard/my-reports", label: "My Reports", icon: Flag },
                { href: "/dashboard/chat", label: "Messages", icon: MessageSquare },
                { href: "/dashboard/profile", label: "Profile", icon: User },
            ];
        } else if (role === "admin") {
            return [
                { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
                { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
                { href: "/dashboard/admin/users/previous", label: "Archived Users", icon: Archive },
                { href: "/dashboard/admin/users/blocked", label: "Blocked Users", icon: ShieldAlert },
                { href: "/dashboard/admin/hostels", label: "Manage Hostels", icon: Building2 },
                { href: "/dashboard/admin/reviews", label: "Manage Reviews", icon: Star },
                { href: "/dashboard/admin/reports", label: "Reports", icon: Flag },
                { href: "/dashboard/chat", label: "All Messages", icon: MessageSquare },
                { href: "/dashboard/profile", label: "Profile", icon: User },
            ];
        }
        return [];
    };

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex flex-col h-full bg-card">
            <div className="h-16 flex items-center px-6 border-b border-border/40">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Hostel Finder
                    </span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-3 md:px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <p className="px-3 md:px-4 text-xs md:text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2 mt-1">
                    Menu
                </p>
                {getNavLinks().map((link) => {
                    const isActive = pathname === link.href || (
                        pathname.startsWith(link.href) &&
                        link.href !== "/dashboard/student" &&
                        link.href !== "/dashboard/owner" &&
                        link.href !== "/dashboard/admin" &&
                        !(link.href === "/dashboard/owner/hostels" && pathname === "/dashboard/owner/hostels/add") &&
                        !(link.href === "/dashboard/admin/users" && (pathname === "/dashboard/admin/users/previous" || pathname === "/dashboard/admin/users/blocked"))
                    );

                    const LinkContent = (
                        <div className={`flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                            }`}>
                            <link.icon className={`h-4.5 w-4.5 md:h-5 md:w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
                            <span className="text-sm md:text-base">{link.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                            )}
                        </div>
                    );

                    return isMobile ? (
                        <SheetClose key={link.href} asChild>
                            <Link href={link.href}>{LinkContent}</Link>
                        </SheetClose>
                    ) : (
                        <Link key={link.href} href={link.href}>{LinkContent}</Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border/40">
                <div className="bg-muted/50 rounded-xl p-1 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm overflow-hidden">
                        {currentUser?.profileImage ? (
                            <img src={currentUser.profileImage} alt={currentUser.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-primary font-bold text-sm">
                                {currentUser?.fullName?.[0] || 'U'}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{currentUser?.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentUser?.role}</p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/80">
                        <LogOut className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <ProtectedRoute allowedRoles={[role]}>
            <div className="min-h-screen flex bg-background font-sans">
                {/* Desktop Sidebar */}
                <aside className="w-72 border-r border-border/40 hidden md:flex flex-col flex-shrink-0 shadow-sm z-20 sticky top-0 h-screen">
                    <SidebarContent />
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
                    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            {/* Mobile Sidebar Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 border-r w-72">
                                    <div className="sr-only">
                                        <SheetTitle>Navigation Menu</SheetTitle>
                                    </div>
                                    <SidebarContent isMobile />
                                </SheetContent>
                            </Sheet>

                            <h2 className="text-lg font-semibold text-foreground/80">
                                {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"} Dashboard
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-9 w-64 rounded-full border border-border bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <Link href="/">
                                <Button variant="outline" size="sm" className="hidden sm:flex rounded-full px-4">
                                    Visit Website
                                </Button>
                            </Link>
                        </div>
                    </header>

                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
