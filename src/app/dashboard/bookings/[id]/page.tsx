import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BookingDetailClient } from "@/components/dashboard/booking-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch booking with related room and type
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, rooms(*, room_types(*))")
    .eq("id", id)
    .single();

  if (error || !booking) {
    notFound();
  }

  return <BookingDetailClient booking={booking} />;
}
