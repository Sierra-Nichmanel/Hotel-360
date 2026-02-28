import Link from "next/link";
import { LucideInfo } from "lucide-react";

export function TrialBanner({ daysLeft }: { daysLeft: number }) {
  return (
    <div className="bg-primary/10 border-b border-primary/20 px-6 py-2 flex items-center justify-between">
      <div className="flex items-center text-sm font-medium text-primary">
        <LucideInfo className="mr-2 h-4 w-4" />
        Your 7-day trial is active. You have {daysLeft} {daysLeft === 1 ? "day" : "days"} remaining.
      </div>
      <Link 
        href="/subscription" 
        className="text-xs font-bold uppercase tracking-wider bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors"
      >
        Upgrade Now
      </Link>
    </div>
  );
}
