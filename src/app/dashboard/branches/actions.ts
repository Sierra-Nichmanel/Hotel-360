"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBranchAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, role, organizations(branch_limit)")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    throw new Error("Only Super Admins can create branches");
  }

  // Check branch limit
  const { count } = await supabase
    .from("branches")
    .select("*", { count: 'exact', head: true })
    .eq("organization_id", profile.organization_id);

  const limit = (profile.organizations as any)?.branch_limit || 1;

  if ((count || 0) >= limit) {
    throw new Error(`Branch limit reached. Your plan allows a maximum of ${limit} branch(es).`);
  }

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;

  const { error } = await supabase
    .from("branches")
    .insert({
      organization_id: profile.organization_id,
      name,
      address,
      phone,
    });

  if (error) {
    console.error("Branch Creation Error:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/branches");
  return { success: true };
}

export async function updateBranchAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const manager_id = formData.get("manager_id") as string;

  const { error } = await supabase
    .from("branches")
    .update({ 
      name, 
      address, 
      phone, 
      manager_id: manager_id || null,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) {
    console.error("Branch Update Error:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/branches");
  return { success: true };
}
