"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

type SearchProject = {
  id:     string;
  name:   string;
  status: string;
};

type SearchTask = {
  id:          string;
  title:       string;
  priority:    string;
  project_id:  string;
  projectName: string;
};

type AllProjectRow = {
  id:   string;
  name: string;
};

const projectStatusVariant: Record<string, BadgeVariant> = {
  Planning:  "default",
  Active:    "info",
  Completed: "success",
  "On Hold": "warning",
};

const taskPriorityVariant: Record<string, BadgeVariant> = {
  low:    "default",
  medium: "warning",
  high:   "danger",
};

const taskPriorityLabel: Record<string, string> = {
  low:    "Low",
  medium: "Medium",
  high:   "High",
};

export default function SearchBox() {
  const router = useRouter();

  const [query,     setQuery]     = useState("");
  const [projects,  setProjects]  = useState<SearchProject[]>([]);
  const [tasks,     setTasks]     = useState<SearchTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen,    setIsOpen]    = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    setIsLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsLoading(false);
      return;
    }

    // RLS returns owned + shared projects — no ownership filter needed
    const [projectSearchResult, allProjectsResult] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name, status")
        .ilike("name", `%${q}%`)
        .limit(5),
      supabase
        .from("projects")
        .select("id, name"),
    ]);

    const matchedProjects: SearchProject[] = (projectSearchResult.data ?? []) as SearchProject[];

    const allProjects = (allProjectsResult.data ?? []) as AllProjectRow[];
    const projectIds  = allProjects.map((p) => p.id);
    const nameMap     = Object.fromEntries(allProjects.map((p) => [p.id, p.name]));

    let matchedTasks: SearchTask[] = [];

    if (projectIds.length > 0) {
      const { data: taskData } = await supabase
        .from("tasks")
        .select("id, title, priority, project_id")
        .in("project_id", projectIds)
        .ilike("title", `%${q}%`)
        .limit(5);

      matchedTasks = ((taskData ?? []) as Omit<SearchTask, "projectName">[]).map((t) => ({
        ...t,
        projectName: nameMap[t.project_id] ?? "Unknown",
      }));
    }

    setProjects(matchedProjects);
    setTasks(matchedTasks);
    setIsLoading(false);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setProjects([]);
      setTasks([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => { search(trimmed); }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function handleSelect(href: string) {
    router.push(href);
    setQuery("");
    setIsOpen(false);
  }

  const hasResults = projects.length > 0 || tasks.length > 0;

  return (
    <div ref={containerRef} className="relative w-80">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects or tasks..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-1.5 pl-9 pr-4 text-sm text-zinc-300 outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-500"
      />

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60">
          {isLoading ? (
            <div className="px-4 py-3 text-xs text-zinc-500">Searching...</div>
          ) : hasResults ? (
            <>
              {projects.length > 0 && (
                <div>
                  <div className="border-b border-zinc-800 px-4 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Projects
                    </span>
                  </div>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => handleSelect(`/projects/${project.id}`)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-800/60"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 text-zinc-500"
                        >
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="truncate text-sm text-zinc-200">{project.name}</span>
                      </div>
                      <Badge
                        label={project.status}
                        variant={projectStatusVariant[project.status] ?? "default"}
                      />
                    </button>
                  ))}
                </div>
              )}

              {tasks.length > 0 && (
                <div className={projects.length > 0 ? "border-t border-zinc-800" : ""}>
                  <div className="border-b border-zinc-800 px-4 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Tasks
                    </span>
                  </div>
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => handleSelect(`/projects/${task.project_id}`)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-800/60"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 text-zinc-500"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M9 21V9" />
                        </svg>
                        <div className="min-w-0">
                          <p className="truncate text-sm text-zinc-200">{task.title}</p>
                          <p className="truncate text-xs text-zinc-500">{task.projectName}</p>
                        </div>
                      </div>
                      <Badge
                        label={taskPriorityLabel[task.priority] ?? task.priority}
                        variant={taskPriorityVariant[task.priority] ?? "default"}
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-5 text-center text-xs text-zinc-500">
              No results for &ldquo;{query.trim()}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
