"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, Home, Building2, Phone, Mail, AlertTriangle, User, Heart, LogOut, Settings, LayoutDashboard, ChevronDown, MessageCircle } from "lucide-react";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { fetchNotifications } from "@/lib/slices/notificationSlice";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);
    const { notifications } = useAppSelector((state: any) => state.chat || { notifications: [] }); // Access chat notifications
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();


    const handleForLogout = () => {
        dispatch(logout());
        router.push("/");
    };

    // Close dropdown when clicking outside


    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }

        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dispatch, isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
        setIsOpen(false);
        setIsUserMenuOpen(false);
    };

    const navigation = [
        { name: "Home", href: "/", icon: Home },
        { name: "Browse Hostels", href: "/hostels", icon: Building2 },
        { name: "About", href: "/about", icon: User },
        { name: "Contact", href: "/contact", icon: Mail },
        { name: "Report Issue", href: "/report", icon: AlertTriangle },
    ];

    const getDashboardLink = () => {
        if (!currentUser) return "/dashboard/student";
        if (currentUser.role === "admin") return "/dashboard/admin";
        if (currentUser.role === "owner") return "/dashboard/owner";
        return "/dashboard/student";
    };

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isTransparentPage = ["/", "/hostels", "/about", "/contact", "/report"].includes(pathname);
    const showTransparent = isTransparentPage && !isScrolled;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 border-b ${showTransparent
            ? "bg-transparent border-transparent"
            : "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm supports-[backdrop-filter]:bg-background/60"
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex cursor-pointer items-center space-x-2">
                        <div className="relative">
                            <Building2 className={`h-8 w-8 ${showTransparent ? "text-white" : "text-primary"}`} />
                            <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${showTransparent ? "bg-blue-400" : "bg-secondary"}`} />
                        </div>
                        <span className={`text-xl font-bold bg-clip-text text-transparent ${showTransparent
                            ? "bg-gradient-to-r from-white to-blue-200"
                            : "bg-gradient-to-r from-primary to-secondary"
                            }`}>
                            Hostel Finder
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.name} href={item.href}>
                                    <Button
                                        variant={isActive(item.href) ? "secondary" : "ghost"}
                                        className={`gap-2 cursor-pointer transition-colors ${showTransparent && !isActive(item.href)
                                            ? "text-white hover:text-white hover:bg-white/10"
                                            : !showTransparent && !isActive(item.href)
                                                ? "text-muted-foreground hover:text-white"
                                                : ""
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-2">
                        <div className={showTransparent ? "text-white" : ""}>
                            <ThemeToggle />
                        </div>
                        {isAuthenticated ? (
                            <>
                                {/* Message Icon */}
                                <Link href="/dashboard/chat">
                                    <Button variant="ghost" size="icon" className={`group rounded-full cursor-pointer relative ${showTransparent
                                        ? "text-white hover:text-white hover:bg-white/10"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        }`}>
                                        <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-background animate-pulse" />
                                        )}
                                    </Button>
                                </Link>

                                {/* Notifications */}
                                <NotificationsDropdown className={showTransparent ? "text-white hover:text-white hover:bg-white/10" : "text-muted-foreground"} />

                                {currentUser?.role !== "admin" && (
                                    <Link href={`/dashboard/${currentUser?.role}/favorites`}>
                                        <Button variant="ghost" size="icon" className={`rounded-full cursor-pointer ${showTransparent
                                            ? "text-white hover:text-white hover:bg-white/10"
                                            : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                            }`}>
                                            <Heart className="h-5 w-5" />
                                        </Button>
                                    </Link>)}

                                {/* User Profile Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors cursor-pointer outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${showTransparent
                                            ? "hover:bg-white/10 text-white"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-border">
                                            {currentUser?.profileImage ? (
                                                <img
                                                    src={currentUser.profileImage}
                                                    alt={currentUser.fullName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-primary">
                                                    {currentUser?.fullName[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="hidden lg:flex flex-col items-start">
                                            <span className="text-sm font-medium leading-none">
                                                {currentUser?.fullName}
                                            </span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""} ${showTransparent ? "text-white" : "text-muted-foreground"
                                            }`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 z-1000">
                                            <div className="px-2 py-1.5 text-sm font-semibold">
                                                My Account <span className="text-muted-foreground font-normal text-xs ml-1">({currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : ''})</span>
                                            </div>
                                            <div className="h-px bg-muted my-1" />

                                            <Link href={getDashboardLink()} onClick={() => setIsUserMenuOpen(false)}>
                                                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </div>
                                            </Link>

                                            <Link href="/dashboard/profile" onClick={() => setIsUserMenuOpen(false)}>
                                                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                </div>
                                            </Link>

                                            <div className="h-px bg-muted my-1" />

                                            <div
                                                onClick={handleLogout}
                                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-destructive/80 bg-destructive text-destructive-foreground text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log Out</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className={`cursor-pointer ${showTransparent ? "text-white hover:text-white hover:bg-white/10" : ""
                                        }`}>Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="cursor-pointer bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                                        Get Started
                                    </Button>
                                </Link>

                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                            className={showTransparent ? "text-white hover:text-white hover:bg-white/10" : ""}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-2 border-t animate-in slide-in-from-top bg-background/95 backdrop-blur-md rounded-b-xl px-2 shadow-xl border-x border-b border-border/40 absolute left-0 right-0 top-16">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href)
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}

                        <div className="pt-4 border-t space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <div className="px-4 py-2 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            {currentUser?.profileImage ? (
                                                <img
                                                    src={currentUser.profileImage}
                                                    alt={currentUser.fullName}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-primary">
                                                    {currentUser?.fullName[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-1 justify-between">
                                            <div>
                                                <p className="font-medium">{currentUser?.fullName}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
                                            </div>
                                            <div>
                                                <Button variant="destructive" size="sm" className="" onClick={handleForLogout}>Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <User className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="px-4">
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full mb-2">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
