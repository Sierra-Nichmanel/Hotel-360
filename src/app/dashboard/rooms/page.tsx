import { createClient } from "@/lib/supabase/server";
import { RoomsClient } from "@/components/dashboard/rooms-client";
import { redirect } from "next/navigation";

export default async function RoomsPage() {
  const supabase = await createClient();
  
  // Get hotel info from user profile
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("hotel_id, branch_id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth");

  // Get records
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*, room_types(*)")
    .eq("hotel_id", profile.hotel_id);

  const { data: branches } = await supabase
    .from("branches")
    .select("id, name")
    .eq("hotel_id", profile.hotel_id);

  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("*")
    .eq("hotel_id", profile.hotel_id);

  return (
    <RoomsClient 
      rooms={rooms || []} 
      branches={branches || []} 
      organizationId={profile.hotel_id}
      branchId={profile.branch_id}
      roomTypes={roomTypes || []}
    />
  );
}
