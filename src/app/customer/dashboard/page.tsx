"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Plus,
  UserRound,
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
  } as const;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_0_40px_-12px_rgba(249,115,22,0.25)]">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-400">{label}</p>

        <div
          className={`rounded-xl p-2.5 ring-1 ${accents[accent]} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold tracking-tight text-white">
        {value}
      </h3>

      <p className="mt-1.5 text-xs text-gray-500">{hint}</p>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

/* ---------------------------------- */
/* Quick Action                       */
/* ---------------------------------- */

function QuickAction({
  href,
  icon,
  label,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-orange-500/25 hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-lg p-2 ${accent} transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>

        <span className="text-sm font-medium text-gray-200 group-hover:text-white">
          {label}
        </span>
      </div>

      <ArrowRight
        size={16}
        className="text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400"
      />
    </Link>
  );
}

/* ---------------------------------- */
/* Customer Dashboard                 */
/* ---------------------------------- */

export default function CustomerDashboard() {
  return (
    <div className="relative space-y-8 text-white">
      {/* Order Overview */}

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Order Overview</h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Your activity at a glance
            </p>
          </div>

          <Link
            href="/menu"
            className="hidden items-center gap-1.5 rounded-xl border border-orange-500/25 bg-orange-500/5 px-3.5 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10 sm:inline-flex"
          >
            <Plus size={16} />
            New Order
          </Link>
        </div>

        {/* Statistics */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={0}
            hint="All time orders"
            icon={<ShoppingBag size={18} />}
            accent="orange"
          />

          <StatCard
            label="Pending"
            value={0}
            hint="Awaiting confirmation"
            icon={<Clock size={18} />}
            accent="yellow"
          />

          <StatCard
            label="Delivered"
            value={0}
            hint="Successfully delivered"
            icon={<CheckCircle2 size={18} />}
            accent="green"
          />

          <StatCard
            label="Processing"
            value={0}
            hint="Orders in progress"
            icon={<Truck size={18} />}
            accent="blue"
          />
        </div>
      </section>

      {/* Recent Orders + Quick Actions */}

      <section className="grid gap-6 xl:grid-cols-3">
        {/* Recent Orders */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent xl:col-span-2">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
            <div>
              <h2 className="font-semibold">Recent Orders</h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Your latest order activity
              </p>
            </div>

            <Link
              href="/customer/orders"
              className="group flex items-center gap-1 text-sm text-orange-400 transition hover:text-orange-300"
            >
              View All

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl" />

              <div className="relative flex size-16 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
                <ShoppingBag className="size-7 text-orange-400" />
              </div>
            </div>

            <h3 className="mt-5 font-semibold">No orders yet</h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
              Your orders will appear here once you order something delicious.
            </p>

            <Link
              href="/menu"
              className="mt-5 rounded-xl border border-orange-500/25 bg-orange-500/5 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10"
            >
              Browse Menu
            </Link>
          </div>
        </div>

        {/* Quick Actions */}

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
          <h2 className="font-semibold">Quick Actions</h2>

          <p className="mt-0.5 text-sm text-gray-500">
            Explore PizzaHub
          </p>

          <div className="mt-5 space-y-3">
            <QuickAction
              href="/menu"
              icon={<Plus size={18} />}
              label="Place an Order"
              accent="bg-orange-500/10 text-orange-400"
            />

            <QuickAction
              href="/customer/orders"
              icon={<ShoppingBag size={18} />}
              label="Track Orders"
              accent="bg-sky-500/10 text-sky-400"
            />

            <QuickAction
              href="/customer/profile"
              icon={<UserRound size={18} />}
              label="Manage Profile"
              accent="bg-purple-500/10 text-purple-400"
            />
          </div>
        </div>
      </section>
    </div>
  );
}