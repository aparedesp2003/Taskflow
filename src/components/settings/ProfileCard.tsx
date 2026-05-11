"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar, validateAvatarFile } from "@/lib/supabase/storage";
import { useToast } from "@/hooks/useToast";

function getInitials(name: string, email: string): string {
  const trimmed = name.trim();
  if (!trimmed) return email.slice(0, 2).toUpperCase();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type ProfileCardProps = {
  userId:     string;
  fullName:   string;
  email:      string;
  avatarUrl?: string | null;
};

export default function ProfileCard({ userId, fullName, email, avatarUrl }: ProfileCardProps) {
  const router      = useRouter();
  const toast       = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name,         setName]         = useState(fullName);
  const [savedName,    setSavedName]    = useState(fullName);
  const [isEditing,    setIsEditing]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarState,  setAvatarState]  = useState<string | null>(avatarUrl ?? null);
  const [isUploading,  setIsUploading]  = useState(false);

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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so re-selecting the same file still fires onChange
    e.target.value = "";

    const validationError = validateAvatarFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const newUrl   = await uploadAvatar(supabase, userId, file);

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: newUrl })
        .eq("id", userId);

      if (dbError) throw dbError;

      setAvatarState(newUrl);
      toast.success("Profile picture updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <div className="border-b border-zinc-800 px-6 py-4">
        <h2 className="text-sm font-semibold text-white">Profile</h2>
      </div>
      <div className="px-6 py-5">
        <div className="flex items-center gap-4">

          {/* Avatar with upload overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Upload profile picture"
            className="group relative h-14 w-14 shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed"
          >
            {/* Image or initials */}
            {avatarState ? (
              <Image
                src={avatarState}
                alt="Profile picture"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
                {initials}
              </div>
            )}

            {/* Camera icon — visible on hover when not uploading */}
            {!isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}

            {/* Spinner overlay — visible while uploading */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-label="Upload profile picture"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {name.trim() ? name.trim() : <span className="text-zinc-500">No name set</span>}
            </p>
            <p className="truncate text-xs text-zinc-500">{email}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-1 text-xs text-indigo-400 transition-colors hover:text-indigo-300 disabled:pointer-events-none disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
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
