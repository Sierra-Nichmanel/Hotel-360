"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { createRoomTypeAction } from "@/app/dashboard/rooms/actions";
import { LucideLoader2 } from "lucide-react";

interface AddRoomTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  branchId: string;
}

export function AddRoomTypeModal({ isOpen, onClose, organizationId, branchId }: AddRoomTypeModalProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['wifi', 'king_bed', 'ac_unit', 'tsunami']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await createRoomTypeAction(formData);
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

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const amenities = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: 'wifi' },
    { id: 'kitchen', label: 'Mini Bar', icon: 'kitchen' },
    { id: 'king_bed', label: 'King Bed', icon: 'king_bed' },
    { id: 'ac_unit', label: 'Air Condition', icon: 'ac_unit' },
    { id: 'tv', label: 'Smart TV', icon: 'tv' },
    { id: 'tsunami', label: 'Sea View', icon: 'tsunami' },
    { id: 'shower', label: 'Rain Shower', icon: 'shower' },
    { id: 'coffee_maker', label: 'Nespresso', icon: 'coffee_maker' },
    { id: 'room_service', label: '24h Service', icon: 'room_service' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <form action={handleSubmit} className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative z-10 border border-slate-200 dark:border-slate-800">
        <input type="hidden" name="hotel_id" value={organizationId} />
        <input type="hidden" name="branch_id" value={branchId} />
        <input type="hidden" name="amenities" value={JSON.stringify(selectedAmenities)} />

        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Module Injection</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add New Room Type</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Define institutional parameters and luxury amenities for the new category.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm group"
          >
            <MaterialIcon icon="close" className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Column: Basic Info */}
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Core Parameters</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Category Nomenclature</label>
                  <input name="name" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all uppercase placeholder:text-slate-300 shadow-inner" placeholder="e.g. EXECUTIVE SEA SUITE" type="text" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Baseline Rate (NAIRA)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-lg">₦</span>
                      <input name="base_price" required className="w-full pl-10 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-lg tracking-tighter placeholder:text-slate-300 shadow-inner" placeholder="0.00" type="number" step="0.01" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Threshold Capacity</label>
                    <div className="relative">
                      <select name="capacity" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-black text-sm tracking-tight transition-all appearance-none cursor-pointer shadow-inner uppercase">
                        <option value="1">1 GUEST</option>
                        <option value="2">2 GUESTS</option>
                        <option value="3" selected>3 GUESTS</option>
                        <option value="4">4 GUESTS</option>
                        <option value="5">5+ GUESTS</option>
                      </select>
                      <MaterialIcon icon="expand_more" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Narrative Description</label>
                  <textarea name="description" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-xs tracking-wide transition-all uppercase placeholder:text-slate-300 resize-none shadow-inner leading-relaxed" placeholder="Describe the room's unique architectural features and service components..." rows={5}></textarea>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold uppercase">
                  <MaterialIcon icon="error_outline" />
                  {error}
                </div>
              )}

              <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 flex items-start space-x-4 shadow-sm">
                <MaterialIcon icon="info" className="text-primary mt-0.5" />
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-widest italic">
                  Note: The defined baseline rate is a starting point. High-yield optimization via the dynamic pricing engine remains available for seasonal adjustments.
                </p>
              </div>
            </div>

            {/* Right Column: Amenity Selection */}
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Luxury Provisioning</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {amenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity.id);
                  return (
                    <button 
                      type="button"
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`group flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all relative transform hover:scale-105 active:scale-95 shadow-sm active:shadow-inner ${
                        isSelected 
                          ? 'border-gold-accent bg-white dark:bg-slate-800 shadow-gold-accent/10' 
                          : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-primary/30'
                      }`}
                    >
                      <MaterialIcon 
                        icon={amenity.icon} 
                        className={`mb-3 text-2xl transition-all ${isSelected ? 'text-gold-accent' : 'text-slate-400 group-hover:text-primary'}`} 
                      />
                      <span className={`text-[9px] font-black uppercase tracking-widest transition-colors text-center ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-400 group-hover:text-primary'}`}>
                        {amenity.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <MaterialIcon icon="check_circle" className="text-gold-accent text-sm" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-6">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MaterialIcon icon="photo_library" className="text-sm" />
                  Primary Visual Preview
                </h4>
                <div className="aspect-video w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-primary transition-all group shadow-inner">
                  <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                    <MaterialIcon icon="add_a_photo" className="text-slate-300 group-hover:text-primary text-2xl" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 group-hover:text-primary uppercase tracking-widest">Inject Architectural Visual</p>
                  <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-2">PNG / JPG / WEBP — MAX 20MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-6">
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-8 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-primary transition-all active:scale-95 disabled:opacity-50"
          >
            Abandon
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-opacity-90 text-white px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all active:scale-95 transform hover:scale-[1.02] flex items-center gap-2"
          >
            {loading ? <LucideLoader2 className="animate-spin h-4 w-4" /> : "Execute Category Creation"}
          </button>
        </div>
      </form>
    </div>
  );
}
