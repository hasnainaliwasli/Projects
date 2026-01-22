"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function NavbarWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");
    const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

    if (isDashboard || isAuthPage) {
        return null;
    }

    return <Navbar />;
}
