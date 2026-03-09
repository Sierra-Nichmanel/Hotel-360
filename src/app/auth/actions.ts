"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hotelName = formData.get("hotelName") as string;

  // 1. Core Auth Signup with metadata for the DB trigger
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        hotel_name: hotelName,
      },
    },
  });

  if (authError) {
    console.error("Auth Signup Error:", authError);
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Signup failed. Please try again." };
  }

  // REVALIDATE AND REDIRECT TO DASHBOARD (middleware will handle onboarding)
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
