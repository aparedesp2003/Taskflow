"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import Toast from "@/components/ui/Toast";
import type { ToastContextValue, ToastItem, ToastType } from "@/types/toast";

export const ToastContext = createContext<ToastContextValue | null>(null);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts,  setToasts]  = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const add = useCallback((type: ToastType, message: string) => {
    setToasts((prev) => [...prev, { id: crypto.randomUUID(), type, message }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({
    success: (msg) => add("success", msg),
    error:   (msg) => add("error",   msg),
    info:    (msg) => add("info",    msg),
    warning: (msg) => add("warning", msg),
  }), [add]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && createPortal(
        <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} item={toast} onRemove={remove} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
