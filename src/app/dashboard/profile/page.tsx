import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Personal Identity</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Manage your administrative footprint, security credentials, and visual presence.</p>
      </div>

      <ProfileForm profile={profile} user={user} />
    </div>
  );
}
