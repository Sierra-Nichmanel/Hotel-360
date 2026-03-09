"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { updateBranchAction } from "./actions";
import { LucideLoader2 } from "lucide-react";

interface BranchSettingsFormProps {
  branch: any;
}

export function BranchSettingsForm({ branch }: BranchSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await updateBranchAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Property specifications synchronized!");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <MaterialIcon icon="location_on" className="text-primary text-xl" />
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-800 dark:text-white">Property Specifics</h2>
        </div>
        {loading && <LucideLoader2 className="animate-spin h-4 w-4 text-primary" />}
      </div>
      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-wide">
            <MaterialIcon icon="error_outline" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl flex items-center gap-3 text-emerald-600 text-[10px] font-bold uppercase tracking-wide">
            <MaterialIcon icon="check_circle" />
            {success}
          </div>
        )}
        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input type="hidden" name="id" value={branch?.id} />
          <div className="space-y-3 md:col-span-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Branch Designation</label>
            <input 
              name="name" 
              defaultValue={branch?.name}
              required
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Public Phone</label>
            <input 
              name="phone" 
              defaultValue={branch?.phone || ""}
              placeholder="+234 ..."
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
            <input 
              name="address" 
              defaultValue={branch?.address || ""}
              placeholder="123 Luxury Street..."
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-fit px-8 py-3 bg-primary text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            Synchronize Property
          </button>
        </form>
      </div>
    </section>
  );
}
