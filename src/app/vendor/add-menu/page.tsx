"use client";

import { apiFetch } from "@/lib/api";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  X,
  Pizza,
  Clock,
  CheckCircle2,
  Loader2,
  MapPin,
  Crown,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";


interface ImgBBResponse {
  success: boolean;
  data: {
    url: string;
    display_url: string;
  };
}

export default function AddMenuPage() {

  const { data: session } = authClient.useSession();

  // Demo subscription data
  const subscriptionPlan: string = "free";
  const activeMenuItems = 2;

  const isPremium = subscriptionPlan === "premium";
  const activeItemLimit = 3;
  const limitReached = !isPremium && activeMenuItems >= activeItemLimit;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [available, setAvailable] = useState(true);

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setError("");
  };

  // Remove image
  const removeImage = () => {
    setImage("");
    setImageFile(null);
  };


  const uploadImage = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await apiFetch(
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (limitReached && available) {
      setError(
        "Free plan allows maximum 3 active menu items. Upgrade to Premium for unlimited items."
      );
      return;
    }

    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      !price ||
      !location.trim() ||
      !preparationTime
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (Number(preparationTime) <= 0) {
      setError("Preparation time must be greater than 0.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a food image.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage(imageFile);
      const response = await apiFetch("http://localhost:5000/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          vendorEmail: session?.user?.email,
          description,
          category,
          price: Number(price),
          location,
          preparationTime: Number(preparationTime),
          available,
         image: imageUrl,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSuccess(true);

      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setLocation("");
      setPreparationTime("");
      setAvailable(true);
      setImage("");
      setImageFile(null);
    } catch (err) { 
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7 text-foreground">
      {/* Header */}
      <div>
        <Link
          href="/vendor/menu"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to My Menu
        </Link>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Add Menu Item
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Add a delicious new item to your restaurant menu.
        </p>
      </div>

  

      {/* Limit Warning */}
      {limitReached && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={20} className="shrink-0" />

          <div>
            <p className="font-semibold">Active Item Limit Reached</p>

            <p className="mt-1">
              Your Free plan allows only 3 active menu items. Deactivate an
              existing item or upgrade to Premium.
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          <CheckCircle2 size={20} />
          Menu item submitted successfully! Status: Pending Approval.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Section */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your food item details.
                </p>
              </div>

              <div className="space-y-5">
                {/* Item Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Item Name *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pepperoni Pizza"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description *
                  </label>

                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your delicious food item..."
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category *
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select category</option>
                    <option value="Classic Pizzas">Classic Pizzas</option>
                    <option value="Vegetarian Pizzas">Vegetarian Pizzas</option>
                    <option value="Meat Lovers">Meat Lovers</option>
                    <option value="Specialty / Gourmet Pizzas">
                      Specialty / Gourmet Pizzas
                    </option>
                    <option value="Sides & Appetizers">
                      Sides & Appetizers
                    </option>
                    <option value="Beverages & Desserts">
                      Beverages & Desserts
                    </option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Restaurant Location *
                  </label>

                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Area / City (e.g. Dhanmondi, Dhaka)"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Preparation */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="mb-6 text-lg font-semibold">
                Pricing & Preparation
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price (৳) *
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="299"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Preparation Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Preparation Time (Minutes) *
                  </label>

                  <div className="relative">
                    <Clock
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                      type="number"
                      min="1"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      placeholder="25"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Availability
              </h2>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    Available for orders
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Customers can order this item when it is active.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAvailable(!available)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    available ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      available ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <p
                className={`mt-3 text-xs ${
                  available ? "text-green-400" : "text-muted-foreground"
                }`}
              >
                {available ? "Currently Active" : "Currently Inactive"}
              </p>
            </div>
          </div>

          {/* Image & Preview */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="mb-2 text-lg font-semibold">
                Food Image
              </h2>

              <p className="mb-5 text-sm text-muted-foreground">
                Upload a high-quality image of your food.
              </p>

              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="Food preview"
                    className="h-52 w-full rounded-xl object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-500"
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (
                <label className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background transition hover:border-primary">
                  <div className="mb-3 rounded-xl bg-primary/10 p-4 text-primary">
                    <ImagePlus size={28} />
                  </div>

                  <p className="text-sm font-medium">
                    Upload Food Image
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG or WEBP
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Maximum 5MB
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Upload size={14} />
                Recommended ratio: 4:3
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-4 font-semibold">
                Item Preview
              </h2>

              <div className="overflow-hidden rounded-xl border border-border bg-background">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-muted text-muted-foreground">
                    <Pizza size={42} />
                  </div>
                )}

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">
                      {name || "Food Name"}
                    </h3>

                    <span className="shrink-0 text-sm font-bold text-primary">
                      ৳{price || "0"}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {description || "Food description will appear here."}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
                    <span>{category || "Category"}</span>

                    <span>{preparationTime || "0"} min</span>
                  </div>

                  {location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={13} />
                      {location}
                    </div>
                  )}

                  <div className="border-t border-border pt-3">
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                      Pending Approval
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (limitReached && available)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Submit Menu Item
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Your item will be submitted for admin approval.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}