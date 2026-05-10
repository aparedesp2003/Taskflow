"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

type AccountCardProps = {
  email:     string;
  createdAt: string | null;
};

export default function AccountCard({ email, createdAt }: AccountCardProps) {
  const [isSending, setIsSending] = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        day:   "numeric",
        year:  "numeric",
      })
    : null;

  async function handlePasswordReset() {
    setIsSending(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSending(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <Card>
      <div className="border-b border-zinc-800 px-6 py-4">
        <h2 className="text-sm font-semibold text-white">Account</h2>
      </div>
      <div className="divide-y divide-zinc-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium text-zinc-400">Email Address</p>
            <p className="mt-0.5 text-sm text-zinc-300">{email}</p>
          </div>
          <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
            Readonly
          </span>
        </div>

        {formattedDate && (
          <div className="px-6 py-4">
            <p className="text-xs font-medium text-zinc-400">Member Since</p>
            <p className="mt-0.5 text-sm text-zinc-300">{formattedDate}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-zinc-400">Password</p>
            <p className="mt-0.5 text-xs text-zinc-600">
              Send a reset link to your email address.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={isSending || sent}
            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 ${
              sent
                ? "border border-emerald-500/30 text-emerald-400"
                : "border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
          >
            {isSending ? "Sending..." : sent ? "Email sent" : "Send reset email"}
          </button>
        </div>

        {error && (
          <div className="px-6 pb-4">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
