"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  X,
  Pizza,
  Clock,
  DollarSign,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AddMenuPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const removeImage = () => {
    setImage("");
    setImageFile(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!name.trim() || !description.trim() || !category || !price || !preparationTime) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(price) <= 0 || Number(preparationTime) <= 0) {
      setError("Price and preparation time must be greater than 0.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a food image.");
      return;
    }

    setLoading(true);

    // Demo submission only. No backend connection yet.
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setPreparationTime("");
      setAvailable(true);
      setImage("");
      setImageFile(null);
    }, 1000);
  };

  return (
    <div className="space-y-7 text-white">
      {/* Header */}
      <div>
        <Link
          href="/vendor/menu"
          className="mb-5 inline-flex items-center gap-2 text-sm text-[#A8A29E] transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to My Menu
        </Link>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Add Menu Item
        </h1>

        <p className="mt-2 text-sm text-[#A8A29E]">
          Add a delicious new item to your restaurant menu.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          <CheckCircle2 size={20} />
          Demo: Menu item added successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Form */}
          <div className="space-y-6 lg:col-span-2">

            {/* Basic Information */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Basic Information</h2>
                <p className="mt-1 text-sm text-[#A8A29E]">
                  Enter your food item details.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Food Name *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pepperoni Pizza"
                    className="w-full rounded-xl border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm outline-none transition placeholder:text-[#716963] focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description *
                  </label>

                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your delicious food item..."
                    className="w-full resize-none rounded-xl border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm outline-none transition placeholder:text-[#716963] focus:border-[#F97316]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category *
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm text-white outline-none focus:border-[#F97316]"
                  >
                    <option value="">Select category</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Sides">Sides</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Preparation */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-6">
              <h2 className="mb-6 text-lg font-semibold">
                Pricing & Preparation
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price (৳) *
                  </label>

                  <div className="relative">
                    <DollarSign
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                    />

                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="299"
                      className="w-full rounded-xl border border-[#302824] bg-[#100D0B] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Preparation Time (Minutes) *
                  </label>

                  <div className="relative">
                    <Clock
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                    />

                    <input
                      type="number"
                      min="1"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      placeholder="25"
                      className="w-full rounded-xl border border-[#302824] bg-[#100D0B] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Availability</h2>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Available for orders</p>
                  <p className="mt-1 text-xs text-[#A8A29E]">
                    Customers can order this item when it is active.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAvailable(!available)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    available ? "bg-[#F97316]" : "bg-[#514943]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      available ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <p className={`mt-3 text-xs ${available ? "text-green-400" : "text-[#A8A29E]"}`}>
                {available ? "Currently Active" : "Currently Inactive"}
              </p>
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5 sm:p-6">
              <h2 className="mb-2 text-lg font-semibold">Food Image</h2>

              <p className="mb-5 text-sm text-[#A8A29E]">
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
                    className="absolute right-3 top-3 rounded-lg bg-black/70 p-2 text-white hover:bg-red-500"
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (
                <label className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#514943] bg-[#100D0B] transition hover:border-[#F97316]">
                  <div className="mb-3 rounded-xl bg-[#F97316]/10 p-4 text-[#F97316]">
                    <ImagePlus size={28} />
                  </div>

                  <p className="text-sm font-medium">Upload Food Image</p>

                  <p className="mt-2 text-xs text-[#A8A29E]">
                    PNG, JPG or WEBP (Max 5MB)
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-[#A8A29E]">
                <Upload size={14} />
                Recommended image ratio: 4:3
              </div>
            </div>

            {/* Preview Card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-5">
              <h2 className="mb-4 font-semibold">Item Preview</h2>

              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#100D0B]">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-[#241D19] text-[#716963]">
                    <Pizza size={42} />
                  </div>
                )}

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">
                      {name || "Food Name"}
                    </h3>

                    <span className="shrink-0 text-sm font-bold text-[#F97316]">
                      ৳{price || "0"}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xs text-[#A8A29E]">
                    {description || "Food description will appear here."}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-xs text-[#A8A29E]">
                    <span>{category || "Category"}</span>

                    <span>
                      {preparationTime || "0"} min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Adding Item...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Add Menu Item
                </>
              )}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}