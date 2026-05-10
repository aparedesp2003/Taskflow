"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";

function getInitials(name: string, email: string): string {
  const trimmed = name.trim();
  if (!trimmed) return email.slice(0, 2).toUpperCase();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type ProfileCardProps = {
  userId:   string;
  fullName: string;
  email:    string;
};

export default function ProfileCard({ userId, fullName, email }: ProfileCardProps) {
  const router = useRouter();
  const toast  = useToast();

  const [name,         setName]         = useState(fullName);
  const [savedName,    setSavedName]    = useState(fullName);
  const [isEditing,    setIsEditing]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initials = getInitials(name, email);

  function handleEdit() {
    setName(savedName);
    setIsEditing(true);
  }

  function handleCancel() {
    setName(savedName);
    setIsEditing(false);
  }

  async function handleSave() {
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() || null })
      .eq("id", userId);

    setIsSubmitting(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    const trimmed = name.trim();
    setSavedName(trimmed);
    setName(trimmed);
    setIsEditing(false);
    toast.success("Profile updated successfully");
    router.refresh();
  }

  return (
    <Card>
      <div className="border-b border-zinc-800 px-6 py-4">
        <h2 className="text-sm font-semibold text-white">Profile</h2>
      </div>
      <div className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {name.trim() ? name.trim() : <span className="text-zinc-500">No name set</span>}
            </p>
            <p className="truncate text-xs text-zinc-500">{email}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-400">Full Name</label>
            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-zinc-300">
              {savedName.trim() ? savedName.trim() : <span className="text-zinc-600">Not set</span>}
            </p>
          )}

        </div>
      </div>
    </Card>
  );
}
