"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Home, User, Briefcase, Layout, Award, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "#home", icon: Home },
    { name: "Experience", href: "#experience", icon: Briefcase },
    { name: "Skills", href: "#skills", icon: Layout },
    { name: "Projects", href: "#projects", icon: User },
    { name: "Achievements", href: "#achievements", icon: Award },
    { name: "Contact", href: "#contact", icon: MessageSquare },
];

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Top Navigation - Desktop Only */}
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
                    scrolled ? "py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm" : "py-6 bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.a
                        href="#home"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100"
                    >
                        Hasnain<span className="text-accent underline decoration-4 underline-offset-4 decoration-accent/30">Ali</span>
                    </motion.a>

                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-all rounded-full hover:bg-white dark:hover:bg-slate-900"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            {theme === "dark" ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-blue-600" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
                <div className="bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2.5 rounded-[2rem] shadow-2xl flex items-center justify-around">
                    {navLinks.slice(0, 5).map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex flex-col items-center justify-center size-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold"
                            title={link.name}
                        >
                            <link.icon size={22} />
                        </a>
                    ))}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="size-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/40"
                    >
                        {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
                    </button>
                </div>
            </nav>
        </>
    );
}
