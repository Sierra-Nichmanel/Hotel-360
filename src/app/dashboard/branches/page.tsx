import { createClient } from "@/lib/supabase/server";
import { BranchesClient } from "@/components/dashboard/branches-client";
import { redirect } from "next/navigation";

export default async function BranchesPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_id, hotels(max_branches)")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  // Get branches for the organization
  const { data: branches } = await supabase
    .from("branches")
    .select("*")
    .eq("hotel_id", profile.hotel_id)
    .order("created_at");

  // Get all staff for manager assignment
  const { data: staff } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("hotel_id", profile.hotel_id);

  const maxBranches = (profile.hotels as any)?.max_branches || 1;

  return (
    <BranchesClient 
      branches={branches || []} 
      maxBranches={maxBranches} 
      staff={staff || []}
      hotelId={profile.hotel_id}
    />
  );
}
