import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET          = "avatars";
const MAX_SIZE_BYTES  = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES   = new Set(["image/png", "image/jpeg", "image/webp"]);

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return "Only PNG, JPEG, and WebP images are allowed.";
  if (file.size > MAX_SIZE_BYTES)    return "Image must be smaller than 2 MB.";
  return null;
}

export async function uploadAvatar(
  supabase: SupabaseClient,
  userId:   string,
  file:     File,
): Promise<string> {
  const ext  = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // Append cache-buster so browsers don't serve the stale image after re-upload.
  return `${data.publicUrl}?v=${Date.now()}`;
}
