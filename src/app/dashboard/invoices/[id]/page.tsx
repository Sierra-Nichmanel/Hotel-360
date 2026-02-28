"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvoicePage({ params }: PageProps) {
  const { id } = use(params);
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500">
      {/* Header Toolbar - Non-printable */}
      <header className="print:hidden sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/checkout" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <MaterialIcon icon="arrow_back" className="text-primary" />
          </Link>
          <div>
            <h1 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Invoice Preview</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase italic mt-0.5">INV-{id} • Guest: John Doe</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <MaterialIcon icon="mail" className="text-sm" />
            Email Guest
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            onClick={() => window.print()}
          >
            <MaterialIcon icon="print" className="text-sm" />
            Print
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-primary text-white hover:bg-opacity-90 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
            <MaterialIcon icon="download" className="text-sm" />
            Download PDF
          </button>
        </div>
      </header>

      {/* Main Invoice Container */}
      <main className="flex-1 flex justify-center py-12 md:py-20 px-4 print:p-0 bg-slate-50 dark:bg-slate-950 print:bg-white">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-12 md:p-20 relative overflow-hidden flex flex-col print:shadow-none print:rounded-none print:m-0 print:w-full border border-slate-100 dark:border-slate-800 print:border-none print:bg-white">
          
          {/* Top Header Section */}
          <div className="flex justify-between items-start mb-20 whitespace-nowrap">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 print:shadow-none">
                  <MaterialIcon icon="hotel" className="text-white text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Hotel 360</h2>
                  <p className="text-[10px] tracking-[0.3em] text-primary font-black uppercase italic">Luxury & Lifestyle</p>
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed uppercase tracking-widest">
                123 Luxury Way, Sky District<br />
                Metropolis, NY 10001<br />
                United States<br />
                <span className="text-[9px] mt-2 block opacity-60">Tax ID: US-984421-X</span>
              </div>
            </div>
            
            <div className="text-right">
              <h3 className="text-5xl font-black text-slate-100 dark:text-slate-800 uppercase tracking-tighter mb-8 leading-none print:text-slate-100">Invoice</h3>
              <div className="space-y-2">
                <div className="flex justify-end gap-6 text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Invoice Number</span>
                  <span className="text-slate-900 dark:text-white">#INV-2023-0842</span>
                </div>
                <div className="flex justify-end gap-6 text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Date Issued</span>
                  <span className="text-slate-700 dark:text-slate-300">Oct 15, 2023</span>
                </div>
                <div className="flex justify-end gap-6 text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Reference ID</span>
                  <span className="text-slate-700 dark:text-slate-300">Booking RE-5502</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Context */}
          <div className="grid grid-cols-2 gap-20 mb-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl p-10 border border-slate-100 dark:border-slate-800 print:bg-slate-50 print:border-slate-100">
            <div>
              <h4 className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-primary mb-6">Guest Credentials</h4>
              <p className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Mr. John Doe</p>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest space-y-1.5">
                <p>john.doe@email.com</p>
                <p>+1 (555) 012-3456</p>
                <p className="pt-4 text-slate-400 italic font-medium blur-[0.2px]">Special Requirements: High floor suite</p>
              </div>
            </div>
            <div>
              <h4 className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-primary mb-6">Stay Architecture</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Arrival</p>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Oct 12, 2023</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Departure</p>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Oct 15, 2023</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Physical Location</p>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Suite 402</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">3 Full Nights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="flex-grow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100 dark:border-slate-800 print:border-slate-200">
                  <th className="py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Service Cycle</th>
                  <th className="py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Strategic Description</th>
                  <th className="py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Qty.</th>
                  <th className="py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Unit Rate</th>
                  <th className="py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 print:divide-slate-50">
                {[
                  { date: 'Oct 12-15', label: 'Deluxe Ocean Suite', desc: 'Premium accommodation package', qty: 3, rate: 450.00 },
                  { date: 'Oct 13', label: 'Corporate Dining Service', desc: 'In-room gastronomic experience', qty: 1, rate: 125.50 },
                  { date: 'Oct 14', label: 'Wellness: Swedish Therapy', desc: '60 Minute regenerative session', qty: 1, rate: 180.00 },
                  { date: 'Oct 14', label: 'In-Suite Refreshments', desc: 'Premium mini-bar utilization', qty: 1, rate: 42.00 },
                ].map((item, i) => (
                  <tr key={i} className="group">
                    <td className="py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">{item.date}</td>
                    <td className="py-6">
                      <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.label}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-0.5">{item.desc}</p>
                    </td>
                    <td className="py-6 text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center uppercase tracking-widest">{item.qty}</td>
                    <td className="py-6 text-[10px] font-bold text-slate-600 dark:text-slate-400 text-right uppercase tracking-tight">${item.rate.toFixed(2)}</td>
                    <td className="py-6 text-[11px] font-black text-slate-900 dark:text-white text-right uppercase tracking-tighter">${(item.qty * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Security Section */}
          <div className="mt-20 flex justify-between items-end border-t border-slate-100 dark:border-slate-800 pt-16 print:border-slate-100">
            <div className="max-w-[340px]">
              {/* High-fidelity PAID watermark effect */}
              <div className="relative inline-block mb-10 transform -rotate-12">
                <div className="absolute inset-0 border-4 border-emerald-500 opacity-20 blur-sm rounded-2xl"></div>
                <div className="border-4 border-emerald-500/40 text-emerald-500/40 rounded-2xl px-10 py-3 font-black text-5xl uppercase tracking-tighter select-none">
                  Fully Settled
                </div>
              </div>
              <div className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest italic space-y-1">
                <p>Transaction ID: tx_98442100552</p>
                <p>Settlement Method: Credit Card • AMEX **** 4421</p>
                <p className="text-slate-300 dark:text-slate-600 mt-4 print:text-slate-400">Thank you for choosing Hotel 360 & Resorts. Your experience is our priority.</p>
              </div>
            </div>
            
            <div className="w-80 space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Subtotal Settlement</span>
                <span className="text-slate-900 dark:text-white">$1,697.50</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Federal Occupancy Tax (14%)</span>
                <span className="text-slate-900 dark:text-white">$237.65</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 pb-5 border-b border-slate-100 dark:border-slate-800 print:border-slate-100">
                <span>Resort Access Surcharge</span>
                <span className="text-slate-900 dark:text-white">$45.00</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] italic">Consolidated Total</span>
                <span className="text-4xl font-black text-primary tracking-tighter">$1,980.15</span>
              </div>
            </div>
          </div>

          {/* Invoice Footer */}
          <footer className="mt-24 pt-10 border-t border-slate-50 dark:border-slate-800 text-center print:border-slate-50">
            <div className="flex justify-center gap-12 mb-6">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] print:text-slate-400">
                <MaterialIcon icon="public" className="text-xs" />
                www.hotel360.com
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] print:text-slate-400">
                <MaterialIcon icon="phone" className="text-xs" />
                +1 (800) 360-HOTEL
              </div>
            </div>
            <p className="text-[8px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest leading-relaxed max-w-lg mx-auto italic print:text-slate-400">
              Hotel 360 Operations Global LLC. This document is an electronically generated fiscal record and does not require a manual signature for validation.
            </p>
          </footer>
        </div>
      </main>

      {/* Floating Action for Mobile Preview - Non-printable */}
      <div className="print:hidden fixed bottom-10 right-10">
        <button className="w-14 h-14 bg-white dark:bg-slate-800 shadow-2xl rounded-full flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all border border-slate-100 dark:border-slate-700 group">
          <MaterialIcon icon="help_outline" className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
}
