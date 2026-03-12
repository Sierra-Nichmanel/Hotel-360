"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { AddBranchModal } from "@/components/modals/add-branch-modal";
import { EditBranchModal } from "@/components/modals/edit-branch-modal";

interface BranchesClientProps {
  branches: any[];
  maxBranches: number;
  staff: any[];
  hotelId: string;
}

export function BranchesClient({ branches, maxBranches, staff, hotelId }: BranchesClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);

  const branchCount = branches?.length || 0;
  const usagePercentage = (branchCount / maxBranches) * 100;
  const isAtLimit = branchCount >= maxBranches;

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Branch Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Manage property operations and occupancy across your global portfolio.</p>
        </div>
        
        {/* Usage Progress */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full md:w-80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Enterprise Plan Usage</span>
            <span className="text-sm font-bold text-primary">{branchCount} / {maxBranches} Branches</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`bg-primary h-full rounded-full transition-all duration-1000 ${isAtLimit ? 'bg-amber-500' : ''}`} style={{ width: `${usagePercentage}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-bold uppercase tracking-tighter">
            <MaterialIcon icon="info" className="text-[14px]" />
            {isAtLimit ? "License limit reached. Please upgrade for more slots." : `${maxBranches - branchCount} license slots remaining for expansion.`}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all italic" placeholder="Search by branch name..." type="text"/>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => !isAtLimit && setIsAddModalOpen(true)}
            disabled={isAtLimit}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs transition-all uppercase tracking-widest ${
              isAtLimit 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-transparent' 
                : 'bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20'
            }`}
          >
            <MaterialIcon icon="add" />
            Create New Branch
          </button>
        </div>
      </div>

      {/* Grid of Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches?.map((branch) => {
          const manager = staff?.find(s => s.id === branch.manager_id);
          return (
            <div key={branch.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mb-2 ${
                      branch.is_main_branch ? 'bg-primary/10 text-primary' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {branch.is_main_branch ? 'Headquarters' : 'Active'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight uppercase line-clamp-1">{branch.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1 italic font-medium">
                      <MaterialIcon icon="location_on" className="text-sm" />
                      <span className="line-clamp-1">{branch.address || "Zurich, Switzerland"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-500 uppercase">
                        {manager ? manager.full_name?.substring(0, 2) : branch.name?.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Branch Manager</p>
                        <p className="text-xs font-bold uppercase tracking-tight line-clamp-1">{manager ? manager.full_name : "Unassigned"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{branch.phone || "No contact info"}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingBranch(branch)}
                    className="px-5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-primary hover:text-white hover:border-primary transition-all uppercase tracking-widest shadow-sm"
                  >
                    Edit Node
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty State / Add New Placeholder */}
        {!isAtLimit && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-primary hover:text-primary transition-all bg-slate-50/50 dark:bg-slate-900/30 min-h-[260px] group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <MaterialIcon icon="add" className="text-2xl" />
            </div>
            <div className="text-center">
              <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors uppercase tracking-widest">Add New Branch</p>
              <p className="text-[10px] font-bold uppercase tracking-tight mt-1">Slot available for deployment</p>
            </div>
          </button>
        )}
      </div>

      <AddBranchModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditBranchModal 
        isOpen={!!editingBranch} 
        onClose={() => setEditingBranch(null)} 
        branch={editingBranch} 
        staff={staff} 
      />
    </div>
  );
}
