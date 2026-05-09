"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { ProjectStatus } from "@/types/project";

type ProjectFormState = {
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
};

type FormErrors = {
  name?: string;
};

const initialState: ProjectFormState = {
  name: "",
  description: "",
  status: "Planning",
  dueDate: "",
};

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleClose() {
    setIsOpen(false);
    setForm(initialState);
    setErrors({});
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Project name is required.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    console.log("New project payload:", {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate,
    });
    handleClose();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="shrink-0 rounded-lg border border-indigo-500/60 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:border-indigo-400 hover:bg-indigo-500/10"
      >
        + New Project
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Project name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Marketing Site Redesign"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500 ${
                errors.name ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="What is this project about?"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Status <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as ProjectStatus,
                  }))
                }
                className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500"
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Due date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500 [color-scheme:dark]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
