"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { loadUser } from "@/lib/slices/authSlice";
import { UserRole } from "@/lib/types";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

import { Loader } from "@/components/ui/loader";

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, currentUser, loading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated && !currentUser) {
            dispatch(loadUser() as any);
        }
    }, [dispatch, isAuthenticated, currentUser]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // router.push("/login"); // Optional: Auto-redirect or let content decide
            // The original logic for redirecting to login if not authenticated is now handled here
            // or can be re-enabled if desired.
            // For now, we'll keep the original redirect logic below the loading check.
        }

        if (!isAuthenticated && !loading) { // Ensure we only redirect if not loading and not authenticated
            router.push("/login");
            return;
        }

        if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
            // Redirect to appropriate dashboard
            if (currentUser.role === "admin") {
                router.push("/dashboard/admin");
            } else if (currentUser.role === "owner") {
                router.push("/dashboard/owner");
            } else {
                router.push("/dashboard/student");
            }
        }
    }, [loading, isAuthenticated, currentUser, allowedRoles, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Loading user data..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Redirecting to login..." />
            </div>
        );
    }

    if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" text="Redirecting..." />
            </div>
        );
    }

    return <>{children}</>;
}
