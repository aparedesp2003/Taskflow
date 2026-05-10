"use client";

import { useDroppable } from "@dnd-kit/core";
import Card from "@/components/ui/Card";
import TaskCard from "@/components/tasks/TaskCard";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import type { Task, TaskStatus } from "@/types/task";

type TaskColumnProps = {
  label:         string;
  color:         string;
  tasks:         Task[];
  projectId:     string;
  defaultStatus: TaskStatus;
};

export default function TaskColumn({
  label,
  color,
  tasks,
  projectId,
  defaultStatus,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: defaultStatus });

  return (
    <div ref={setNodeRef}>
      <Card
        className={`flex min-h-96 flex-col transition-colors duration-150 ${
          isOver ? "border-indigo-500/40 bg-indigo-500/5" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>
            {label}
          </span>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-500">
            {tasks.length}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-3">
          {tasks.length === 0 ? (
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
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>

        <div className="border-t border-zinc-800 px-3 py-3">
          <AddTaskModal projectId={projectId} defaultStatus={defaultStatus} />
        </div>
      </Card>
    </div>
  );
}
