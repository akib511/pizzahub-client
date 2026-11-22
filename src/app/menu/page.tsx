"use client";

import { API_URL, apiFetch } from "@/lib/api";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  SlidersHorizontal,
} from "lucide-react";

const categories = [
  { name: "All Pizzas", icon: PizzaIcon },
  { name: "Classic", icon: UtensilsCrossed },
  { name: "Vegetarian", icon: Leaf },
  { name: "Meat Lovers", icon: Beef },
  { name: "Specialty", icon: Sparkles },
  { name: "Sides & Appetizers", icon: ChefHat },
  { name: "Desserts", icon: CakeSlice },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

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

const getCategory = (category: string) => {
  if (category === "Classic Pizzas") return "Classic";
  if (category === "Vegetarian Pizzas") return "Vegetarian";
  if (category === "Specialty / Gourmet Pizzas") return "Specialty";
  return category;
};

function MenuContent() {
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState("All Pizzas");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteLoading, setFavoriteLoading] = useState<string[]>([]);

  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  // Category from the URL — applied while rendering rather than in an effect.
  const categoryFromUrl = searchParams.get("category");
  const urlCategory = categoryFromUrl
    ? getCategory(categoryFromUrl)
    : "All Pizzas";

  const [prevUrlCategory, setPrevUrlCategory] = useState<string | null>(null);

  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    setActiveCategory(urlCategory);
  }

  // Clear stored favorites when nobody is signed in.
  const [prevEmail, setPrevEmail] = useState<string | undefined | null>(null);

  if (email !== prevEmail) {
    setPrevEmail(email);

    if (!email) {
      setFavoriteIds([]);
    }
  }

  // Fetch Menu
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(`${API_URL}/menu`);

        if (!response.ok) {
          throw new Error("Failed to load menu items");
        }

        const data: Pizza[] = await response.json();

        setPizzas(
          data.filter(
            (item) =>
              item.status?.toLowerCase() === "approved" &&
              item.available === true,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  // Fetch Favorites
  useEffect(() => {
    if (!email) return;

    const fetchFavorites = async () => {
      if (session?.user?.role !== "customer") {
  setFavoriteIds([]);
  return;
}
      try {
        const response = await apiFetch(
          `${API_URL}/customer/favorites/${encodeURIComponent(email)}`,
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

  // Filter and Sort
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
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "name-desc") return b.name.localeCompare(a.name);

        return 0;
      });
  }, [pizzas, activeCategory, search, sort]);

  // Toggle Favorite
  const toggleFavorite = async (itemId: string) => {
    if (!email) {
      alert("Please login to add favorites");
      return;
    }

    if (favoriteLoading.includes(itemId)) return;

    const isFavorite = favoriteIds.includes(itemId);

    try {
      setFavoriteLoading((prev) => [...prev, itemId]);

      const response = await apiFetch(
        `${API_URL}/customer/favorites/${encodeURIComponent(email)}/${itemId}`,
        {
          method: isFavorite ? "DELETE" : "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite");
      }

      if (isFavorite) {
        setFavoriteIds((prev) => prev.filter((id) => id !== itemId));
      } else {
        setFavoriteIds((prev) => [...prev, itemId]);
      }
    } catch (error) {
      console.error("Favorite update failed:", error);
    } finally {
      setFavoriteLoading((prev) =>
        prev.filter((id) => id !== itemId),
      );
    }
  };

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All Pizzas");
    setSort("featured");
    setShowMobileFilters(false);
  };

  const activeFilterCount =
    (activeCategory !== "All Pizzas" ? 1 : 0) +
    (sort !== "featured" ? 1 : 0);

  return (
    <section className="min-h-screen overflow-hidden bg-background px-3 py-9 text-foreground min-[420px]:px-4 sm:px-6 sm:py-14 md:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
              Made fresh. Made different.
            </span>

            <h2 className="mt-2 text-3xl font-semibold leading-tight sm:mt-3 sm:text-4xl md:text-5xl lg:text-6xl">
              Find Your <span className="text-primary">Flavor.</span>
            </h2>

            <p className="mt-3 max-w-md text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
              Your next favorite pizza is waiting. Explore handcrafted flavors
              made with the finest ingredients.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Flame size={17} className="shrink-0 text-primary" />
            Fresh from the oven
          </div>
        </div>

        {/* Search */}
        <div className="mt-7 flex items-center gap-2 sm:mt-10 lg:block">
          <div className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 transition-colors focus-within:border-primary sm:h-12 sm:max-w-md sm:rounded-lg">
            <Search size={18} className="shrink-0 text-primary" />

            <input
              type="text"
              aria-label="Search pizzas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pizza..."
              className="w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground sm:text-sm"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-muted hover:text-foreground sm:size-8 sm:bg-transparent"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowMobileFilters(true)}
            aria-label="Open filters"
            className="relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:border-primary/50 active:scale-95 lg:hidden"
          >
            <SlidersHorizontal size={18} />

            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="mt-7 grid min-w-0 gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">

          {/* Desktop Sidebar */}
          <aside className="hidden min-w-0 lg:sticky lg:top-6 lg:block lg:self-start">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Something for everyone
            </h3>

            <div className="flex flex-col gap-1">
              {categories.map(({ name, icon: Icon }) => {
                const active = activeCategory === name;

                const count =
                  name === "All Pizzas"
                    ? pizzas.length
                    : pizzas.filter(
                        (pizza) => getCategory(pizza.category) === name,
                      ).length;

                return (
                  <button
                    key={name}
                    onClick={() => setActiveCategory(name)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-background shadow-lg shadow-orange-500/10"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="flex-1 truncate">{name}</span>

                    <span className="text-[11px] opacity-70">
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-border px-3 pt-6">
              <ChefHat size={26} className="text-primary" />

              <h4 className="mt-3 font-medium">Made with love.</h4>

              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Every pizza is prepared fresh using carefully selected
                ingredients.
              </p>
            </div>
          </aside>

          {/* Menu Content */}
          <div className="min-w-0">

            {/* Desktop Toolbar */}
            <div className="mb-5 hidden flex-wrap items-center justify-between gap-3 lg:flex">
              <p className="text-xs text-muted-foreground" aria-live="polite">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredPizzas.length}
                </span>{" "}
                delicious options
              </p>

              <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <ArrowDownUp size={14} className="shrink-0" />

                <span>Sort by</span>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort pizzas"
                  className="h-10 max-w-none cursor-pointer rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Mobile Result Count */}
            <p
              className="mb-3 text-xs text-muted-foreground lg:hidden"
              aria-live="polite"
            >
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredPizzas.length}
              </span>{" "}
              {filteredPizzas.length === 1 ? "option" : "options"}
            </p>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <div className="aspect-[1.4] animate-pulse bg-muted" />

                    <div className="space-y-3 p-4">
                      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                      <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
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

                <p className="mt-2 text-xs text-muted-foreground">
                  {error}
                </p>
              </div>
            )}

            {/* Menu Items */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                  {filteredPizzas.map((pizza) => {
                    const isFavorite = favoriteIds.includes(pizza._id);

                    const isFavoriteLoading =
                      favoriteLoading.includes(pizza._id);

                    return (
                      <div
                        key={pizza._id}
                        className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:shadow-black/30 md:hover:-translate-y-1"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[1.4]">
                          <Link
                            href={`/menu/${pizza._id}`}
                            aria-label={`View ${pizza.name} details`}
                            className="absolute inset-0"
                          >
                            <Image
                              src={pizza.image}
                              alt={pizza.name}
                              fill
                              sizes="(max-width: 479px) 100vw, (max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </Link>

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
{session?.user?.role === "customer" && (
  <button
    onClick={() => toggleFavorite(pizza._id)}
    disabled={isFavoriteLoading}
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
    className="absolute right-2.5 top-2.5 z-10 flex size-11 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80 active:scale-95 disabled:cursor-wait disabled:opacity-60 sm:right-3 sm:top-3 sm:size-9"
  >
    <Heart
      size={19}
      className={
        isFavorite
          ? "fill-red-500 text-red-500"
          : "text-foreground"
      }
    />
  </button>
)}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col px-4 pb-0 pt-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-[10px]">
                            {getCategory(pizza.category)}
                          </p>

                          <div className="mt-1.5 flex items-start justify-between gap-2">
                            <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold leading-snug sm:text-lg sm:font-medium">
                              {pizza.name}
                            </h3>

                            <span className="shrink-0 whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary sm:bg-transparent sm:px-0 sm:py-0 sm:text-base sm:font-semibold">
                              ৳{pizza.price}
                            </span>
                          </div>

                          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-muted-foreground sm:mt-2 sm:min-h-11 sm:text-xs sm:leading-6">
                            {pizza.description}
                          </p>

                          {/* Footer */}
                          <div className="mt-auto mt-3 flex items-center justify-between border-t border-border pt-3 sm:mt-4">
                            <Link
                              href={`/menu/${pizza._id}`}
                              className="flex min-h-10 items-center gap-1 text-[13px] font-medium text-foreground transition-colors hover:text-primary sm:min-h-9 sm:text-xs"
                            >
                              View details

                              <ArrowUpRight
                                size={15}
                                className="transition-transform group-hover:translate-x-0.5 sm:size-[14px]"
                              />
                            </Link>

                            {getCategory(pizza.category) === "Vegetarian" && (
                              <Leaf
                                size={15}
                                className="text-green-500 sm:size-[14px]"
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
                  <div className="rounded-xl border border-border bg-card px-4 py-14 text-center sm:px-5 sm:py-20">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-500/10">
                      <Search className="text-primary" size={24} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold sm:text-lg">
                      No pizza found
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                      We couldn&apos;t find anything matching your search. Try
                      another name or category.
                    </p>

                    <button
                      onClick={clearFilters}
                      className="mt-5 w-full rounded-xl border border-primary/30 bg-primary/5 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary/10 active:scale-[0.98] sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm"
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

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card px-5 pb-6 pt-4">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/30" />

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>

              <button
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
                className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Categories */}
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </p>

              <div className="grid grid-cols-2 gap-2">
                {categories.map(({ name, icon: Icon }) => {
                  const active = activeCategory === name;

                  return (
                    <button
                      key={name}
                      onClick={() => setActiveCategory(name)}
                      aria-pressed={active}
                      className={`flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all active:scale-[0.98] ${
                        active
                          ? "bg-primary text-background"
                          : "bg-card text-muted-foreground"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sort by
              </p>

              <div className="flex flex-col gap-2">
                {sortOptions.map((option) => {
                  const active = sort === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => setSort(option.value)}
                      aria-pressed={active}
                      className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition active:scale-[0.98] ${
                        active
                          ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                          : "bg-card text-muted-foreground"
                      }`}
                    >
                      <span>{option.label}</span>

                      {active && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={clearFilters}
                className="h-12 flex-1 rounded-xl border border-border text-sm font-medium text-muted-foreground transition hover:text-foreground active:scale-[0.98]"
              >
                Reset
              </button>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="h-12 flex-[1.5] rounded-xl bg-primary text-sm font-semibold text-background transition hover:bg-primary active:scale-[0.98]"
              >
                Show {filteredPizzas.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-primary">
          Loading menu...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}