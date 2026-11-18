"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, X, ArrowUpRight, ArrowDownUp, Flame, ChefHat, Leaf,
  Pizza as PizzaIcon, UtensilsCrossed, Beef, Sparkles, CakeSlice,
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

const pizzas = [
  { id: 1, name: "Margherita", category: "Classic", description: "Fresh mozzarella, basil & tomato sauce", price: 590, image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=90", badge: "Popular" },
  { id: 2, name: "Pepperoni Feast", category: "Meat Lovers", description: "Premium pepperoni & melted mozzarella", price: 850, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=90", badge: "Best Seller" },
  { id: 3, name: "Garden Fresh", category: "Vegetarian", description: "Fresh vegetables, olives & mushrooms", price: 690, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&q=90", badge: "" },
  { id: 4, name: "Truffle Mushroom", category: "Specialty", description: "Wild mushrooms, truffle & parmesan", price: 790, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=90", badge: "Chef's Choice" },
  { id: 5, name: "BBQ Chicken", category: "Meat Lovers", description: "Smoky BBQ, grilled chicken & red onions", price: 920, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900&q=90", badge: "" },
  { id: 6, name: "Four Cheese", category: "Classic", description: "Mozzarella, cheddar, parmesan & blue cheese", price: 750, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=90", badge: "" },
];

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("All Pizzas");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filteredPizzas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pizzas
      .filter((p) => (activeCategory === "All Pizzas" || p.category === activeCategory) && p.name.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "name-desc") return b.name.localeCompare(a.name);
        return a.id - b.id;
      });
  }, [activeCategory, search, sort]);

  const clearFilters = () => { setSearch(""); setActiveCategory("All Pizzas"); setSort("featured"); };

  return (
    <section className="bg-[#0F0D0C] px-4 py-12 text-[#F5F3EF] sm:px-6 sm:py-16 md:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F97316] sm:text-xs">
              Made fresh. Made different.
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
              Find Your <span className="text-[#F97316]">Flavor.</span>
            </h2>
            <p className="mt-3 max-w-md text-xs leading-6 text-[#A8A29E] sm:mt-4 sm:text-sm sm:leading-7">
              Your next favorite pizza is waiting. Explore handcrafted flavors made with the finest ingredients.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#A8A29E] sm:text-sm md:shrink-0">
            <Flame size={16} className="shrink-0 text-[#F97316] sm:h-[17px] sm:w-[17px]" />
            Fresh from the oven
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 flex h-11 items-center gap-3 rounded-md border border-[#2E2925] bg-[#1A1716] px-3 transition-colors focus-within:border-[#F97316] sm:mt-10 sm:h-12 sm:max-w-md sm:px-4">
          <Search size={17} className="shrink-0 text-[#F97316] sm:h-[18px] sm:w-[18px]" />
          <input
            type="text"
            aria-label="Search pizzas"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your favorite pizza..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-[#78716C] sm:text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search" className="shrink-0 text-[#A8A29E] hover:text-white">
              <X size={15} className="sm:h-4 sm:w-4" />
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[210px_1fr] lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#78716C] sm:mb-4 sm:text-[11px]">
              Something for everyone
            </h3>

            {/* Horizontal scroll on mobile/tablet, vertical on desktop */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {categories.map(({ name, icon: Icon }) => {
                const active = activeCategory === name;
                const count = name === "All Pizzas" ? pizzas.length : pizzas.filter((p) => p.category === name).length;
                return (
                  <button
                    key={name}
                    onClick={() => setActiveCategory(name)}
                    aria-pressed={active}
                    className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-left text-[11px] font-medium transition-colors sm:gap-3 sm:py-3 sm:text-xs lg:w-full ${
                      active ? "bg-[#F97316] text-[#0F0D0C]" : "bg-[#1A1716] text-[#A8A29E] hover:bg-[#25201D] hover:text-white lg:bg-transparent"
                    }`}
                  >
                    <Icon size={15} className="shrink-0 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{name}</span>
                    <span className="ml-1 text-[10px] opacity-70 lg:ml-auto">{String(count).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 hidden border-t border-[#2E2925] px-3 pt-6 lg:block">
              <ChefHat size={26} className="text-[#F97316]" />
              <h4 className="mt-3 font-medium">Made with love.</h4>
              <p className="mt-2 text-xs leading-6 text-[#A8A29E]">Every pizza is prepared fresh using carefully selected ingredients.</p>
            </div>
          </aside>

          {/* Pizza Grid */}
          <div className="min-w-0">
            {/* Toolbar — stacks on small screens */}
            <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-[11px] text-[#A8A29E] sm:text-xs" aria-live="polite">
                Showing <span className="font-semibold text-white">{filteredPizzas.length}</span> delicious options
              </p>
              <label className="flex items-center gap-2 text-[11px] text-[#A8A29E] sm:text-xs">
                <ArrowDownUp size={13} className="shrink-0 sm:h-[14px] sm:w-[14px]" />
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort pizzas"
                  className="h-8 flex-1 cursor-pointer rounded-md border border-[#2E2925] bg-[#1A1716] px-2 text-[11px] text-white outline-none focus:border-[#F97316] sm:h-9 sm:flex-none sm:px-3 sm:text-xs"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Grid: 1 col mobile → 2 col sm → 3 col xl */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {filteredPizzas.map((pizza) => (
                <Link
                  key={pizza.id}
                  href={`/menu/${pizza.id}`}
                  className="group overflow-hidden rounded-lg border border-[#2E2925] bg-[#1A1716] transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316]/60 hover:shadow-2xl hover:shadow-black/40"
                >
                  <div className="relative aspect-[1.4] overflow-hidden sm:aspect-[1.3]">
                    <Image
                      src={pizza.image}
                      alt={pizza.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    {pizza.badge && (
                      <span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-[#F97316] px-2 py-1 text-[9px] font-bold text-[#0F0D0C] sm:text-[10px]">
                        <Flame size={10} className="sm:h-[11px] sm:w-[11px]" /> {pizza.badge}
                      </span>
                    )}
                  </div>
                  <div className="px-3 pt-3 sm:px-4 sm:pt-4">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#F97316] sm:text-[10px]">{pizza.category}</p>
                    <div className="mt-1.5 flex items-baseline justify-between gap-2 sm:mt-2">
                      <h3 className="text-base font-medium sm:text-lg">{pizza.name}</h3>
                      <span className="whitespace-nowrap text-sm font-semibold text-[#F97316] sm:text-base">৳{pizza.price}</span>
                    </div>
                    <p className="mt-1.5 min-h-[40px] text-[11px] leading-5 text-[#A8A29E] sm:mt-2 sm:min-h-[44px] sm:text-xs sm:leading-6">
                      {pizza.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#2E2925] py-2.5 sm:mt-4 sm:py-3">
                      <span className="flex items-center gap-1 text-[11px] transition-colors group-hover:text-[#F97316] sm:text-xs">
                        View details <ArrowUpRight size={14} className="sm:h-[15px] sm:w-[15px]" />
                      </span>
                      {pizza.category === "Vegetarian" && <Leaf size={13} className="text-[#7BC47F] sm:h-[14px] sm:w-[14px]" />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPizzas.length === 0 && (
              <div className="rounded-lg border border-[#2E2925] bg-[#1A1716] px-6 py-16 text-center sm:py-20">
                <Search className="mx-auto text-[#F97316]" size={28} />
                <h3 className="mt-4 text-base font-semibold sm:text-lg">No pizza found</h3>
                <p className="mt-2 text-xs text-[#A8A29E] sm:text-sm">Try another name or category.</p>
                <button onClick={clearFilters} className="mt-5 rounded-md border border-[#2E2925] px-4 py-2 text-xs text-[#F97316] hover:border-[#F97316] sm:text-sm">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}