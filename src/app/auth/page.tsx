import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      {/* Left Side: Hero Image & Branding */}
      <section className="hidden lg:flex lg:w-1/2 relative auth-split-bg flex-col justify-between p-12 text-white">
        <div className="z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MaterialIcon icon="apartment" className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Hotel 360</span>
          </Link>
        </div>
        <div className="z-10 max-w-md">
          <h1 className="text-5xl font-bold leading-tight mb-6">Elevating Hospitality Management to New Heights.</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            The ultimate enterprise-grade platform for modern hoteliers. Manage operations, guest relations, and analytics from a single, unified interface.
          </p>
        </div>
        <div className="z-10 flex gap-8 text-sm font-medium text-white/60">
          <span>© 2026 Hotel 360 Inc.</span>
          <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
        </div>
      </section>

      {/* Right Side: Auth Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark overflow-y-auto">
        <div className="w-full max-w-[480px]">
          {/* Branding for Mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <MaterialIcon icon="apartment" className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Hotel 360</span>
          </div>

          <AuthForm />
        </div>
      </section>
    </main>
  );
}
