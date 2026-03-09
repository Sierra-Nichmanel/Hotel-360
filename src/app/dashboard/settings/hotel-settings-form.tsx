"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { updateHotelAction } from "./actions";
import { LucideLoader2 } from "lucide-react";

interface HotelSettingsFormProps {
  hotel: any;
}

export function HotelSettingsForm({ hotel }: HotelSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await updateHotelAction(formData);
      if (result?.error) {
        setError(result.error);
        if (result.error.includes("column \"location\" of relation \"hotels\" does not exist")) {
           setError("Database update required. Please run the SQL migration to add the 'location' column.");
        }
      } else {
        if (result?.warning) {
          setError(result.warning); // Show warning as a non-breaking error or specific warning UI
        } else {
          setSuccess("Hotel identity updated successfully!");
        }
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
          <MaterialIcon icon="corporate_fare" className="text-primary text-xl" />
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-800 dark:text-white">Hotel Information</h2>
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
        <form action={handleSubmit} className="grid grid-cols-1 gap-8">
          <input type="hidden" name="id" value={hotel.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Legal Entity Name</label>
              <input 
                name="name" 
                defaultValue={hotel.name}
                required
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Headquarters Location</label>
              <div className="relative">
                <MaterialIcon icon="room" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  name="location" 
                  defaultValue={hotel.location || ""}
                  placeholder="e.g. LAGOS, NIGERIA"
                  className="w-full pl-11 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase placeholder:text-slate-300 shadow-inner"
                />
              </div>
            </div>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-fit px-8 py-3 bg-primary text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            Save Entity Identity
          </button>
        </form>
      </div>
    </section>
  );
}
