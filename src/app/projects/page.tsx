import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import ProjectsPageClient from "@/components/projects/ProjectsPageClient";
import type { Project, ProjectStatus } from "@/types/project";

type ProjectRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS returns owned + shared projects — no ownership filter needed
  const { data: rows, error } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, due_date, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch projects:", error.message);
  }

  // Fetch task counts for every visible project in one query
  const projectIds = (rows ?? []).map((r: ProjectRow) => r.id);

  type TaskCountRow = { project_id: string; status: string };
  const taskTotals: Record<string, { total: number; done: number }> = {};

  if (projectIds.length > 0) {
    const { data: taskRows, error: taskError } = await supabase
      .from("tasks")
      .select("project_id, status")
      .in("project_id", projectIds);

    if (taskError) {
      console.error("Failed to fetch task counts:", taskError.message);
    }

    for (const t of (taskRows ?? []) as TaskCountRow[]) {
      if (!taskTotals[t.project_id]) taskTotals[t.project_id] = { total: 0, done: 0 };
      taskTotals[t.project_id].total++;
      if (t.status === "done") taskTotals[t.project_id].done++;
    }
  }

  const projects: Project[] = (rows ?? []).map((row: ProjectRow) => {
    const counts   = taskTotals[row.id] ?? { total: 0, done: 0 };
    const progress = counts.total === 0
      ? 0
      : Math.round((counts.done / counts.total) * 100);

    return {
      id:          row.id,
      name:        row.name,
      description: row.description ?? "",
      status:      row.status as ProjectStatus,
      category:    "",
      progress,
      taskCount:   counts.total,
      dueDate:     row.due_date
        ? new Date(row.due_date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day:   "numeric",
            year:  "numeric",
          })
        : "",
      createdAt: row.created_at,
      isShared:  row.user_id !== user.id,
    };
  });

  return (
    <AppShell>
      <ProjectsPageClient projects={projects} />
    </AppShell>
  );
}
