"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  MapPin,
  Clock,
  ChefHat,
  ShieldCheck,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const pizzas = [
  {
    id: "1",
    name: "Margherita",
    category: "Classic",
    rating: 4.8,
    reviews: 124,
    prepTime: "15–20 Mins",
    description:
      "A timeless Italian classic made with fresh mozzarella, rich tomato sauce, fragrant basil, and a perfectly baked crust. Simple ingredients, extraordinary flavor.",
    price: 590,
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1200&q=90",
    badge: "Popular",
    vendor: "PizzaHub Kitchen",
    location: "Dhaka, Bangladesh",
    ingredients: ["Fresh Mozzarella", "San Marzano Tomato", "Fresh Basil", "Olive Oil"],
  },
  {
    id: "2",
    name: "Pepperoni Feast",
    category: "Meat Lovers",
    rating: 4.9,
    reviews: 210,
    prepTime: "20–25 Mins",
    description:
      "Loaded with premium pepperoni, melted mozzarella, and our signature tomato sauce. A rich and satisfying pizza for true meat lovers.",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1200&q=90",
    badge: "Best Seller",
    vendor: "PizzaHub Kitchen",
    location: "Dhaka, Bangladesh",
    ingredients: ["Premium Pepperoni", "Double Mozzarella", "Signature Sauce", "Oregano"],
  },
  {
    id: "3",
    name: "Garden Fresh",
    category: "Vegetarian",
    rating: 4.7,
    reviews: 89,
    prepTime: "20–25 Mins",
    description:
      "A colorful combination of fresh vegetables, olives, mushrooms, mozzarella, and herbs for a light yet delicious experience.",
    price: 690,
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1200&q=90",
    badge: "Fresh",
    vendor: "PizzaHub Kitchen",
    location: "Dhaka, Bangladesh",
    ingredients: ["Bell Peppers", "Black Olives", "Fresh Mushrooms", "Sweet Corn"],
  },
  {
    id: "4",
    name: "Truffle Mushroom",
    category: "Specialty",
    rating: 4.9,
    reviews: 156,
    prepTime: "25–30 Mins",
    description:
      "An elegant combination of wild mushrooms, parmesan, creamy mozzarella, and rich truffle flavor.",
    price: 790,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=90",
    badge: "Chef's Choice",
    vendor: "PizzaHub Kitchen",
    location: "Dhaka, Bangladesh",
    ingredients: ["Wild Mushrooms", "White Truffle Oil", "Aged Parmesan", "Thyme"],
  },
  {
    id: "5",
    name: "BBQ Chicken",
    category: "Meat Lovers",
    rating: 4.8,
    reviews: 195,
    prepTime: "20–30 Mins",
    description:
      "Smoky BBQ sauce, tender grilled chicken, red onions, and melted cheese come together for a bold and unforgettable flavor.",
    price: 920,
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1200&q=90",
    badge: "Special",
    vendor: "PizzaHub Kitchen",
    location: "Dhaka, Bangladesh",
    ingredients: ["Grilled Chicken", "Smoky BBQ Sauce", "Red Onions", "Cheddar Blend"],
  },
  {
    id: "6",
    name: "Four Cheese",
    category: "Classic",
    rating: 4.8,
    reviews: 142,
    prepTime: "15–25 Mins",
    description:
      "A cheese lover's dream featuring mozzarella, cheddar, parmesan, and blue cheese on a freshly baked crust.",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=90",
    badge: "Cheese Lover",
    vendor: "PizzaHub Kitchen",
    location: "Dhaka, Bangladesh",
    ingredients: ["Mozzarella", "Aged Cheddar", "Parmesan", "Gorgonzola"],
  },
];

const SIZES = [
  { label: 'Regular (8")', extra: 0 },
  { label: 'Medium (10")', extra: 200 },
  { label: 'Large (12")', extra: 400 },
];

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function PizzaDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const pizza = pizzas.find((item) => item.id === id);

  if (!pizza) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-[#0C0A09] px-5 text-white">
        <div className="max-w-md rounded-3xl border border-[#29221E] bg-[#161210] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
            <Flame size={32} />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Pizza Not Found</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#A8A29E]">
            Sorry, we couldn&apos;t find the pizza you are looking for. It might have been removed from the menu.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <ArrowLeft size={18} />
            Back to Menu
          </Link>
        </div>
      </section>
    );
  }

  const unitPrice = pizza.price + SIZES[selectedSize].extra;
  const totalPrice = unitPrice * quantity;
  const relatedPizzas = pizzas.filter((item) => item.id !== pizza.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#0C0A09] pb-28 pt-8 text-white sm:pb-16 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Back Button */}
        <div className="mb-6 flex items-center justify-between sm:mb-10">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2.5 rounded-full border border-[#29221E] bg-[#161210] px-4 py-2 text-xs font-medium text-[#D6D3D1] transition hover:border-[#F97316]/50 hover:text-white sm:text-sm"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Menu
          </Link>

          <div className="hidden items-center gap-2 text-xs text-[#78716C] sm:flex">
            <Link href="/" className="hover:text-[#A8A29E]">Home</Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-[#A8A29E]">Menu</Link>
            <span>/</span>
            <span className="text-[#F97316]">{pizza.name}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Image Showcase (6 cols on lg) */}
          <div className="lg:sticky lg:top-8 lg:col-span-6">
            <div className="group relative aspect-square overflow-hidden rounded-3xl border border-[#29221E] bg-[#161210] shadow-2xl">
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Subtle Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Top Badges */}
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F97316] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  <Sparkles size={13} />
                  {pizza.badge}
                </span>

                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{pizza.rating}</span>
                  <span className="text-[#A8A29E]">({pizza.reviews})</span>
                </div>
              </div>

              {/* Bottom Info Overlay on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-center gap-2 text-xs text-[#E7E5E4] sm:text-sm">
                  <Clock size={16} className="text-[#F97316]" />
                  <span>Freshly baked in <strong>{pizza.prepTime}</strong></span>
                </div>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                  Hot & Ready
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Controls (6 cols on lg) */}
          <div className="flex flex-col lg:col-span-6">
            {/* Category Tag */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F97316]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#F97316]">
                <Flame size={14} />
                {pizza.category}
              </span>
            </div>

            {/* Title & Description */}
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {pizza.name}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-[#A8A29E] sm:text-base sm:leading-7">
              {pizza.description}
            </p>

            {/* Size Selector */}
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#D6D3D1]">
                  Choose Size
                </label>
                <span className="text-xs text-[#78716C]">Required</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
                {SIZES.map((size, index) => {
                  const isActive = selectedSize === index;
                  return (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => setSelectedSize(index)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all sm:p-3.5 ${
                        isActive
                          ? "border-[#F97316] bg-[#F97316]/15 text-white shadow-md shadow-orange-500/10"
                          : "border-[#29221E] bg-[#161210] text-[#A8A29E] hover:border-[#3F3530] hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold sm:text-sm">
                        {size.label}
                      </span>
                      <span className="mt-1 text-[11px] text-[#A8A29E]">
                        {size.extra === 0 ? "Base Price" : `+৳${size.extra}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Quantity Card */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#29221E] bg-[#161210] p-4 sm:p-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#A8A29E]">
                  Total Price
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#F97316] sm:text-4xl">
                    ৳{totalPrice}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-[#78716C]">
                      (৳{unitPrice} × {quantity})
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 rounded-xl border border-[#29221E] bg-[#0C0A09] p-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A8A29E] transition hover:bg-[#1C1715] hover:text-white disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center text-sm font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F97316]/15 text-[#F97316] transition hover:bg-[#F97316] hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-7">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#D6D3D1]">
                Key Ingredients
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {pizza.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-xl border border-[#29221E] bg-[#161210] px-3.5 py-2 text-xs font-medium text-[#E7E5E4] transition hover:border-[#F97316]/40"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Vendor & Delivery Info Box */}
            <div className="mt-7 rounded-2xl border border-[#29221E] bg-[#161210]/70 p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-[#29221E] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/15 text-[#F97316]">
                    <ChefHat size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold">{pizza.vendor}</p>
                      <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[#A8A29E]">
                      <MapPin size={12} className="text-[#F97316]" />
                      {pizza.location}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Verified Kitchen
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2.5 text-[#A8A29E]">
                  <Clock size={16} className="shrink-0 text-[#F97316]" />
                  <div>
                    <p className="text-[11px] text-[#78716C]">Prep Time</p>
                    <p className="font-semibold text-white">{pizza.prepTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[#A8A29E]">
                  <ShoppingBag size={16} className="shrink-0 text-[#F97316]" />
                  <div>
                    <p className="text-[11px] text-[#78716C]">Delivery</p>
                    <p className="font-semibold text-white">Fast Home Delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="mt-8 hidden gap-3 sm:flex">
              <Link
                href="/sign-in"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.99]"
              >
                Order Now • ৳{totalPrice}
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/menu"
                className="flex items-center justify-center rounded-2xl border border-[#29221E] bg-[#161210] px-6 py-4 text-sm font-semibold text-white transition hover:border-[#3F3530] hover:bg-[#1E1916]"
              >
                Explore Menu
              </Link>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <section className="mt-16 border-t border-[#29221E] pt-12 sm:mt-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                You May Also Like
              </h2>
              <p className="mt-1 text-xs text-[#A8A29E] sm:text-sm">
                More freshly baked favorites from our kitchen
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:underline sm:text-sm"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPizzas.map((item) => (
              <Link
                key={item.id}
                href={`/menu/${item.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-[#29221E] bg-[#161210] p-3 transition hover:border-[#F97316]/50 hover:bg-[#1C1714]"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-[#F97316]">
                    {item.category}
                  </span>
                  <h3 className="truncate text-base font-bold text-white group-hover:text-[#F97316]">
                    {item.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#D6D3D1]">
                      ৳{item.price}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#A8A29E]">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {item.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#29221E] bg-[#100D0B]/95 px-4 py-3 backdrop-blur-lg sm:hidden">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
              Total ({quantity}x)
            </p>
            <p className="text-lg font-extrabold text-[#F97316]">৳{totalPrice}</p>
          </div>
          <Link
            href="/sign-in"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          >
            Order Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}