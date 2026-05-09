import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import ProjectList from "@/components/projects/ProjectList";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import type { Project } from "@/types/project";

const mockProjects: Project[] = [
  {
    id: "1",
    name: "TaskFlow Redesign",
    description: "Full redesign of the TaskFlow dashboard, including a new design system, updated components, and improved UX flows.",
    status: "Active",
    category: "Frontend",
    progress: 68,
    taskCount: 12,
    dueDate: "May 30, 2026",
    createdAt: "2026-04-01",
  },
  {
    id: "2",
    name: "API Integration",
    description: "Connect the front-end to the production REST API, implement error handling, and add request caching.",
    status: "Active",
    category: "Backend",
    progress: 42,
    taskCount: 7,
    dueDate: "Jun 10, 2026",
    createdAt: "2026-04-15",
  },
  {
    id: "3",
    name: "Marketing Site",
    description: "Build and deploy the public-facing marketing landing page with hero section, features, pricing, and contact form.",
    status: "Completed",
    category: "Marketing",
    progress: 100,
    taskCount: 24,
    dueDate: "Apr 20, 2026",
    createdAt: "2026-03-01",
  },
  {
    id: "4",
    name: "Mobile App",
    description: "Initial planning and architecture for the React Native mobile companion app targeting iOS and Android.",
    status: "Planning",
    category: "Mobile",
    progress: 10,
    taskCount: 3,
    dueDate: "Aug 1, 2026",
    createdAt: "2026-05-01",
  },
  {
    id: "5",
    name: "Analytics Dashboard",
    description: "Internal analytics panel for tracking user activity, project metrics, and task completion rates over time.",
    status: "On Hold",
    category: "Analytics",
    progress: 25,
    taskCount: 9,
    dueDate: "Jul 15, 2026",
    createdAt: "2026-04-20",
  },
  {
    id: "6",
    name: "Auth & Permissions",
    description: "Role-based access control, team member invites, and permission scoping per project and workspace.",
    status: "Planning",
    category: "Infrastructure",
    progress: 5,
    taskCount: 6,
    dueDate: "Sep 1, 2026",
    createdAt: "2026-05-05",
  },
];

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage and track all your active projects.</p>
        </div>
        <CreateProjectModal />
      </div>

      <ProjectList projects={mockProjects} />
    </AppShell>
  );
}
