import Link from "next/link";
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

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="flex flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-black/30">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug text-white group-hover:text-indigo-300 transition-colors duration-200">
            {project.name}
          </h3>
          <Badge label={project.status} variant={statusVariant[project.status]} />
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
          {project.category}
        </p>

        <p className="text-xs leading-relaxed text-zinc-300 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span className="font-medium text-zinc-400">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span>{project.taskCount} tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{project.dueDate}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
