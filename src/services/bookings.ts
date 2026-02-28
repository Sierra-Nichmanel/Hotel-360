import { createClient } from "@/lib/supabase/server";
import { calculateBookingPrice } from "./pricing";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checked-in", "cancelled"],
  "checked-in": ["checked-out"],
  "checked-out": [],
  cancelled: [],
};

export async function createBooking(
  organizationId: string,
  branchId: string,
  roomId: string,
  roomTypeId: string,
  checkIn: string,
  checkOut: string,
  guestData: { name: string; email?: string; phone?: string }
) {
  const supabase = await createClient();

  // 1. Calculate price with the pricing engine
  const { totalAmount, nightlyBreakdown } = await calculateBookingPrice(
    organizationId,
    branchId,
    roomTypeId,
    checkIn,
    checkOut
  );

  // 2. Create booking record
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      hotel_id: organizationId,
      branch_id: branchId,
      room_id: roomId,
      guest_name: guestData.name,
      guest_email: guestData.email,
      guest_phone: guestData.phone,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: totalAmount,
      nightly_breakdown: nightlyBreakdown,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return booking;
}

export async function updateBookingStatus(bookingId: string, currentStatus: string, nextStatus: string) {
  const supabase = await createClient();

  // 15. BOOKING STATUS FLOW - Validate transition
  if (!VALID_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${nextStatus}`);
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: nextStatus })
    .eq("id", bookingId);

  if (error) throw error;

  // If checked in, room becomes occupied
  if (nextStatus === "checked-in") {
    const { data: booking } = await supabase.from("bookings").select("room_id").eq("id", bookingId).single();
    if (booking) {
      await supabase.from("rooms").update({ status: "occupied" }).eq("id", booking.room_id);
    }
  }

  // If checked out, room becomes available (needs cleaning)
  if (nextStatus === "checked-out") {
    const { data: booking } = await supabase.from("bookings").select("room_id").eq("id", bookingId).single();
    if (booking) {
      await supabase.from("rooms").update({ status: "cleaning" }).eq("id", booking.room_id);
    }
  }
}
