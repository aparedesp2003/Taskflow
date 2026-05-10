import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import type { Project, ProjectStatus } from "@/types/project";

const statusVariant: Record<ProjectStatus, BadgeVariant> = {
  Planning: "default",
  Active: "info",
  Completed: "success",
  "On Hold": "warning",
};

type ProjectDetailsCardProps = {
  project: Project;
};

export default function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="border-b border-zinc-800 px-5 py-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Project Details
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Status</span>
            <Badge label={project.status} variant={statusVariant[project.status]} />
          </div>
          {project.dueDate && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Due date</span>
              <span className="text-xs font-medium text-zinc-300">{project.dueDate}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Created</span>
            <span className="text-xs font-medium text-zinc-300">{project.createdAt}</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Progress</span>
              <span className="text-xs font-medium text-zinc-400">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} />
          </div>
        </div>
      </div>

      <div className="border-b border-zinc-800 px-5 py-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Recent Activity
        </h2>
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-700"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <p className="text-xs text-zinc-600">No activity yet</p>
        </div>
      </div>

      <div className="px-5 py-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Quick Actions
        </h2>
        <div className="space-y-2">
          <button
            type="button"
            className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Edit Project
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-red-500/30 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            Delete Project
          </button>
        </div>
      </div>
    </Card>
  );
}
