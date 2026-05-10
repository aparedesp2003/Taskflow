import type { ReactNode } from "react";

type AuthCardProps = {
  title:    string;
  subtitle: string;
  children: ReactNode;
};

function TaskFlowLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2"  y="2"  width="11" height="11" rx="2.5" fill="#6366f1" />
        <rect x="15" y="2"  width="11" height="11" rx="2.5" fill="#818cf8" />
        <rect x="2"  y="15" width="11" height="11" rx="2.5" fill="#818cf8" />
        <rect x="15" y="15" width="11" height="11" rx="2.5" fill="#4338ca" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-white">TaskFlow</span>
    </div>
  );
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <TaskFlowLogo />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/40">
          {children}
        </div>
      </div>
    </div>
  );
}
