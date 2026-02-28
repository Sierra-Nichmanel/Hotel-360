"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  branches: any[];
  currentUserRole: string;
  currentUserBranchId?: string;
}

export function AddStaffModal({ 
  isOpen, 
  onClose, 
  organizationId, 
  branches,
  currentUserRole,
  currentUserBranchId
}: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const fullName = formData.get("full_name") as string;
    const role = formData.get("role") as string;
    const branchId = formData.get("branch_id") as string;

    // In a real app, we would use an admin API or invite system.
    // For this demo, we'll simulate adding a profile directly 
    // (Note: This normally requires a service role or custom edge function to bypass signup)
    
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        hotel_id: organizationId,
        branch_id: branchId,
        role: role,
        full_name: fullName,
        // In a real system, we'd create the auth user first
        id: crypto.randomUUID(), // Mock ID for demo purposes if not handling auth here
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Onboard Personnel</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Register new staff member into the ecosystem</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <MaterialIcon icon="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold uppercase">
              <MaterialIcon icon="error" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Full Name</label>
              <input required name="full_name" placeholder="John Doe" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
              <input required name="email" type="email" placeholder="john@hotel360.com" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Role</label>
                <select required name="role" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase">
                  <option value="receptionist">Receptionist</option>
                  <option value="accountant">Accountant</option>
                  <option value="branch_manager">Branch Manager</option>
                  {currentUserRole === 'super_admin' && <option value="super_admin">Super Admin</option>}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Station</label>
                <select 
                  required 
                  name="branch_id" 
                  disabled={currentUserRole === 'branch_manager'}
                  defaultValue={currentUserBranchId}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase disabled:opacity-50"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
            <button disabled={loading} className="flex-[2] px-6 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-opacity-90 shadow-xl shadow-primary/20 transition-all disabled:opacity-50">
              {loading ? "Processing..." : "Confirm Onboarding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
