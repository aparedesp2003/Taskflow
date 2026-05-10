import Card from "@/components/ui/Card";

const COLUMNS = [
  { label: "To Do", color: "text-zinc-400" },
  { label: "In Progress", color: "text-amber-400" },
  { label: "Done", color: "text-emerald-400" },
] as const;

export default function TaskBoardPlaceholder() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-white">Task Board</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <Card key={col.label} className="flex min-h-96 flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${col.color}`}>
                {col.label}
              </span>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-500">
                0
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
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

            <div className="border-t border-zinc-800 px-4 py-3">
              <button
                type="button"
                className="w-full rounded-lg border border-zinc-700 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
              >
                + Add Task
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
