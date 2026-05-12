"use client";

import { useState } from "react";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectList from "@/components/projects/ProjectList";
import type { Project } from "@/types/project";

type ProjectsPageClientProps = {
  projects: Project[];
};

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage and track all your active projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="shrink-0 rounded-lg border border-indigo-500/60 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:border-indigo-400 hover:bg-indigo-500/10"
        >
          + New Project
        </button>
      </div>

      <ProjectList projects={projects} onCreateProject={() => setIsOpen(true)} />

      <CreateProjectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
