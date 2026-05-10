"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";

type TaskFormState = {
  title:       string;
  description: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  dueDate:     string;
};

type FormErrors = {
  title?: string;
};

type EditTaskModalProps = {
  task:    Task;
  isOpen:  boolean;
  onClose: () => void;
};

export default function EditTaskModal({ task, isOpen, onClose }: EditTaskModalProps) {
  const router = useRouter();
  const toast  = useToast();

  const [form,              setForm]              = useState<TaskFormState>({
    title:       task.title,
    description: task.description,
    status:      task.status,
    priority:    task.priority,
    dueDate:     task.dueDate,
  });
  const [errors,            setErrors]            = useState<FormErrors>({});
  const [isSubmitting,      setIsSubmitting]      = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting,        setIsDeleting]        = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        title:       task.title,
        description: task.description,
        status:      task.status,
        priority:    task.priority,
        dueDate:     task.dueDate,
      });
      setErrors({});
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  }, [isOpen, task]);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Task title is required.";
    return errs;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("tasks")
      .update({
        title:       form.title.trim(),
        description: form.description.trim(),
        status:      form.status,
        priority:    form.priority,
        due_date:    form.dueDate || null,
      })
      .eq("id", task.id)
      .eq("project_id", task.projectId);

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    toast.success("Task updated successfully");
    onClose();
    router.refresh();
  }

  async function handleDelete() {
    setIsDeleting(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", task.id)
      .eq("project_id", task.projectId);

    if (error) {
      toast.error(error.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      return;
    }

    toast.success("Task deleted successfully");
    onClose();
    router.refresh();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      {showDeleteConfirm ? (
        <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-400"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Delete this task?</p>
            <p className="mt-1 text-xs text-zinc-500">This action cannot be undone.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:pointer-events-none disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="edit-task-title" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-task-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className={`w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500 ${
                errors.title ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-task-description" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Description
            </label>
            <textarea
              id="edit-task-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-task-status" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Status
              </label>
              <div className="relative">
                <select
                  id="edit-task-status"
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
              <label htmlFor="edit-task-priority" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Priority
              </label>
              <div className="relative">
                <select
                  id="edit-task-priority"
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
            <label htmlFor="edit-task-due-date" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Due date
            </label>
            <input
              id="edit-task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500 scheme-dark"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-50"
            >
              Delete Task
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
