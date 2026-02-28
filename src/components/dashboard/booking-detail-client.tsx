"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import Link from "next/link";
import { useState } from "react";
import { updateBookingStatusAction } from "@/app/dashboard/bookings/actions";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingDetailClientProps {
  booking: any;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Confirmation",
  confirmed: "Confirmed Reservation",
  "checked-in": "Active Residency",
  "checked-out": "Completed Stay",
  cancelled: "Cancelled Booking",
};

const NEXT_ACTIONS: Record<string, { label: string; icon: string; next: string }> = {
  pending: { label: "Confirm Reservation", icon: "check_circle", next: "confirmed" },
  confirmed: { label: "Initialize Check-In", icon: "login", next: "checked-in" },
  "checked-in": { label: "Initialize Check-Out", icon: "logout", next: "checked-out" },
};

export function BookingDetailClient({ booking }: BookingDetailClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleStatusChange(nextStatus: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await updateBookingStatusAction(booking.id, booking.status, nextStatus);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const action = NEXT_ACTIONS[booking.status];

  return (
    <div className="flex justify-end min-h-screen bg-transparent animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.3)] flex flex-col border-l border-slate-200 dark:border-slate-800 h-full relative z-10">
        
        <header className="sticky top-0 z-20 px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex justify-between items-start mb-8">
            <Link href="/dashboard/bookings" className="p-2.5 -ml-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-primary">
              <MaterialIcon icon="close" />
            </Link>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border shadow-sm ${
                booking.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                booking.status === 'checked-in' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'
              }`}>
                {STATUS_LABELS[booking.status] || booking.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/5">
              <MaterialIcon icon="person" className="text-4xl" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Guest Profile</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{booking.guest_name}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                <MaterialIcon icon="loyalty" className="text-xs not-italic" />
                Registry <span className="text-slate-900 dark:text-white not-italic font-black ml-1">#{booking.id.substring(0, 8)}</span>
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar px-10 py-10 space-y-12">
          
          <section>
            <div className="flex items-center gap-3 mb-6 group">
              <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                <MaterialIcon icon="calendar_today" className="text-primary text-sm" />
              </div>
              <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">Stay Architecture</h3>
            </div>
            <div className="grid grid-cols-2 gap-8 bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black">Check-In Registry</label>
                <p className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">{booking.check_in_date}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase italic">From 14:00 PM Protocol</p>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black">Check-Out Deadline</label>
                <p className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">{booking.check_out_date}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase italic">By 11:00 AM Protocol</p>
              </div>
              <div className="col-span-2 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black block mb-2">Inventory Assignment</label>
                  <p className="font-black text-sm uppercase tracking-tight text-primary">Room {booking.rooms?.room_number} — {booking.rooms?.room_types?.name}</p>
                </div>
                <div className="text-right">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black block mb-2">Interval</label>
                  <p className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">
                    {Math.max(1, Math.ceil((new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 60 * 60 * 24)))} Full Cycles
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 group">
              <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                <MaterialIcon icon="contact_mail" className="text-primary text-sm" />
              </div>
              <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">Guest Credentials</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Electronic Mail', val: booking.guest_email || 'NOT REGISTERED', icon: 'alternate_email' },
                { label: 'Mobile Frequency', val: booking.guest_phone || 'NOT REGISTERED', icon: 'smartphone' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-6 group cursor-pointer p-2 -ml-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <MaterialIcon icon={item.icon} className="text-sm" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <MaterialIcon icon="receipt_long" className="text-primary text-sm" />
                </div>
                <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">Fiscal Ledger</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                  <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-6 py-4">Descriptor</th>
                    <th className="px-6 py-4 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Consolidated Booking Charge</td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white uppercase tracking-tighter">₦{booking.total_price.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-primary/5 dark:bg-primary/10 border-t border-primary/10">
                  <tr>
                    <td className="px-6 py-5 font-black text-[10px] text-primary uppercase tracking-[0.2em]">Consolidated Amount</td>
                    <td className="px-6 py-5 text-right font-black text-primary text-2xl tracking-tighter">₦{booking.total_price.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </main>

        <footer className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-8 z-20">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-wide">
              <MaterialIcon icon="error_outline" />
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="flex items-center justify-center gap-3 px-6 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]">
              <MaterialIcon icon="print" className="text-sm" />
              Fiscal Record
            </button>
            <button 
              onClick={() => handleStatusChange('cancelled')}
              disabled={loading || booking.status === 'cancelled' || booking.status === 'checked-out'}
              className="flex items-center justify-center gap-3 px-6 py-4 border border-red-200 dark:border-red-900/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <MaterialIcon icon="cancel" className="text-sm" />
              Void Protocol
            </button>
          </div>

          {action ? (
            <button 
              onClick={() => handleStatusChange(action.next)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-primary text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <LucideLoader2 className="animate-spin h-5 w-5" /> : (
                <>
                  <MaterialIcon icon={action.icon} className="text-lg" />
                  {action.label}
                </>
              )}
            </button>
          ) : (
             <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-center">
                Registry Cycle Concluded
             </div>
          )}
        </footer>
      </div>
    </div>
  );
}
