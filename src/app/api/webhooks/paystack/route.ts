import { createClient } from "@/lib/supabase/server";
import crypto from "node:crypto";
import { PLANS, SubscriptionPlan } from "@/config/plans";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: Request) {
  const body = await request.json();
  const signature = request.headers.get("x-paystack-signature");

  // Verify signature
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { event, data } = body;
  const supabase = await createClient();

  switch (event) {
    case "charge.success":
    case "subscription.create":
      const planId = data.metadata.plan as SubscriptionPlan;
      const plan = PLANS[planId];
      
      await supabase
        .from("organizations")
        .update({
          subscription_status: "active",
          subscription_plan: planId,
          branch_limit: plan.branchLimit,
          paystack_customer_code: data.customer.customer_code,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("id", data.metadata.organization_id || await getOrgId(data.metadata.user_id));
      break;

    case "subscription.disable":
    case "invoice.payment_failed":
      await supabase
        .from("organizations")
        .update({
          subscription_status: "expired",
        })
        .eq("paystack_customer_code", data.customer.customer_code);
      break;
  }

  return new Response("OK", { status: 200 });
}

async function getOrgId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", userId)
    .single();
  return data?.organization_id;
}
