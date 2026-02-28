import { createClient } from "@/lib/supabase/server";
import { BookingsClient } from "@/components/dashboard/bookings-client";
import { redirect } from "next/navigation";

export default async function BookingsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_id, branch_id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  // Get records
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, rooms(room_number, room_types(name))")
    .eq("hotel_id", profile.hotel_id)
    .order("check_in_date", { ascending: false });

  // Get available rooms for New Booking modal
  const { data: availableRooms } = await supabase
    .from("rooms")
    .select("*, room_types(name, base_price)")
    .eq("hotel_id", profile.hotel_id)
    .eq("status", "available");

  return (
    <BookingsClient 
      bookings={bookings || []} 
      organizationId={profile.hotel_id}
      availableRooms={availableRooms || []}
    />
  );
}
