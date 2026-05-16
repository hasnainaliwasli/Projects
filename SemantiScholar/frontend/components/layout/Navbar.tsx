"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Settings, Sun, Moon, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  showSidebarToggle?: boolean;
}

export default function Navbar({
  onToggleSidebar,
  isSidebarOpen,
  showSidebarToggle = false,
}: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-40 h-16 w-full border-b border-surface-200 dark:border-dark-border glass"
      style={{ background: "var(--navbar-bg)" }}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* ─── Left Section ────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              id="sidebar-toggle"
              onClick={onToggleSidebar}
              className="rounded-xl p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-300 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-sm transition-transform group-hover:scale-105">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-surface-900 dark:text-surface-50">
              SemantiScholar
            </span>
          </Link>
        </div>

        {/* ─── Center Section (Search) ─────────────────────── */}
        {isAuthenticated && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                id="navbar-search"
                type="text"
                placeholder="Search..."
                className="w-full h-9 rounded-xl border border-surface-200 bg-surface-50 pl-9 pr-4 text-sm text-surface-700 placeholder:text-surface-400 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-surface-800/50 dark:text-surface-300 dark:placeholder:text-surface-500 dark:focus:ring-primary-900"
              />
            </div>
          </div>
        )}

        {/* ─── Right Section ───────────────────────────────── */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-semibold text-white shadow-sm cursor-pointer transition-transform hover:scale-105"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-xl object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || "U"
                )}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-11 w-56 rounded-xl border border-surface-200 bg-white dark:border-dark-border dark:bg-dark-card shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800">
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>

                  <div className="py-1">
                    {/* Settings Link */}
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setShowDropdown(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-surface-100 dark:border-surface-800 py-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
