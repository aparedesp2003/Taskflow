import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import ProjectList from "@/components/projects/ProjectList";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
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

  const { data: rows, error } = await supabase
    .from("projects")
    .select("id, user_id, name, description, status, due_date, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch projects:", error.message);
  }

  const projects: Project[] = (rows ?? [])
    .filter((row: ProjectRow) => row.user_id === user.id)
    .map((row: ProjectRow) => ({
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
            day: "numeric",
            year: "numeric",
          })
        : "",
      createdAt: row.created_at,
    }));

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage and track all your active projects.</p>
        </div>
        <CreateProjectModal />
      </div>

      <ProjectList projects={projects} />
    </AppShell>
  );
}
