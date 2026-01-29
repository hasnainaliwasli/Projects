"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { register, clearError } from "@/lib/slices/authSlice";
import { UserRole } from "@/lib/types";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as UserRole,
    phoneNumber: "",
    homeAddress: "",
    profileImage: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string>("");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, isAuthenticated, currentUser, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      router.push(
        currentUser.role === "owner"
          ? "/dashboard/owner"
          : "/dashboard/student"
      );
    }
  }, [isAuthenticated, currentUser, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setErrors("Password must be at least 6 characters");
      return;
    }

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (formData.phoneNumber) data.append("phoneNumbers[]", formData.phoneNumber);
    if (formData.homeAddress) data.append("homeAddress", formData.homeAddress);
    if (formData.profileImage) data.append("profileImage", formData.profileImage);
    if (formData.role === "student") data.append("favoriteHostels", JSON.stringify([]));

    dispatch(register(data) as any);
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-slate-100 dark:bg-gray-900 p-0 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[40%_60%] gap-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-full max-h-[95vh] border border-gray-100 dark:border-gray-700 transition-transform duration-500">

        {/* Back to Home Button */}
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
        <div className="hidden lg:flex flex-col justify-center pt-24 p-12 xl:p-16 bg-[#020817] text-white relative overflow-hidden border-r border-gray-800">
          {/* Hero Glow Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[80px]"></div>
          </div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83z" fill="white" fill-opacity="0.4" fill-rule="evenodd"/></svg>')`,
              }}>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-bold leading-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Join our community
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Create an account to discover the best hostels or manage your properties with ease.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Personalized Profile</h3>
                  <p className="text-gray-400 text-sm">Save your favorites and track your applications.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Owner Tools</h3>
                  <p className="text-gray-400 text-sm">List your hostel and reach thousands of students.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="p-10 flex flex-col overflow-y-auto h-full">
          <div className="space-y-2 lg:mt-0 flex-shrink-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Create Account</h2>
            <p className="text-gray-600 mb-2 pb-1 dark:text-gray-400">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {(errors || error) && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
                <span className="mt-0.5">⚠️</span>
                <span>{errors || error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="+92..."
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Register as</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none"
                  >
                    <option value="student">Student</option>
                    <option value="owner">Hostel Owner</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Home Address - Full Width */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Home Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  name="homeAddress"
                  placeholder="Street, City, Country"
                  value={formData.homeAddress}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 cursor-pointer mt-4 bg-[#020817] hover:bg-[#020817]/90 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-sm">
            <span className="text-gray-500">Already have an account?</span>
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}