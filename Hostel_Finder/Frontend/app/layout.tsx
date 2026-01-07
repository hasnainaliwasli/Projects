import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux-provider";
import { ToastProvider } from "@/components/toast-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { SocketProvider } from "@/context/SocketProvider";
import { AuthLoader } from "@/components/auth-loader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hostel Finder - Find Your Perfect Hostel",
  description: "Find and book the perfect hostel for students and professionals. Browse hostels by location, price, and amenities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ReduxProvider>
            <AuthLoader />
            <SocketProvider>
              <NavbarWrapper />
              {children}
            </SocketProvider>
            <ToastProvider />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
