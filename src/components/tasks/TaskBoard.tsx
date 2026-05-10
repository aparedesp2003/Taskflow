"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createClient } from "@/lib/supabase/client";
import TaskColumn from "@/components/tasks/TaskColumn";
import type { Task, TaskStatus } from "@/types/task";

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "todo",        label: "To Do",       color: "text-zinc-400"    },
  { status: "in_progress", label: "In Progress",  color: "text-amber-400"  },
  { status: "done",        label: "Done",         color: "text-emerald-400" },
];

type TaskBoardProps = {
  tasks:     Task[];
  projectId: string;
};

export default function TaskBoard({ tasks, projectId }: TaskBoardProps) {
  const router = useRouter();

  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dragError,  setDragError]  = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function onDragStart(event: DragStartEvent) {
    const task = localTasks.find((t) => t.id === (event.active.id as string));
    setActiveTask(task ?? null);
    setDragError(null);
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || isUpdating) return;

    const taskId    = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task      = localTasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    const previousTasks = localTasks;
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    setIsUpdating(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId)
      .eq("project_id", task.projectId)
      .select()
      .single();

    setIsUpdating(false);

    if (error) {
      setLocalTasks(previousTasks);
      setDragError("Failed to update task status. Please try again.");
      return;
    }

    router.refresh();
  }

  if (!hasMounted) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white">Task Board</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="flex min-h-96 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-500">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-zinc-700"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      <p className="text-xs text-zinc-600">No tasks yet</p>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                      >
                        <p className="text-sm font-medium text-white">{task.title}</p>
                        {task.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                            {task.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={`space-y-4${isUpdating ? " cursor-wait" : ""}`}>
        <h2 className="text-sm font-semibold text-white">Task Board</h2>

        {dragError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            {dragError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.status}
              label={col.label}
              color={col.color}
              tasks={localTasks.filter((t) => t.status === col.status)}
              projectId={projectId}
              defaultStatus={col.status}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-1 cursor-grabbing rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl shadow-black/50">
            <p className="text-sm font-medium text-white">{activeTask.title}</p>
            {activeTask.description && (
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                {activeTask.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
