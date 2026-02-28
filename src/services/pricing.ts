import { createClient } from "@/lib/supabase/server";
import { addDays, format, isSameDay, getDay } from "date-fns";

export async function calculateBookingPrice(
  organizationId: string,
  branchId: string,
  roomTypeId: string,
  checkIn: string,
  checkOut: string
) {
  const supabase = await createClient();

  // 1. Fetch Room Type and Base Price
  const { data: roomType } = await supabase
    .from("room_types")
    .select("base_price")
    .eq("id", roomTypeId)
    .eq("branch_id", branchId) // Branch isolation
    .single();

  if (!roomType) throw new Error("Room type not found in this branch");

  // 2. Fetch Active Pricing Rules & Overrides
  const [rulesRes, overridesRes] = await Promise.all([
    supabase
      .from("pricing_rules")
      .select("*")
      .eq("branch_id", branchId)
      .eq("room_type_id", roomTypeId),
    supabase
      .from("room_pricing")
      .select("*")
      .eq("branch_id", branchId)
      .eq("room_type_id", roomTypeId)
      .gte("date", checkIn)
      .lt("date", checkOut)
  ]);

  const rules = rulesRes.data || [];
  const overrides = overridesRes.data || [];

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nightlyBreakdown = [];
  let totalAmount = 0;

  // 3. Loop through each night
  for (let current = start; current < end; current = addDays(current, 1)) {
    const currentDateStr = format(current, "yyyy-MM-dd");
    const currentDayOfWeek = getDay(current);
    
    let nightPrice = parseFloat(roomType.base_price);
    let appliedRule = "base_rate";

    // Tier 1: Per-Night Override
    const override = overrides.find(o => o.date === currentDateStr);
    
    if (override) {
      nightPrice = parseFloat(override.price);
      appliedRule = "manual_override";
    } else {
      // Tier 2: Pricing Rules (Weekend / Seasonal)
      let maxPriority = -1;
      
      for (const rule of rules) {
        let matches = false;

        if (rule.rule_type === "specific_date" && rule.start_date === currentDateStr) {
          matches = true;
        } else if (rule.rule_type === "seasonal" && currentDateStr >= rule.start_date && currentDateStr <= rule.end_date) {
          matches = true;
        } else if (rule.rule_type === "weekend" && rule.days_of_week.includes(currentDayOfWeek)) {
          matches = true;
        }

        if (matches && rule.priority > maxPriority) {
          nightPrice = parseFloat(rule.price_override);
          appliedRule = rule.rule_type;
          maxPriority = rule.priority;
        }
      }
    }

    nightlyBreakdown.push({
      date: currentDateStr,
      price: nightPrice,
      rule: appliedRule,
    });
    totalAmount += nightPrice;
  }

  return {
    totalAmount,
    nightlyBreakdown,
  };
}
