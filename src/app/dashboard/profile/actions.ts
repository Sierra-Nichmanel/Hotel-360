"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const fullName = formData.get("full_name") as string;
  const avatarUrl = formData.get("avatar_url") as string;

  // Try updating with all fields first
  const { error } = await supabase
    .from("profiles")
    .update({ 
      full_name: fullName, 
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString() 
    })
    .eq("id", user.id);

  if (error) {
    console.warn("Profile Update Error (Full):", error.message);
    
    // Fallback: If avatar_url column is missing, try updating only the name
    if (error.message.includes("column \"avatar_url\" of relation \"profiles\" does not exist")) {
      const { error: fallbackError } = await supabase
        .from("profiles")
        .update({ 
          full_name: fullName, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", user.id);

      if (fallbackError) {
        return { error: fallbackError.message };
      }
      
      revalidatePath("/dashboard/profile");
      revalidatePath("/dashboard", "layout");
      return { 
        success: true, 
        warning: "Profile updated, but avatar column is missing from database. Please run the SQL migration." 
      };
    }

    return { error: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function updateUserEmailAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    console.error("Email Update Error:", error);
    return { error: error.message };
  }

  return { success: true, message: "Check your new email for a confirmation link." };
}
