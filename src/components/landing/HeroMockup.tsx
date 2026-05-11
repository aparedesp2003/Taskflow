const NAV_ITEMS = [
  {
    label: "Dashboard",
    active: false,
    path: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  },
  {
    label: "Projects",
    active: true,
    path: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    label: "Tasks",
    active: false,
    path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4-1v2m0 0h4m-4 0H9m6 4H9m6 4H9",
  },
  {
    label: "Team",
    active: false,
    path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    label: "Settings",
    active: false,
    path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

const TODO_TASKS = [
  { title: "Design system tokens", priority: "high",   tag: "Design"  },
  { title: "Write API docs",       priority: "medium", tag: "Docs"    },
  { title: "Set up CI/CD",         priority: "low",    tag: "DevOps"  },
];

const INPROGRESS_TASKS = [
  { title: "Redesign dashboard",   priority: "high",   tag: "Design"   },
  { title: "Drag & drop support",  priority: "high",   tag: "Frontend" },
  { title: "Auth middleware",      priority: "medium", tag: "Backend"  },
];

const DONE_TASKS = [
  { title: "Project kickoff",      priority: "medium", tag: "Planning" },
  { title: "Database schema",      priority: "high",   tag: "Backend"  },
  { title: "Landing page copy",    priority: "low",    tag: "Content"  },
];

const TEAM = [
  { initial: "A", name: "Andres P.",  role: "Owner",  color: "bg-indigo-500" },
  { initial: "M", name: "Maria L.",   role: "Editor", color: "bg-pink-500"   },
  { initial: "C", name: "Carlos R.",  role: "Viewer", color: "bg-emerald-500"},
];

function PriorityBadge({ priority }: { priority: string }) {
  const cls =
    priority === "high"
      ? "bg-red-500/15 text-red-400"
      : priority === "medium"
        ? "bg-amber-500/15 text-amber-400"
        : "bg-zinc-800 text-zinc-500";
  return (
    <span className={`rounded px-1.5 py-0.5 text-[7px] font-medium ${cls}`}>
      {priority}
    </span>
  );
}

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[7px] text-indigo-400">
      {tag}
    </span>
  );
}

function TaskCard({
  title,
  priority,
  tag,
  done = false,
}: {
  title: string;
  priority: string;
  tag: string;
  done?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-sm ${done ? "opacity-60" : ""}`}
    >
      <p
        className={`mb-1.5 text-[9px] font-medium leading-snug ${done ? "text-zinc-500 line-through" : "text-zinc-300"}`}
      >
        {title}
      </p>
      <div className="flex items-center justify-between">
        {done ? (
          <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[7px] text-emerald-400">
            done
          </span>
        ) : (
          <PriorityBadge priority={priority} />
        )}
        <TagBadge tag={tag} />
      </div>
    </div>
  );
}

export default function HeroMockup() {
  return (
    /* Outer glow wrapper */
    <div className="relative">
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-indigo-500/10 blur-2xl" />

      {/* Browser frame */}
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-950 shadow-[0_32px_96px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{ aspectRatio: "16 / 10" }}
      >
        {/* Chrome bar */}
        <div className="flex h-[5%] min-h-[28px] items-center gap-2 border-b border-zinc-800/80 bg-zinc-900 px-3">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-red-400/50" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/50" />
            <div className="h-2 w-2 rounded-full bg-green-400/50" />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="flex items-center gap-1.5 rounded bg-zinc-800 px-2.5 py-0.5">
              <div className="h-1 w-1 rounded-full bg-green-400" />
              <span className="text-[8px] text-zinc-500">taskflow.app/projects/product-redesign</span>
            </div>
          </div>
        </div>

        {/* App shell */}
        <div className="flex" style={{ height: "95%" }}>

          {/* ── Sidebar ── */}
          <div className="flex w-[15%] flex-col border-r border-zinc-800/60 bg-zinc-950 px-2 py-3">
            {/* Logo */}
            <div className="mb-5 flex items-center gap-1.5 px-1">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-600">
                <svg width="10" height="10" viewBox="0 0 28 28" fill="none">
                  <rect x="2"  y="2"  width="11" height="11" rx="2.5" fill="white" opacity="0.9" />
                  <rect x="15" y="2"  width="11" height="11" rx="2.5" fill="white" opacity="0.6" />
                  <rect x="2"  y="15" width="11" height="11" rx="2.5" fill="white" opacity="0.6" />
                  <rect x="15" y="15" width="11" height="11" rx="2.5" fill="white" opacity="0.4" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-white">TaskFlow</span>
            </div>

            {/* Nav items */}
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                    item.active
                      ? "bg-indigo-600/20 text-indigo-400"
                      : "text-zinc-600"
                  }`}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.path} />
                  </svg>
                  <span className="text-[8px] font-medium">{item.label}</span>
                  {item.active && (
                    <div className="ml-auto h-1 w-1 rounded-full bg-indigo-400" />
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom avatar */}
            <div className="mt-auto flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[6px] font-bold text-white">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-[7px] font-medium text-zinc-300">Andres P.</p>
                <p className="text-[6px] text-zinc-600">Pro Plan</p>
              </div>
            </div>
          </div>

          {/* ── Main ── */}
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Topbar */}
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/60 bg-zinc-900/40 px-3 py-1.5">
              <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                <span className="text-[8px] text-zinc-600">Search tasks and projects...</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Bell */}
                <div className="relative flex h-5 w-5 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
                  </svg>
                  <div className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </div>
                {/* CTA */}
                <div className="rounded-lg bg-indigo-600 px-2 py-1 text-[8px] font-semibold text-white">
                  + New Task
                </div>
                {/* Avatar */}
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[7px] font-bold text-white">
                  A
                </div>
              </div>
            </div>

            {/* Page content */}
            <div className="flex flex-1 gap-3 overflow-hidden p-3">

              {/* ── Kanban area ── */}
              <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                {/* Project header */}
                <div className="flex shrink-0 items-start justify-between">
                  <div>
                    <h1 className="text-[11px] font-bold text-white">Product Redesign</h1>
                    <p className="text-[8px] text-zinc-500">Active · Due Jun 30, 2026</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[7px] font-medium text-blue-400">
                      Active
                    </span>
                    <div className="rounded border border-zinc-700 px-1.5 py-0.5 text-[7px] text-zinc-400">
                      Edit
                    </div>
                  </div>
                </div>

                {/* KPI strip */}
                <div className="grid shrink-0 grid-cols-4 gap-1.5">
                  {[
                    { label: "Total Tasks", value: "12" },
                    { label: "To Do",       value: "3"  },
                    { label: "In Progress", value: "3"  },
                    { label: "Completed",   value: "3"  },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-1.5"
                    >
                      <p className="text-[7px] text-zinc-500">{s.label}</p>
                      <p className="text-[13px] font-bold text-white">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Kanban columns */}
                <div className="grid flex-1 grid-cols-3 gap-2 overflow-hidden">

                  {/* To Do */}
                  <div className="flex flex-col gap-1.5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-2">
                    <div className="flex shrink-0 items-center justify-between px-0.5">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                        <span className="text-[8px] font-semibold text-zinc-400">To Do</span>
                      </div>
                      <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[7px] text-zinc-500">3</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {TODO_TASKS.map((t) => (
                        <TaskCard key={t.title} {...t} />
                      ))}
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="flex flex-col gap-1.5 overflow-hidden rounded-xl border border-indigo-500/25 bg-indigo-950/30 p-2 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]">
                    <div className="flex shrink-0 items-center justify-between px-0.5">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                        <span className="text-[8px] font-semibold text-indigo-300">In Progress</span>
                      </div>
                      <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[7px] text-indigo-400">3</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {INPROGRESS_TASKS.map((t) => (
                        <TaskCard key={t.title} {...t} />
                      ))}
                    </div>
                  </div>

                  {/* Done */}
                  <div className="flex flex-col gap-1.5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-2">
                    <div className="flex shrink-0 items-center justify-between px-0.5">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[8px] font-semibold text-emerald-300">Done</span>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[7px] text-emerald-400">3</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {DONE_TASKS.map((t) => (
                        <TaskCard key={t.title} {...t} done />
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Right panel ── */}
              <div className="flex w-[18%] shrink-0 flex-col gap-2 overflow-hidden">

                {/* Project details */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5">
                  <p className="mb-2 text-[7px] font-semibold uppercase tracking-wider text-zinc-500">
                    Project Details
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] text-zinc-500">Status</span>
                      <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[6px] font-medium text-blue-400">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] text-zinc-500">Due date</span>
                      <span className="text-[7px] text-zinc-300">Jun 30, 2026</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] text-zinc-500">Created</span>
                      <span className="text-[7px] text-zinc-300">May 1, 2026</span>
                    </div>
                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[7px] text-zinc-500">Progress</span>
                        <span className="text-[7px] text-zinc-400">42%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                        <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5">
                  <p className="mb-2 text-[7px] font-semibold uppercase tracking-wider text-zinc-500">
                    Team
                  </p>
                  <div className="space-y-2">
                    {TEAM.map((m) => (
                      <div key={m.name} className="flex items-center gap-1.5">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${m.color} text-[6px] font-bold text-white`}
                        >
                          {m.initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[8px] text-zinc-300">{m.name}</p>
                          <p className="text-[6px] text-zinc-600">{m.role}</p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-1 w-full rounded-lg border border-dashed border-zinc-700 py-1 text-center text-[7px] text-zinc-600">
                      + Invite member
                    </div>
                  </div>
                </div>

                {/* Recent activity stub */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5">
                  <p className="mb-2 text-[7px] font-semibold uppercase tracking-wider text-zinc-500">
                    Recent Activity
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { dot: "bg-indigo-400", text: "Task moved to In Progress" },
                      { dot: "bg-emerald-400", text: "Database schema completed" },
                      { dot: "bg-zinc-500",    text: "Maria joined the project" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <div className={`mt-1 h-1 w-1 shrink-0 rounded-full ${item.dot}`} />
                        <p className="text-[7px] leading-tight text-zinc-500">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-zinc-950/90 to-transparent" />
      </div>
    </div>
  );
}
