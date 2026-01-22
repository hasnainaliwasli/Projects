"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  RefreshCcw 
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgotpassword', { email });
      setIsSubmitted(true);
      toast.success("Email sent successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[40%_60%] gap-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-auto max-h-[90vh] border border-gray-100 dark:border-gray-700 transition-all duration-500">
        
        {/* Back to Home/Login Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="hidden text-white sm:inline">Go to Home</span>
        </Link>

        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center pt-24 p-12 xl:p-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
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
                Account Recovery
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Don't worry, it happens to the best of us. Let's get you back into your dashboard.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Recovery</h3>
                  <p className="text-blue-100 text-sm">We use encrypted links to ensure your account stays safe.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="p-10 flex flex-col justify-center min-h-[500px]">
          {!isSubmitted ? (
            <>
              <div className="space-y-2 mb-8 flex-shrink-0">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                <p className="text-gray-600 dark:text-gray-400">Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State View */
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Check Your Email</h2>
                <p className="text-gray-600 dark:text-gray-400 px-8">
                  We've sent password reset instructions to <br />
                  <strong className="text-gray-900 dark:text-white">{email}</strong>
                </p>
              </div>
              
              <div className="pt-4 space-y-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl transition-all hover:opacity-90 w-full"
                >
                  Back to Login
                </Link>
                
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:underline mx-auto"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Try a different email
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}