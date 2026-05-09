import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

export type InsightVariant = "positive" | "warning" | "neutral";

const insightStyles: Record<InsightVariant, string> = {
  positive: "text-emerald-400",
  warning: "text-amber-400",
  neutral: "text-zinc-500",
};

type StatsCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  insight?: string;
  insightVariant?: InsightVariant;
};

export default function StatsCard({
  label,
  value,
  icon,
  insight,
  insightVariant = "neutral",
}: StatsCardProps) {
  return (
    <Card className="p-6 transition-all duration-200 hover:border-indigo-500/40">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">{label}</span>
          <span className="text-3xl font-semibold text-white">{value}</span>
          {insight && (
            <span className={`text-xs ${insightStyles[insightVariant]}`}>
              {insight}
            </span>
          )}
        </div>
        <div className="text-zinc-500">{icon}</div>
      </div>
    </Card>
  );
}
