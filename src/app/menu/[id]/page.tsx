
"use client";

import React, { useState, use, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
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

interface Pizza {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  prepTime: string;
  description: string;
  price: number;
  image: string;
  badge: string;
  vendor: string;
  location: string;
  ingredients: string[];
}

type PageProps = {
  params: Promise<{ id: string }>;
};

// Computed once at module scope so that rendering stays pure
// (React must not call impure functions like `Date.now` during render).
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];

export default function PizzaDetailsPage({ params }: PageProps) {
  const { id } = use(params);

  const { data: session } = authClient.useSession();

  const [quantity, setQuantity] = useState(1);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const orderFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const response = await fetch("http://localhost:5000/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data = await response.json();

        const approvedPizzas = data
          .filter(
            (item: { status: string; available: boolean }) =>
              item.status?.toLowerCase() === "approved" &&
              item.available === true
          )
          .map(
            (item: {
              _id: string;
              name: string;
              category: string;
              description: string;
              price: number;
              image: string;
              preparationTime?: number;
              location?: string;
              vendorEmail?: string;
              vendorName?: string;
              ingredients?: string[];
              badge?: string;
            }) => ({
              id: item._id,
              name: item.name,
              category: item.category,
              rating: 0,
              reviews: 0,
              prepTime: item.preparationTime
                ? `${item.preparationTime} Mins`
                : "20–25 Mins",
              description: item.description,
              price: item.price,
              image: item.image,
              badge: item.badge || "Freshly Made",
              vendor:
                item.vendorName || item.vendorEmail || "PizzaHub Vendor",
              location: item.location || "Bangladesh",
              ingredients: item.ingredients || [],
            })
          );

        setPizzas(approvedPizzas);
      } catch (error) {
        console.error("Failed to fetch pizza:", error);
        toast.error("Failed to load pizza details");
      } finally {
        setLoading(false);
      }
    };

    fetchPizza();
  }, []);

  const pizza = pizzas.find((item) => item.id === id);

  const scrollToOrderForm = () => {
    setShowOrderForm(true);

    setTimeout(() => {
      orderFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleOrderClick = () => {
    if (!session?.user?.email) {
      toast.error("Please login first!");
      window.location.href = "/sign-in";
      return;
    }

    scrollToOrderForm();
  };

  const handlePlaceOrder = async () => {
    if (!session?.user?.email) {
      toast.error("Please login first!");
      return;
    }

    if (!deliveryDate || !deliveryAddress.trim()) {
      toast.error("Please provide delivery date and address");
      return;
    }

    if (deliveryDate < today) {
      toast.error("Please select a valid delivery date");
      return;
    }

    setOrderLoading(true);

    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: pizza?.id,
          customerEmail: session.user.email,
          quantity,
          deliveryDate,
          deliveryAddress,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      toast.success("Your order has been placed successfully!");

      setShowOrderForm(false);
      setDeliveryDate("");
      setDeliveryAddress("");
      setMessage("");
      setQuantity(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 text-center text-foreground">
        Loading pizza details...
      </div>
    );
  }

  if (!pizza) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-2xl sm:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Flame size={32} />
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Pizza Not Found
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sorry, we couldn&apos;t find the pizza you are looking for. It might
            have been removed from the menu.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <ArrowLeft size={18} />
            Back to Menu
          </Link>
        </div>
      </section>
    );
  }

  const totalPrice = pizza.price * quantity;

  const relatedPizzas = pizzas
    .filter((item) => item.id !== pizza.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background pb-24 pt-6 text-foreground sm:pb-16 sm:pt-10 lg:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between sm:mb-10">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition hover:border-primary/50 hover:text-foreground sm:text-sm"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Menu
          </Link>

          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Link href="/" className="hover:text-muted-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-muted-foreground">
              Menu
            </Link>
            <span>/</span>
            <span className="max-w-40 truncate text-primary">
              {pizza.name}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid items-start gap-7 lg:grid-cols-12 lg:gap-12">
          {/* Pizza Image */}
          <div className="lg:sticky lg:top-8 lg:col-span-6">
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:rounded-3xl">
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2 sm:left-6 sm:right-6 sm:top-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg sm:px-4 sm:text-xs">
                  <Sparkles size={13} />
                  {pizza.badge}
                </span>

                <div className="flex items-center gap-1 rounded-full border border-border bg-black/60 px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur-md sm:gap-1.5 sm:px-3.5 sm:text-xs">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{pizza.rating}</span>
                  <span className="text-muted-foreground">
                    ({pizza.reviews})
                  </span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-xl border border-border bg-black/55 px-3 py-2.5 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-2xl sm:px-4 sm:py-3">
                <div className="flex items-center gap-2 text-[10px] text-foreground sm:text-sm">
                  <Clock size={15} className="shrink-0 text-primary" />
                  <span>
                    Freshly baked in <strong>{pizza.prepTime}</strong>
                  </span>
                </div>

                <span className="shrink-0 rounded-lg bg-emerald-500/20 px-2 py-1 text-[9px] font-semibold text-emerald-400 sm:px-2.5 sm:text-[11px]">
                  Hot & Ready
                </span>
              </div>
            </div>
          </div>

          {/* Pizza Details */}
          <div className="flex flex-col lg:col-span-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">
                <Flame size={14} />
                {pizza.category}
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {pizza.name}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
              {pizza.description}
            </p>

            {/* Price & Quantity */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:mt-7 sm:p-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                  Total Price
                </p>

                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary sm:text-4xl">
                    ৳{totalPrice}
                  </span>

                  {quantity > 1 && (
                    <span className="text-xs text-muted-foreground">
                      (৳{pizza.price} × {quantity})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || orderLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-card hover:text-foreground disabled:opacity-40"
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
                  disabled={orderLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary transition hover:bg-primary hover:text-white disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Ingredients */}
            {pizza.ingredients.length > 0 && (
              <div className="mt-6 sm:mt-7">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Key Ingredients
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {pizza.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 sm:px-3.5"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vendor Information */}
            <div className="mt-6 rounded-2xl border border-border bg-card/70 p-4 sm:mt-7 sm:p-5">
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <ChefHat size={22} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-bold">
                        {pizza.vendor}
                      </p>
                      <ShieldCheck
                        size={16}
                        className="shrink-0 text-emerald-500"
                      />
                    </div>

                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} className="shrink-0 text-primary" />
                      {pizza.location}
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400 sm:text-xs">
                  Verified Kitchen
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:gap-4">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Clock size={16} className="shrink-0 text-primary" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Prep Time</p>
                    <p className="font-semibold text-foreground">
                      {pizza.prepTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <ShoppingBag size={16} className="shrink-0 text-primary" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Delivery</p>
                    <p className="font-semibold text-foreground">
                      Fast Home Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            {showOrderForm && (
              <div
                ref={orderFormRef}
                className="mt-6 scroll-mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5"
              >
                <h2 className="mb-4 text-lg font-bold">
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-foreground">
                      Delivery Date
                    </label>

                    <input
                      type="date"
                      value={deliveryDate}
                      min={today}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      disabled={orderLoading}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-foreground">
                      Delivery Address
                    </label>

                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full delivery address"
                      rows={3}
                      disabled={orderLoading}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-foreground">
                      Additional Message (Optional)
                    </label>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any special instructions?"
                      rows={2}
                      disabled={orderLoading}
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={orderLoading}
                      className="flex-1 rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {orderLoading
                        ? "Placing Order..."
                        : `Confirm Order • ৳${totalPrice}`}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      disabled={orderLoading}
                      className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

           
           {/* Desktop Action Buttons */}
{!showOrderForm && (
  <div className="mt-7 hidden gap-3 sm:flex">
    <button
      type="button"
      onClick={handleOrderClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.99]"
    >
      Order Now • ৳{totalPrice}
      <ArrowRight size={18} />
    </button>

    <Link
      href="/menu"
      className="flex items-center justify-center rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground transition hover:border-border hover:bg-muted"
    >
      Explore Menu
    </Link>
  </div>
)}
          </div>
        </div>

        {/* Related Pizzas */}
        {relatedPizzas.length > 0 && (
          <section className="mt-14 border-t border-border pt-10 sm:mt-20 sm:pt-12">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  You May Also Like
                </h2>

                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  More freshly baked favorites from our kitchen
                </p>
              </div>

              <Link
                href="/menu"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm"
              >
                View All <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPizzas.map((item) => (
                <Link
                  key={item.id}
                  href={`/menu/${item.id}`}
                  className="group flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-primary/50 hover:bg-muted sm:gap-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-medium text-primary sm:text-[11px]">
                      {item.category}
                    </span>

                    <h3 className="truncate text-sm font-bold text-foreground transition group-hover:text-primary sm:text-base">
                      {item.name}
                    </h3>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-foreground">
                        ৳{item.price}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                        {item.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

    {/* Mobile Sticky Bottom Bar */}
{!showOrderForm && (
  <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-lg sm:hidden">
    <div className="mx-auto flex max-w-7xl items-center gap-3">
      <div className="shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Total ({quantity}x)
        </p>

        <p className="text-lg font-extrabold text-primary">
          ৳{totalPrice}
        </p>
      </div>

      <button
        type="button"
        onClick={handleOrderClick}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]"
      >
        Order Now
        <ArrowRight size={16} />
      </button>
    </div>
  </div>
)}
    </main>
  );
}
