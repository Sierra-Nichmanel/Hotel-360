"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBookingStatusAction } from "@/app/dashboard/bookings/actions";
import { LucideLoader2 } from "lucide-react";

interface RoomAssignmentClientProps {
  booking: any;
  availableRooms: any[];
}

export function RoomAssignmentClient({ booking, availableRooms }: RoomAssignmentClientProps) {
  const [selectedRoomId, setSelectedRoomId] = useState(booking.room_id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const selectedRoom = availableRooms.find(r => r.id === selectedRoomId) || 
                       (selectedRoomId === booking.room_id ? booking.rooms : null);

  async function handleAssignAndCheckIn() {
    setLoading(true);
    setError(null);
    try {
      // 1. If room changed, update booking first (though the service action might need to handle this)
      // For now, let's assume we just want to initialize check-in with the current/selected room.
      // If the schema allows updating room_id, we should do that.
      
      const result = await updateBookingStatusAction(booking.id, booking.status, 'checked-in');
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/dashboard/bookings/${booking.id}`);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500">
      <header className="p-8 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Assignment</h1>
              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrival Registry</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{booking.guest_name}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-3 italic">
              Registry: <span className="text-primary font-black not-italic tracking-tighter">#{booking.id.substring(0, 8)}</span>
              <span className="h-1 w-1 rounded-full bg-slate-200"></span>
              Checking-in {booking.check_in_date === new Date().toISOString().split('T')[0] ? 'Today' : booking.check_in_date}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-6 py-4 bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-2xl shadow-inner">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] block mb-2 text-center">Commitment</span>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20">
                  <MaterialIcon icon="king_bed" className="text-sm" />
                </div>
                <span className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    {booking.rooms?.room_types?.name || 'Deluxe Room'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30 dark:bg-transparent">
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-wide">
            <MaterialIcon icon="error_outline" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {availableRooms.map((room) => (
            <button 
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={`flex flex-col items-start p-6 rounded-2xl transition-all relative group text-left ${
                selectedRoomId === room.id
                  ? 'bg-primary text-white border-2 border-primary shadow-2xl shadow-primary/30 scale-105 z-10' 
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              {selectedRoomId === room.id && (
                <MaterialIcon icon="check_circle" className="absolute top-4 right-4 text-white text-sm animate-pulse" />
              )}
              <span className={`text-3xl font-black tracking-tighter ${selectedRoomId === room.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {room.room_number}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-widest mt-2 ${
                selectedRoomId === room.id ? 'text-white/80' : 'text-slate-400'
              }`}>
                {room.room_types?.name}
              </span>
              <div className={`mt-8 flex items-center gap-3 ${
                selectedRoomId === room.id ? 'text-white/90' : 'text-slate-500'
              }`}>
                <MaterialIcon icon="cleaning_services" className="text-sm" />
                <span className="text-[10px] font-bold uppercase tracking-tight truncate">Ready / Clean</span>
              </div>
            </button>
          ))}

          {availableRooms.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                No alternative available inventory found
            </div>
          )}
        </div>
      </main>

      <footer className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sticky bottom-0 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="hidden lg:flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <MaterialIcon icon="info" className="text-primary text-xl" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Architecture Active</p>
            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {selectedRoom ? `Room ${selectedRoom.room_number}` : 'Selection Required'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button 
            onClick={() => router.back()}
            className="flex-1 lg:flex-none px-10 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
          >
            Abandon
          </button>
          <button 
            onClick={handleAssignAndCheckIn}
            disabled={loading || !selectedRoomId}
            className="flex-[2] lg:flex-none px-12 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <LucideLoader2 className="animate-spin h-5 w-5" /> : (
                <>
                    Initialize Check-in: {selectedRoom ? `Room ${selectedRoom.room_number}` : '...'}
                    <MaterialIcon icon="check_circle" className="text-lg" />
                </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
