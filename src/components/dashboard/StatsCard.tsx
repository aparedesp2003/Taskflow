import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

type StatsCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
};

export default function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <Card className="p-6 transition-all duration-200 hover:border-indigo-500/40">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">{label}</span>
          <span className="text-3xl font-semibold text-white">{value}</span>
        </div>
        <div className="text-zinc-500">{icon}</div>
      </div>
    </Card>
  );
}
