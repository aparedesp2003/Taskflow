"use client";

import Image from "next/image";
import SearchBox from "@/components/layout/SearchBox";
import NotificationBell from "@/components/layout/NotificationBell";
import NewTaskButton from "@/components/layout/NewTaskButton";

type NavbarProps = {
  userEmail:   string;
  avatarUrl?:  string | null;
  onMenuClick?: () => void;
};

export default function Navbar({ userEmail, avatarUrl, onMenuClick }: NavbarProps) {
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="hidden sm:block">
          <SearchBox />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />

        <NewTaskButton />

        <div className="flex items-center gap-2 border-l border-zinc-800 pl-3 sm:gap-4">
          <span className="hidden text-sm text-zinc-400 sm:block">{userEmail}</span>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Profile picture"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
              {initial}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
