"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
Heart,
ShoppingBag,
ArrowRight,
Trash2,
Search,
Pizza,
Star,
MapPin,
CheckCircle2,
AlertCircle,
X,
} from "lucide-react";

type Favorite = {
_id: string;
name: string;
description: string;
image: string;
price: number;
category: string;
location?: string;
rating?: number;
};

export default function CustomerFavoritesPage() {
const { data: session, isPending } = authClient.useSession();

const [favorites, setFavorites] = useState<Favorite[]>([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);

const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
const [deleting, setDeleting] = useState(false);

const [toast, setToast] = useState<{
message: string;
type: "success" | "error";
} | null>(null);

const email = session?.user?.email;

// Fetch Customer Favorites
useEffect(() => {
if (isPending) return;

if (!email) {
  setLoading(false);
  return;
}

const fetchFavorites = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/customer/favorites/${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      setFavorites(data);
    }
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
  } finally {
    setLoading(false);
  }
};

fetchFavorites();

}, [email, isPending]);

// Remove Favorite
const removeFavorite = async (itemId: string) => {
if (!email || deleting) return;

setDeleting(true);

try {
  const response = await fetch(
    `http://localhost:5000/customer/favorites/${encodeURIComponent(email)}/${itemId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove favorite");
  }

  setFavorites((prev) =>
    prev.filter((item) => item._id !== itemId)
  );

  setShowDeleteId(null);

  setToast({
    message: "Favorite removed successfully!",
    type: "success",
  });
} catch (error) {
  console.error("Failed to remove favorite:", error);

  setToast({
    message: "Failed to remove favorite. Please try again.",
    type: "error",
  });
} finally {
  setDeleting(false);
}

};

// Auto Close Toast
useEffect(() => {
if (!toast) return;

const timer = setTimeout(() => {
  setToast(null);
}, 3000);

return () => clearTimeout(timer);

}, [toast]);

// Search Favorites
const filteredFavorites = favorites.filter((item) =>
item.name.toLowerCase().includes(search.toLowerCase())
);

return (
<main className="min-h-full text-white">
<div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">

    {/* Header */}
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400">
          <Heart size={13} className="fill-red-400" />
          Your Collection
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Favorites<span className="text-orange-500">.</span>
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Your favorite pizzas, all in one place.
        </p>
      </div>

      <Link
        href="/menu"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110"
      >
        <ShoppingBag size={17} />
        Explore Menu
        <ArrowRight size={16} />
      </Link>
    </div>

    {/* Search and Count */}
    <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-sm">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your favorite pizzas..."
          className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/40"
        />
      </div>

      <p className="text-sm text-gray-500">
        <span className="font-semibold text-white">
          {favorites.length}
        </span>{" "}
        favorite items
      </p>
    </div>

    {/* Favorites Grid */}
    <section className="mt-7">

      {/* Loading */}
      {loading || isPending ? (
        <div className="py-20 text-center text-sm text-gray-400">
          Loading your favorites...
        </div>
      ) : filteredFavorites.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredFavorites.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#171310] transition duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-black/20"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                  {item.category}
                </span>

                <button
                  onClick={() => setShowDeleteId(item._id)}
                  aria-label={`Remove ${item.name} from favorites`}
                  title="Remove from favorites"
                  className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-red-400 backdrop-blur-md transition hover:scale-105 hover:bg-red-500 hover:text-white"
                >
                  <Heart size={18} className="fill-current" />
                </button>

                {item.rating !== undefined && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-xs text-white backdrop-blur-md">
                    <Star
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                    {item.rating}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold transition group-hover:text-orange-400">
                    {item.name}
                  </h2>

                  <p className="shrink-0 text-lg font-bold text-orange-400">
                    ৳{item.price}
                  </p>
                </div>

                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                  {item.description}
                </p>

                {item.location && (
                  <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-xs text-gray-500">
                    <MapPin size={14} className="shrink-0 text-orange-400" />
                    <span>{item.location}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href="/menu"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-3 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    <Pizza size={16} />
                    View Menu
                  </Link>

                  <button
                    onClick={() => setShowDeleteId(item._id)}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Remove ${item.name}`}
                    title="Remove favorite"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent px-5 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/[0.06]">
            <Heart size={28} className="text-red-400" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            {search ? "No Favorites Found" : "No Favorites Yet"}
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            {search
              ? "No favorite pizza matches your search. Try another name."
              : "You haven't added any pizzas to your favorites yet. Explore our menu and save the pizzas you love!"}
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Pizza Menu
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  </div>

  {/* Delete Confirmation Dialog */}
  {showDeleteId && (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={() => !deleting && setShowDeleteId(null)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1A1716] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-500/10">
          <Trash2 size={25} className="text-red-400" />
        </div>

        <h3 className="mt-4 text-center text-lg font-semibold text-white">
          Remove Favorite?
        </h3>

        <p className="mt-2 text-center text-sm leading-6 text-gray-400">
          Are you sure you want to remove this pizza from your favorites?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowDeleteId(null)}
            disabled={deleting}
            className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() => removeFavorite(showDeleteId)}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Toast Notification */}
  {toast && (
    <div
      className={`fixed right-4 top-5 z-[110] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
        toast.type === "success"
          ? "border-green-500/20 bg-[#17251C] text-green-400"
          : "border-red-500/20 bg-[#291717] text-red-400"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 size={20} />
      ) : (
        <AlertCircle size={20} />
      )}

      <p className="text-sm font-medium">{toast.message}</p>

      <button
        onClick={() => setToast(null)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )}
</main>

);
}