"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

type FieldErrors = {
  firstName?: string;
  lastName?:  string;
};

export default function SignupForm() {
  const router = useRouter();

  const [firstName,      setFirstName]      = useState("");
  const [lastName,       setLastName]       = useState("");
  const [email,          setEmail]          = useState("");
  const [password,       setPassword]       = useState("");
  const [showPassword,   setShowPassword]   = useState(false);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [fieldErrors,    setFieldErrors]    = useState<FieldErrors>({});
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errs: FieldErrors = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!lastName.trim())  errs.lastName  = "Last name is required.";

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          full_name:  fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        { id: data.user.id, email, full_name: fullName },
        { onConflict: "id" },
      );

      if (profileError) {
        setError(profileError.message);
        setIsSubmitting(false);
        return;
      }
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSubmittedEmail(email);
  }

  if (submittedEmail) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-400"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Check your inbox</p>
          <p className="mt-1 text-xs text-zinc-500">
            We sent a confirmation link to{" "}
            <span className="text-zinc-300">{submittedEmail}</span>
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
    <form onSubmit={handleSignup} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-first-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
            First Name
          </label>
          <input
            id="signup-first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Andres"
            className={`w-full rounded-lg border bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition-colors focus:border-indigo-500 ${
              fieldErrors.firstName ? "border-red-500" : "border-zinc-700"
            }`}
          />
          {fieldErrors.firstName && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-last-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Last Name
          </label>
          <input
            id="signup-last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Paredes"
            className={`w-full rounded-lg border bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition-colors focus:border-indigo-500 ${
              fieldErrors.lastName ? "border-red-500" : "border-zinc-700"
            }`}
          />
          {fieldErrors.lastName && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition-colors focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium text-zinc-400">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 pr-10 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition-colors focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-300 transition-colors hover:text-white">
          Log in
        </Link>
      </p>
    </form>
  );
}
