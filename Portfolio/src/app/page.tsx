"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Achievements } from "@/components/achievements";

export default function Home() {
  return (
    <main className="relative selection:bg-accent/30">
      <Navbar />
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <Achievements />

      <footer className="py-12 bg-primary text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Hasnain Ali. Built with Next.js & Tailwind CSS.
          </div>
        </div>
      </footer>
    </main>
  );
}
