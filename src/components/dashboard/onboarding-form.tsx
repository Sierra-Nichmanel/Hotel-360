"use client";

import { useState } from "react";
import { finishOnboarding } from "@/app/dashboard/onboarding-actions";
import { MaterialIcon } from "@/components/ui/material-icon";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function OnboardingForm({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await finishOnboarding(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="w-16 h-16 bg-gold-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-gold-accent/20">
        <MaterialIcon icon="auto_awesome" className="text-gold-accent text-3xl" />
      </div>
      
      <div className="max-w-md mb-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">Finalize Your Presence</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Welcome to the Hotel 360 ecosystem. We were unable to automatically sync your profile from the cloud. Let's initialize your workspace manually.
        </p>
      </div>

      <form action={handleSubmit} className="w-full max-w-sm space-y-6 text-left">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="fullName">
            Personal Identity
          </label>
          <div className="relative group">
            <MaterialIcon 
              icon="person_outline" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold-accent transition-colors text-lg" 
            />
            <input
              id="fullName"
              name="fullName"
              placeholder="Your Full Name"
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-gold-accent/20 focus:border-gold-accent outline-none transition-all dark:text-white text-sm font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="hotelName">
            Property / Group Designation
          </label>
          <div className="relative group">
            <MaterialIcon 
              icon="corporate_fare" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold-accent transition-colors text-lg" 
            />
            <input
              id="hotelName"
              name="hotelName"
              placeholder="e.g. Grand Plaza Group"
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-gold-accent/20 focus:border-gold-accent outline-none transition-all dark:text-white text-sm font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Selected Tier Context
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'starter', name: 'Starter', price: '₦30k' },
              { id: 'growth', name: 'Growth', price: '₦85k' },
              { id: 'scale', name: 'Scale', price: '₦220k' },
              { id: 'enterprise', name: 'Enterprise', price: 'Custom' },
            ].map((plan) => (
              <label key={plan.id} className="relative cursor-pointer group">
                <input type="radio" name="plan" value={plan.id} defaultChecked={plan.id === 'starter'} className="peer sr-only" />
                <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl peer-checked:border-gold-accent peer-checked:bg-gold-accent/5 transition-all flex flex-col items-center text-center group-hover:border-gold-accent/50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 peer-checked:text-gold-accent">{plan.name}</span>
                  <span className="text-xs font-bold mt-1 text-slate-900 dark:text-white">{plan.price}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-2 uppercase tracking-widest">
            <MaterialIcon icon="error_outline" className="text-lg" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-accent hover:bg-[#C19A2E] text-slate-900 font-black py-4 rounded-xl shadow-lg shadow-gold-accent/20 hover:shadow-gold-accent/30 transition-all flex items-center justify-center gap-2 mt-8 uppercase text-xs tracking-[0.2em]"
        >
          {loading ? (
            <LucideLoader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Finalize Infrastructure
              <MaterialIcon icon="bolt" className="text-sm" />
            </>
          )}
        </button>

        <p className="text-[9px] text-center text-slate-400 italic">
          Authenticated as <span className="text-slate-600 dark:text-slate-300 font-bold">{userEmail}</span>
        </p>
      </form>
    </div>
  );
}
