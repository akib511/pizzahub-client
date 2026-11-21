"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

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

export default function CustomerProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load user information while rendering (instead of copying session data
  // into state inside an effect).
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & {
        profileImage?: string;
        bio?: string;
      })
    | undefined;

  const sessionSignature = sessionUser
    ? [
        sessionUser.id,
        sessionUser.name,
        sessionUser.image,
        sessionUser.profileImage,
        sessionUser.bio,
      ].join("|")
    : "";

  const [prevSessionSignature, setPrevSessionSignature] = useState("");

  if (sessionUser && sessionSignature !== prevSessionSignature) {
    setPrevSessionSignature(sessionSignature);

    setName(sessionUser.name || "");
    setImage(sessionUser.image || sessionUser.profileImage || "");
    setBio(sessionUser.bio || "");
  }

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

  const previewUrl = URL.createObjectURL(file);
  setImage(previewUrl);

  toast.info("Image selected. Click Save Changes to update.");

  e.target.value = "";
};

  // Update Profile
const handleUpdateProfile = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (!name.trim()) {
    toast.error("Please enter your full name.");
    return;
  }

  setLoading(true);

  try {
    let finalImage = image;

    if (selectedFile) {
      setUploading(true);
      finalImage = await uploadImage(selectedFile);
      setUploading(false);
    }

    const { error } = await authClient.updateUser({
      name: name.trim(),
      image: finalImage || "",
      bio: bio.trim(),
    });

    if (error) {
      toast.error(error.message || "Profile update failed.");
      return;
    }

    setImage(finalImage);
    setSelectedFile(null);

    window.dispatchEvent(new Event("profile-updated"));

    toast.success("Profile updated successfully!");
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Something went wrong."
    );
  } finally {
    setLoading(false);
    setUploading(false);
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
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-background px-4 py-10 sm:px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 -top-20 h-80 w-80 rounded-full bg-orange-500/[0.08] blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-20 -right-32 h-80 w-80 rounded-full bg-amber-500/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-8">
         

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            My Profile<span className="text-orange-500">.</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal information and customize your account.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/30">
          {/* Profile Header */}
          <div className="relative overflow-hidden border-b border-border bg-gradient-to-r from-card via-card to-card px-6 py-9 sm:px-10">
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-orange-500/[0.08] blur-3xl" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-border bg-muted shadow-xl ring-2 ring-orange-500/40">
                  {image ? (
                    <img
                      src={image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={48} className="text-orange-500" />
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={loading || uploading}
                  className="hidden"
                />

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                  title="Change profile picture"
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-card bg-orange-500 text-white shadow-lg transition hover:scale-110 hover:bg-orange-600 disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Camera size={17} />
                  )}
                </button>
              </div>

              {/* User Information */}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  {name || "Customer"}
                </h2>

                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                  <Mail size={15} />
                  {session.user.email}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                  <ShieldCheck size={14} />
                  Customer Account
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Click the camera icon to change your photo.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdateProfile} className="p-6 sm:p-10">
            <div className="mb-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update your account details below.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                      type="email"
                      value={session.user.email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-border bg-background/70 py-3.5 pl-12 pr-4 text-sm text-muted-foreground outline-none"
                    />
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Email address cannot be changed.
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="border-t border-border pt-8">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-foreground">About Me</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Tell others a little about yourself.
                </p>
              </div>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-4 top-4 text-muted-foreground"
                />

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  placeholder="Write something about yourself..."
                  rows={4}
                  maxLength={300}
                  className="w-full resize-none rounded-xl border border-border bg-background py-4 pl-12 pr-4 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {bio.length}/300 characters
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="mt-6 space-y-3">
              {message && (
                <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  <ShieldCheck size={19} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
              <p className="text-xs text-muted-foreground">
                Make sure to save your changes.
              </p>

              <button
                type="submit"
                disabled={loading || uploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-7 py-3.5 text-sm font-bold text-foreground shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
              >
                {loading || uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {uploading ? "Uploading Image..." : "Saving Changes..."}
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

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} />
          Your account information is securely managed.
        </div>
      </div>
    </main>
  );
}
