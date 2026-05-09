import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

type AppShellProps = {
  children: ReactNode;
};

export default async function AppShell({ children }: AppShellProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "";

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto px-8 py-6 xl:px-10">
          <div className="mx-auto w-full max-w-450">{children}</div>
        </main>
      </div>
    </div>
  );
}
