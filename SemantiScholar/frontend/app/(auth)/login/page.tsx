"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import LoginForm from "@/components/auth/LoginForm";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-dark-bg p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-sm transition-transform group-hover:scale-105">
              <span className="text-base font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
              SemantiScholar
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Enter your credentials to access your account
          </p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-dark-card/80">
          <LoginForm />
        </Card>

        <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
