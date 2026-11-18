"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function CustomerProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (error) {
        setError(error.message || "Failed to update profile.");
      } else {
        setMessage("Your profile has been updated successfully!");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-8 text-center text-gray-400">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden p-4 sm:p-8">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-amber-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Page Heading */}
        <div className="mb-10 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-400">
            <Sparkles size={14} />
            ACCOUNT SETTINGS
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your Profile
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Personalize your account details and manage your presence.
          </p>
        </div>

        {/* Main Profile Card - Glassmorphism Style */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-2xl backdrop-blur-xl">
          
          {/* Top Decorative Gradient Line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

          {/* Profile Header / Avatar Section */}
          <div className="relative flex flex-col items-center gap-6 border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-6 py-10 sm:flex-row sm:px-10">
            <div className="group relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#1C1715] bg-[#2A221E] shadow-xl ring-2 ring-orange-500/30 transition-all group-hover:ring-orange-500/60">
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-orange-500/80" />
                )}
              </div>
              {/* Camera Badge on Avatar */}
              <div className="absolute bottom-1 right-1 rounded-full border-2 border-[#1C1715] bg-orange-500 p-2 text-white shadow-lg">
                <Camera size={14} />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {name || "Customer"}
              </h2>
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-400 sm:justify-start">
                <Mail size={14} />
                {session.user.email}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                <ShieldCheck size={14} />
                Verified Customer
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-10">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="group relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-orange-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-2xl border border-white/10 bg-[#141110] py-4 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-orange-500/50 focus:bg-[#1A1513] focus:ring-1 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                {/* Email Input (Read Only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={session.user.email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-2xl border border-white/5 bg-[#141110]/50 py-4 pl-12 pr-4 text-sm text-gray-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Profile Image URL
                </label>
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-orange-500">
                    <ImageIcon size={18} />
                  </div>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full rounded-2xl border border-white/10 bg-[#141110] py-4 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-orange-500/50 focus:bg-[#1A1513] focus:ring-1 focus:ring-orange-500/50"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Paste a direct link to an image to update your avatar.
                </p>
              </div>

              {/* Messages */}
              <div className="space-y-3 pt-2">
                {message && (
                  <div className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                      <ShieldCheck size={16} />
                    </div>
                    {message}
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                      <ShieldCheck size={16} />
                    </div>
                    {error}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}