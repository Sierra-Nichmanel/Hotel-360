import { createClient } from "@/lib/supabase/server";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { redirect } from "next/navigation";
import { PLANS, SubscriptionPlan } from "@/config/plans";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return redirect("/dashboard?error=missing_reference");
  }

  try {
    const data = await verifyPaystackTransaction(reference);

    if (data.status === "success") {
      const supabase = await createClient();
      const planId = data.metadata.plan as SubscriptionPlan;
      const plan = PLANS[planId];

      const { error } = await supabase
        .from("hotels")
        .update({
          subscription_status: "active",
          subscription_plan: planId,
          max_branches: plan.branchLimit,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("id", data.metadata.hotel_id || (await getHotelId(data.metadata.user_id)));

      if (error) {
        console.error("DB Update Error:", error);
        return redirect("/dashboard?error=activation_failed");
      }

      return redirect("/dashboard?success=activated");
    }
  } catch (error) {
    console.error("Verification Error:", error);
  }

  return redirect("/dashboard?error=verification_failed");
}

async function getHotelId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("hotel_id")
    .eq("id", userId)
    .single();
  return data?.hotel_id;
}
