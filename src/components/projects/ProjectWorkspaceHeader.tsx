import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import type { Project } from "@/types/project";
import { getProjectStatusFromProgress } from "@/utils/project";

type ProjectWorkspaceHeaderProps = {
  project: Project;
};

export default function ProjectWorkspaceHeader({ project }: ProjectWorkspaceHeaderProps) {
  const progressStatus = getProjectStatusFromProgress(project.progress);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
        <Badge label={progressStatus.label} variant={progressStatus.variant} />
      </div>

      {project.description && (
        <p className="mt-1 text-sm text-zinc-400">{project.description}</p>
      )}

      <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
        {project.dueDate && (
          <div className="flex items-center gap-1.5">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Due {project.dueDate}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <svg
            width="13"
            height="13"
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
          <span>Created {project.createdAt}</span>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Progress</span>
          <span className="font-medium text-zinc-400">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
      </div>
    </div>
  );
}
