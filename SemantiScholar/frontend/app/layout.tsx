import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import AuthHydration from "@/providers/AuthHydration";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SemantiScholar — AI-Powered Platform",
  description:
    "A modern, scalable AI-powered platform built with Next.js and Express.",
  keywords: ["AI", "platform", "Next.js", "MERN"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthHydration />
          <ToastProvider />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
