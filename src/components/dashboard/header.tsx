"use client";

import { MaterialIcon } from "@/components/ui/material-icon";

interface HeaderProps {
  userName: string;
  userRole: string;
  userImage?: string;
}

export function Header({ userName, userRole, userImage }: HeaderProps) {
  return (
    <header className="h-20 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="relative w-96">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
          placeholder="Search for bookings, rooms, guests..." 
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-icons">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase">{userName}</p>
            <p className="text-xs text-slate-500 capitalize">{userRole.replace("_", " ")}</p>
          </div>
          {userImage ? (
            <img 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover" 
              src={userImage} 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
