
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

export function NavItem({ icon, to, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        active 
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="mr-3 h-5 w-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
