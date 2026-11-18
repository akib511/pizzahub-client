"use client";

import { useState } from "react";
import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function VendorProfilePage() {
  const [profile, setProfile] = useState({
    name: "PizzaHub Vendor",
    email: "vendor@example.com",
    phone: "+880 1712-345678",
    restaurantName: "PizzaHub Restaurant",
    location: "Dhanmondi, Dhaka",
    description:
      "Serving delicious pizzas made with fresh ingredients and authentic flavors.",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Profile Settings
        </h1>

        <p className="mt-1 text-sm text-[#A8A29E]">
          Manage your personal and restaurant information.
        </p>
      </div>

      {/* Profile Header */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1C1715] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10">
            <Store size={30} className="text-orange-400" />

            <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1C1715] bg-orange-500 text-white transition hover:bg-orange-600">
              <Camera size={14} />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              {profile.restaurantName}
            </h2>

            <p className="mt-1 text-sm text-[#A8A29E]">
              {profile.email}
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-400">
              <Store size={13} />
              Vendor Account
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <User size={18} className="text-orange-400" />

          <h2 className="font-semibold text-white">
            Personal Information
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm text-[#A8A29E]">
              Full Name
            </label>

            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/[0.06] bg-[#100D0B] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-orange-500/40"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-[#A8A29E]">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/[0.06] bg-[#100D0B] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-orange-500/40"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm text-[#A8A29E]">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/[0.06] bg-[#100D0B] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-orange-500/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Information */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Store size={18} className="text-orange-400" />

          <h2 className="font-semibold text-white">
            Restaurant Information
          </h2>
        </div>

        <div className="space-y-4">
          {/* Restaurant Name */}
          <div>
            <label className="mb-2 block text-sm text-[#A8A29E]">
              Restaurant Name
            </label>

            <input
              name="restaurantName"
              value={profile.restaurantName}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/[0.06] bg-[#100D0B] px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500/40"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm text-[#A8A29E]">
              Restaurant Location
            </label>

            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/[0.06] bg-[#100D0B] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-orange-500/40"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm text-[#A8A29E]">
              Restaurant Description
            </label>

            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none rounded-lg border border-white/[0.06] bg-[#100D0B] px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500/40"
            />
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-orange-400" />

          <h2 className="font-semibold text-white">
            Account Security
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Password
            </p>

            <p className="mt-1 text-xs text-[#78716C]">
              Change your account password.
            </p>
          </div>

          <button
            onClick={() => alert("Password change will be implemented later.")}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm text-[#D6D3D1] transition hover:bg-white/[0.04]"
          >
            <Lock size={15} />
            Change Password
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}