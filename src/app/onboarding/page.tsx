"use client";

import { useState } from "react";
import { selectTrial, selectPlan } from "./actions";
import { MaterialIcon } from "@/components/ui/material-icon";
import { LucideLoader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  { 
    id: "starter", 
    name: "Starter", 
    price: "₦5,000", 
    description: "Perfect for single property management",
    features: ["1 Branch", "Room Management", "Basic Analytics", "Email Support"],
    color: "from-blue-500/10 to-blue-600/10",
    borderColor: "group-hover:border-blue-500/50 peer-checked:border-blue-500"
  },
  { 
    id: "growth", 
    name: "Growth", 
    price: "₦15,000", 
    description: "Scale your hospitality business",
    features: ["Up to 5 Branches", "Advanced Analytics", "Priority Support", "Staff Roles"],
    color: "from-gold-accent/10 to-[#C19A2E]/10",
    borderColor: "group-hover:border-gold-accent/50 peer-checked:border-gold-accent"
  },
  { 
    id: "scale", 
    name: "Scale", 
    price: "₦50,000", 
    description: "Enterprise grade control",
    features: ["Up to 20 Branches", "API Access", "Dedicated Manager", "White-labeling"],
    color: "from-purple-500/10 to-purple-600/10",
    borderColor: "group-hover:border-purple-500/50 peer-checked:border-purple-500"
  }
];

export default function OnboardingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleTrial = async () => {
    setLoading("trial");
    try {
      await selectTrial();
    } catch (error) {
      console.error(error);
      setLoading(null);
    }
  };

  const handleSelectPlan = async () => {
    if (!selectedPlan) return;
    setLoading("plan");
    try {
      await selectPlan(selectedPlan);
    } catch (error) {
      console.error(error);
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 max-w-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-xl shadow-primary/20">
            <MaterialIcon icon="card_membership" className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Choose Your <span className="text-gold-accent">Path Forward</span>.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Whether you're just starting or scaling an empire, we have the perfect plan to elevate your hospitality management.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 w-full">
          {/* Free Trial Option */}
          <div className="lg:col-span-4">
            <div className="h-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between hover:border-primary/30 transition-all group">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MaterialIcon icon="auto_awesome" className="text-primary text-xl" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">Limited Time</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">7-Day Free Trial</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                  Get full access to all Starter features for 7 days. No credit card required.
                </p>
                <ul className="space-y-4 mb-8">
                  {["All Starter Features", "Full Dashboard Access", "Up to 10 Rooms", "Instant Setup"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium">
                      <MaterialIcon icon="check_circle" className="text-emerald-500 text-lg" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleTrial}
                disabled={!!loading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {loading === "trial" ? (
                  <LucideLoader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Start 7-Day Free Trial
                    <MaterialIcon icon="rocket_launch" className="text-lg" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Paid Plans Section */}
          <div className="lg:col-span-8">
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl h-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold">Select a Subscription Plan</h3>
                <span className="px-4 py-1.5 bg-gold-accent/10 text-gold-accent rounded-full text-xs font-bold uppercase tracking-widest border border-gold-accent/20">
                  Best Value
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <label key={plan.id} className="relative cursor-pointer group flex flex-col">
                    <input 
                      type="radio" 
                      name="plan" 
                      value={plan.id} 
                      onChange={() => setSelectedPlan(plan.id)}
                      className="peer sr-only" 
                    />
                    <div className={cn(
                      "flex-1 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all flex flex-col group-hover:bg-slate-50 dark:group-hover:bg-slate-900",
                      plan.borderColor
                    )}>
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br", plan.color)}>
                        <MaterialIcon icon={plan.id === "starter" ? "apartment" : plan.id === "growth" ? "business" : "corporate_fare"} className="text-slate-900 dark:text-white" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        {plan.name}
                      </span>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                        <span className="text-xs font-bold text-slate-500">/mo</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                        {plan.description}
                      </p>
                      <div className="mt-auto space-y-2">
                        {plan.features.slice(0, 3).map(f => (
                          <div key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleSelectPlan}
                disabled={!selectedPlan || !!loading}
                className={cn(
                  "w-full mt-8 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg",
                  selectedPlan 
                    ? "bg-gold-accent hover:bg-[#C19A2E] text-slate-900 shadow-gold-accent/20" 
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                )}
              >
                {loading === "plan" ? (
                  <LucideLoader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue with Selected Plan
                    <MaterialIcon icon="arrow_forward" className="text-lg" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-12 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <MaterialIcon icon="security" className="text-emerald-500 text-lg" />
          Secure payment processing powered by Paystack
        </p>
      </div>
    </main>
  );
}
