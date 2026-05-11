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

  const userEmail = user?.email ?? "";

  const { data: profileData } = user
    ? await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const avatarUrl = (profileData as { avatar_url: string | null } | null)?.avatar_url ?? null;

  return (
    <AppShellClient userEmail={userEmail} avatarUrl={avatarUrl}>
      {children}
    </AppShellClient>
  );
}
