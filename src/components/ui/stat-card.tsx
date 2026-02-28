import { cn } from "@/lib/utils";
import { MaterialIcon } from "./material-icon";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  todayLabel?: string;
  colorVariant?: "blue" | "emerald" | "amber" | "purple";
}

export function StatCard({ title, value, icon, trend, todayLabel, colorVariant = "blue" }: StatCardProps) {
  const variants = {
    blue: "bg-blue-50 dark:bg-primary/10 text-primary",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600",
    purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-600",
  };

  return (
    <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", variants[colorVariant])}>
          <MaterialIcon icon={icon} />
        </div>
        {trend && (
          <span className={cn(
            "text-sm font-bold flex items-center",
            trend.isUp ? "text-emerald-500" : "text-red-500"
          )}>
            <MaterialIcon icon={trend.isUp ? "trending_up" : "trending_down"} className="text-sm mr-1" />
            {trend.value}
          </span>
        )}
        {todayLabel && (
          <span className="text-slate-400 text-sm font-bold">{todayLabel}</span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white uppercase">{value}</p>
    </div>
  );
}
