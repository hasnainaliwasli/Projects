"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/layout";
import { Button, Container, Card } from "@/components/ui";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Leverage cutting-edge AI models to analyze, generate, and transform your data effortlessly.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description:
      "Enterprise-grade security with end-to-end encryption and robust authentication.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance with server-side rendering and edge computing for instant responses.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description:
      "Built on a modular MERN stack that grows with your needs from prototype to production.",
    gradient: "from-blue-500 to-cyan-500",
  },
];

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* ─── Hero Section ─────────────────────────────────── */}
      <section className="relative flex flex-1 items-center overflow-hidden">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary-500/10 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[400px] rounded-full bg-accent-500/10 blur-[100px]" />
        </div>

        <Container size="lg" className="relative py-20 sm:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5"
            >
              <Sparkles size={14} className="text-primary-400" />
              <span className="text-xs font-semibold text-primary-400">
                Phase 1 — Foundation Ready
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Build Smarter with{" "}
              <span className="gradient-text">AI-Powered</span> Intelligence
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-surface-400 leading-relaxed"
            >
              A modern, production-ready platform designed for speed, security,
              and scalability. Transform your workflow with the power of AI.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/dashboard">
                <Button size="lg" className="group">
                  Go to Dashboard
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── Features Section ─────────────────────────────── */}
      <section className="relative py-20 sm:py-28">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-surface-400 text-lg">
              A thoughtfully designed stack for modern applications.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card
                  variant="default"
                  hoverable
                  className="h-full flex flex-col"
                >
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-sm`}
                  >
                    <feature.icon size={18} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-surface-200 dark:border-dark-border py-8">
        <Container size="lg">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-surface-500">
              © {new Date().getFullYear()} SemantiScholar. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-surface-500 transition-colors hover:text-surface-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-surface-500 transition-colors hover:text-surface-300"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-surface-500 transition-colors hover:text-surface-300"
              >
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
