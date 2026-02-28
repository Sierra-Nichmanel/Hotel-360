"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState, useEffect } from "react";
import { createBookingAction } from "@/app/dashboard/bookings/actions";
import { LucideLoader2 } from "lucide-react";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  rooms: any[];
  initialRoomId?: string;
}

export function CreateBookingModal({ isOpen, onClose, organizationId, rooms, initialRoomId }: CreateBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(initialRoomId);

  useEffect(() => {
    if (isOpen) {
      setSelectedRoomId(initialRoomId);
    }
  }, [isOpen, initialRoomId]);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const roomId = formData.get("room_id") as string;
      const room = rooms.find(r => r.id === roomId);
      if (!room) throw new Error("Please select a room.");

      formData.append("room_data", JSON.stringify({
        id: room.id,
        branch_id: room.branch_id,
        type_id: room.room_type_id
      }));

      const result = await createBookingAction(formData);
      if (result && result.error) throw new Error(result.error);
      
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <form action={handleSubmit} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative z-10 border border-slate-200 dark:border-slate-800">
        <input type="hidden" name="hotel_id" value={organizationId} />

        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-slate-900 dark:text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MaterialIcon icon="book_online" className="text-primary text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">New Reservation</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic mt-0.5">Register a guest check-in or booking.</p>
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

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Guest Full Name</label>
            <div className="relative">
              <MaterialIcon icon="person_outline" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                name="guest_name" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all uppercase placeholder:text-slate-300 shadow-inner dark:text-white" 
                placeholder="e.g. JOHN DOE" 
                type="text" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Check-in Date</label>
            <input 
              name="check_in" 
              required 
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all uppercase shadow-inner dark:text-white" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Check-out Date</label>
            <input 
              name="check_out" 
              required 
              type="date"
              defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all uppercase shadow-inner dark:text-white" 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign Room</label>
            <div className="relative">
              <MaterialIcon icon="bed" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <select 
                name="room_id" 
                required 
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all appearance-none cursor-pointer shadow-inner uppercase dark:text-white"
              >
                <option value="">Select an available room...</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    Room {room.room_number} - {room.room_types?.name} (₦{room.room_types?.base_price?.toLocaleString()}/night)
                  </option>
                ))}
              </select>
              <MaterialIcon icon="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="md:col-span-2 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-wide">
              <MaterialIcon icon="error_outline" />
              {error}
            </div>
          )}
        </div>

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
            disabled={loading || (rooms.length === 0 && !selectedRoomId)}
            className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? <LucideLoader2 className="animate-spin h-4 w-4" /> : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
