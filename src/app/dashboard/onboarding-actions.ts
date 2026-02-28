"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function finishOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const hotelName = formData.get("hotelName") as string;
  const plan = (formData.get("plan") as string) || "starter";
  const fullName = formData.get("fullName") as string;

  try {
    // 1. Create Hotel (Organization)
    const { data: hotel, error: hotelError } = await supabase
      .from("hotels")
      .insert({
        name: hotelName,
        subscription_plan: plan,
        subscription_status: "trial",
        max_branches: plan === "starter" ? 1 : plan === "growth" ? 5 : plan === "scale" ? 20 : 9999,
      })
      .select()
      .single();

    if (hotelError) throw hotelError;

    // 2. Create Default Branch
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .insert({
        hotel_id: hotel.id,
        name: "Main Branch",
        is_main_branch: true,
      })
      .select()
      .single();

    if (branchError) throw branchError;

    // 3. Create Profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        hotel_id: hotel.id,
        branch_id: branch.id,
        role: "super_admin",
        full_name: fullName,
      });

    if (profileError) throw profileError;

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Onboarding setup error:", error);
    return { error: error.message || "Failed to finalize setup" };
  }
}
