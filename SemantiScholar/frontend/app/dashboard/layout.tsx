"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar, Sidebar } from "@/components/layout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Full-screen mode for document viewer — no sidebar, no navbar
  const isDocViewer = /^\/dashboard\/documents\/[^/]+$/.test(pathname);
  if (isDocViewer) {
    return <ProtectedRoute><div className="h-screen w-screen overflow-hidden">{children}</div></ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="shrink-0 z-40">
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isSidebarOpen={sidebarOpen}
            showSidebarToggle
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* ─── Main Content ─────────────────────────────── */}
          <main
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
            style={{ backgroundColor: "var(--main-bg)" }}
          >
            <div className="animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
