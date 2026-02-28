import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { RoomAssignmentClient } from "@/components/dashboard/room-assignment-client";

interface PageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function RoomAssignmentPage({ searchParams }: PageProps) {
  const { bookingId } = await searchParams;
  if (!bookingId) {
    redirect("/dashboard/bookings");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Fetch commitment (booking)
  const { data: booking, error: bError } = await supabase
    .from("bookings")
    .select("*, rooms(*, room_types(*))")
    .eq("id", bookingId)
    .single();

  if (bError || !booking) {
    notFound();
  }

  // Fetch available rooms of the same type (or any if we want to allow arbitrary assignment)
  const { data: availableRooms } = await supabase
    .from("rooms")
    .select("*, room_types(*)")
    .eq("organization_id", booking.organization_id)
    .eq("status", "available");

  return (
    <RoomAssignmentClient 
        booking={booking} 
        availableRooms={availableRooms || []} 
    />
  );
}
