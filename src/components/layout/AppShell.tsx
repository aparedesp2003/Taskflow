import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import ToastProvider from "@/components/ui/ToastProvider";

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
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar userEmail={userEmail} avatarUrl={avatarUrl} />
        <main className="flex-1 overflow-y-auto px-8 py-6 xl:px-10">
          <div className="mx-auto w-full max-w-450">
            <ToastProvider>{children}</ToastProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
