"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  X,
  Loader2,
  Pencil,
  ImagePlus,
  Upload,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  image: string;
  available: boolean;
  status: "Active" | "Inactive" | "Pending";
  orders: number;
  vendorEmail: string;
  preparationTime: number;
}

interface ImgBBResponse {
  success: boolean;
  data: {
    url: string;
    display_url: string;
  };
}

interface EditMenuDialogProps {
  item: MenuItem;
  onClose: () => void;
  onUpdate: (updatedItem: MenuItem) => void;
}

export default function EditMenuDialog({
  item,
  onClose,
  onUpdate,
}: EditMenuDialogProps) {
  const [editName, setEditName] = useState(item.name);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editPrice, setEditPrice] = useState(String(item.price));
  const [editLocation, setEditLocation] = useState(item.location);
  const [editPreparationTime, setEditPreparationTime] = useState(
    String(item.preparationTime),
  );

  const [editAvailable, setEditAvailable] = useState(item.available);
  const [editImage, setEditImage] = useState(item.image);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // Select new image
  const handleEditImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setEditError("Image size must be less than 5MB.");
      return;
    }

    setEditImageFile(file);
    setEditImage(URL.createObjectURL(file));
    setEditError("");
  };

  // Upload image to ImgBB
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
      },
    );

    const data: ImgBBResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Image upload failed.");
    }

    return data.data.url;
  };

  // Update menu item
  const updateMenuItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEditError("");

    if (
      !editName.trim() ||
      !editDescription.trim() ||
      !editCategory ||
      !editPrice ||
      !editLocation.trim() ||
      !editPreparationTime
    ) {
      setEditError("Please fill in all required fields.");
      return;
    }

    if (Number(editPrice) <= 0) {
      setEditError("Price must be greater than 0.");
      return;
    }

    if (Number(editPreparationTime) <= 0) {
      setEditError("Preparation time must be greater than 0.");
      return;
    }

    try {
      setUpdating(true);

      let imageUrl = item.image;

      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }

      const updatedData = {
        name: editName.trim(),
        description: editDescription.trim(),
        category: editCategory,
        price: Number(editPrice),
        location: editLocation.trim(),
        preparationTime: Number(editPreparationTime),
        available: editAvailable,
        image: imageUrl,
      };

      const response = await fetch(
        `http://localhost:5000/menu/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update menu item");
      }

      const updatedItem: MenuItem = {
        ...item,
        ...updatedData,
        status:
          item.status === "Pending"
            ? "Pending"
            : updatedData.available
              ? "Active"
              : "Inactive",
      };

      onUpdate(updatedItem);
    } catch (error) {
      console.error("Update menu error:", error);

      setEditError(
        error instanceof Error
          ? error.message
          : "Something went wrong!",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-5">
      <div className="my-auto w-full max-w-3xl rounded-2xl border border-[#302824] bg-[#1C1715] shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#302824] p-5 sm:p-6">
          <div>
            <p className="text-sm text-orange-400">Menu Management</p>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              Edit Menu Item
            </h2>

            <p className="mt-1 text-xs text-[#A8A29E]">
              Update your food item information.
            </p>
          </div>

          <button
            type="button"
            disabled={updating}
            onClick={onClose}
            className="rounded-lg p-2 text-[#A8A29E] transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={updateMenuItem}>
          <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5 sm:p-6">

            {editError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle size={18} className="shrink-0" />
                {editError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Item Name *
              </label>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full rounded-xl border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm outline-none focus:border-orange-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description *
              </label>

              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
                className="w-full resize-none rounded-xl border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm outline-none focus:border-orange-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category *
              </label>

              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                required
                className="w-full rounded-xl border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                <option value="">Select category</option>
                <option value="Classic Pizzas">Classic Pizzas</option>
                <option value="Vegetarian Pizzas">Vegetarian Pizzas</option>
                <option value="Meat Lovers">Meat Lovers</option>
                <option value="Specialty / Gourmet Pizzas">
                  Specialty / Gourmet Pizzas
                </option>
                <option value="Sides & Appetizers">Sides & Appetizers</option>
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                />

                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#302824] bg-[#100D0B] py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Price and Preparation Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price (৳) *
                </label>

                <input
                  type="number"
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
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
                    value={editPreparationTime}
                    onChange={(e) =>
                      setEditPreparationTime(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-[#302824] bg-[#100D0B] py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between rounded-xl border border-[#302824] bg-[#100D0B] p-4">
              <div>
                <p className="text-sm font-medium">
                  Available for orders
                </p>

                <p className="mt-1 text-xs text-[#A8A29E]">
                  Turn off when this item is unavailable.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditAvailable(!editAvailable)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  editAvailable ? "bg-orange-500" : "bg-[#514943]"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    editAvailable ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Food Image
              </label>

              <div className="rounded-xl border border-[#302824] bg-[#100D0B] p-3">
                {editImage ? (
                  <div className="relative">
                    <img
                      src={editImage}
                      alt="Food preview"
                      className="h-48 w-full rounded-lg object-cover"
                    />

                    <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-lg bg-black/80 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500">
                      <Upload size={15} />
                      Change Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#514943] transition hover:border-orange-500">
                    <ImagePlus size={30} className="text-orange-500" />

                    <span className="mt-3 text-sm font-medium">
                      Upload Food Image
                    </span>

                    <span className="mt-1 text-xs text-[#A8A29E]">
                      JPG, PNG or WEBP (Max 5MB)
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                <p className="mt-3 text-xs text-[#A8A29E]">
                  {editImageFile
                    ? "New image selected. It will be uploaded to ImgBB when you update."
                    : "Your current image is being used. Select a new image to replace it."}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#302824] p-5 sm:flex-row sm:justify-end sm:p-6">
            <button
              type="button"
              disabled={updating}
              onClick={onClose}
              className="rounded-xl border border-[#302824] px-5 py-3 text-sm font-semibold text-[#A8A29E] transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  Update Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}