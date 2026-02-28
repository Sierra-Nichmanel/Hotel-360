"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateHotelAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase
    .from("hotels")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Organization Update Error:", error);
    return;
  }

  revalidatePath("/dashboard/settings");
}

export async function updateBranchAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const { error } = await supabase
    .from("branches")
    .update({ 
      name, 
      phone, 
      address, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) {
    console.error("Branch Update Error:", error);
    return;
  }

  revalidatePath("/dashboard/settings");
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const fullName = formData.get("full_name") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ 
      full_name: fullName, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error);
    return;
  }

  revalidatePath("/dashboard/settings");
}
