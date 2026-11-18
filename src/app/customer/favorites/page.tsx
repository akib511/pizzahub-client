"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Search,
  Pizza,
  Star,
  MapPin,
} from "lucide-react";

const initialFavorites = [
  {
    id: "1",
    name: "Pepperoni Pizza",
    description: "Classic pepperoni with mozzarella cheese and rich tomato sauce.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600",
    price: 24.99,
    category: "Meat Lovers",
    rating: 4.8,
    location: "Dhanmondi, Dhaka",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce and delicious basil leaves.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
    price: 12.99,
    category: "Classic Pizza",
    rating: 4.9,
    location: "Uttara, Dhaka",
  },
  {
    id: "3",
    name: "BBQ Chicken Pizza",
    description: "Smoky BBQ chicken topped with cheese and fresh vegetables.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    price: 16.99,
    category: "Specialty Pizza",
    rating: 4.7,
    location: "Mirpur, Dhaka",
  },
];

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [search, setSearch] = useState("");

  const removeFavorite = (id: string) => {
    setFavorites((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

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

        {/* Search and count */}
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
          {filteredFavorites.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFavorites.map((item) => (
                <div
                  key={item.id}
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
                      onClick={() => removeFavorite(item.id)}
                      aria-label={`Remove ${item.name} from favorites`}
                      title="Remove from favorites"
                      className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-red-400 backdrop-blur-md transition hover:scale-105 hover:bg-red-500 hover:text-white"
                    >
                      <Heart size={18} className="fill-current" />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-xs text-white backdrop-blur-md">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                      {item.rating}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold transition group-hover:text-orange-400">
                        {item.name}
                      </h2>

                      <p className="shrink-0 text-lg font-bold text-orange-400">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-xs text-gray-500">
                      <MapPin size={14} className="shrink-0 text-orange-400" />
                      <span>{item.location}</span>
                    </div>

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
                        onClick={() => removeFavorite(item.id)}
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
    </main>
  );
}