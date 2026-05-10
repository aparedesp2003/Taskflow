import TaskColumn from "@/components/tasks/TaskColumn";
import type { Task, TaskStatus } from "@/types/task";

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "todo",        label: "To Do",      color: "text-zinc-400"    },
  { status: "in_progress", label: "In Progress", color: "text-amber-400"  },
  { status: "done",        label: "Done",        color: "text-emerald-400" },
];

type TaskBoardProps = {
  tasks: Task[];
  projectId: string;
};

export default function TaskBoard({ tasks, projectId }: TaskBoardProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-white">Task Board</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <TaskColumn
            key={col.status}
            label={col.label}
            color={col.color}
            tasks={tasks.filter((t) => t.status === col.status)}
            projectId={projectId}
            defaultStatus={col.status}
          />
        ))}
      </div>
    </div>
  );
}
