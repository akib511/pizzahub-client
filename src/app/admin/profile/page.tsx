"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
  User,
  Mail,
  Camera,
  Save,
  ShieldCheck,
  Bell,
  Settings,
  Globe,
  Store,
  ShoppingBag,
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
  const { data: session } = authClient.useSession();

  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [platformStats, setPlatformStats] = useState({
    totalVendors: 0,
    totalOrders: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const role = "Super Admin";

  // Load admin information while rendering (instead of copying session data
  // into state inside an effect).
  const adminUser = session?.user as
    | (NonNullable<typeof session>["user"] & { profileImage?: string })
    | undefined;

  const sessionSignature = adminUser
    ? [adminUser.id, adminUser.name, adminUser.image].join("|")
    : "";

  const [prevSessionSignature, setPrevSessionSignature] = useState("");

  if (adminUser && sessionSignature !== prevSessionSignature) {
    setPrevSessionSignature(sessionSignature);

    const currentName = adminUser.name || "";

    setName(currentName);
    setSavedName(currentName);
    setEmail(adminUser.email || "");
    setImage(adminUser.image || adminUser.profileImage || "");
  }

  // Load Platform Statistics
  useEffect(() => {
    const loadPlatformStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/admin/platform-stats",
        );

        if (!response.ok) {
          throw new Error("Failed to load platform statistics.");
        }

        const data = await response.json();

        setPlatformStats({
          totalVendors: data.totalVendors,
          totalOrders: data.totalOrders,
        });
      } catch {
        toast.error("Failed to load platform information.");
      } finally {
        setStatsLoading(false);
      }
    };

    loadPlatformStats();
  }, []);

  // Load Notification Preferences
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

        setNotifications({
          newOrders: data.newOrders ?? true,
          vendorApplications: data.vendorApplications ?? true,
          menuApprovals: data.menuApprovals ?? true,
          transactions: data.transactions ?? false,
        });
      } catch {
        toast.error("Failed to load notification preferences.");
      } finally {
        setPreferencesLoading(false);
      }
    };

    loadPreferences();
  }, [email]);

  // Select Profile Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setImage(URL.createObjectURL(file));

    toast.info("Image selected. Click Save Changes to update.");
    e.target.value = "";
  };

  // Save Admin Profile
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      let finalImage = image;

      // Upload image only after clicking Save Changes
      if (selectedFile) {
        setUploading(true);
        finalImage = await uploadImage(selectedFile);
      }

      const { error } = await authClient.updateUser({
        name: name.trim(),
        ...(selectedFile ? { image: finalImage } : {}),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }
      setImage(finalImage);
      setSavedName(name.trim());
      setName(name.trim());
      setSelectedFile(null);

      window.dispatchEvent(new Event("profile-updated"));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Toggle Notification Preferences
  const toggleNotification = async (key: keyof typeof notifications) => {
    if (savingPreference || preferencesLoading) return;

    const previousValue = notifications[key];
    const updatedValue = !previousValue;

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
        [key]: previousValue,
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
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Profile Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your admin account and platform preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Personal Information</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Update your account information.
          </p>
        </div>

        <div className="p-5">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-2xl font-bold text-foreground">
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
                className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-orange-500 text-black transition hover:bg-orange-400"
                title="Change profile picture"
              >
                <Camera size={14} />
              </label>

              <input
                id="adminProfileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                {savedName || "Admin"}
              </h3>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-orange-400">
                <ShieldCheck size={14} />
                {role}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {selectedFile
                  ? "New image selected"
                  : "JPG, PNG or WEBP (Max 5MB)"}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none focus:border-orange-500/50"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-muted-foreground">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-muted-foreground outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={loading || !session?.user}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {uploading
                ? "Uploading..."
                : loading
                  ? "Saving..."
                  : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell size={17} className="text-orange-400" />
            <h2 className="font-semibold text-foreground">
              Notification Preferences
            </h2>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
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
                <p className="text-sm font-medium text-foreground">{item.title}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleNotification(item.key)}
                disabled={preferencesLoading || savingPreference}
                aria-label={`Toggle ${item.title}`}
                aria-pressed={notifications[item.key]}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications[item.key] ? "bg-orange-500" : "bg-stone-700"
                } disabled:opacity-50`}
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
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Settings size={17} className="text-orange-400" />
            <h2 className="font-semibold text-foreground">Platform Information</h2>
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
              value: statsLoading
                ? "Loading..."
                : `${platformStats.totalVendors} Vendors`,
              icon: Store,
            },
            {
              label: "Total Orders",
              value: statsLoading
                ? "Loading..."
                : `${platformStats.totalOrders.toLocaleString()} Orders`,
              icon: ShoppingBag,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon size={15} />
                  <span className="text-xs">{item.label}</span>
                </div>

                <p className="mt-2 font-semibold text-foreground">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex gap-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.03] p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-orange-400" />

        <div>
          <p className="text-sm font-medium text-foreground">Account Security</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Your admin account has full access to manage users, vendors, menu
            items, orders and transactions. Keep your credentials secure and
            never share your password.
          </p>
        </div>
      </div>
    </div>
  );
}
