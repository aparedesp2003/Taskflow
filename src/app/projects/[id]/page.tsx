import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import StatsCard from "@/components/dashboard/StatsCard";
import ProjectWorkspaceHeader from "@/components/projects/ProjectWorkspaceHeader";
import TaskBoard from "@/components/tasks/TaskBoard";
import ProjectDetailsCard from "@/components/projects/ProjectDetailsCard";
import type { Project, ProjectStatus } from "@/types/project";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";

type ProjectRow = {
  id:          string;
  user_id:     string;
  name:        string;
  description: string | null;
  status:      string;
  due_date:    string | null;
  created_at:  string;
};

type TaskRow = {
  id:          string;
  project_id:  string;
  title:       string;
  description: string | null;
  status:      string;
  priority:    string;
  due_date:    string | null;
  created_at:  string;
};

type KpiStat = {
  label: string;
  value: number;
  icon:  ReactNode;
};

function ProjectNotFound() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-600">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm font-medium text-zinc-300">Project not found</p>
        <p className="mt-1 text-xs text-zinc-600">
          This project doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/projects"
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Back to Projects
        </Link>
      </div>
    </AppShell>
  );
}

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, due_date, created_at")
    .eq("id", id)
    .maybeSingle();

  const row = data as ProjectRow | null;

  if (!row || row.user_id !== user.id) {
    return <ProjectNotFound />;
  }

  const project: Project = {
    id:          row.id,
    name:        row.name,
    description: row.description ?? "",
    status:      row.status as ProjectStatus,
    category:    "",
    progress:    0,
    taskCount:   0,
    dueDate:     row.due_date
      ? new Date(row.due_date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day:   "numeric",
          year:  "numeric",
        })
      : "",
    createdAt: new Date(row.created_at).toLocaleDateString("en-US", {
      month: "short",
      day:   "numeric",
      year:  "numeric",
    }),
  };

  const { data: taskRows, error: tasksError } = await supabase
    .from("tasks")
    .select("id, project_id, title, description, status, priority, due_date, created_at")
    .eq("project_id", row.id)
    .order("created_at", { ascending: true });

  if (tasksError) {
    console.error("Failed to fetch tasks:", tasksError.message);
  }

  const tasks: Task[] = (taskRows ?? []).map((t: TaskRow) => ({
    id:          t.id,
    projectId:   t.project_id,
    title:       t.title,
    description: t.description ?? "",
    status:      t.status   as TaskStatus,
    priority:    t.priority as TaskPriority,
    dueDate:     t.due_date ?? "",
    createdAt: t.created_at,
  }));

  const totalTasks   = tasks.length;
  const todoCount    = tasks.filter((t) => t.status === "todo").length;
  const inProgCount  = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount    = tasks.filter((t) => t.status === "done").length;

  const kpiStats: KpiStat[] = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "To Do",
      value: todoCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    },
    {
      label: "In Progress",
      value: inProgCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: doneCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <AppShell>
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/projects"
          className="text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Projects
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="font-medium text-zinc-300">{project.name}</span>
      </nav>

      <div className="space-y-8">
        <ProjectWorkspaceHeader project={project} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {kpiStats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TaskBoard tasks={tasks} projectId={project.id} />
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ProjectDetailsCard project={project} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
