import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HotelSettingsForm } from "./hotel-settings-form";
import { BranchSettingsForm } from "./branch-settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, hotels(*), branches(*)")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  const hotel = profile.hotels;
  const branch = profile.branches;

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Configuration Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Manage your hotel identity and property specific configurations.</p>
      </div>

      <div className="max-w-4xl w-full space-y-8 pb-12">
        {/* Hotel Settings (Super Admin or Admin) */}
        {(profile.role === "super_admin" || profile.role === "admin") && (
          <HotelSettingsForm hotel={hotel} />
        )}

        {/* Branch Settings (Super Admin, Admin or Manager) */}
        {(profile.role === "super_admin" || profile.role === "admin" || profile.role === "branch_manager") && (
          <BranchSettingsForm branch={branch} />
        )}
      </div>
    </div>
  );
}
