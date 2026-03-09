"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateHotelAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;

  // Try updating with all fields first
  const { error } = await supabase
    .from("hotels")
    .update({ 
      name, 
      location,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) {
    console.warn("Hotel Update Error (Full):", error.message);
    
    // Fallback: If location column is missing, try updating only the name
    if (error.message.includes("column \"location\" of relation \"hotels\" does not exist")) {
      const { error: fallbackError } = await supabase
        .from("hotels")
        .update({ 
          name, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", id);

      if (fallbackError) {
        return { error: fallbackError.message };
      }
      
      revalidatePath("/dashboard/settings");
      revalidatePath("/dashboard", "layout");
      return { 
        success: true, 
        warning: "Hotel name updated, but 'location' column is missing from database. Please run the SQL migration." 
      };
    }

    return { error: error.message };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard", "layout");
  return { success: true };
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
    return { error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
