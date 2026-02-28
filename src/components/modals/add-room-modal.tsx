"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { createRoomAction } from "@/app/dashboard/rooms/actions";
import { LucideLoader2 } from "lucide-react";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  branchId: string;
  roomTypes: any[];
}

export function AddRoomModal({ isOpen, onClose, organizationId, branchId, roomTypes }: AddRoomModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await createRoomAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <form action={handleSubmit} className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative z-10 border border-slate-200 dark:border-slate-800">
        <input type="hidden" name="hotel_id" value={organizationId} />
        <input type="hidden" name="branch_id" value={branchId} />

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-slate-900 dark:text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MaterialIcon icon="meeting_room" className="text-primary text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Add physical Room</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic mt-0.5">Register a new room unit in the system.</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
          >
            <MaterialIcon icon="close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Room Number / ID</label>
            <div className="relative">
              <MaterialIcon icon="tag" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                name="room_number" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all uppercase placeholder:text-slate-300 shadow-inner dark:text-white" 
                placeholder="e.g. 101 or SUITE-A" 
                type="text" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Category</label>
            <div className="relative">
              <MaterialIcon icon="category" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <select 
                name="room_type_id" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all appearance-none cursor-pointer shadow-inner uppercase dark:text-white"
              >
                <option value="">Select Room Type...</option>
                {roomTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name} (₦{type.base_price.toLocaleString()})</option>
                ))}
              </select>
              <MaterialIcon icon="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>
            {roomTypes.length === 0 && (
              <p className="text-[9px] text-primary font-bold uppercase mt-2">No Room Types found. Please create one first.</p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-wide">
              <MaterialIcon icon="error_outline" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-4">
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-primary transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading || roomTypes.length === 0}
            className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? <LucideLoader2 className="animate-spin h-4 w-4" /> : "Deploy Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
