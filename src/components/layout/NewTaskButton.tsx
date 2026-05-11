"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import type { TaskStatus, TaskPriority } from "@/types/task";

type FormState = {
  title:       string;
  description: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  dueDate:     string;
};

const initialForm: FormState = {
  title:       "",
  description: "",
  status:      "todo",
  priority:    "medium",
  dueDate:     "",
};

// Matches /projects/<uuid> but not /projects or /projects/new/etc.
const PROJECT_PAGE_RE = /^\/projects\/([^/]+)$/;

export default function NewTaskButton() {
  const pathname = usePathname();
  const router   = useRouter();

  const match     = PROJECT_PAGE_RE.exec(pathname);
  const projectId = match?.[1] ?? null;

  const [isOpen,       setIsOpen]       = useState(false);
  const [form,         setForm]         = useState<FormState>(initialForm);
  const [titleError,   setTitleError]   = useState("");
  const [submitError,  setSubmitError]  = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!projectId) return null;

  function handleClick() {
    setIsOpen(true);
  }

  function handleClose() {
    if (isSubmitting) return;
    setIsOpen(false);
    setForm(initialForm);
    setTitleError("");
    setSubmitError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) return;

    if (!form.title.trim()) {
      setTitleError("Task title is required.");
      return;
    }
    setTitleError("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("tasks").insert({
      project_id:  projectId,
      title:       form.title.trim(),
      description: form.description.trim(),
      status:      form.status,
      priority:    form.priority,
      due_date:    form.dueDate || null,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    handleClose();
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        + New Task
      </button>

      {projectId && (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add Task">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-task-title" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="new-task-title"
                type="text"
                placeholder="e.g. Design the landing page"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className={`w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500 ${
                  titleError ? "border-red-500" : "border-zinc-700"
                }`}
              />
              {titleError && <p className="mt-1 text-xs text-red-400">{titleError}</p>}
            </div>

            <div>
              <label htmlFor="new-task-description" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Description
              </label>
              <textarea
                id="new-task-description"
                rows={3}
                placeholder="What needs to be done?"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="new-task-status" className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Status
                </label>
                <div className="relative">
                  <select
                    id="new-task-status"
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
                    className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              <div>
                <label htmlFor="new-task-priority" className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="new-task-priority"
                    value={form.priority}
                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}
                    className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="new-task-due-date" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Due date
              </label>
              <input
                id="new-task-due-date"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500 scheme-dark"
              />
            </div>

            {submitError && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {submitError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
