"use client";

import { AnimatePresence, motion } from "framer-motion";
import { API_URL, apiFetch } from "@/lib/api";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  LoaderCircle,
  MapPin,
  Store,
  Eye,
} from "lucide-react";

interface Pizza {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  location?: string;
  vendorEmail?: string;
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
        const response = await apiFetch(`${API_URL}/menu`);
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

  // Helper to get vendor name from email
  const getVendorName = (email?: string) => {
    if (!email) return "Unknown Vendor";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section className="relative overflow-hidden bg-background py-8 sm:py-8">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[400px] rounded-full bg-primary/[0.05] blur-[100px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[400px] rounded-full bg-primary/[0.03] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-5 flex items-end justify-between gap-3 sm:mb-6"
        >
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-primary">
                Chef&apos;s Selection
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
              Signature <span className="text-primary">Plates</span>
            </h2>
          </div>

          <Link
            href="/menu"
            className="group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 text-[11px] font-medium text-muted-foreground transition hover:border-primary/50 hover:text-primary active:scale-95 sm:h-10 sm:px-5 sm:text-xs"
          >
            View all
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col items-center justify-center py-12"
          >
            <LoaderCircle size={24} className="animate-spin text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">Loading menu...</p>
          </motion.div>
        )}

        {!loading && error && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="py-8 text-center text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}

        {!loading && !error && pizzas.length === 0 && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="py-8 text-center text-xs text-muted-foreground"
          >
            No featured pizzas available right now.
          </motion.p>
        )}

        {/* SPLIT LAYOUT */}
        {!loading && !error && pizzas.length > 0 && activePizza && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-4 lg:grid-cols-12 lg:gap-6"
          >
            {/* LEFT: HERO CARD (Featured) */}
            <motion.div variants={fadeUp} className="lg:col-span-7">
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activePizza._id}
                      src={activePizza.image}
                      alt={activePizza.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {activePizza.isPremium && (
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      <Flame size={10} />
                      Chef&apos;s pick
                    </div>
                  )}

                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-md">
                    {activePizza.category}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="text-lg font-bold leading-tight text-white sm:text-2xl">
                      {activePizza.name}
                    </h3>
                    
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80 sm:text-sm">
                      {activePizza.description}
                    </p>

                    {/* Vendor & Location Info */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Store size={12} className="text-primary" />
                        {getVendorName(activePizza.vendorEmail)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary" />
                        {activePizza.location || "Location unavailable"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-white/70">from</span>
                        <span className="text-xl font-black text-white sm:text-2xl">${activePizza.price}</span>
                      </div>

                      <Link
                        href={`/menu/${activePizza._id}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-bold text-white transition hover:bg-primary active:scale-[0.97] sm:h-10 sm:px-5"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: LIST CARDS */}
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <motion.div variants={staggerContainer} className="space-y-2">
                {pizzas.map((pizza, index) => {
                  if (index === activeIndex) return null;

                  return (
                    <motion.button
                      key={pizza._id}
                      variants={fadeUp}
                      whileHover={{ y: -3 }}
                      onClick={() => setActiveIndex(index)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-border bg-muted/40 p-2 text-left transition-all hover:border-primary/40 hover:bg-muted active:scale-[0.99] sm:p-2.5"
                    >
                      {/* Image */}
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg sm:size-16">
                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="line-clamp-1 text-sm font-semibold text-foreground transition group-hover:text-primary">
                            {pizza.name}
                          </h4>
                          <span className="shrink-0 text-sm font-bold text-primary">
                            ${pizza.price}
                          </span>
                        </div>

                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-primary/70">
                          {pizza.category}
                        </p>

                        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                          {pizza.description}
                        </p>

                        {/* Vendor & Location Info */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Store size={10} className="text-primary/70" />
                            {getVendorName(pizza.vendorEmail)}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <MapPin size={10} className="text-primary/70" />
                            {pizza.location || "Unknown"}
                          </span>
                        </div>
                      </div>

                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-foreground/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      />
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Bottom CTA */}
              <Link
                href="/menu"
                className="group mt-2.5 flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 text-left transition hover:border-primary/40 hover:bg-muted/40"
              >
                <p className="text-[11px] text-muted-foreground transition group-hover:text-foreground">
                  {pizzas.length}+ more flavors available
                </p>
                <ArrowRight
                  size={14}
                  className="text-primary transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}