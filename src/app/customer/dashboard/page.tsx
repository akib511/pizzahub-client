"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Plus,
} from "lucide-react";

/* ---------------------------------- */
/* Stat Card                          */
/* ---------------------------------- */

function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  accent: "orange" | "yellow" | "green" | "blue";
}) {
  const accents = {
    orange: "text-orange-400 bg-orange-500/10 ring-orange-500/20",
    yellow: "text-amber-400 bg-amber-500/10 ring-amber-500/20",
    green: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
    blue: "text-sky-400 bg-sky-500/10 ring-sky-500/20",
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-3 transition duration-300 hover:border-orange-500/20 sm:rounded-2xl sm:p-5">

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-400 sm:text-sm">
          {label}
        </p>

        <div
          className={`shrink-0 rounded-lg p-1.5 ring-1 sm:rounded-xl sm:p-2.5 ${accents[accent]}`}
        >
          {icon}
        </div>
      </div>

      <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:mt-4 sm:text-3xl">
        {value}
      </h3>

      <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
        {hint}
      </p>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

/* ---------------------------------- */
/* Order Type                         */
/* ---------------------------------- */

type Order = {
  _id: string;
  itemName: string;
  itemImage?: string;
  customerEmail: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "delivered";
  createdAt?: string;
};

/* ---------------------------------- */
/* Customer Dashboard                 */
/* ---------------------------------- */

export default function CustomerDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/orders/customer/${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch customer orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [email, isPending]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  return (
    <div className="space-y-6 px-3 py-5 pb-24 text-white sm:space-y-8 sm:px-6 sm:py-7 lg:px-8 lg:pb-8">

      {/* Order Overview */}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">

          <div>
            <h2 className="text-base font-semibold sm:text-lg">
              Order Overview
            </h2>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Your activity at a glance
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-orange-500/25 bg-orange-500/5 px-2.5 py-2 text-xs font-medium text-orange-400 transition hover:bg-orange-500/10 sm:rounded-xl sm:px-3.5 sm:text-sm"
          >
            <Plus size={15} />
            New Order
          </Link>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

          <StatCard
            label="Total Orders"
            value={totalOrders}
            hint="All time orders"
            icon={<ShoppingBag size={17} className="sm:size-[19px]" />}
            accent="orange"
          />

          <StatCard
            label="Pending"
            value={pendingOrders}
            hint="Awaiting confirmation"
            icon={<Clock size={17} className="sm:size-[19px]" />}
            accent="yellow"
          />

          <StatCard
            label="Processing"
            value={processingOrders}
            hint="Orders in progress"
            icon={<Truck size={17} className="sm:size-[19px]" />}
            accent="blue"
          />

          <StatCard
            label="Delivered"
            value={deliveredOrders}
            hint="Successfully delivered"
            icon={<CheckCircle2 size={17} className="sm:size-[19px]" />}
            accent="green"
          />

        </div>
      </section>

      {/* Recent Orders */}

      <section>

        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-transparent sm:rounded-2xl">

          {/* Header */}

          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] p-4 sm:p-5">

            <div>
              <h2 className="text-sm font-semibold sm:text-base">
                Recent Orders
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Your latest order activity
              </p>
            </div>

            <Link
              href="/customer/orders"
              className="group flex shrink-0 items-center gap-1 text-xs font-medium text-orange-400 transition hover:text-orange-300 sm:text-sm"
            >
              View All
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="py-14 text-center text-sm text-gray-500">
              Loading orders...
            </div>

          ) : orders.length === 0 ? (

            /* Empty State */

            <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:py-14">

              <div className="flex size-14 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] sm:size-16">
                <ShoppingBag className="size-6 text-orange-400 sm:size-7" />
              </div>

              <h3 className="mt-4 text-sm font-semibold sm:mt-5">
                No orders yet
              </h3>

              <p className="mt-2 max-w-xs text-xs leading-6 text-gray-500 sm:text-sm">
                Your orders will appear here once you order something delicious.
              </p>

              <Link
                href="/menu"
                className="mt-5 rounded-xl border border-orange-500/25 bg-orange-500/5 px-4 py-2 text-xs font-medium text-orange-400 transition hover:bg-orange-500/10 sm:text-sm"
              >
                Browse Menu
              </Link>

            </div>

          ) : (

            /* Orders List */

            <div className="divide-y divide-white/[0.06]">

              {orders.slice(0, 5).map((order) => (

                <div
                  key={order._id}
                  className="flex items-center gap-3 p-3 transition hover:bg-white/[0.02] sm:gap-4 sm:p-5"
                >

                  {/* Food Image */}

                  <img
                    src={order.itemImage || "/placeholder-food.png"}
                    alt={order.itemName}
                    className="size-12 shrink-0 rounded-lg object-cover sm:size-14 sm:rounded-xl"
                  />

                  {/* Order Details */}

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-xs font-semibold text-white sm:text-sm">
                      {order.itemName}
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                      Quantity: {order.quantity}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ""}
                    </p>

                  </div>

                  {/* Price & Status */}

                  <div className="shrink-0 text-right">

                    <p className="text-xs font-semibold text-white sm:text-sm">
                      ৳{order.totalPrice}
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-orange-500/10 px-2 py-1 text-[10px] capitalize text-orange-400 sm:px-2.5 sm:text-xs">
                      {order.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}