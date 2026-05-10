"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ToastItem } from "@/types/toast";

const AUTO_DISMISS_MS  = 3000;
const EXIT_DURATION_MS = 200;

type ToastProps = {
  item:     ToastItem;
  onRemove: (id: string) => void;
};

const typeConfig: Record<
  ToastItem["type"],
  { border: string; iconColor: string; icon: React.ReactNode }
> = {
  success: {
    border:    "border-emerald-500/30",
    iconColor: "text-emerald-400",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  error: {
    border:    "border-red-500/30",
    iconColor: "text-red-400",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  info: {
    border:    "border-blue-500/30",
    iconColor: "text-blue-400",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warning: {
    border:    "border-amber-500/30",
    iconColor: "text-amber-400",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
};

export default function Toast({ item, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(AUTO_DISMISS_MS);
  const startedAtRef = useRef(0);

  const dismiss = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setIsExiting(true);
    setTimeout(() => onRemove(item.id), EXIT_DURATION_MS);
  }, [item.id, onRemove]);

  const startTimer = useCallback(() => {
    startedAtRef.current = Date.now();
    timerRef.current     = setTimeout(dismiss, remainingRef.current);
  }, [dismiss]);

  const pauseTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current     = null;
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
  }, []);

  const resumeTimer = useCallback(() => {
    if (timerRef.current) return;
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    startTimer();
    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const config = typeConfig[item.type];

  const animClass = isExiting
    ? "opacity-0 translate-x-2 scale-95"
    : isVisible
    ? "opacity-100 translate-x-0 scale-100"
    : "opacity-0 translate-x-2 scale-100";

  return (
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className={`pointer-events-auto flex min-w-72 max-w-sm items-start gap-3 rounded-xl border ${config.border} bg-zinc-900 px-4 py-3 shadow-2xl shadow-black/60 transition-all duration-200 ease-out ${animClass}`}
    >
      <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>{config.icon}</div>
      <p className="flex-1 text-sm leading-snug text-zinc-200">{item.message}</p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="mt-0.5 shrink-0 text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
