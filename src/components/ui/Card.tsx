import type { ReactNode } from "react";

type CardProps = {
  children:  ReactNode;
  className?: string;
  onClick?:  () => void;
};

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
