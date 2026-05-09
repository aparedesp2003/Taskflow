import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import type { InsightVariant } from "@/components/dashboard/StatsCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

// --- Mock data (replace with real hooks when ready) ---

type StatItem = {
  label: string;
  value: number;
  icon: ReactNode;
  insight: string;
  insightVariant: InsightVariant;
};

const stats: StatItem[] = [
  {
    label: "Total Projects",
    value: 8,
    insight: "+2 created this week",
    insightVariant: "positive",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Tasks In Progress",
    value: 14,
    insight: "4 due today",
    insightVariant: "warning",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Completed Tasks",
    value: 37,
    insight: "+12 finished this week",
    insightVariant: "positive",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

type MockProject = {
  id: number;
  name: string;
  status: string;
  taskCount: number;
  variant: BadgeVariant;
};

const recentProjects: MockProject[] = [
  { id: 1, name: "TaskFlow Redesign", status: "Active", taskCount: 12, variant: "info" },
  { id: 2, name: "API Integration", status: "In Progress", taskCount: 7, variant: "warning" },
  { id: 3, name: "Marketing Site", status: "Completed", taskCount: 24, variant: "success" },
  { id: 4, name: "Mobile App", status: "Planning", taskCount: 3, variant: "default" },
];

type MockTask = {
  id: number;
  title: string;
  project: string;
  due: string;
  priority: string;
  variant: BadgeVariant;
};

const upcomingTasks: MockTask[] = [
  { id: 1, title: "Design system tokens", project: "TaskFlow Redesign", due: "Today", priority: "High", variant: "danger" },
  { id: 2, title: "Write API docs", project: "API Integration", due: "Tomorrow", priority: "Medium", variant: "warning" },
  { id: 3, title: "Review pull requests", project: "TaskFlow Redesign", due: "May 12", priority: "Low", variant: "default" },
  { id: 4, title: "Deploy to staging", project: "API Integration", due: "May 13", priority: "High", variant: "danger" },
];

// --- Page ---

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <DashboardHeader
        title="Dashboard"
        subtitle="Here's what's happening with your projects."
      />

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              insight={stat.insight}
              insightVariant={stat.insightVariant}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
            </div>
            <ul>
              {recentProjects.map((project, index) => (
                <li
                  key={project.id}
                  className={`flex items-center justify-between px-6 py-3 transition-colors hover:bg-zinc-800/40 ${
                    index !== recentProjects.length - 1 ? "border-b border-zinc-800/60" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{project.name}</p>
                    <p className="text-xs text-zinc-500">{project.taskCount} tasks</p>
                  </div>
                  <Badge label={project.status} variant={project.variant} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Upcoming Tasks</h2>
            </div>
            <ul>
              {upcomingTasks.map((task, index) => (
                <li
                  key={task.id}
                  className={`flex items-center justify-between px-6 py-3 transition-colors hover:bg-zinc-800/40 ${
                    index !== upcomingTasks.length - 1 ? "border-b border-zinc-800/60" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <p className="text-xs text-zinc-500">
                      {task.project} · {task.due}
                    </p>
                  </div>
                  <Badge label={task.priority} variant={task.variant} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
