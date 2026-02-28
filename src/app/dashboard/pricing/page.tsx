import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";

export default async function PricingPage() {
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

  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("*")
    .eq("organization_id", profile.organization_id);

  const { data: pricingRules } = await supabase
    .from("pricing_rules")
    .select("*")
    .eq("organization_id", profile.organization_id);

  // Generate a mock calendar for March 2024
  const daysInMarch = 31;
  const startDay = 5; // Friday
  const calendarDays = [];

  // Add leading empty cells
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ day: 0, inactive: true });
  }

  // Add actual days
  for (let i = 1; i <= daysInMarch; i++) {
    const isWeekend = (i + startDay - 1) % 7 === 5 || (i + startDay - 1) % 7 === 6;
    const isOverride = i === 12 || i === 13;
    const occupancy = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
    const basePrice = isWeekend ? 290 : 210;
    const price = isOverride ? basePrice + 50 : basePrice;
    
    calendarDays.push({
      day: i,
      price,
      occupancy,
      isWeekend,
      isOverride,
      today: i === 15
    });
  }

  return (
    <div className="flex h-full overflow-hidden bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      {/* Control Sidebar */}
      <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar p-6 space-y-8 h-full">
        {/* Room Selection */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Inventory Source</label>
          <div className="space-y-3">
            <select className="w-full bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary py-3 px-4">
              {roomTypes?.map(type => (
                <option key={type.id}>{type.name}</option>
              ))}
              {(!roomTypes || roomTypes.length === 0) && <option>No Room Types</option>}
            </select>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available units: 42</span>
              <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline uppercase tracking-wider">View All</span>
            </div>
          </div>
        </div>

        {/* Bulk Pricing Tool */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10">
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon icon="flash_on" className="text-primary" />
            <h3 className="font-extrabold text-[11px] uppercase tracking-widest text-slate-800 dark:text-white">Bulk Adjustments</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Price Modifier</label>
              <div className="flex bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-700">
                <input className="w-full pl-4 py-3 bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="+15" type="number" />
                <span className="bg-slate-100 dark:bg-slate-700 px-4 flex items-center text-[10px] font-bold border-l border-slate-100 dark:border-slate-700">%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border-2 border-primary bg-white dark:bg-slate-800 rounded-xl text-center cursor-pointer transition-all shadow-lg shadow-primary/10">
                <p className="text-[9px] text-primary font-extrabold uppercase mb-1">Fri</p>
                <MaterialIcon icon="check_circle" className="text-primary text-lg" />
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 rounded-xl text-center cursor-pointer hover:border-primary transition-all">
                <p className="text-[9px] text-slate-400 font-extrabold uppercase mb-1">Sat</p>
                <MaterialIcon icon="radio_button_unchecked" className="text-slate-200 text-lg" />
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-opacity-90 text-white font-extrabold py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20">Apply Changes</button>
          </div>
        </div>

        {/* Market Intel */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Market Pulse</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <MaterialIcon icon="event" className="text-amber-500 text-sm" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Tech Summit (Mar 12)</span>
              </div>
              <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-extrabold shadow-sm">HIGH</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <MaterialIcon icon="trending_up" className="text-blue-500 text-sm" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Competitor Avg.</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-900 dark:text-white">$285</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden flex flex-col bg-background-light dark:bg-background-dark p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-extrabold uppercase tracking-tighter">March 2024</h2>
            <div className="flex bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-1">
              <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg"><MaterialIcon icon="chevron_left" /></button>
              <button className="px-5 text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg">Today</button>
              <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg"><MaterialIcon icon="chevron_right" /></button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex rounded-xl bg-white dark:bg-slate-900 p-1 shadow-sm border border-slate-200 dark:border-slate-800">
              <button className="px-6 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-lg bg-primary text-white shadow-md shadow-primary/20">Month</button>
              <button className="px-6 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Week</button>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] font-extrabold text-green-700 dark:text-green-400 uppercase tracking-widest">AI Strategy Active</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">{day}</div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-7">
            {calendarDays.map((d, i) => (
              <div 
                key={i} 
                className={`border-r border-b border-slate-50 dark:border-slate-800/50 p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group relative ${
                  d.inactive ? 'opacity-20 bg-slate-50 dark:bg-slate-800/20' : ''
                } ${d.isOverride ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''} ${d.occupancy && d.occupancy > 90 ? 'bg-rose-50/30 dark:bg-rose-900/10' : ''}`}
              >
                {!d.inactive && (
                  <>
                    <span className={`text-[11px] font-extrabold ${
                      d.today ? 'bg-primary text-white w-7 h-7 flex items-center justify-center rounded-lg shadow-lg shadow-primary/20' : 'text-slate-400'
                    }`}>{d.day}</span>
                    <div className="mt-6 space-y-3">
                      <div className={`text-2xl font-extrabold uppercase tracking-tighter ${d.isOverride ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
                        ${d.price}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          <span>Occ.</span>
                          <span>{d.occupancy}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                          <div 
                            className={`h-full ${d.occupancy && d.occupancy > 90 ? 'bg-rose-500' : 'bg-primary'} transition-all duration-1000`} 
                            style={{ width: `${d.occupancy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {d.isOverride && (
                      <div className="absolute top-6 right-6">
                        <span className="w-2 h-2 rounded-full bg-amber-500 flex shadow-sm shadow-amber-500/50"></span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Override Panel */}
      <aside className="w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-0 flex flex-col h-full">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/20 dark:bg-slate-800/20">
          <div>
            <h3 className="font-extrabold text-xl uppercase tracking-tight">March 12, 2024</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase italic mt-1">Tuesday • Deluxe King Suite</p>
          </div>
          <button className="text-slate-400 hover:text-primary transition-colors hover:rotate-90 transition-transform">
            <MaterialIcon icon="close" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:scale-105">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-2">Demand</p>
              <p className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">92%</p>
              <p className="text-[9px] text-emerald-500 font-bold mt-2 uppercase">↑ Very High</p>
            </div>
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:scale-105">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-2">Comp Set</p>
              <p className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white">$285</p>
              <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Avg. Price</p>
            </div>
          </div>

          {/* Pricing Actions */}
          <div className="space-y-6">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">Strategic Controls</label>
            <div className="p-6 border-2 border-primary rounded-2xl bg-primary/5 shadow-lg shadow-primary/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-tight">Override Base</span>
                <span className="bg-primary text-white text-[9px] px-3 py-1 rounded-full font-extrabold shadow-sm shadow-primary/20">MANUAL</span>
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-extrabold text-xl font-display">$</span>
                <input className="w-full pl-10 pr-6 py-4 bg-white dark:bg-slate-800 rounded-xl border-transparent focus:ring-0 text-3xl font-extrabold tracking-tighter shadow-inner" type="number" defaultValue="310" />
              </div>
            </div>
          </div>

          {/* Restriction Toggles */}
          <div className="space-y-6">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">Operational Constraints</label>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[11px] font-bold uppercase tracking-tight">Min. Stay (LOS)</span>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-100"><MaterialIcon icon="remove" className="text-xs" /></button>
                  <span className="w-6 text-center text-sm font-extrabold">2</span>
                  <button className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-100"><MaterialIcon icon="add" className="text-xs" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[11px] font-bold uppercase tracking-tight italic">Closed to Arrival</span>
                <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex gap-4">
            <button className="flex-1 bg-primary text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-[11px] uppercase tracking-widest">Update Strategy</button>
            <button className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 text-slate-400">
              <MaterialIcon icon="history" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
