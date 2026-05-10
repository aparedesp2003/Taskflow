"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import type { BadgeVariant } from "@/components/ui/Badge";
import type { Task, TaskPriority } from "@/types/task";

const priorityVariant: Record<TaskPriority, BadgeVariant> = {
  low:    "default",
  medium: "warning",
  high:   "danger",
};

const priorityLabel: Record<TaskPriority, string> = {
  low:    "Low",
  medium: "Medium",
  high:   "High",
};

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id:   task.id,
    data: { task },
  });

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day:   "numeric",
        year:  "numeric",
      })
    : "";

  return (
    <>
      <div
        ref={setNodeRef}
        style={transform ? { transform: CSS.Transform.toString(transform) } : undefined}
        className="touch-none"
        {...listeners}
        {...attributes}
        onClick={() => !isDragging && setIsOpen(true)}
      >
        <Card
          className={`p-4 transition-transform duration-150 ${
            isDragging
              ? "opacity-30 cursor-grabbing"
              : "cursor-grab hover:-translate-y-0.5"
          }`}
        >
          <p className="text-sm font-medium text-white">{task.title}</p>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{task.description}</p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <Badge
              label={priorityLabel[task.priority]}
              variant={priorityVariant[task.priority]}
            />

            {formattedDueDate && (
              <div className="flex items-center gap-1 text-xs text-zinc-600">
                <svg
                  width="11"
                  height="11"
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
                <span>{formattedDueDate}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <EditTaskModal
        task={task}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
