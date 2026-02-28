"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createRoomTypeAction(formData: FormData) {
  const supabase = await createClient();
  
  const organization_id = formData.get("organization_id") as string;
  const branch_id = formData.get("branch_id") as string;
  const name = formData.get("name") as string;
  const base_price = parseFloat(formData.get("base_price") as string);

  const { error } = await supabase
    .from("room_types")
    .insert({
      organization_id,
      branch_id,
      name,
      base_price,
      capacity: 2, // Default
    });

  if (error) {
    console.error("Room Type Creation Error:", error);
    return { error: error.message };
  }
  revalidatePath("/dashboard/rooms");
  return { success: true };
}

export async function createRoomAction(formData: FormData) {
  const supabase = await createClient();
  
  const organization_id = formData.get("organization_id") as string;
  const branch_id = formData.get("branch_id") as string;
  const room_type_id = formData.get("room_type_id") as string;
  const room_number = formData.get("room_number") as string;

  const { error } = await supabase
    .from("rooms")
    .insert({
      organization_id,
      branch_id,
      room_type_id,
      room_number,
      status: "available",
    });

  if (error) {
    console.error("Room Creation Error:", error);
    return { error: error.message };
  }
  revalidatePath("/dashboard/rooms");
  return { success: true };
}
