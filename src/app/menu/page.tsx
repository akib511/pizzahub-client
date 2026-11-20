"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

import {
  Search,
  X,
  ArrowUpRight,
  ArrowDownUp,
  Flame,
  ChefHat,
  Leaf,
  Pizza as PizzaIcon,
  UtensilsCrossed,
  Beef,
  Sparkles,
  CakeSlice,
  Heart,
} from "lucide-react";

/* ---------------------------------- */
/* Categories                         */
/* ---------------------------------- */

const categories = [
  { name: "All Pizzas", icon: PizzaIcon },
  { name: "Classic", icon: UtensilsCrossed },
  { name: "Vegetarian", icon: Leaf },
  { name: "Meat Lovers", icon: Beef },
  { name: "Specialty", icon: Sparkles },
  { name: "Sides & Appetizers", icon: ChefHat },
  { name: "Desserts", icon: CakeSlice },
];

/* ---------------------------------- */
/* Sorting Options                    */
/* ---------------------------------- */

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

/* ---------------------------------- */
/* Pizza Type                         */
/* ---------------------------------- */

interface Pizza {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  status: string;
  preparationTime: number;
  location: string;
  vendorEmail: string;
}

/* ---------------------------------- */
/* Category Helper                    */
/* ---------------------------------- */

const getCategory = (category: string) => {
  if (category === "Classic Pizzas") return "Classic";
  if (category === "Vegetarian Pizzas") return "Vegetarian";
  if (category === "Specialty / Gourmet Pizzas") return "Specialty";

  return category;
};

/* ---------------------------------- */
/* Menu Section                       */
/* ---------------------------------- */

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("All Pizzas");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session } = authClient.useSession();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const email = session?.user?.email;

  /* ---------------------------------- */
  /* Fetch Approved and Active Pizzas   */
  /* ---------------------------------- */

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/menu");

        if (!response.ok) {
          throw new Error("Failed to load menu items");
        }

        const data: Pizza[] = await response.json();

        const approvedPizzas = data.filter(
          (item) =>
            item.status?.toLowerCase() === "approved" &&
            item.available === true
        );

        setPizzas(approvedPizzas);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  /* ---------------------------------- */
  /* Fetch Customer Favorites           */
  /* ---------------------------------- */

  useEffect(() => {
    if (!email) {
      setFavoriteIds([]);
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

        const data: Pizza[] = await response.json();

        setFavoriteIds(data.map((item) => item._id));
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, [email]);



  const filteredPizzas = useMemo(() => {
    const q = search.trim().toLowerCase();

    return pizzas
      .filter((pizza) => {
        const category = getCategory(pizza.category);

        const matchesCategory =
          activeCategory === "All Pizzas" ||
          category === activeCategory;

        const matchesSearch =
          pizza.name.toLowerCase().includes(q) ||
          pizza.description.toLowerCase().includes(q) ||
          category.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;

        if (sort === "price-desc") return b.price - a.price;

        if (sort === "name-asc") {
          return a.name.localeCompare(b.name);
        }

        if (sort === "name-desc") {
          return b.name.localeCompare(a.name);
        }

        return 0;
      });
  }, [pizzas, activeCategory, search, sort]);

  /* ---------------------------------- */
  /* Toggle Favorite                    */
  /* ---------------------------------- */

  const toggleFavorite = async (itemId: string) => {
    if (!email) {
      alert("Please login to add favorites");
      return;
    }

    const isFavorite = favoriteIds.includes(itemId);

    try {
      const response = await fetch(
        `http://localhost:5000/customer/favorites/${encodeURIComponent(email)}/${itemId}`,
        {
          method: isFavorite ? "DELETE" : "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite");
      }

      if (isFavorite) {
        setFavoriteIds((prev) =>
          prev.filter((id) => id !== itemId)
        );
      } else {
        setFavoriteIds((prev) => [...prev, itemId]);
      }
    } catch (error) {
      console.error("Favorite update failed:", error);
    }
  };

  /* ---------------------------------- */
  /* Clear Filters                      */
  /* ---------------------------------- */

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All Pizzas");
    setSort("featured");
  };



  return (
    <section className="bg-[#0F0D0C] px-4 py-10 text-[#F5F3EF] sm:px-6 sm:py-14 md:px-8 lg:py-20">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F97316] sm:text-xs">
              Made fresh. Made different.
            </span>

            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Find Your <span className="text-[#F97316]">Flavor.</span>
            </h2>

            <p className="mt-3 max-w-md text-xs leading-6 text-[#A8A29E] sm:text-sm sm:leading-7">
              Your next favorite pizza is waiting. Explore handcrafted
              flavors made with the finest ingredients.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#A8A29E] sm:text-sm">
            <Flame
              size={17}
              className="shrink-0 text-[#F97316]"
            />
            Fresh from the oven
          </div>

        </div>

        {/* Search */}

        <div className="mt-8 flex h-11 items-center gap-3 rounded-lg border border-[#2E2925] bg-[#1A1716] px-3 transition-colors focus-within:border-[#F97316] sm:mt-10 sm:h-12 sm:max-w-md sm:px-4">

          <Search
            size={18}
            className="shrink-0 text-[#F97316]"
          />

          <input
            type="text"
            aria-label="Search pizzas"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizza by name or flavor..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-[#78716C] sm:text-sm"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="shrink-0 text-[#A8A29E] transition hover:text-white"
            >
              <X size={16} />
            </button>
          )}

        </div>

        {/* Main Content */}

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[210px_1fr] lg:gap-10">

          {/* Sidebar */}

          <aside className="lg:sticky lg:top-6 lg:self-start">

            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#78716C] sm:mb-4 sm:text-[11px]">
              Something for everyone
            </h3>

            {/* Category Buttons */}

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">

              {categories.map(({ name, icon: Icon }) => {
                const active = activeCategory === name;

                const count =
                  name === "All Pizzas"
                    ? pizzas.length
                    : pizzas.filter(
                        (pizza) => getCategory(pizza.category) === name
                      ).length;

                return (
                  <button
                    key={name}
                    onClick={() => setActiveCategory(name)}
                    aria-pressed={active}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium transition-all sm:gap-3 sm:py-3 sm:text-xs lg:w-full ${
                      active
                        ? "bg-[#F97316] text-[#0F0D0C] shadow-lg shadow-orange-500/10"
                        : "bg-[#1A1716] text-[#A8A29E] hover:bg-[#25201D] hover:text-white lg:bg-transparent"
                    }`}
                  >
                    <Icon
                      size={16}
                      className="shrink-0"
                    />

                    <span className="whitespace-nowrap">
                      {name}
                    </span>

                    <span className="ml-1 text-[10px] opacity-70 lg:ml-auto">
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}

            </div>

            {/* Sidebar Information */}

            <div className="mt-8 hidden border-t border-[#2E2925] px-3 pt-6 lg:block">

              <ChefHat
                size={26}
                className="text-[#F97316]"
              />

              <h4 className="mt-3 font-medium">
                Made with love.
              </h4>

              <p className="mt-2 text-xs leading-6 text-[#A8A29E]">
                Every pizza is prepared fresh using carefully selected
                ingredients.
              </p>

            </div>

          </aside>

          {/* Pizza Grid */}

          <div className="min-w-0">

            {/* Toolbar */}

            <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">

              <p
                className="text-[11px] text-[#A8A29E] sm:text-xs"
                aria-live="polite"
              >
                Showing{" "}
                <span className="font-semibold text-white">
                  {filteredPizzas.length}
                </span>{" "}
                delicious options
              </p>

              <label className="flex items-center gap-2 text-[11px] text-[#A8A29E] sm:text-xs">

                <ArrowDownUp
                  size={14}
                  className="shrink-0"
                />

                <span className="hidden sm:inline">
                  Sort by
                </span>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort pizzas"
                  className="h-9 w-full cursor-pointer rounded-lg border border-[#2E2925] bg-[#1A1716] px-2 text-xs text-white outline-none transition focus:border-[#F97316] sm:w-auto sm:px-3"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

              </label>

            </div>

            {/* Loading */}

            {loading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-xl border border-[#2E2925] bg-[#1A1716]"
                  >
                    <div className="aspect-[1.4] animate-pulse bg-white/[0.05]" />

                    <div className="space-y-3 p-4">
                      <div className="h-3 w-20 animate-pulse rounded bg-white/[0.07]" />
                      <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.07]" />
                      <div className="h-3 w-full animate-pulse rounded bg-white/[0.07]" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.07]" />
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-12 text-center">

                <p className="text-sm font-medium text-red-400">
                  Unable to load menu
                </p>

                <p className="mt-2 text-xs text-[#A8A29E]">
                  {error}
                </p>

              </div>
            )}

            {/* Pizza Grid */}

            {!loading && !error && (
              <>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">

                  {filteredPizzas.map((pizza) => {
                    const isFavorite = favoriteIds.includes(pizza._id);

                    return (
                      <div
                        key={pizza._id}
                        className="group overflow-hidden rounded-xl border border-[#2E2925] bg-[#1A1716] transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316]/60 hover:shadow-xl hover:shadow-black/30"
                      >

                        {/* Image */}

                        <div className="relative aspect-[1.4] overflow-hidden sm:aspect-[1.3]">

                          <Link
                            href={`/menu/${pizza._id}`}
                            aria-label={`View ${pizza.name} details`}
                            className="absolute inset-0"
                          >
                            <Image
                              src={pizza.image}
                              alt={pizza.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </Link>

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          {/* Favorite Button */}

                          <button
                            onClick={() => toggleFavorite(pizza._id)}
                            aria-label={
                              isFavorite
                                ? `Remove ${pizza.name} from favorites`
                                : `Add ${pizza.name} to favorites`
                            }
                            aria-pressed={isFavorite}
                            title={
                              isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                            className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80"
                          >
                            <Heart
                              size={18}
                              className={
                                isFavorite
                                  ? "fill-red-500 text-red-500"
                                  : "text-white"
                              }
                            />
                          </button>

                        </div>

                        {/* Content */}

                        <div className="px-3 pt-3 sm:px-4 sm:pt-4">

                          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#F97316] sm:text-[10px]">
                            {getCategory(pizza.category)}
                          </p>

                          <div className="mt-1.5 flex items-baseline justify-between gap-2 sm:mt-2">

                            <h3 className="min-w-0 truncate text-base font-medium sm:text-lg">
                              {pizza.name}
                            </h3>

                            <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#F97316] sm:text-base">
                              ৳{pizza.price}
                            </span>

                          </div>

                          <p className="mt-1.5 line-clamp-2 min-h-10 text-[11px] leading-5 text-[#A8A29E] sm:mt-2 sm:min-h-11 sm:text-xs sm:leading-6">
                            {pizza.description}
                          </p>

                          {/* Footer */}

                          <div className="mt-3 flex items-center justify-between border-t border-[#2E2925] py-2.5 sm:mt-4 sm:py-3">

                            <Link
                              href={`/menu/${pizza._id}`}
                              className="flex items-center gap-1 text-[11px] font-medium text-[#F5F3EF] transition-colors hover:text-[#F97316] sm:text-xs"
                            >
                              View details

                              <ArrowUpRight
                                size={14}
                                className="transition-transform group-hover:translate-x-0.5"
                              />
                            </Link>

                            {getCategory(pizza.category) === "Vegetarian" && (
                              <Leaf
                                size={14}
                                className="text-[#7BC47F]"
                              />
                            )}

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* Empty State */}

                {filteredPizzas.length === 0 && (
                  <div className="rounded-xl border border-[#2E2925] bg-[#1A1716] px-5 py-14 text-center sm:py-20">

                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-500/10">
                      <Search
                        className="text-[#F97316]"
                        size={24}
                      />
                    </div>

                    <h3 className="mt-4 text-base font-semibold sm:text-lg">
                      No pizza found
                    </h3>

                    <p className="mt-2 text-xs text-[#A8A29E] sm:text-sm">
                      We couldn't find anything matching your search.
                      Try another name or category.
                    </p>

                    <button
                      onClick={clearFilters}
                      className="mt-5 rounded-lg border border-[#F97316]/30 bg-[#F97316]/5 px-5 py-2.5 text-xs font-medium text-[#F97316] transition hover:bg-[#F97316]/10 sm:text-sm"
                    >
                      Clear filters
                    </button>

                  </div>
                )}

              </>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}