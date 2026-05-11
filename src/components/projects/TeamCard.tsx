"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import type { ProjectMember } from "@/types/project-member";

// ─── Avatar ──────────────────────────────────────────────────────────────────

type MemberAvatarProps = {
  fullName:  string | null;
  avatarUrl: string | null;
};

function MemberAvatar({ fullName, avatarUrl }: MemberAvatarProps) {
  const initials = fullName
    ? fullName.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={fullName ?? "Member"}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
      {initials}
    </div>
  );
}

// ─── Member row ───────────────────────────────────────────────────────────────

type MemberRowProps = {
  member:    ProjectMember;
  isOwner:   boolean;
};

function MemberRow({ member, isOwner }: MemberRowProps) {
  const roleLabel   = isOwner ? "Owner" : "Member";
  const roleClasses = isOwner
    ? "bg-indigo-500/10 text-indigo-400"
    : "bg-zinc-800 text-zinc-400";

  return (
    <div className="flex items-start gap-3 px-5 py-2.5">
      <div className="mt-0.5 shrink-0">
        <MemberAvatar fullName={member.fullName} avatarUrl={member.avatarUrl} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-zinc-300">
          {member.fullName
            ? member.fullName
            : member.email
              ? member.email
              : <span className="italic text-zinc-500">Unknown</span>}
        </p>
        {member.fullName && member.email && (
          <p className="truncate text-xs text-zinc-500">{member.email}</p>
        )}
      </div>
      <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${roleClasses}`}>
        {roleLabel}
      </span>
    </div>
  );
}

// ─── TeamCard ─────────────────────────────────────────────────────────────────

type TeamCardProps = {
  projectId:     string;
  ownerId:       string;
  currentUserId: string;
  initialOwner:  { fullName: string | null; email: string | null; avatarUrl: string | null };
  initialMembers: ProjectMember[];
};

export default function TeamCard({
  projectId,
  ownerId,
  currentUserId,
  initialOwner,
  initialMembers,
}: TeamCardProps) {
  const router  = useRouter();
  const toast   = useToast();
  const isOwner = currentUserId === ownerId;

  const [members,      setMembers]      = useState<ProjectMember[]>(initialMembers);
  const [inviteEmail,  setInviteEmail]  = useState("");
  const [isInviting,   setIsInviting]   = useState(false);

  // Sync local state when server props update (after router.refresh())
  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const ownerMember: ProjectMember = {
    id:        ownerId,
    userId:    ownerId,
    role:      "owner",
    fullName:  initialOwner.fullName,
    email:     initialOwner.email,
    avatarUrl: initialOwner.avatarUrl,
    createdAt: "",
  };

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    setIsInviting(true);
    try {
      const supabase = createClient();

      // Resolve email → user_id via security-definer RPC
      const { data: targetUserId, error: rpcError } = await supabase
        .rpc("get_user_id_by_email", { lookup_email: email });

      if (rpcError) throw rpcError;

      if (!targetUserId) {
        toast.error("No account found with that email address.");
        return;
      }

      if (targetUserId === currentUserId) {
        toast.error("You cannot invite yourself as a collaborator.");
        return;
      }

      if (members.some((m) => m.userId === targetUserId)) {
        toast.error("This user is already a collaborator on this project.");
        return;
      }

      const { error: insertError } = await supabase
        .from("project_members")
        .insert({
          project_id: projectId,
          user_id:    targetUserId,
          role:       "member",
          invited_by: currentUserId,
        });

      if (insertError) {
        // Unique constraint violation — already a member
        if (insertError.code === "23505") {
          toast.error("This user is already a collaborator on this project.");
          return;
        }
        throw insertError;
      }

      setInviteEmail("");
      toast.success("Collaborator added successfully.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add collaborator.");
    } finally {
      setIsInviting(false);
    }
  }

  return (
    <Card>
      <div className="border-b border-zinc-800 px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Team</h2>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {/* Owner row */}
        <MemberRow member={ownerMember} isOwner />

        {/* Collaborator rows */}
        {members.map((member) => (
          <MemberRow key={member.id} member={member} isOwner={false} />
        ))}

        {/* Empty collaborators state */}
        {members.length === 0 && (
          <div className="px-5 py-4 text-center">
            <p className="text-xs text-zinc-600">No collaborators yet</p>
          </div>
        )}
      </div>

      {/* Invite section — owner only */}
      {isOwner && (
        <div className="border-t border-zinc-800 px-5 py-4">
          <p className="mb-2.5 text-xs font-medium text-zinc-400">Invite by email</p>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              disabled={isInviting}
              className="flex-1 min-w-0 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isInviting || !inviteEmail.trim()}
              className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
            >
              {isInviting ? "Adding..." : "Invite"}
            </button>
          </form>
        </div>
      )}
    </Card>
  );
}
