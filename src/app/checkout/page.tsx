import { createClient } from "@/lib/supabase/server";
import { PLANS, SubscriptionPlan } from "@/config/plans";
import { initializePaystackTransaction } from "@/lib/paystack";
import { redirect } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";

export default async function CheckoutPage({ 
  searchParams 
}: { 
  searchParams: { plan?: string } 
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/auth");

  const planId = (searchParams.plan || "starter") as SubscriptionPlan;
  const plan = PLANS[planId];

  async function startPayment() {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const checkout = await initializePaystackTransaction(user.email!, plan.monthlyPrice, {
        user_id: user.id,
        plan: planId,
      });
      redirect(checkout.authorization_url);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <MaterialIcon icon="credit_card" className="text-4xl" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Initialize Activation</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Securely activate your {plan.name} License</p>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 text-left border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Package</span>
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Due</span>
            <span className="text-xl font-black text-primary uppercase tracking-tighter">₦{plan.monthlyPrice.toLocaleString()}</span>
          </div>
        </div>

        <form action={startPayment}>
          <button className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-opacity-90 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3">
            Finalize & Pay via Paystack
            <MaterialIcon icon="arrow_forward" className="text-sm" />
          </button>
        </form>

        <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2 italic">
          <MaterialIcon icon="verified_user" className="text-[14px]" />
          Shielded by enterprise-grade encryption
        </p>
      </div>
    </div>
  );
}
