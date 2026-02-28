"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { updateBranchAction } from "@/app/dashboard/branches/actions";
import { LucideLoader2 } from "lucide-react";

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: any;
  staff: any[];
}

export function EditBranchModal({ isOpen, onClose, branch, staff }: EditBranchModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !branch) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateBranchAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Modify Property</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Updating configuration for {branch.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-primary transition-colors">
            <MaterialIcon icon="close" />
          </button>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          <input type="hidden" name="id" value={branch.id} />
          
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Branch Designation</label>
            <div className="relative group">
              <MaterialIcon icon="business" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                required
                name="name"
                defaultValue={branch.name}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm tracking-tight"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Physical Location Address</label>
            <div className="relative group">
              <MaterialIcon icon="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                required
                name="address"
                defaultValue={branch.address}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm tracking-tight"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Phone Line</label>
              <input
                required
                name="phone"
                defaultValue={branch.phone}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm tracking-tight"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Assigned Manager</label>
              <select
                name="manager_id"
                defaultValue={branch.manager_id || ""}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm tracking-tight appearance-none"
              >
                <option value="">Unassigned</option>
                {staff?.map(m => (
                  <option key={m.id} value={m.id}>{m.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-500 text-[11px] font-bold uppercase tracking-tight flex items-center gap-2">
              <MaterialIcon icon="error_outline" className="text-lg" />
              {error}
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? <LucideLoader2 className="h-4 w-4 animate-spin" /> : "Sync Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
