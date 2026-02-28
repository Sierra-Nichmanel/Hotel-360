"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { AddRoomTypeModal } from "@/components/modals/add-room-type-modal";
import { AddRoomModal } from "@/components/modals/add-room-modal";
import { CreateBookingModal } from "@/components/modals/create-booking-modal";
import { useRouter } from "next/navigation";

interface RoomsClientProps {
  rooms: any[];
  branches: any[];
  organizationId: string;
  branchId: string;
  roomTypes: any[];
}

export function RoomsClient({ rooms, branches, organizationId, branchId, roomTypes }: RoomsClientProps) {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);
  const [preselectedRoomId, setPreselectedRoomId] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleOpenBookingModal = (roomId: string) => {
    setPreselectedRoomId(roomId);
    setIsCreateBookingModalOpen(true);
  };

  const availableCount = rooms?.filter(r => r.status === 'available').length || 0;
  const occupiedCount = rooms?.filter(r => r.status === 'occupied').length || 0;
  const maintenanceCount = rooms?.filter(r => r.status === 'maintenance').length || 0;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Room Inventory</h2>
          <p className="text-sm text-slate-500 italic">Manage real-time room availability and status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.refresh()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase"
          >
            <MaterialIcon icon="refresh" className="text-sm" />
            Refresh
          </button>
          <button 
            onClick={() => setIsTypeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase"
          >
            <MaterialIcon icon="category" className="text-sm" />
            Add Type
          </button>
          <button 
            onClick={() => setIsRoomModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-shadow shadow-lg shadow-primary/20 uppercase"
          >
            <MaterialIcon icon="add" className="text-sm" />
            Add Room
          </button>
        </div>
      </div>

      {/* Filter & Summary Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[300px] relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm italic" placeholder="Search room number or guest..." type="text"/>
          </div>
          <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary font-bold uppercase">
            {branches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            <option value="all">All Branches</option>
          </select>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>
          
          {/* Status Ribbon */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold uppercase tracking-wider">{availableCount} Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-xs font-bold uppercase tracking-wider">{occupiedCount} Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-xs font-bold uppercase tracking-wider">{maintenanceCount} Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
            {rooms?.map((room) => (
              <div key={room.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter">{room.room_number}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{room.room_types?.name} • Floor {room.room_number.charAt(0)}</p>
                  </div>
                  <span className={`px-2 py-1 text-[9px] font-bold rounded uppercase tracking-widest ${
                    room.status === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500' :
                    room.status === 'occupied' ? 'bg-primary/10 text-primary dark:bg-primary/20' :
                    'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500'
                  }`}>
                    {room.status}
                  </span>
                </div>
                
                <div className="py-2 mb-6 min-h-[40px]">
                  {room.status === 'occupied' ? (
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <MaterialIcon icon="person" className="text-sm" />
                       </div>
                       <div>
                         <p className="text-[10px] font-bold uppercase text-slate-900 dark:text-white">Active Folio</p>
                         <p className="text-[9px] text-slate-500 italic uppercase">Guest In-House</p>
                       </div>
                    </div>
                  ) : room.status === 'available' ? (
                    <p className="text-[10px] text-slate-400 italic font-medium uppercase tracking-wider">Ready for check-in</p>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <MaterialIcon icon="engineering" className="text-sm" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">In Maintenance</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">₦{room.room_types?.base_price?.toLocaleString() || '0'} <span className="text-[10px] font-normal text-slate-400">/ night</span></span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-primary transition-colors">
                      <MaterialIcon icon="edit" className="text-sm" />
                    </button>
                    {room.status === 'available' && (
                      <button 
                        onClick={() => handleOpenBookingModal(room.id)}
                        className="px-3 py-1 bg-primary text-white text-[9px] font-bold rounded hover:bg-opacity-90 transition-all uppercase tracking-widest active:scale-95"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!rooms || rooms.length === 0) && (
              <div className="col-span-full py-24 text-center text-slate-400 bg-white dark:bg-slate-900 font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl uppercase tracking-[0.2em]">
                NO ASSETS REGISTERED
              </div>
            )}
          </div>
        </div>

        {/* Right Side Info Panel */}
        <aside className="w-80 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-xl hidden xl:flex flex-col shadow-sm h-fit">
          <div className="mb-8">
            <h4 className="font-bold text-lg text-slate-900 dark:text-white uppercase">Room Insights</h4>
            <p className="text-[10px] text-slate-500 italic mt-1 font-medium italic font-medium italic">Operational summary and recent logs.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
              <MaterialIcon icon="touch_app" className="text-4xl text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4">Select a room from the grid to manage assignment or status.</p>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Occupancy Rate</span>
                <span className="text-[10px] font-bold text-primary">{rooms?.length ? Math.round((occupiedCount / rooms.length) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-1000" 
                  style={{ width: `${rooms?.length ? Math.round((occupiedCount / rooms.length) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <AddRoomTypeModal 
        isOpen={isTypeModalOpen} 
        onClose={() => {
          setIsTypeModalOpen(false);
          router.refresh();
        }}
        organizationId={organizationId}
        branchId={branchId}
      />

      <AddRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          router.refresh();
        }}
        organizationId={organizationId}
        branchId={branchId}
        roomTypes={roomTypes}
      />

      <CreateBookingModal 
        isOpen={isCreateBookingModalOpen}
        onClose={() => {
          setIsCreateBookingModalOpen(false);
          setPreselectedRoomId(undefined);
          router.refresh();
        }}
        organizationId={organizationId}
        rooms={rooms.filter(r => r.status === 'available')}
        initialRoomId={preselectedRoomId}
      />
    </div>
  );
}
