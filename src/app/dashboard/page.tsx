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

type ProjectRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
};

type UpcomingTaskRow = {
  id: string;
  title: string;
  priority: string;
  due_date: string;
  project_id: string;
};

type StatItem = {
  label: string;
  value: number;
  icon: ReactNode;
  insight: string;
  insightVariant: InsightVariant;
};

const projectStatusVariant: Record<string, BadgeVariant> = {
  Planning: "default",
  Active: "info",
  Completed: "success",
  "On Hold": "warning",
};

const taskPriorityVariant: Record<string, BadgeVariant> = {
  low: "default",
  medium: "warning",
  high: "danger",
};

const taskPriorityLabel: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Step 1: Fetch all accessible projects — RLS returns owned + shared projects
  const { data: rawProjects } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, created_at")
    .order("created_at", { ascending: false });

  const projectRows: ProjectRow[] = (rawProjects ?? []) as ProjectRow[];

  const totalProjects = projectRows.length;
  const recentProjectRows = projectRows.slice(0, 4);
  const projectIds = projectRows.map((r) => r.id);
  const projectNameMap = Object.fromEntries(
    projectRows.map((r) => [r.id, r.name]),
  );

  // Step 2: Task queries — skipped entirely if user has no projects
  let inProgressCount = 0;
  let doneCount = 0;
  let upcomingTaskRows: UpcomingTaskRow[] = [];

  if (projectIds.length > 0) {
    const [inProgressResult, doneResult, upcomingResult] = await Promise.all([
      supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .in("project_id", projectIds)
        .eq("status", "in_progress"),
      supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .in("project_id", projectIds)
        .eq("status", "done"),
      supabase
        .from("tasks")
        .select("id, title, priority, due_date, project_id")
        .in("project_id", projectIds)
        .not("due_date", "is", null)
        .neq("status", "done")
        .order("due_date", { ascending: true })
        .limit(5),
    ]);

    inProgressCount = inProgressResult.count ?? 0;
    doneCount = doneResult.count ?? 0;
    upcomingTaskRows = (upcomingResult.data ?? []) as UpcomingTaskRow[];
  }

  const stats: StatItem[] = [
    {
      label: "Total Projects",
      value: totalProjects,
      insight: "Active workspace",
      insightVariant: "neutral",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Tasks In Progress",
      value: inProgressCount,
      insight: "Currently active",
      insightVariant: "warning",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Completed Tasks",
      value: doneCount,
      insight: "Finished work",
      insightVariant: "positive",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
  ];

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
              <h2 className="text-sm font-semibold text-white">
                Recent Projects
              </h2>
            </div>
            <ul>
              {recentProjectRows.length === 0 ? (
                <li className="px-6 py-8 text-center text-xs text-zinc-600">
                  No projects yet
                </li>
              ) : (
                recentProjectRows.map((project, index) => (
                  <li
                    key={project.id}
                    className={`flex items-center justify-between px-6 py-3 transition-colors hover:bg-zinc-800/40 ${
                      index !== recentProjectRows.length - 1
                        ? "border-b border-zinc-800/60"
                        : ""
                    }`}
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium text-white">
                        {project.name}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {project.description ?? "No description"}
                      </p>
                    </div>
                    <Badge
                      label={project.status}
                      variant={
                        projectStatusVariant[project.status] ?? "default"
                      }
                    />
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card>
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">
                Upcoming Tasks
              </h2>
            </div>
            <ul>
              {upcomingTaskRows.length === 0 ? (
                <li className="px-6 py-8 text-center text-xs text-zinc-600">
                  No upcoming tasks
                </li>
              ) : (
                upcomingTaskRows.map((task, index) => {
                  const formattedDue = new Date(
                    task.due_date + "T00:00:00",
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  const projectName =
                    projectNameMap[task.project_id] ?? "Unknown";
                  return (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between px-6 py-3 transition-colors hover:bg-zinc-800/40 ${
                        index !== upcomingTaskRows.length - 1
                          ? "border-b border-zinc-800/60"
                          : ""
                      }`}
                    >
                      <div className="min-w-0 pr-4">
                        <p className="text-sm font-medium text-white">
                          {task.title}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {projectName} · {formattedDue}
                        </p>
                      </div>
                      <Badge
                        label={
                          taskPriorityLabel[task.priority] ?? task.priority
                        }
                        variant={
                          taskPriorityVariant[task.priority] ?? "default"
                        }
                      />
                    </li>
                  );
                })
              )}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
