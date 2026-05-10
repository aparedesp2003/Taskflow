import { useContext } from "react";
import { ToastContext } from "@/components/ui/ToastProvider";
import type { ToastContextValue } from "@/types/toast";

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
