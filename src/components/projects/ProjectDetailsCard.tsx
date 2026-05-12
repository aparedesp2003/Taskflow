"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import type { Project, ProjectStatus } from "@/types/project";
import { getProjectStatusFromProgress } from "@/utils/project";

type EditForm = {
  name:        string;
  description: string;
  status:      ProjectStatus;
  dueDate:     string;
};

type ProjectDetailsCardProps = {
  project: Project;
  isOwner: boolean;
};

export default function ProjectDetailsCard({ project, isOwner }: ProjectDetailsCardProps) {
  const router = useRouter();
  const toast  = useToast();

  // ── Edit modal ────────────────────────────────────────────────────────────
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [editForm,     setEditForm]     = useState<EditForm>({
    name:        project.name,
    description: project.description,
    status:      project.status,
    dueDate:     project.rawDueDate ?? "",
  });
  const [editNameError, setEditNameError] = useState("");
  const [isSaving,      setIsSaving]      = useState(false);

  function handleEditOpen() {
    setEditForm({
      name:        project.name,
      description: project.description,
      status:      project.status,
      dueDate:     project.rawDueDate ?? "",
    });
    setEditNameError("");
    setIsEditOpen(true);
  }

  function handleEditClose() {
    if (isSaving) return;
    setIsEditOpen(false);
    setEditNameError("");
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditNameError("Project name is required.");
      return;
    }
    setEditNameError("");
    setIsSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({
        name:        editForm.name.trim(),
        description: editForm.description.trim(),
        status:      editForm.status,
        due_date:    editForm.dueDate || null,
      })
      .eq("id", project.id);

    setIsSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Project updated");
    setIsEditOpen(false);
    router.refresh();
  }

  // ── Delete modal ──────────────────────────────────────────────────────────
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting,   setIsDeleting]   = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      toast.error(error.message);
      setIsDeleting(false);
      return;
    }

    toast.success("Project deleted");
    router.push("/projects");
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const progressStatus = getProjectStatusFromProgress(project.progress);

  return (
    <>
      <Card className="flex flex-col">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Project Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Status</span>
              <Badge label={progressStatus.label} variant={progressStatus.variant} />
            </div>
            {project.dueDate && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Due date</span>
                <span className="text-xs font-medium text-zinc-300">{project.dueDate}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Created</span>
              <span className="text-xs font-medium text-zinc-300">{project.createdAt}</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Progress</span>
                <span className="text-xs font-medium text-zinc-400">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
          </div>
        </div>

        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-700"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="text-xs text-zinc-600">No activity yet</p>
          </div>
        </div>

        {isOwner && (
          <div className="px-5 py-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleEditOpen}
                className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Edit Project
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="w-full rounded-lg border border-red-500/30 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
              >
                Delete Project
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Edit Project Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={isEditOpen} onClose={handleEditClose} title="Edit Project">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-project-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Project name <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-project-name"
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              className={`w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500 ${
                editNameError ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {editNameError && (
              <p className="mt-1 text-xs text-red-400">{editNameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-project-description" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Description
            </label>
            <textarea
              id="edit-project-description"
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="edit-project-status" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Status
            </label>
            <div className="relative">
              <select
                id="edit-project-status"
                value={editForm.status}
                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
                className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500"
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <div>
            <label htmlFor="edit-project-due-date" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Due date
            </label>
            <input
              id="edit-project-due-date"
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors focus:border-indigo-500 scheme-dark"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleEditClose}
              disabled={isSaving}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Project Modal ───────────────────────────────────────────── */}
      <Modal isOpen={isDeleteOpen} onClose={() => { if (!isDeleting) setIsDeleteOpen(false); }} title="Delete Project">
        <div className="space-y-5">
          <p className="text-sm text-zinc-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">{project.name}</span>?
            This action cannot be undone and will permanently remove all tasks associated with this project.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
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
              {isDeleting ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
