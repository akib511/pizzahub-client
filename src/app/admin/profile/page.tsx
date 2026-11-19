"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Camera,
  Save,
  ShieldCheck,
  Bell,
  Lock,
  Settings,
  Globe,
  Store,
  ShoppingBag,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminProfilePage() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@pizzahub.com");
  const [role, setRole] = useState("Super Admin");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [notifications, setNotifications] = useState({
    newOrders: true,
    vendorApplications: true,
    menuApprovals: true,
    transactions: false,
  });

  const handleSaveProfile = () => {
    alert("Profile settings saved successfully!");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    alert("Password updated successfully!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Profile Settings
        </h1>

        <p className="mt-1 text-sm text-stone-400">
          Manage your admin account and platform preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1C1715]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-semibold text-white">Personal Information</h2>
          <p className="mt-1 text-xs text-stone-500">
            Update your account information.
          </p>
        </div>

        <div className="p-5">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-2xl font-bold text-white">
                AU
              </div>

              <button
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1C1715] bg-orange-500 text-black transition hover:bg-orange-400"
                title="Change profile picture"
              >
                <Camera size={14} />
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-white">{name}</h3>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-orange-400">
                <ShieldCheck size={14} />
                {role}
              </div>

              <p className="mt-2 text-xs text-stone-500">
                JPG, PNG or WEBP
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-stone-400">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                />

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.07] bg-[#100D0B] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-orange-500/50"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-stone-400">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.07] bg-[#100D0B] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-orange-500/50"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1C1715]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <Lock size={17} className="text-orange-400" />
            <h2 className="font-semibold text-white">Change Password</h2>
          </div>

          <p className="mt-1 text-xs text-stone-500">
            Keep your admin account secure.
          </p>
        </div>

        <div className="space-y-4 p-5">
          {/* Current Password */}
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-white/[0.07] bg-[#100D0B] px-3 py-2.5 pr-10 text-sm text-white outline-none focus:border-orange-500/50"
              />

              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm text-stone-400">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-lg border border-white/[0.07] bg-[#100D0B] px-3 py-2.5 pr-10 text-sm text-white outline-none focus:border-orange-500/50"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm text-stone-400">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-white/[0.07] bg-[#100D0B] px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:border-orange-500/30 hover:text-orange-400"
            >
              <Lock size={15} />
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1C1715]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell size={17} className="text-orange-400" />
            <h2 className="font-semibold text-white">
              Notification Preferences
            </h2>
          </div>

          <p className="mt-1 text-xs text-stone-500">
            Choose which notifications you want to receive.
          </p>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {[
            {
              key: "newOrders" as const,
              title: "New Orders",
              description: "Receive alerts when new orders are placed.",
            },
            {
              key: "vendorApplications" as const,
              title: "Vendor Applications",
              description: "Get notified about new vendor applications.",
            },
            {
              key: "menuApprovals" as const,
              title: "Menu Approvals",
              description: "Notifications for pending menu review.",
            },
            {
              key: "transactions" as const,
              title: "Transactions",
              description: "Payment and refund notifications.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications[item.key]
                    ? "bg-orange-500"
                    : "bg-stone-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications[item.key]
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Information */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1C1715]">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <Settings size={17} className="text-orange-400" />
            <h2 className="font-semibold text-white">
              Platform Information
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
          {[
            {
              label: "Platform",
              value: "PizzaHub",
              icon: Globe,
            },
            {
              label: "Registered Vendors",
              value: "86 Vendors",
              icon: Store,
            },
            {
              label: "Total Orders",
              value: "3,642 Orders",
              icon: ShoppingBag,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.06] bg-[#100D0B] p-4"
              >
                <div className="flex items-center gap-2 text-stone-500">
                  <Icon size={15} />
                  <span className="text-xs">{item.label}</span>
                </div>

                <p className="mt-2 font-semibold text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex gap-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.03] p-4">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-orange-400"
        />

        <div>
          <p className="text-sm font-medium text-white">
            Account Security
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            Your admin account has full access to manage users, vendors,
            menu items, orders and transactions. Keep your credentials
            secure and never share your password.
          </p>
        </div>
      </div>
    </div>
  );
}