import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, hotels(*)")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    redirect("/dashboard");
  }

  const hotel = (profile as any).hotels;

  // Real Usage Metrics
  const { data: bookingCount } = await supabase
    .from("bookings")
    .select("id", { count: 'exact', head: true })
    .eq("hotel_id", profile.hotel_id);

  const { data: staffCount } = await supabase
    .from("profiles")
    .select("id", { count: 'exact', head: true })
    .eq("hotel_id", profile.hotel_id);

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Subscription & Billing</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Manage your hotel's billing cycles and plan usage globally.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-[10px] font-bold border border-blue-100 dark:border-blue-800 uppercase tracking-widest shadow-sm">
          <MaterialIcon icon="security" className="text-sm" />
          Secured by Paystack
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-10 pb-12">
        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Plan Card */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-primary/30 rounded-2xl p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6">
              <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">Active Plan</span>
            </div>
            
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Current Subscription</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter capitalize">{hotel.subscription_plan || 'Scale'}</h2>
                <span className="text-slate-400 text-lg font-bold uppercase tracking-tight italic">/ Monthly</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md font-medium">
                Your next billing cycle starts shortly. You are currently utilizing the <span className="font-bold text-slate-900 dark:text-white uppercase">
                  {hotel.subscription_plan || 'Scale'}
                </span> tier for operational excellence.
              </p>
            </div>
            
            <div className="mt-10 flex gap-4">
              <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20">Manage Billing</button>
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-300">Transaction History</button>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold mb-8 text-[11px] uppercase tracking-[0.2em] text-slate-500">Resource Usage</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[11px] mb-3 font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Total Bookings</span>
                  <span className="text-slate-900 dark:text-white uppercase Tracking-tight">{bookingCount?.length || 0} Records</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-3 font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Active Personnel</span>
                  <span className="text-slate-900 dark:text-white uppercase tracking-tight">{staffCount?.length || 0} Slots</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-3 font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Organization Nodes</span>
                  <span className="text-slate-900 dark:text-white uppercase tracking-tight">Active</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold uppercase tracking-tight">Expand Your Potential</h2>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg">Monthly</button>
              <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-slate-700 shadow-sm rounded-lg text-primary">Yearly (Save 20%)</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Starter */}
            <div className={`bg-white dark:bg-slate-900 border ${hotel.subscription_plan === 'starter' ? 'border-primary shadow-lg' : 'border-slate-200 dark:border-slate-800'} rounded-2xl p-6 flex flex-col hover:border-primary/40 transition-all cursor-pointer group`}>
              {hotel.subscription_plan === 'starter' && <div className="bg-primary text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">Active</div>}
              <h3 className="text-lg font-bold mb-1 uppercase tracking-tight group-hover:text-primary transition-colors">Starter</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-6 italic">Boutique property control.</p>
              <div className="mb-6 font-bold">
                <span className="text-2xl font-extrabold uppercase tracking-tighter">₦30,000</span>
                <span className="text-slate-400 text-[10px] uppercase">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">
                  <MaterialIcon icon="check_circle" className="text-emerald-500 text-xs" /> Up to 1 Property
                </li>
              </ul>
              <button className="w-full py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Select</button>
            </div>

            {/* Growth */}
            <div className={`bg-white dark:bg-slate-900 border ${hotel.subscription_plan === 'growth' ? 'border-primary shadow-lg' : 'border-slate-200 dark:border-slate-800'} rounded-2xl p-6 flex flex-col hover:border-primary/40 transition-all cursor-pointer group`}>
              {hotel.subscription_plan === 'growth' && <div className="bg-primary text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">Active</div>}
              <h3 className="text-lg font-bold mb-1 uppercase tracking-tight group-hover:text-primary transition-colors">Growth</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-6 italic">Scaling hotel chains.</p>
              <div className="mb-6 font-bold">
                <span className="text-2xl font-extrabold uppercase tracking-tighter">₦85,000</span>
                <span className="text-slate-400 text-[10px] uppercase">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">
                  <MaterialIcon icon="check_circle" className="text-emerald-500 text-xs" /> Up to 5 Properties
                </li>
              </ul>
              <button className="w-full py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Select</button>
            </div>

            {/* Scale */}
            <div className={`bg-white dark:bg-slate-900 border ${hotel.subscription_plan === 'scale' || !hotel.subscription_plan ? 'border-primary shadow-xl scale-105 z-10' : 'border-slate-200 dark:border-slate-800'} rounded-2xl p-6 flex flex-col hover:border-primary/40 transition-all cursor-pointer group`}>
              {(!hotel.subscription_plan || hotel.subscription_plan === 'scale') && <div className="bg-primary text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">Current Choice</div>}
              <h3 className="text-lg font-bold mb-1 uppercase tracking-tight group-hover:text-primary transition-colors">Scale</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-6 italic">Large scale operations.</p>
              <div className="mb-6 font-bold">
                <span className="text-2xl font-extrabold uppercase tracking-tighter">₦220,000</span>
                <span className="text-slate-400 text-[10px] uppercase">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                  <MaterialIcon icon="check_circle" className="text-primary text-xs" /> 20 Properties
                </li>
              </ul>
              <button className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-[9px] uppercase tracking-widest">Selected</button>
            </div>

            {/* Enterprise */}
            <div className={`bg-white dark:bg-slate-900 border ${hotel.subscription_plan === 'enterprise' ? 'border-primary shadow-lg' : 'border-slate-200 dark:border-slate-800'} rounded-2xl p-6 flex flex-col hover:border-primary/40 transition-all cursor-pointer group`}>
              <h3 className="text-lg font-bold mb-1 uppercase tracking-tight group-hover:text-primary transition-colors">Enterprise</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-6 italic">Custom solutions.</p>
              <div className="mb-6 font-bold">
                <span className="text-2xl font-extrabold uppercase tracking-tighter">Custom</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">
                  <MaterialIcon icon="check_circle" className="text-emerald-500 text-xs" /> Unlimited Nodes
                </li>
              </ul>
              <button className="w-full py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-400">Contact</button>
            </div>
          </div>
        </div>

        {/* Billing Information & Payment History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Payment Method */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-extrabold uppercase text-[11px] tracking-[0.2em] text-slate-500">Payment method</h3>
              <button className="text-primary text-[10px] font-extrabold uppercase tracking-widest hover:underline">Edit</button>
            </div>
            <div className="flex items-center gap-4 p-5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 mb-8">
              <div className="w-14 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center font-extrabold italic text-slate-500 text-xs shadow-inner">VISA</div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-tight">Visa ending in 4242</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase italic">Expires 12/26</p>
              </div>
              <MaterialIcon icon="verified" className="text-emerald-500 text-xl" />
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-center gap-2 opacity-40">
                <span className="text-[9px] font-bold uppercase tracking-widest">Powered by</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-xs font-extrabold uppercase tracking-tighter">paystack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
              <h3 className="font-extrabold uppercase text-[11px] tracking-[0.2em] text-slate-500">Billing History</h3>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <MaterialIcon icon="filter_list" className="text-lg" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[9px] uppercase font-extrabold tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Invoice ID</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { date: 'Oct 15, 2023', id: 'INV-360-0092', amount: '₦1,200,000.00' },
                    { date: 'Sep 15, 2023', id: 'INV-360-0081', amount: '₦99,000.00' },
                    { date: 'Aug 15, 2023', id: 'INV-360-0075', amount: '₦99,000.00' },
                  ].map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-5 text-xs font-bold uppercase text-slate-600 dark:text-slate-400">{inv.date}</td>
                      <td className="px-8 py-5 text-xs font-extrabold uppercase tracking-tight">{inv.id}</td>
                      <td className="px-8 py-5 text-xs font-bold uppercase text-primary">{inv.amount}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                          <MaterialIcon icon="file_download" className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Showing recent activity</p>
              <button className="text-[9px] font-extrabold text-primary hover:underline uppercase tracking-widest">View All Archives</button>
            </div>
          </div>
        </div>

        {/* Support Banner */}
        <div className="bg-primary rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center shadow-inner">
              <MaterialIcon icon="headset_mic" className="text-4xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight">Need assistance?</h3>
              <p className="text-white/70 text-sm font-medium italic mt-1">Our dedicated support team is available 24/7 for custom enterprise solutions.</p>
            </div>
          </div>
          <button className="bg-white text-primary px-10 py-4 rounded-2xl font-extrabold uppercase tracking-[0.1em] text-xs hover:scale-105 transition-all shadow-xl hover:shadow-white/20 relative z-10 whitespace-nowrap">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
