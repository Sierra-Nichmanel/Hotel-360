import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import Link from "next/link";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Guest Checkout</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Finalize guest folio and process secure payment for departure.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
          <MaterialIcon icon="lock" className="text-slate-400 text-sm" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secure Protocol</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-12 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
          <div className="absolute top-5 left-0 w-2/3 h-0.5 bg-primary -z-10 transition-all duration-1000"></div>
          
          <div className="flex flex-col items-center gap-2 bg-background-light dark:bg-background-dark px-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 ring-4 ring-white dark:ring-slate-900">1</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Folio Review</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-background-light dark:bg-background-dark px-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 ring-4 ring-white dark:ring-slate-900">2</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Settlement</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-background-light dark:bg-background-dark px-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-bold ring-4 ring-white dark:ring-slate-900">3</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Departure</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Folio Breakdown */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
              <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <MaterialIcon icon="receipt_long" className="text-primary" />
                Detailed Breakdown
              </h2>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Folio: #H360-8821</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                  <tr className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    <th className="px-8 py-4">Transaction Details</th>
                    <th className="px-8 py-4 text-right">Service Date</th>
                    <th className="px-8 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { label: 'Deluxe King Room', desc: '3 Nights Stay', date: 'Oct 12 - 15', amount: 750.00, icon: 'bed', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Mini-bar & Snacks', desc: 'Sparkling water, Premium nuts', date: 'Oct 13', amount: 42.50, icon: 'liquor', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Serenity Spa', desc: 'Full body aromatherapy', date: 'Oct 14', amount: 180.00, icon: 'spa', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${item.color}`}>
                            <MaterialIcon icon={item.icon} className="text-sm" />
                          </div>
                          <div>
                            <div className="text-[11px] font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">{item.label}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase italic">{item.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right text-[10px] font-bold text-slate-500 uppercase">{item.date}</td>
                      <td className="px-8 py-5 text-right font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
              <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <MaterialIcon icon="account_balance_wallet" className="text-primary" />
                Settlement Method
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by</span>
                <span className="text-xs font-black text-primary uppercase tracking-tighter">paystack</span>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-10">
                <label className="relative cursor-pointer group">
                  <input type="radio" name="payment" defaultChecked className="peer sr-only" />
                  <div className="p-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                    <MaterialIcon icon="credit_card" className="text-slate-400 peer-checked:text-primary mb-2" />
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 peer-checked:text-primary">Card & Bank</div>
                  </div>
                </label>
                <label className="relative cursor-pointer group opacity-50">
                  <input type="radio" name="payment" className="peer sr-only" disabled />
                  <div className="p-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-center">
                    <MaterialIcon icon="qr_code_2" className="text-slate-300 mb-2" />
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Other Channels</div>
                  </div>
                </label>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Cardholder Designation</label>
                    <input className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase" placeholder="ALEXANDER GUEST" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Secure Card Input</label>
                    <div className="relative">
                      <input className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all font-mono" placeholder="0000 0000 0000 0000" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                        <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded shadow-inner"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Expiration Profile</label>
                    <input className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all" placeholder="MM / YY" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Verification Security (CVV)</label>
                    <input className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all" placeholder="***" type="password" />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-center gap-10 py-6 border-t border-slate-50 dark:border-slate-800 opacity-40">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="verified_user" className="text-sm" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">PCI DSS Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="lock" className="text-sm" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">AES-256 Encrypted</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Folio Summary Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="relative h-40">
              <img 
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2574&auto=format&fit=crop" 
                className="w-full h-full object-cover" 
                alt="Luxury Suite"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-extrabold uppercase tracking-tight text-lg">Deluxe King Room</h3>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest italic">Room 402 • Main Building</p>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Arrival</span>
                  <span className="text-slate-900 dark:text-white">Oct 12, 2023</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Departure</span>
                  <span className="text-slate-900 dark:text-white">Oct 15, 2023</span>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Guest Folio</span>
                  <span className="text-slate-900 dark:text-white">Alexander Guest</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 space-y-4 shadow-inner border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-900 dark:text-white">$972.50</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Service Fee (12%)</span>
                  <span className="text-slate-900 dark:text-white">$116.70</span>
                </div>
                <div className="pt-4 border-t border-primary/20 flex flex-col items-end gap-1">
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Global Total Due</span>
                  <span className="text-4xl font-black text-primary tracking-tighter">$1,089.20</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest">
                <MaterialIcon icon="payment" className="text-lg" />
                Authorize Folio Settlement
              </button>
              
              <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-tight leading-relaxed px-4">
                By processing, you verify all folio charges are correct and authorized for direct debit settlement.
              </p>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 flex items-center gap-5 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
              <MaterialIcon icon="headset_mic" className="text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-tight">Need assistance?</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase italic mt-1 leading-none">Concierge is available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
