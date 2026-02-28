import { StatCard } from "@/components/ui/stat-card";
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell } from "@/components/ui/data-table";
import { MaterialIcon } from "@/components/ui/material-icon";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_id, branch_id")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  // Fetch Rooms for Occupancy
  const { data: rooms } = await supabase
    .from("rooms")
    .select("status")
    .eq("hotel_id", profile.hotel_id);

  const totalRooms = rooms?.length || 0;
  const occupiedRooms = rooms?.filter(r => r.status === 'occupied').length || 0;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Fetch Revenue (Total price of non-cancelled bookings)
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_price")
    .eq("hotel_id", profile.hotel_id)
    .neq("status", "cancelled");

  const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

  // Daily Check-ins
  const today = new Date().toISOString().split('T')[0];
  const { count: dailyCheckins } = await supabase
    .from("bookings")
    .select("*", { count: 'exact', head: true })
    .eq("hotel_id", profile.hotel_id)
    .eq("check_in_date", today);

  // Recent Bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, rooms(room_number, room_types(name))")
    .eq("hotel_id", profile.hotel_id)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { 
      title: "Occupancy Rate", 
      value: `${occupancyRate}%`, 
      icon: "meeting_room", 
      trend: { value: "Live", isUp: true },
      colorVariant: "blue" as const
    },
    { 
      title: "Revenue Ledger", 
      value: `₦${totalRevenue.toLocaleString()}`, 
      icon: "payments", 
      trend: { value: "Gross", isUp: true },
      colorVariant: "emerald" as const
    },
    { 
      title: "Daily Arrivals", 
      value: (dailyCheckins || 0).toString(), 
      icon: "login", 
      todayLabel: "Today",
      colorVariant: "amber" as const
    },
    { 
      title: "Inventory", 
      value: totalRooms.toString(), 
      icon: "inventory_2", 
      trend: { value: "Assets", isUp: true },
      colorVariant: "purple" as const
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Operational Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 italic">Real-time status of your property operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2">
          <DataTable title="Recent Activity" actionLabel="View Ledger">
            <table className="w-full text-left">
              <DataTableHeader>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Dates</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 font-bold text-right uppercase tracking-wider">Actions</th>
              </DataTableHeader>
              <DataTableBody>
                {recentBookings?.map((booking) => (
                  <DataTableRow key={booking.id}>
                    <DataTableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                          {booking.guest_name?.substring(0, 2) || "G"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white uppercase">{booking.guest_name}</p>
                          <p className="text-[10px] text-slate-500 italic">#BK-{booking.id.substring(0,6)}</p>
                        </div>
                      </div>
                    </DataTableCell>
                    <DataTableCell className="text-center font-medium text-[10px] text-slate-500 uppercase tracking-tighter">
                        {booking.check_in_date} → {booking.check_out_date}
                    </DataTableCell>
                    <DataTableCell>
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            booking.status === 'checked-in' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                            {booking.status}
                        </span>
                      </div>
                    </DataTableCell>
                    <DataTableCell className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tighter">
                        ₦{booking.total_price?.toLocaleString() || '0'}
                    </DataTableCell>
                    <DataTableCell align="right">
                      <Link href={`/dashboard/bookings/${booking.id}`} className="text-slate-400 hover:text-primary transition-colors">
                        <MaterialIcon icon="visibility" className="text-xl" />
                      </Link>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </table>
            {(!recentBookings || recentBookings.length === 0) && (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-slate-900">
                NO RECENT ACTIVITY LOGGED
              </div>
            )}
          </DataTable>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-1000">
                <MaterialIcon icon="analytics" className="text-8xl" />
            </div>
            <h3 className="text-sm font-black mb-6 text-slate-900 dark:text-white uppercase tracking-[0.2em]">Operational Pulse</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-slate-500">Occupancy Distribution</span>
                  <span className="text-primary">{occupancyRate}%</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-full h-2 shadow-inner">
                  <div className="bg-primary h-2 rounded-full shadow-lg shadow-primary/20 transition-all duration-1000" style={{ width: `${occupancyRate}%` }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Performance Insight</p>
                 <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight">
                    Your current occupancy is <span className="text-primary font-black">{occupancyRate}%</span>. 
                    Manage your <Link href="/dashboard/rooms" className="underline decoration-primary/30 hover:text-primary transition-colors">room assets</Link> to optimize revenue.
                 </p>
              </div>
            </div>
          </div>

          <div className="bg-primary p-8 rounded-3xl text-white shadow-2xl shadow-primary/40 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12 scale-150">
                <MaterialIcon icon="auto_awesome" className="text-9xl" />
            </div>
            <MaterialIcon icon="auto_graph" className="text-white text-3xl mb-4" />
            <h4 className="font-black text-lg mb-2 uppercase tracking-tight">Strategic Intel</h4>
            <p className="text-xs text-white/80 italic font-medium leading-relaxed uppercase tracking-tight">
                Expect dynamic demand shifts based on local registry patterns. Maintain active folio audits.
            </p>
            <Link href="/dashboard/reports" className="mt-8 block w-fit">
              <button className="bg-white text-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl active:scale-95 w-full">
                  Audit Operations
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
