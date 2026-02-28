import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { updateOrganizationAction, updateBranchAction, updateProfileAction } from "./actions";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*), branches(*)")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  const hotel = profile.organizations;
  const branch = profile.branches;

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Configuration Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Manage your hotel identity, property specifics, and personal administrative profile.</p>
      </div>

      <div className="max-w-4xl w-full space-y-8 pb-12">
        {/* Hotel Settings (Super Admin only) */}
        {profile.role === "super_admin" && (
          <section className="bg-white dark:bg-slate-900 rounded-2-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30">
              <MaterialIcon icon="corporate_fare" className="text-primary text-xl" />
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-800 dark:text-white">Organization Information</h2>
            </div>
            <div className="p-8">
              <form action={updateOrganizationAction} className="grid grid-cols-1 gap-8">
                <input type="hidden" name="id" value={hotel.id} />
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Legal Entity Name</label>
                  <input 
                    name="name" 
                    defaultValue={hotel.name}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase"
                  />
                </div>
                <button className="w-fit px-8 py-3 bg-primary text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all">
                  Save Entity Identity
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Branch Settings (Super Admin or Manager) */}
        {(profile.role === "super_admin" || profile.role === "branch_manager") && (
          <section className="bg-white dark:bg-slate-900 rounded-2-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30">
              <MaterialIcon icon="location_on" className="text-primary text-xl" />
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-800 dark:text-white">Property Specifics</h2>
            </div>
            <div className="p-8">
              <form action={updateBranchAction} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="hidden" name="id" value={branch?.id} />
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Branch Designation</label>
                  <input 
                    name="name" 
                    defaultValue={branch?.name}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all uppercase"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Public Phone</label>
                  <input 
                    name="phone" 
                    defaultValue={branch?.phone || ""}
                    placeholder="+234 ..."
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                  <input 
                    name="address" 
                    defaultValue={branch?.address || ""}
                    placeholder="123 Luxury Street..."
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
                  />
                </div>
                <button className="w-fit px-8 py-3 bg-primary text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all">
                  Synchronize Property
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Profile Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-2-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30">
            <MaterialIcon icon="person" className="text-primary text-xl" />
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-800 dark:text-white">Personal Profile</h2>
          </div>
          <div className="p-8">
            <form action={updateProfileAction} className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Legal Full Name</label>
                <input 
                  name="full_name" 
                  defaultValue={profile.full_name || ""}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Administrative Email (Read-only)</label>
                <input 
                  readOnly 
                  value={user.email}
                  className="w-full px-5 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-transparent rounded-xl text-slate-500 font-bold text-sm tracking-tight cursor-not-allowed italic"
                />
              </div>
              <button className="w-fit px-8 py-3 bg-primary text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all">
                Update Security Profile
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
