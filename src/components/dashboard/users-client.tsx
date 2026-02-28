"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { AddStaffModal } from "@/components/modals/add-staff-modal";

interface UsersClientProps {
  staff: any[];
  branches: any[];
  organizationId: string;
  currentUserRole: string;
  currentUserBranchId?: string;
}

export function UsersClient({ 
  staff, 
  branches, 
  organizationId, 
  currentUserRole,
  currentUserBranchId 
}: UsersClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  const filteredStaff = staff?.filter(member => {
    const matchesSearch = member.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || member.role === roleFilter;
    const matchesBranch = !branchFilter || member.branch_id === branchFilter;
    return matchesSearch && matchesRole && matchesBranch;
  });

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8 gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl sm:truncate tracking-tight uppercase">
            Personnel & Access Governance
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 italic">
            Orchestrate your global workforce permissions and branch assignments.
          </p>
        </div>
        {(currentUserRole === "super_admin" || currentUserRole === "branch_manager") && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-opacity-90 transition-all uppercase tracking-widest" 
              type="button"
            >
              <MaterialIcon icon="person_add" className="mr-2 text-sm" />
              Onboard Personnel
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Assets</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 uppercase tracking-tighter">{staff?.length || 0}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <MaterialIcon icon="people" className="text-2xl" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Administrative Nodes</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 uppercase tracking-tighter">
                {staff?.filter(s => s.role === 'super_admin').length || 0}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
            <MaterialIcon icon="security" className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              className="pl-10 w-full rounded-lg border-transparent bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary py-2.5 transition-all italic" 
              placeholder="Search personnel by name..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="rounded-lg border-transparent bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary font-bold uppercase py-2.5"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Stratums</option>
            <option value="super_admin">Super Admin</option>
            <option value="branch_manager">Branch Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="accountant">Accountant</option>
          </select>
          <select 
            className="rounded-lg border-transparent bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary font-bold uppercase py-2.5"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="">All Operational Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Personnel Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]" scope="col">Staff Identification</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]" scope="col">Authority Role</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]" scope="col">Stationed Branch</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]" scope="col">Pulse</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]" scope="col">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredStaff?.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary uppercase text-xs">
                        {m.full_name?.substring(0, 2) || "S"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{m.full_name || "New Staff"}</div>
                        <div className="text-[10px] text-slate-500 italic">UUID: {m.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                      {m.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-600 dark:text-slate-400 uppercase italic">
                    {m.branches?.name || "Global Headquarters"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mr-1.5"></span>
                      Nominal
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                        <MaterialIcon icon="edit" className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className="bg-white dark:bg-slate-900 px-6 py-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Audit Coverage: <span className="font-extrabold">{filteredStaff?.length}</span> of <span className="font-extrabold">{staff?.length}</span> Nodes
          </p>
        </div>
      </div>

      <AddStaffModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        organizationId={organizationId}
        branches={branches}
        currentUserRole={currentUserRole}
        currentUserBranchId={currentUserBranchId}
      />
    </div>
  );
}
