"use client";

import { motion } from "framer-motion";
import {
  Activity,
  FileText,
  Users,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Clock,
  Folder,
} from "lucide-react";
import { Card, Container } from "@/components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fadeUp: any = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: papers, isLoading: isLoadingPapers } = useQuery({
    queryKey: ["papers"],
    queryFn: async () => {
      const res = await api.get("/papers");
      return res.data.data;
    },
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data.data;
    },
  });

  const stats = [
    {
      label: "Total Documents",
      value: isLoadingPapers ? "-" : (papers?.length || 0),
      change: "Active",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Projects",
      value: isLoadingProjects ? "-" : (projects?.length || 0),
      change: "Active",
      icon: Folder,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "API Requests",
      value: "∞",
      change: "Healthy",
      icon: Activity,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      label: "System Status",
      value: "100%",
      change: "Online",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const recentActivity = [
    {
      action: "System initialized",
      time: "Today",
      icon: BarChart3,
    },
    {
      action: "AI Assistant ready",
      time: "Today",
      icon: Activity,
    },
    {
      action: "Dashboard configured",
      time: "Today",
      icon: FileText,
    },
  ];

  return (
    <Container size="xl">
      {/* ─── Page Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Welcome back, {user?.name || "User"}! Here&apos;s an overview of your platform.
        </p>
      </motion.div>

      {/* ─── Stats Grid ───────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Card variant="default" className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                    {stat.label}
                  </p>
                  {stat.value === "-" ? (
                    <div className="h-8 w-12 mt-2 bg-surface-200 dark:bg-surface-800 rounded animate-pulse" />
                  ) : (
                    <p className="mt-2 text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-500">
                    <ArrowUpRight size={12} />
                    {stat.change}
                  </div>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}
                >
                  <stat.icon size={18} className="text-white" />
                </div>
              </div>

              {/* Decorative gradient line */}
              <div
                className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r ${stat.gradient} opacity-40`}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ─── Content Grid ─────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4">Recent Milestones</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.action}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-surface-400">
                      <Clock size={10} />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
        >
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3">
                <span className="text-sm font-medium text-emerald-500">
                  Core Database
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3">
                <span className="text-sm font-medium text-emerald-500">
                  AI Embedding Engine
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-primary-500/10 px-4 py-3">
                <span className="text-sm font-medium text-primary-500">
                  Web Application
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-primary-500">
                  <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                  Running
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Container>
  );
}
