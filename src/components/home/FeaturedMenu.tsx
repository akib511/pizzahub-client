"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  LoaderCircle,
  Plus,
} from "lucide-react";

interface Pizza {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  isPremium?: boolean;
  createdAt?: string;
}

export default function FeaturedMenu() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchFeaturedMenu() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("http://localhost:5000/menu");
        if (!response.ok) throw new Error("Failed to load menu items");
        const data: Pizza[] = await response.json();

        const featuredItems = data
          .filter(
            (item: Pizza & { status?: string; available?: boolean }) =>
              item.status === "approved" && item.available === true
          )
          .sort((a, b) => {
            if (a.isPremium && !b.isPremium) return -1;
            if (!a.isPremium && b.isPremium) return 1;
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          })
          .slice(0, 5);

        setPizzas(featuredItems);
      } catch (error) {
        console.error("Featured menu error:", error);
        setError("Unable to load featured pizzas. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedMenu();
  }, []);

  const activePizza = pizzas[activeIndex];

  return (
   
    <section className="relative overflow-hidden bg-[#100D0B] py-8 sm:py-8">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[400px] rounded-full bg-[#F97316]/[0.05] blur-[100px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[400px] rounded-full bg-[#F97316]/[0.03] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-[#F97316]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#F97316]">
                Chef's Selection
              </span>
            </div>

            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              Signature <span className="text-[#F97316]">Plates</span>
            </h2>
          </div>

          <Link
            href="/menu"
            className="group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 text-[11px] font-medium text-stone-300 transition hover:border-[#F97316]/50 hover:text-[#F97316] active:scale-95 sm:h-10 sm:px-5 sm:text-xs"
          >
            View all
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoaderCircle size={24} className="animate-spin text-[#F97316]" />
            <p className="mt-2 text-xs text-stone-500">Loading menu...</p>
          </div>
        )}

        {!loading && error && (
          <p className="py-8 text-center text-xs text-red-400">{error}</p>
        )}

        {!loading && !error && pizzas.length === 0 && (
          <p className="py-8 text-center text-xs text-stone-500">
            No featured pizzas available right now.
          </p>
        )}

        {/* SPLIT LAYOUT */}
        {!loading && !error && pizzas.length > 0 && activePizza && (
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
            {/* LEFT: HERO */}
            <div className="lg:col-span-7">
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1A1716]">
                <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                  <img
                    key={activePizza._id}
                    src={activePizza.image}
                    alt={activePizza.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#100D0B] via-[#100D0B]/40 to-transparent" />

                  {activePizza.isPremium && (
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#F97316]/30 bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#F97316] backdrop-blur-md">
                      <Flame size={10} />
                      Chef's pick
                    </div>
                  )}

                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-md">
                    {activePizza.category}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">
                      {activePizza.name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs leading-5 text-stone-400 sm:text-sm">
                      {activePizza.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400">
                          from
                        </span>
                        <span className="text-xl font-black text-white sm:text-2xl">
                          ${activePizza.price}
                        </span>
                      </div>

                      <Link
                        href={`/menu/${activePizza._id}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#F97316] px-4 text-xs font-bold text-white transition hover:bg-[#ea6a0f] active:scale-[0.97] sm:h-10 sm:px-5"
                      >
                        <Plus size={14} strokeWidth={3} />
                        Add to order
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LIST */}
            <div className="lg:col-span-5">
              <div className="space-y-2">
                {pizzas.map((pizza, index) => {
                  if (index === activeIndex) return null;

                  return (
                    <button
                      key={pizza._id}
                      onClick={() => setActiveIndex(index)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 text-left transition-all hover:border-[#F97316]/40 hover:bg-white/[0.04] active:scale-[0.99] sm:p-2.5"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg sm:size-16">
                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="line-clamp-1 text-sm font-semibold text-white transition group-hover:text-[#F97316]">
                            {pizza.name}
                          </h4>
                          <span className="shrink-0 text-sm font-bold text-[#F97316]">
                            ${pizza.price}
                          </span>
                        </div>

                        <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-500">
                          {pizza.description}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F97316]"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Bottom CTA - Made compact */}
              <Link
                href="/menu"
                className="group mt-2.5 flex items-center justify-between rounded-lg border border-dashed border-white/10 px-3 py-2 text-left transition hover:border-[#F97316]/40 hover:bg-white/[0.02]"
              >
                <p className="text-[11px] text-stone-400 transition group-hover:text-white">
                  {pizzas.length}+ more flavors available
                </p>
                <ArrowRight
                  size={14}
                  className="text-[#F97316] transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}