import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import AppShellClient from "@/components/layout/AppShellClient";

type AppShellProps = {
  children: ReactNode;
};

export default async function AppShell({ children }: AppShellProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [nameResult, avatarResult] = await Promise.all([
    user
      ? supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    user
      ? supabase.from("profiles").select("avatar_url").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (nameResult.error) {
    console.error("[AppShell] name fetch failed:", nameResult.error.message);
  }
  if (avatarResult.error) {
    console.error("[AppShell] avatar fetch failed:", avatarResult.error.message);
  }

  const fullName    = (nameResult.data as { full_name: string | null } | null)?.full_name ?? null;
  const avatarUrl   = (avatarResult.data as { avatar_url: string | null } | null)?.avatar_url ?? null;
  const displayName = fullName || (user?.user_metadata?.full_name as string | undefined) || "User";

  return (
    <AppShellClient displayName={displayName} avatarUrl={avatarUrl}>
      {children}
    </AppShellClient>
  );
}
