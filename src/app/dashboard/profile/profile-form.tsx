"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { useState } from "react";
import { updateUserProfileAction, updateUserEmailAction } from "./actions";
import { LucideLoader2 } from "lucide-react";

interface ProfileFormProps {
  profile: any;
  user: any;
}

export function ProfileForm({ profile: initialProfile, user: initialUser }: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleProfileSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await updateUserProfileAction(formData);
      if (result.error) {
        setError(result.error);
        if (result.error.includes("column \"avatar_url\" of relation \"profiles\" does not exist")) {
           setError("Database update required. Please run the SQL provided in the walkthrough to add the 'avatar_url' column.");
        }
      } else {
        setSuccess("Profile updated successfully!");
        // Update local state if needed or rely on revalidation
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await updateUserEmailAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.message || "Email identity update initiated.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl w-full space-y-8 pb-12">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[1.5rem] flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-wide animate-in slide-in-from-top-4 duration-300">
          <MaterialIcon icon="error_outline" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-[1.5rem] flex items-center gap-3 text-emerald-600 text-[10px] font-bold uppercase tracking-wide animate-in slide-in-from-top-4 duration-300">
          <MaterialIcon icon="check_circle" />
          {success}
        </div>
      )}

      {/* Profile Card */}
      <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <div className="h-32 bg-primary"></div>
        <div className="px-10 pb-10">
          <div className="relative -mt-16 mb-8 flex items-end gap-6">
            <div className="w-32 h-32 rounded-[2rem] bg-white dark:bg-slate-800 p-2 shadow-2xl relative group">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-[1.5rem] object-cover" />
              ) : (
                <div className="w-full h-full rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary font-black text-4xl">
                  {profile.full_name?.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="pb-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{profile.full_name}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{profile.role?.replace("_", " ") || 'User'}</p>
            </div>
          </div>

          <form action={handleProfileSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <div className="relative">
                  <MaterialIcon icon="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    name="full_name" 
                    defaultValue={profile.full_name || ""}
                    required
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Avatar Resource URL</label>
                <div className="relative">
                  <MaterialIcon icon="link" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    name="avatar_url" 
                    defaultValue={profile.avatar_url || ""}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
                  />
                </div>
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-fit px-10 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-opacity-90 shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <LucideLoader2 className="animate-spin h-4 w-4" /> : "Commit Profile Changes"}
            </button>
          </form>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-10 mt-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
            <MaterialIcon icon="security" className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Security Credentials</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update your access path and communication channel.</p>
          </div>
        </div>

        <form action={handleEmailSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Administrative Email</label>
            <div className="relative">
              <MaterialIcon icon="alternate_email" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                name="email" 
                defaultValue={user.email || ""}
                required
                className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:ring-2 focus:ring-primary font-bold text-sm tracking-tight transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button disabled className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] cursor-not-allowed opacity-50">
              Change Password
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-4 border-2 border-primary/20 text-primary hover:bg-primary/5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <LucideLoader2 className="animate-spin h-4 w-4" /> : "Update Email Identity"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
