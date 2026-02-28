"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell } from "@/components/ui/data-table";
import { CreateBookingModal } from "@/components/modals/create-booking-modal";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BookingsClientProps {
  bookings: any[];
  organizationId: string;
  availableRooms: any[];
}

export function BookingsClient({ bookings, organizationId, availableRooms }: BookingsClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = booking.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const arrivalsToday = bookings?.filter(b => b.check_in_date === new Date().toISOString().split('T')[0]).length || 0;
  const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Action Bar & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Bookings & Reservations Ledger</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 italic">Manage and monitor all guest stays and upcoming arrivals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.refresh()}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <MaterialIcon icon="refresh" className="text-sm" />
            Sync
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <MaterialIcon icon="add_circle_outline" />
            Create Booking
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-slate-800 border-transparent focus:border-primary focus:ring-0 rounded text-sm transition-all dark:text-white" 
              placeholder="Search guests or ID..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="w-full px-4 py-2 bg-background-light dark:bg-slate-800 border-transparent focus:border-primary focus:ring-0 rounded text-sm appearance-none dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="checked-in">Checked-In</option>
              <option value="checked-out">Checked-Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredBookings?.length || 0} of {bookings?.length || 0} Records
            </div>
          </div>
        </div>
      </div>

      {/* The Ledger Table */}
      <DataTable title="Reservations Ledger">
        <table className="w-full text-left">
          <DataTableHeader>
            <th className="px-6 py-4 font-bold uppercase tracking-wider">Guest Name</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider">Room</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Dates</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider">Financials</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Status</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
          </DataTableHeader>
          <DataTableBody>
            {filteredBookings?.map((booking) => (
              <DataTableRow key={booking.id}>
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                      {booking.guest_name?.substring(0, 2) || "G"}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white uppercase">{booking.guest_name}</p>
                      <p className="text-xs text-slate-500 italic">#{booking.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <div className="text-sm">
                    <span className="font-bold text-slate-900 dark:text-white uppercase">{booking.rooms?.room_number}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span className="text-slate-500 italic uppercase">{(booking.rooms as any)?.room_types?.name}</span>
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tighter tabular-nums">{booking.check_in_date} → {booking.check_out_date}</p>
                  </div>
                </DataTableCell>
                <DataTableCell className="text-sm font-bold text-slate-900 dark:text-white uppercase">
                   ₦{booking.total_price.toLocaleString()}
                </DataTableCell>
                <DataTableCell>
                  <div className="flex justify-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      booking.status === 'checked-in' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </DataTableCell>
                <DataTableCell align="right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/dashboard/bookings/${booking.id}`}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-primary"
                    >
                      <MaterialIcon icon="visibility" className="text-lg" />
                    </Link>
                  </div>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </table>
        {(!filteredBookings || filteredBookings.length === 0) && (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-slate-900">
            {searchQuery || statusFilter !== 'all' ? "NO MATCHING RECORDS FOUND" : "NO RESERVATIONS LOGGED"}
          </div>
        )}
      </DataTable>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="login" className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Arrivals Today</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white uppercase">{arrivalsToday} Guests</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <MaterialIcon icon="pending_actions" className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending Tasks</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white uppercase">{pendingCount} Unconfirmed</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="hotel" className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Available Assets</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white uppercase">{availableRooms.length} Rooms</p>
          </div>
        </div>
      </div>

      <CreateBookingModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          router.refresh();
        }}
        organizationId={organizationId}
        rooms={availableRooms}
      />
    </div>
  );
}
