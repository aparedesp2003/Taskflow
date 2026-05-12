"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
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

type CreateProjectModalProps = {
  isOpen:  boolean;
  onClose: () => void;
};

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const router = useRouter();
  const toast  = useToast();

  const [form,         setForm]         = useState<ProjectFormState>(initialState);
  const [errors,       setErrors]       = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleClose() {
    onClose();
    setForm(initialState);
    setErrors({});
    setIsSubmitting(false);
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Project name is required.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be signed in to create a project.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      due_date: form.dueDate || null,
    });

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    toast.success("Project created successfully");
    handleClose();
    router.refresh();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="project-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Project name <span className="text-red-400">*</span>
              </label>
              <input
                id="project-name"
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
              <label htmlFor="project-description" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Description
              </label>
              <textarea
                id="project-description"
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
              <label htmlFor="project-status" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Status <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="project-status"
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
              <label htmlFor="project-due-date" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Due date
              </label>
              <input
                id="project-due-date"
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500 scheme-dark"
              />
            </div>

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
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
        </form>
    </Modal>
  );
}
