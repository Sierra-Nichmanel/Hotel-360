import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { TrialBanner } from "@/components/dashboard/trial-banner";
import { OnboardingForm } from "@/components/dashboard/onboarding-form";
import { differenceInDays, parseISO } from "date-fns";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Get hotel and profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, hotels(*)")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.hotels) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark/50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 lg:p-12">
          <OnboardingForm userEmail={user.email || ""} />
        </div>
      </div>
    );
  }

  const hotel = profile.hotels;
  const now = new Date();
  
  // TRIAL SYSTEM CHECK - For display purposes only
  const isTrial = hotel.subscription_status === "trial" || hotel.subscription_status === "pending_payment";
  const subscriptionEndDate = hotel.subscription_end_date ? parseISO(hotel.subscription_end_date) : new Date();
  const daysLeft = differenceInDays(subscriptionEndDate, now);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark/50">
      <Sidebar userRole={profile.role} hotelName={hotel.name} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {(isTrial || hotel.subscription_status === "pending_payment") && daysLeft >= 0 && <TrialBanner daysLeft={daysLeft} />}
        <Header 
          userName={profile.full_name || "User"} 
          userRole={profile.role} 
          userImage={profile.avatar_url}
        />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
