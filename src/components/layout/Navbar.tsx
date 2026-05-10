import SearchBox from "@/components/layout/SearchBox";
import NotificationBell from "@/components/layout/NotificationBell";

type NavbarProps = {
  userEmail: string;
};

export default function Navbar({ userEmail }: NavbarProps) {
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 backdrop-blur-md">
      <SearchBox />

      <div className="flex items-center gap-3">
        <NotificationBell />

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          + New Task
        </button>

        <div className="flex items-center gap-4 border-l border-zinc-800 pl-3">
          <span className="text-sm text-zinc-400">{userEmail}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
