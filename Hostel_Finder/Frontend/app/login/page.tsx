"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e:any) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setTimeout(() => {
            setLoading(false);
            setError("Invalid credentials. Please try again.");
        }, 1500);
    };

    return (
        /* Added overflow-x-hidden to prevent horizontal scroll from blur elements */
        <div className="h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Main Card Container - Added -translate-y-10 to move it up */}
            <div className="w-full max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-auto border border-gray-100 dark:border-gray-700 transition-transform duration-500">

                {/* --- BACK TO HOME BUTTON --- */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="hidden text-white sm:inline">Back to Home</span>
                </Link>

                {/* Left Side - Branding */}
                <div className="hidden lg:flex flex-col justify-start pt-24 p-12 xl:p-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full"
                            style={{
                                backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83z" fill="white" fill-opacity="0.4" fill-rule="evenodd"/></svg>')`,
                            }}>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                                Login to Access your dashboard
                            </h2>
                            <p className="text-lg text-blue-100 leading-relaxed">
                                Find the Perfect Hostel for you, or the perfect client for your hostel in an easy way.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Secure & Reliable</h3>
                                    <p className="text-blue-100 text-sm">Your data is protected with security</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Easy to approach</h3>
                                    <p className="text-blue-100 text-sm">Contact by using the in-app chat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                {/* Changed p-0 to p-8 sm:p-12 for better spacing and to avoid overflow issues */}
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="space-y-2 mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
                                <span className="mt-0.5">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            {loading ? "Signing in..." : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-1.5 text-sm">
                        <span className="text-gray-500">Don't have an account?</span>
                        <Link href="/register" className="font-bold text-blue-600 hover:underline">
                            Sign up for free
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}