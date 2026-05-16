"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ChevronLeft,
  X,
  Sparkles,
  Folder,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: Folder,
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    label: "AI Chat",
    href: "/dashboard/chat",
    icon: Sparkles,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ─── Mobile Overlay ───────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ─── Sidebar ──────────────────────────────────────── */}
      <aside
        id="main-sidebar"
        className={clsx(
          "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] flex-col border-r border-surface-200 transition-all duration-300 dark:border-dark-border",
          "lg:relative lg:top-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-[4.5rem]" : "w-64"
        )}
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* ─── Sidebar Header ─────────────────────────────── */}
        <div className="flex h-14 items-center justify-between px-4">
          {!isCollapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
              Navigation
            </span>
          )}

          {/* Collapse toggle (desktop) */}
          <button
            id="sidebar-collapse-toggle"
            onClick={onToggleCollapse}
            className={clsx(
              "hidden lg:flex items-center justify-center rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800",
              isCollapsed && "mx-auto"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              size={16}
              className={clsx(
                "transition-transform duration-300",
                isCollapsed && "rotate-180"
              )}
            />
          </button>

          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* ─── Navigation Links ───────────────────────────── */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon
                  size={18}
                  className={clsx(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300"
                  )}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* ─── Sidebar Footer ─────────────────────────────── */}
        {/* {!isCollapsed && (
          <div className="border-t border-surface-200 p-4 dark:border-dark-border">
            <div className="rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 p-3 dark:from-primary-950/30 dark:to-accent-950/30">
              <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                Phase 1 Ready
              </p>
              <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                Foundation established
              </p>
            </div>
          </div>
        )} */}
      </aside>
    </>
  );
}
