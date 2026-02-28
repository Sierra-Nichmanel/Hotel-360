import React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ title, actionLabel, onActionClick, children, className }: DataTableProps) {
  return (
    <div className={cn("bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden", className)}>
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        {actionLabel && (
          <button 
            onClick={onActionClick}
            className="text-primary text-sm font-semibold hover:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

export function DataTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
      <tr>
        {children}
      </tr>
    </thead>
  );
}

export function DataTableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm italic">
      {children}
    </tbody>
  );
}

export function DataTableRow({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <tr className={cn("hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors", className)}>
      {children}
    </tr>
  );
}

export function DataTableCell({ children, className, align = "left" }: { children: React.ReactNode, className?: string, align?: "left" | "right" | "center" }) {
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  
  return (
    <td className={cn("px-6 py-4", alignments[align], className)}>
      {children}
    </td>
  );
}
