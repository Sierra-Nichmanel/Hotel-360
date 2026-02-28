import { createClient } from "@/lib/supabase/server";
import { UsersClient } from "@/components/dashboard/users-client";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  // Get all users for this organization
  const { data: staff } = await supabase
    .from("profiles")
    .select("*, branches(name)")
    .eq("organization_id", profile.organization_id)
    .order("role");

  // Get branches for the filter/modal
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name")
    .eq("organization_id", profile.organization_id);

  return (
    <UsersClient 
      staff={staff || []} 
      branches={branches || []} 
      organizationId={profile.organization_id}
      currentUserRole={profile.role}
      currentUserBranchId={profile.branch_id}
    />
  );
}
