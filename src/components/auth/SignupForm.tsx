"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully!");
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4 max-w-md w-full">
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-md border px-4 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-md border px-4 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full rounded-md bg-black px-4 py-2 text-white">
        Create account
      </button>
    </form>
  );
}
