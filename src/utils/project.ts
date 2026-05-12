import type { BadgeVariant } from "@/components/ui/Badge";

export function getProjectStatusFromProgress(progress: number): { label: string; variant: BadgeVariant } {
  if (progress === 100) return { label: "Completed", variant: "success" };
  if (progress > 0)     return { label: "In Progress", variant: "warning" };
  return { label: "Not Started", variant: "danger" };
}
