import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProfileCard from "@/components/settings/ProfileCard";
import AccountCard from "@/components/settings/AccountCard";

type ProfileRow = {
  id:         string;
  full_name:  string | null;
  avatar_url: string | null;
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const profile    = profileData as ProfileRow | null;
  const fullName   = profile?.full_name  ?? "";
  const avatarUrl  = profile?.avatar_url ?? null;
  const email      = user.email          ?? "";
  const createdAt  = user.created_at     ?? null;

  return (
    <AppShell>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your profile, account, and workspace preferences."
      />

      <div className="max-w-2xl space-y-6">
        <ProfileCard userId={user.id} fullName={fullName} email={email} avatarUrl={avatarUrl} />

        <AccountCard email={email} createdAt={createdAt} />

        {/* Preferences */}
        <Card>
          <div className="border-b border-zinc-800 px-6 py-4">
            <h2 className="text-sm font-semibold text-white">Preferences</h2>
          </div>
          <div className="divide-y divide-zinc-800">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-zinc-400"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">Theme</p>
                  <p className="text-xs text-zinc-500">Dark mode</p>
                </div>
              </div>
              <Badge label="Active" variant="success" />
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-zinc-400"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">Email Notifications</p>
                  <p className="text-xs text-zinc-500">Receive email updates</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge label="Coming soon" variant="default" />
                <div className="pointer-events-none relative h-5 w-9 cursor-not-allowed rounded-full bg-zinc-700 opacity-40">
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-zinc-400" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20">
          <div className="border-b border-red-500/20 px-6 py-4">
            <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Delete Account</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge label="Coming soon" variant="default" />
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 opacity-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
