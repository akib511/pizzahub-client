"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
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
  Upload,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

interface ImgBBResponse {
  success: boolean;
  data: {
    url: string;
  };
}

export default function VendorProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    restaurantName: "",
    location: "",
    description: "",
    profileImage: "",
    restaurantLogo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Pending image files (not yet uploaded — preview only)
  const [pendingProfileImage, setPendingProfileImage] = useState<File | null>(null);
  const [pendingRestaurantLogo, setPendingRestaurantLogo] = useState<File | null>(null);

  // Local preview URLs (created from pending files)
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [restaurantLogoPreview, setRestaurantLogoPreview] = useState<string>("");

  // Upload Image to ImgBB
  const uploadImage = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data: ImgBBResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Image upload failed.");
    }

    return data.data.url;
  };

  // Fetch Profile
  useEffect(() => {
    if (isPending) return;

    const email = session?.user?.email;

    if (!email) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/vendor/profile/${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile({
          name: data.name || "",
          email: data.email || email,
          phone: data.phone || "",
          restaurantName: data.restaurantName || "",
          location: data.location || "",
          description: data.description || "",
          profileImage: data.profileImage || "",
          restaurantLogo: data.restaurantLogo || "",
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.email, isPending]);

  // Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle image selection — preview only, no upload yet
  const handleImageSelect = (
    file: File,
    field: "profileImage" | "restaurantLogo"
  ) => {
    const previewUrl = URL.createObjectURL(file);

    if (field === "profileImage") {
      // Revoke old preview URL to avoid memory leaks
      if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
      setPendingProfileImage(file);
      setProfileImagePreview(previewUrl);
    } else {
      if (restaurantLogoPreview) URL.revokeObjectURL(restaurantLogoPreview);
      setPendingRestaurantLogo(file);
      setRestaurantLogoPreview(previewUrl);
    }

    toast.success("Image selected! Click 'Save Changes' to apply.");
  };

  // Save Profile — upload pending images first, then save all data
  const handleSave = async () => {
    if (!session?.user?.email) {
      toast.error("Please login first");
      return;
    }

    if (!profile.name.trim() || !profile.restaurantName.trim()) {
      toast.error("Name and restaurant name are required");
      return;
    }

    setSaving(true);

    try {
      // Upload pending images to ImgBB before saving
      let profileImageUrl = profile.profileImage;
      let restaurantLogoUrl = profile.restaurantLogo;

      if (pendingProfileImage) {
        profileImageUrl = await uploadImage(pendingProfileImage);
      }

      if (pendingRestaurantLogo) {
        restaurantLogoUrl = await uploadImage(pendingRestaurantLogo);
      }

      const response = await fetch(
        `http://localhost:5000/vendor/profile/${encodeURIComponent(session.user.email)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            phone: profile.phone,
            restaurantName: profile.restaurantName,
            location: profile.location,
            description: profile.description,
            profileImage: profileImageUrl,
            restaurantLogo: restaurantLogoUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update profile state with the uploaded URLs
      setProfile((previous) => ({
        ...previous,
        profileImage: profileImageUrl,
        restaurantLogo: restaurantLogoUrl,
      }));

      // Clear pending files and preview URLs
      if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
      if (restaurantLogoPreview) URL.revokeObjectURL(restaurantLogoPreview);
      setPendingProfileImage(null);
      setPendingRestaurantLogo(null);
      setProfileImagePreview("");
      setRestaurantLogoPreview("");

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading || isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />

          <p className="text-sm text-[#A8A29E]">
            Loading vendor profile...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-[#A8A29E]">
          Please login to access your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">

      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Profile Settings
            </h1>

            <Sparkles size={19} className="text-orange-400" />
          </div>

          <p className="mt-2 text-sm text-[#A8A29E]">
            Manage your personal information and restaurant profile.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs font-semibold text-green-400">
            Vendor Account
          </span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#1C1715] p-5 sm:p-7">

        {/* Background Decoration */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-500/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          {/* Vendor Information */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/10">
              {(profileImagePreview || profile.profileImage) ? (
                <img
                  src={profileImagePreview || profile.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={28} className="text-orange-400" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                {profile.name || "Vendor Name"}
              </h2>

              <p className="mt-1 truncate text-sm text-[#A8A29E]">
                {profile.email}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-orange-400">
                <Store size={13} />
                Restaurant Owner
              </div>
            </div>
          </div>

          {/* Restaurant Logo */}
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#100D0B]/70 p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#211A16]">
              {(restaurantLogoPreview || profile.restaurantLogo) ? (
                <img
                  src={restaurantLogoPreview || profile.restaurantLogo}
                  alt="Restaurant Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UtensilsCrossed
                  size={24}
                  className="text-orange-400"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[#78716C]">
                Your Restaurant
              </p>

              <p className="mt-1 max-w-[180px] truncate text-sm font-semibold text-white">
                {profile.restaurantName || "Restaurant Name"}
              </p>
            </div>
          </div>
        </div>

        {/* Image Uploads */}
        <div className="relative mt-7 grid gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-2">

          {/* Profile Image */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#100D0B]/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                <Camera size={18} className="text-orange-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Profile Picture
                </p>

                <p className="mt-1 text-xs text-[#78716C]">
                  Update your photo
                </p>
              </div>
            </div>

            <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20">
              <Upload size={14} />

              Upload

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={saving}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleImageSelect(file, "profileImage");
                  }

                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {/* Restaurant Logo */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#100D0B]/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                <Store size={18} className="text-orange-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Restaurant Logo
                </p>

                <p className="mt-1 text-xs text-[#78716C]">
                  Upload your logo
                </p>
              </div>
            </div>

            <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20">
              <Upload size={14} />

              Upload

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={saving}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleImageSelect(file, "restaurantLogo");
                  }

                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        {(pendingProfileImage || pendingRestaurantLogo) && (
          <p className="relative mt-3 text-xs text-orange-400">
            Image selected — click &apos;Save Changes&apos; to upload and apply.
          </p>
        )}
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <User size={19} className="text-orange-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Personal Information
            </h2>

            <p className="mt-1 text-xs text-[#78716C]">
              Your personal contact details.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#D6D3D1]">
              Full Name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={saving}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-white/[0.07] bg-[#100D0B] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#57534E] focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#D6D3D1]">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-white/[0.05] bg-[#100D0B]/70 py-3 pl-11 pr-4 text-sm text-[#78716C] outline-none"
              />
            </div>

            <p className="mt-2 text-[11px] text-[#57534E]">
              Email address cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#D6D3D1]">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={saving}
                placeholder="+880 1XXXXXXXXX"
                className="w-full rounded-xl border border-white/[0.07] bg-[#100D0B] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#57534E] focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Restaurant Information */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <Store size={19} className="text-orange-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Restaurant Information
            </h2>

            <p className="mt-1 text-xs text-[#78716C]">
              Tell customers about your restaurant.
            </p>
          </div>
        </div>

        <div className="space-y-5">

          {/* Restaurant Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#D6D3D1]">
              Restaurant Name
            </label>

            <div className="relative">
              <Store
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="restaurantName"
                value={profile.restaurantName}
                onChange={handleChange}
                disabled={saving}
                placeholder="Enter restaurant name"
                className="w-full rounded-xl border border-white/[0.07] bg-[#100D0B] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#57534E] focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#D6D3D1]">
              Restaurant Location
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                disabled={saving}
                placeholder="Enter restaurant location"
                className="w-full rounded-xl border border-white/[0.07] bg-[#100D0B] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#57534E] focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[#D6D3D1]">
                Restaurant Description
              </label>

              <span className="text-xs text-[#57534E]">
                {profile.description.length} characters
              </span>
            </div>

            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              disabled={saving}
              placeholder="Tell customers about your restaurant, food quality and services..."
              rows={5}
              className="w-full resize-none rounded-xl border border-white/[0.07] bg-[#100D0B] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#57534E] focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
            />
          </div>

        </div>
      </div>

      {/* Account Security */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <ShieldCheck size={19} className="text-orange-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Account Security
            </h2>

            <p className="mt-1 text-xs text-[#78716C]">
              Keep your account safe and secure.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-white/[0.05] bg-[#100D0B]/60 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
              <Lock size={18} className="text-[#A8A29E]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Password
              </p>

              <p className="mt-1 text-xs text-[#78716C]">
                Change your account password.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.info("Password change will be implemented later.")
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-[#D6D3D1] transition hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-400"
          >
            <Lock size={15} />
            Change Password
          </button>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-center text-xs text-[#78716C] sm:text-left">
          Make sure your information is correct before saving.
        </p>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Save size={17} />

          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

    </div>
  );
}