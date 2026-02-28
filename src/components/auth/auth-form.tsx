"use client";

import { useState } from "react";
import { login, signup } from "@/app/auth/actions";
import { LucideLoader2 } from "lucide-react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const result = await login(formData);
        if (result?.error) setError(result.error);
      } else {
        const result = await signup(formData);
        if (result?.error) setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isLogin 
            ? "Manage your property efficiently and effortlessly." 
            : "Start your journey with the industry's most powerful platform."}
        </p>
      </div>

      {/* Mode Toggle (Segmented Control) */}
      <div className="bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl flex mb-8">
        <button 
          onClick={() => setIsLogin(true)}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
            isLogin 
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          )}
        >
          Login
        </button>
        <button 
          onClick={() => setIsLogin(false)}
          className={cn(
            "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
            !isLogin 
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          )}
        >
          Sign Up
        </button>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {!isLogin && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1" htmlFor="hotelName">
                Organization Name
              </label>
              <div className="relative group">
                <MaterialIcon 
                  icon="corporate_fare" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg" 
                />
                <input
                  id="hotelName"
                  name="hotelName"
                  placeholder="e.g. Grand Plaza Group"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                  required={!isLogin}
                />
              </div>
              <p className="text-[10px] text-slate-400 ml-1 uppercase tracking-wider font-bold">This will be the name of your main property or group.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                Choose Your Launch Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'starter', name: 'Starter', price: '₦5k', limit: '1 Branch' },
                  { id: 'growth', name: 'Growth', price: '₦15k', limit: '5 Branches' },
                  { id: 'scale', name: 'Scale', price: '₦50k', limit: '20 Branches' },
                ].map((plan) => (
                  <label key={plan.id} className="relative cursor-pointer group">
                    <input type="radio" name="plan" value={plan.id} defaultChecked={plan.id === 'starter'} className="peer sr-only" />
                    <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center text-center group-hover:border-primary/50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 peer-checked:text-primary">{plan.name}</span>
                      <span className="text-sm font-bold mt-1 text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-[9px] font-bold text-slate-500 italic mt-0.5">{plan.limit}</span>
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full hidden peer-checked:flex items-center justify-center">
                      <MaterialIcon icon="check" className="text-white text-[10px]" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">
            Business Email Address
          </label>
          <div className="relative group">
            <MaterialIcon 
              icon="mail_outline" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg" 
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
              Password
            </label>
            {isLogin && (
              <a className="text-xs font-semibold text-primary hover:underline" href="#">Forgot password?</a>
            )}
          </div>
          <div className="relative group">
            <MaterialIcon 
              icon="lock_outline" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg" 
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2">
            <MaterialIcon icon="error_outline" className="text-lg" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-accent hover:bg-[#C19A2E] text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-gold-accent/20 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <LucideLoader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {isLogin ? "Sign In to Dashboard" : "Get Started Now"}
              <MaterialIcon icon="arrow_forward" className="text-sm" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background-light dark:bg-background-dark px-4 text-slate-500 dark:text-slate-400 font-medium">Or continue with SSO</span>
        </div>
      </div>

      {/* SSO Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <svg className="w-5 h-5 text-[#0078D4]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"></path>
          </svg>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Microsoft</span>
        </button>
      </div>
    </div>
  );
}
