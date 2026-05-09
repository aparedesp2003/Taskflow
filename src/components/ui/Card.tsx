import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 ${className}`}>
      {children}
    </div>
  );
}
