import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { StatCard } from "@/components/ui/stat-card";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  // Aggregate Metrics
  // 1. Revenue
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_price, nightly_breakdown")
    .eq("organization_id", profile.organization_id)
    .neq("status", "cancelled");

  const totalRevenue = revenueData?.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0) || 0;
  
  // 2. Rooms / Occupancy
  const { data: rooms } = await supabase
    .from("rooms")
    .select("status")
    .eq("organization_id", profile.organization_id);

  const totalRooms = rooms?.length || 0;
  const occupiedRooms = rooms?.filter(r => r.status === 'occupied').length || 0;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  // 3. ADR & RevPAR (Simple approximation for now)
  const totalNights = revenueData?.reduce((sum, b) => {
      const breakdown = b.nightly_breakdown as any[];
      return sum + (breakdown?.length || 0);
  }, 0) || 0;
  
  const adr = totalNights > 0 ? totalRevenue / totalNights : 0;
  const revpar = totalRooms > 0 ? totalRevenue / totalRooms : 0; // Simple RevPAR

  // 4. Branch Data
  const { data: branches } = await supabase
    .from("branches")
    .select("*, rooms(status)")
    .eq("organization_id", profile.organization_id);

  const branchMetrics = branches?.map(b => {
      const bRooms = (b.rooms as any[]) || [];
      const bOccupied = bRooms.filter(r => r.status === 'occupied').length;
      return {
          name: b.name,
          occupancy: bRooms.length > 0 ? Math.round((bOccupied / bRooms.length) * 100) : 0,
          revenue: 0, // Need deeper join for per-branch revenue
          status: b.is_main_branch ? 'Headquarters' : 'Active'
      };
  });

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Enterprise performance monitoring and revenue tracking across all properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <MaterialIcon icon="file_download" className="text-sm" />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20">
            <MaterialIcon icon="refresh" className="text-sm" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <MaterialIcon icon="calendar_today" className="text-primary text-sm" />
          <select className="bg-transparent border-none text-[11px] font-bold uppercase tracking-wider focus:ring-0 w-full cursor-pointer">
            <option>Oct 1, 2023 - Oct 31, 2023</option>
            <option>Last 30 Days</option>
            <option>Q3 2023</option>
            <option>Custom Range...</option>
          </select>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <MaterialIcon icon="location_on" className="text-primary text-sm" />
          <select className="bg-transparent border-none text-[11px] font-bold uppercase tracking-wider focus:ring-0 w-full cursor-pointer">
            <option>All Branches (12 Locations)</option>
            <option>Downtown - Main HQ</option>
            <option>Uptown - Boutique</option>
          </select>
        </div>
        <div className="flex items-center justify-end">
          <button className="p-3 text-slate-500 hover:text-primary transition-colors">
            <MaterialIcon icon="filter_list" />
          </button>
        </div>
      </div>

      <div className="space-y-10 pb-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} trend={{ value: "Live", isUp: true }} icon="account_balance_wallet" />
          <StatCard title="Avg. Occupancy" value={`${Math.round(occupancyRate)}%`} trend={{ value: "Current", isUp: true }} icon="bedroom_parent" />
          <StatCard title="ADR" value={`₦${Math.round(adr).toLocaleString()}`} trend={{ value: "Stable", isUp: true }} icon="payments" />
          <StatCard title="RevPAR" value={`₦${Math.round(revpar).toLocaleString()}`} trend={{ value: "Stable", isUp: true }} icon="trending_up" />
        </div>

        {/* Charts & Deep Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h4 className="font-extrabold text-[11px] uppercase tracking-[0.2em] text-slate-500">Revenue Performance</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between relative pt-8">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-8 bottom-0 flex flex-col justify-between pointer-events-none opacity-50">
                <div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
                <div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
                <div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
                <div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
              </div>
              
              {/* Bars */}
              {[32, 45, 60, 48, 55, 68, 42, 50].map((h, i) => (
                <div key={i} className="relative group w-full flex justify-center">
                  <div 
                    className="w-10 bg-primary group-hover:bg-opacity-80 transition-all rounded-t-lg relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      ${(h * 2).toFixed(1)}k
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 px-4">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Week 1</span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Week 2</span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Week 3</span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Week 4</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col">
            <h4 className="font-extrabold text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-10">Revenue Sources</h4>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 rounded-full border-[1.5rem] border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[1.5rem] border-primary border-t-transparent border-r-transparent transform -rotate-45"></div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold uppercase tracking-tighter">75%</p>
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Direct</p>
                </div>
              </div>
              
              <div className="w-full mt-10 space-y-4">
                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Direct Booking</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-900 dark:text-white">100%</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">OTA Channels</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-900 dark:text-white">0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30 dark:bg-slate-800/20">
            <div>
              <h4 className="font-extrabold text-[11px] uppercase tracking-[0.2em] text-slate-500">Regional Performance</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-1">Detailed metrics by physical location</p>
            </div>
            <div className="relative w-full sm:w-64">
              <MaterialIcon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-tight focus:ring-primary transition-all"
                placeholder="Find branch..."
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                <tr className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-8 py-5">Property Name</th>
                  <th className="px-8 py-5">Occupancy</th>
                  <th className="px-8 py-5">Rev. (USD)</th>
                  <th className="px-8 py-5">Net Profit</th>
                  <th className="px-8 py-5 text-right">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {branchMetrics?.map((branch) => (
                  <tr key={branch.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">{branch.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase italic">Status: {branch.status}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400">{branch.occupancy}%</span>
                        <div className="w-24 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-primary transition-all duration-1000`} style={{ width: `${branch.occupancy}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-extrabold uppercase tracking-tight text-primary">₦0</td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest text-slate-400`}>
                        -
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" disabled>
                        <MaterialIcon icon="visibility" className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Sync Status */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 italic">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Global Data Feed Synchronized</span>
          </div>
          <span>Report Generated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
