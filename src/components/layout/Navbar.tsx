import Image from "next/image";
import SearchBox from "@/components/layout/SearchBox";
import NotificationBell from "@/components/layout/NotificationBell";
import NewTaskButton from "@/components/layout/NewTaskButton";

type NavbarProps = {
  userEmail:  string;
  avatarUrl?: string | null;
};

export default function Navbar({ userEmail, avatarUrl }: NavbarProps) {
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 backdrop-blur-md">
      <SearchBox />

      <div className="flex items-center gap-3">
        <NotificationBell />

        <NewTaskButton />

        <div className="flex items-center gap-4 border-l border-zinc-800 pl-3">
          <span className="text-sm text-zinc-400">{userEmail}</span>
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
