"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function selectTrial() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Get the hotel ID for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_id")
    .eq("id", user.id)
    .single();

  if (!profile?.hotel_id) throw new Error("Hotel not found");

  // Set trial end date (7 days from now)
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 7);

  const { error } = await supabase
    .from("hotels")
    .update({
      subscription_status: "trial",
      subscription_plan: "starter", // Default to starter for trial
      subscription_end_date: trialEndDate.toISOString(),
      subscription_start_date: new Date().toISOString(),
    })
    .eq("id", profile.hotel_id);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function selectPlan(planId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Get the hotel ID for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_id")
    .eq("id", user.id)
    .single();

  if (!profile?.hotel_id) throw new Error("Hotel not found");

  const { error } = await supabase
    .from("hotels")
    .update({
      subscription_status: "pending_payment",
      subscription_plan: planId,
    })
    .eq("id", profile.hotel_id);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect(`/checkout?plan=${planId}`);
}
