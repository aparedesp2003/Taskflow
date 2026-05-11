import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HeroMockup from "@/components/landing/HeroMockup";

const FEATURES = [
  {
    title:       "Project Dashboards",
    description: "Create and manage projects with status tracking, descriptions, and due dates in one organized view.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title:       "Drag & Drop Kanban",
    description: "Move tasks between To Do, In Progress, and Done columns with smooth drag-and-drop interactions.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    title:       "Real-time Task Tracking",
    description: "Set priorities, due dates, and descriptions. Track every task from creation to completion.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title:       "Search & Notifications",
    description: "Find any project or task instantly. Get alerted when tasks are overdue or due today.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 512 512" aria-hidden="true">
              <defs>
                <linearGradient id="tf-nav-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
                  <stop offset="0%"  stopColor="#4338CA" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="tf-nav-sh" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                  <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.22" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="114" fill="url(#tf-nav-bg)" />
              <rect width="512" height="300" rx="114" fill="url(#tf-nav-sh)" />
              <rect x="84"  y="146" width="344" height="80"  rx="20" fill="white" />
              <rect x="216" y="146" width="80"  height="234" rx="20" fill="white" />
            </svg>
            <span className="text-base font-semibold tracking-tight text-white">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 text-center sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="-mt-25 h-150 w-225 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span className="text-xs font-medium text-indigo-300">Project + Task Management</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Organize projects.{" "}
            <span className="text-indigo-400">Track tasks.</span>{" "}
            Move work forward.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400 sm:text-lg">
            TaskFlow is a project and task management dashboard with Kanban workflows — built for people who ship.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="relative mx-auto mt-14 hidden max-w-5xl sm:block">
          <HeroMockup />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-3 text-base text-zinc-500">
              Built for modern teams and solo builders alike.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Ready to get organized?
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            Create your free account and start managing projects in minutes.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 sm:flex-row sm:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 512 512" aria-hidden="true">
              <defs>
                <linearGradient id="tf-ft-bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
                  <stop offset="0%"  stopColor="#4338CA" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="114" fill="url(#tf-ft-bg)" />
              <rect x="84"  y="146" width="344" height="80"  rx="20" fill="white" />
              <rect x="216" y="146" width="80"  height="234" rx="20" fill="white" />
            </svg>
            <span className="text-sm font-medium text-zinc-500">TaskFlow</span>
          </div>

          {/* Copyright — centered on all breakpoints */}
          <p className="order-last text-center text-xs text-zinc-600 sm:order-0">
            © 2026 TaskFlow. All rights reserved.
          </p>

          {/* Social / contact links */}
          <div className="flex items-center gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/aparedesp2003"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/andresparedesp/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:aaparedesp@outlook.com"
              aria-label="Email"
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
