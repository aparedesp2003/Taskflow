"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email,        setEmail]        = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [success,      setSuccess]      = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-400"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Check your inbox</p>
          <p className="mt-1 text-xs text-zinc-500">
            We sent a reset link to{" "}
            <span className="text-zinc-300">{email}</span>
          </p>
        </div>
        <Link
          href="/login"
          className="mt-1 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Back to Log In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reset-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
          Email address
        </label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition-colors focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Reset Email"}
      </button>

      <p className="text-center text-xs text-zinc-500">
        <Link
          href="/login"
          className="font-medium text-zinc-400 transition-colors hover:text-zinc-200"
        >
          ← Back to Log In
        </Link>
      </p>
    </form>
  );
}
