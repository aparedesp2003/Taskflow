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

  const projects: Project[] = (rows ?? []).map((row: ProjectRow) => ({
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
    createdAt: row.created_at,
    isShared:  row.user_id !== user.id,
  }));

  return (
    <AppShell>
      <ProjectsPageClient projects={projects} />
    </AppShell>
  );
}
