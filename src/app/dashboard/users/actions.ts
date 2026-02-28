"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

// We need an admin client for recruitment to bypass rate limits or handle auth better
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {}
      },
    }
  );
}

export async function inviteUserAction(formData: FormData) {
  const supabase = createAdminClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const branch_id = formData.get("branch_id") as string;

  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error("Recruitment Error:", authError);
    return;
  }

  // 2. The trigger handles profile creation, but we update the role and branch
  if (authData.user) {
    await supabase
      .from("profiles")
      .update({ role, branch_id })
      .eq("id", authData.user.id);
  }

  revalidatePath("/dashboard/users");
}
