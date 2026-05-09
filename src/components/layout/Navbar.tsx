type NavbarProps = {
  userEmail: string;
};

export default function Navbar({ userEmail }: NavbarProps) {
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 backdrop-blur-md">
      <div className="relative w-80">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search projects or tasks..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-1.5 pl-9 pr-4 text-sm text-zinc-300 outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

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
