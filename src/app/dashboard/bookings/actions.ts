"use server";

import { revalidatePath } from "next/cache";
import { createBooking } from "@/services/bookings";

export async function createBookingAction(formData: FormData) {
  const organizationId = formData.get("organization_id") as string;
  const guestName = formData.get("guest_name") as string;
  const roomJson = formData.get("room_data") as string;
  const checkIn = formData.get("check_in") as string;
  const checkOut = formData.get("check_out") as string;

  const roomData = JSON.parse(roomJson);

  try {
    await createBooking(
      organizationId,
      roomData.branch_id,
      roomData.id,
      roomData.type_id,
      checkIn,
      checkOut,
      { name: guestName }
    );
    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/rooms");
    return { success: true };
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    return { error: error.message };
  }
}

export async function updateBookingStatusAction(bookingId: string, currentStatus: string, nextStatus: string) {
  const { updateBookingStatus } = await import("@/services/bookings");
  try {
    await updateBookingStatus(bookingId, currentStatus, nextStatus);
    revalidatePath(`/dashboard/bookings/${bookingId}`);
    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/rooms");
    return { success: true };
  } catch (error: any) {
    console.error("Status Update Error:", error);
    return { error: error.message };
  }
}
