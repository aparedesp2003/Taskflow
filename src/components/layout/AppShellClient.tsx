"use client";

import { useState, useEffect, type ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import ToastProvider from "@/components/ui/ToastProvider";

type AppShellClientProps = {
  children:     ReactNode;
  displayName:  string;
  avatarUrl:    string | null;
};

export default function AppShellClient({ children, displayName, avatarUrl }: AppShellClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          displayName={displayName}
          avatarUrl={avatarUrl}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-450">
            <ToastProvider>{children}</ToastProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
