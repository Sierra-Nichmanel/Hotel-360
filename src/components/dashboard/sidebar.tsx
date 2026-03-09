"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signout } from "@/app/auth/actions";
import { MaterialIcon } from "@/components/ui/material-icon";

interface SidebarProps {
  userRole: string;
  hotelName: string;
  currentBranch?: string;
}

export function Sidebar({ userRole, hotelName, currentBranch = "Downtown Branch" }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Bookings", href: "/dashboard/bookings", icon: "calendar_today" },
    { name: "Rooms", href: "/dashboard/rooms", icon: "bed" },
    { name: "Reports", href: "/dashboard/reports", icon: "analytics" },
    ...(userRole === "super_admin" || userRole === "branch_manager" ? [
      { name: "Personnel", href: "/dashboard/users", icon: "people" },
    ] : []),
    ...(userRole === "super_admin" ? [
      { name: "Properties", href: "/dashboard/branches", icon: "business" },
      { name: "Revenue Logic", href: "/dashboard/pricing", icon: "payments" },
      { name: "Subscription", href: "/dashboard/subscription", icon: "credit_card" },
    ] : []),
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <MaterialIcon icon="apartment" className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase truncate max-w-[150px]">{hotelName}</h1>
        </Link>

        {/* Branch Switcher (Visible to Super Admin) */}
        {userRole === "super_admin" && (
          <div className="relative mb-8">
            <button className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-900 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
              <div className="flex items-center gap-2">
                <MaterialIcon icon="location_on" className="text-sm text-primary" />
                <span className="truncate">{currentBranch}</span>
              </div>
              <MaterialIcon icon="swap_horiz" className="text-sm" />
            </button>
          </div>
        )}

        {/* Static Branch Info (for Manager/Staff) */}
        {userRole !== "super_admin" && (
          <div className="mb-8 px-3 py-2 border border-slate-100 dark:border-slate-800 rounded-lg">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                <MaterialIcon icon="store" className="text-[14px]" />
                Station
             </div>
             <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentBranch}</p>
          </div>
        )}

        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 transition-colors rounded-lg font-medium text-sm",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <MaterialIcon icon={item.icon} className={cn(
                pathname === item.href ? "text-primary" : "text-slate-500"
              )} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 transition-colors rounded-lg font-medium text-sm mb-1",
            pathname === "/dashboard/settings"
              ? "bg-primary/10 text-primary"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <MaterialIcon icon="settings" className={cn(
            pathname === "/dashboard/settings" ? "text-primary" : "text-slate-500"
          )} />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => signout()}
          className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg font-medium text-sm w-full"
        >
          <MaterialIcon icon="logout" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
