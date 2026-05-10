import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type MockTask = {
  title:    string;
  priority: "high" | "medium" | "low";
};

type MockColumn = {
  label: string;
  color: string;
  tasks: MockTask[];
};

const MOCK_COLUMNS: MockColumn[] = [
  {
    label: "To Do",
    color: "text-zinc-400",
    tasks: [
      { title: "Design landing page",  priority: "high"   },
      { title: "Write documentation",  priority: "low"    },
    ],
  },
  {
    label: "In Progress",
    color: "text-amber-400",
    tasks: [
      { title: "Build authentication", priority: "high"   },
      { title: "API integration",      priority: "medium" },
    ],
  },
  {
    label: "Done",
    color: "text-emerald-400",
    tasks: [
      { title: "Setup database",       priority: "medium" },
      { title: "Configure CI/CD",      priority: "low"    },
    ],
  },
];

const PRIORITY_STYLES: Record<MockTask["priority"], string> = {
  high:   "bg-red-500/10 text-red-400",
  medium: "bg-amber-500/10 text-amber-400",
  low:    "bg-zinc-800 text-zinc-400",
};

const PRIORITY_LABELS: Record<MockTask["priority"], string> = {
  high:   "High",
  medium: "Medium",
  low:    "Low",
};

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
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="2"  y="2"  width="11" height="11" rx="2.5" fill="#6366f1" />
              <rect x="15" y="2"  width="11" height="11" rx="2.5" fill="#818cf8" />
              <rect x="2"  y="15" width="11" height="11" rx="2.5" fill="#818cf8" />
              <rect x="15" y="15" width="11" height="11" rx="2.5" fill="#4338ca" />
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
          <div className="mt-[-100px] h-[600px] w-[900px] rounded-full bg-indigo-500/10 blur-3xl" />
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

        {/* Mock Dashboard Preview */}
        <div className="relative mx-auto mt-14 hidden max-w-5xl sm:block">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/[0.04]">
            {/* Browser chrome */}
            <div className="flex h-9 items-center gap-1.5 border-b border-zinc-800 bg-zinc-900/80 px-4">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <div className="ml-3 flex h-5 w-44 items-center rounded-md bg-zinc-800 px-2.5">
                <span className="text-[10px] text-zinc-600">taskflow.app/projects/website</span>
              </div>
            </div>

            {/* Mock board */}
            <div className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <p className="text-xs font-medium text-zinc-400">Website Redesign</p>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {MOCK_COLUMNS.map((col) => (
                  <div
                    key={col.label}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${col.color}`}>
                        {col.label}
                      </span>
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
                        {col.tasks.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {col.tasks.map((task) => (
                        <div
                          key={task.title}
                          className="rounded-lg border border-zinc-800 bg-zinc-900 p-2.5"
                        >
                          <p className="text-xs font-medium text-zinc-100">{task.title}</p>
                          <div className="mt-2 flex justify-end">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[task.priority]}`}>
                              {PRIORITY_LABELS[task.priority]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent" />
          </div>
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
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="2"  y="2"  width="11" height="11" rx="2.5" fill="#6366f1" />
              <rect x="15" y="2"  width="11" height="11" rx="2.5" fill="#818cf8" />
              <rect x="2"  y="15" width="11" height="11" rx="2.5" fill="#818cf8" />
              <rect x="15" y="15" width="11" height="11" rx="2.5" fill="#4338ca" />
            </svg>
            <span className="text-sm font-medium text-zinc-500">TaskFlow</span>
          </div>
          <p className="text-xs text-zinc-600">© 2025 TaskFlow. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
