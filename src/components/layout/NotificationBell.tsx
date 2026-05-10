"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

type NotificationType = "overdue" | "due_today";

type NotificationItem = {
  id:          string;
  type:        NotificationType;
  title:       string;
  projectId:   string;
  projectName: string;
  dueDate:     string;
  priority:    string;
};

type ProjectRow = { id: string; name: string };
type TaskRow    = { id: string; title: string; priority: string; due_date: string; project_id: string };

const priorityVariant: Record<string, BadgeVariant> = {
  low:    "default",
  medium: "warning",
  high:   "danger",
};

const priorityLabel: Record<string, string> = {
  low:    "Low",
  medium: "Medium",
  high:   "High",
};

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-zinc-700" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-3/5 animate-pulse rounded bg-zinc-700" />
        <div className="h-2.5 w-2/5 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="h-5 w-12 animate-pulse rounded-full bg-zinc-800" />
    </div>
  );
}

export default function NotificationBell() {
  const router = useRouter();

  const [isOpen,     setIsOpen]     = useState(false);
  const [items,      setItems]      = useState<NotificationItem[]>([]);
  const [isLoading,  setIsLoading]  = useState(false);

  const containerRef  = useRef<HTMLDivElement>(null);
  const fetchIdRef    = useRef(0);
  const hasFetchedRef = useRef(false);

  async function fetchNotifications(silent: boolean) {
    const fetchId      = ++fetchIdRef.current;
    const showSkeleton = !silent && !hasFetchedRef.current;

    let skeletonTimer: ReturnType<typeof setTimeout> | null = null;
    if (showSkeleton) {
      skeletonTimer = setTimeout(() => {
        if (fetchId === fetchIdRef.current) setIsLoading(true);
      }, 150);
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || fetchId !== fetchIdRef.current) {
      if (skeletonTimer) clearTimeout(skeletonTimer);
      return;
    }

    const { data: projectData } = await supabase
      .from("projects")
      .select("id, name")
      .eq("user_id", user.id);

    if (fetchId !== fetchIdRef.current) {
      if (skeletonTimer) clearTimeout(skeletonTimer);
      return;
    }

    const projects   = (projectData ?? []) as ProjectRow[];
    const projectIds = projects.map((p) => p.id);
    const nameMap    = Object.fromEntries(projects.map((p) => [p.id, p.name]));

    if (projectIds.length === 0) {
      if (skeletonTimer) clearTimeout(skeletonTimer);
      setIsLoading(false);
      setItems([]);
      hasFetchedRef.current = true;
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const [overdueResult, dueTodayResult] = await Promise.all([
      supabase
        .from("tasks")
        .select("id, title, priority, due_date, project_id")
        .in("project_id", projectIds)
        .lt("due_date", today)
        .neq("status", "done")
        .order("due_date", { ascending: true })
        .limit(10),
      supabase
        .from("tasks")
        .select("id, title, priority, due_date, project_id")
        .in("project_id", projectIds)
        .eq("due_date", today)
        .neq("status", "done")
        .limit(10),
    ]);

    if (fetchId !== fetchIdRef.current) {
      if (skeletonTimer) clearTimeout(skeletonTimer);
      return;
    }

    function toItems(rows: TaskRow[], type: NotificationType): NotificationItem[] {
      return rows.map((t) => ({
        id:          t.id,
        type,
        title:       t.title,
        projectId:   t.project_id,
        projectName: nameMap[t.project_id] ?? "Unknown",
        dueDate:     t.due_date,
        priority:    t.priority,
      }));
    }

    const nextItems = [
      ...toItems((overdueResult.data  ?? []) as TaskRow[], "overdue"),
      ...toItems((dueTodayResult.data ?? []) as TaskRow[], "due_today"),
    ];

    if (skeletonTimer) clearTimeout(skeletonTimer);
    setIsLoading(false);
    setItems(nextItems);
    hasFetchedRef.current = true;
  }

  useEffect(() => {
    fetchNotifications(true);
    // intentionally empty deps — runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(projectId: string) {
    router.push(`/projects/${projectId}`);
    setIsOpen(false);
  }

  const overdueItems  = items.filter((i) => i.type === "overdue");
  const dueTodayItems = items.filter((i) => i.type === "due_today");
  const badgeCount    = items.length;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {badgeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-4 text-white">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60">
          <div className="border-b border-zinc-800 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-600"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-sm font-medium text-zinc-400">You&apos;re all caught up</p>
                <p className="text-xs text-zinc-600">No overdue or due-today tasks</p>
              </div>
            ) : (
              <>
                {overdueItems.length > 0 && (
                  <div>
                    <div className="border-b border-zinc-800/60 px-4 py-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                        Overdue
                      </span>
                    </div>
                    {overdueItems.map((item) => (
                      <NotificationRow key={item.id} item={item} onSelect={handleSelect} />
                    ))}
                  </div>
                )}

                {dueTodayItems.length > 0 && (
                  <div className={overdueItems.length > 0 ? "border-t border-zinc-800" : ""}>
                    <div className="border-b border-zinc-800/60 px-4 py-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        Due Today
                      </span>
                    </div>
                    {dueTodayItems.map((item) => (
                      <NotificationRow key={item.id} item={item} onSelect={handleSelect} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type NotificationRowProps = {
  item:     NotificationItem;
  onSelect: (projectId: string) => void;
};

function NotificationRow({ item, onSelect }: NotificationRowProps) {
  const formattedDate = new Date(item.dueDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
  });

  const dotColor  = item.type === "overdue" ? "bg-red-400" : "bg-amber-400";
  const dateLabel = item.type === "due_today" ? "Today" : formattedDate;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.projectId)}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/60"
    >
      <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">{item.title}</p>
        <p className="truncate text-xs text-zinc-500">
          {item.projectName} · {dateLabel}
        </p>
      </div>
      <Badge
        label={priorityLabel[item.priority] ?? item.priority}
        variant={priorityVariant[item.priority] ?? "default"}
      />
    </button>
  );
}
