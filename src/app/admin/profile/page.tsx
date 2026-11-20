"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
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

const uploadImage = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImageBB API key is missing.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("Image upload failed.");
  }

  return data.data.url;
};

export default function AdminProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = "Super Admin";

  useEffect(() => {
    if (session?.user) {
      const userInfo = session.user as typeof session.user & {
        profileImage?: string;
      };

      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
      setImage(userInfo.image || userInfo.profileImage || "");
    }
  }, [session]);

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

  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [savingPreference, setSavingPreference] = useState(false);

  useEffect(() => {
    if (!email) return;

    const loadPreferences = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/admin/preferences/${encodeURIComponent(email)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load preferences.");
        }

        const data = await response.json();
        setNotifications(data);
      } catch {
        toast.error("Failed to load notification preferences.");
      } finally {
        setPreferencesLoading(false);
      }
    };

    loadPreferences();
  }, [email]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const imageUrl = await uploadImage(file);

      setImage(imageUrl);
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image || undefined,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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

  const toggleNotification = async (key: keyof typeof notifications) => {
    if (savingPreference || preferencesLoading) return;

    const updatedValue = !notifications[key];

    setNotifications((prev) => ({
      ...prev,
      [key]: updatedValue,
    }));

    try {
      setSavingPreference(true);

      const response = await fetch(
        `http://localhost:5000/admin/preferences/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [key]: updatedValue,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update preferences.");
      }

      toast.success("Notification preference updated!");
    } catch {
      setNotifications((prev) => ({
        ...prev,
        [key]: !updatedValue,
      }));

      toast.error("Failed to update notification preference.");
    } finally {
      setSavingPreference(false);
    }
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
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-2xl font-bold text-white">
                {image ? (
                  <img
                    src={image}
                    alt="Admin Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  name.charAt(0).toUpperCase() || "A"
                )}
              </div>

              <label
                htmlFor="adminProfileImage"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#1C1715] bg-orange-500 text-black transition hover:bg-orange-400"
                title="Change profile picture"
              >
                {uploading ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Camera size={14} />
                )}
              </label>

              <input
                id="adminProfileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="font-semibold text-white">{name}</h3>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-orange-400">
                <ShieldCheck size={14} />
                {role}
              </div>

              <p className="mt-2 text-xs text-stone-500">
                {uploading ? "Uploading image..." : "JPG, PNG or WEBP"}
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
              disabled={loading || uploading}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
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
                <p className="text-sm font-medium text-white">{item.title}</p>

                <p className="mt-1 text-xs text-stone-500">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => toggleNotification(item.key)}
                disabled={preferencesLoading || savingPreference}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications[item.key] ? "bg-orange-500" : "bg-stone-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications[item.key] ? "left-6" : "left-1"
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
            <h2 className="font-semibold text-white">Platform Information</h2>
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

                <p className="mt-2 font-semibold text-white">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex gap-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.03] p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-orange-400" />

        <div>
          <p className="text-sm font-medium text-white">Account Security</p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            Your admin account has full access to manage users, vendors, menu
            items, orders and transactions. Keep your credentials secure and
            never share your password.
          </p>
        </div>
      </div>
    </div>
  );
}
