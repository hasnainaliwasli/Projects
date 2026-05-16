"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--card-bg)",
          color: "var(--foreground)",
          border: "1px solid var(--card-border)",
          borderRadius: "0.75rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          padding: "12px 16px",
          boxShadow: "var(--shadow-elevated)",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
