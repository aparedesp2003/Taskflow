type NavbarProps = {
  userEmail: string;
};

export default function Navbar({ userEmail }: NavbarProps) {
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-end border-b border-zinc-800 bg-zinc-900/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400">{userEmail}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
          {initial}
        </div>
      </div>
    </header>
  );
}
