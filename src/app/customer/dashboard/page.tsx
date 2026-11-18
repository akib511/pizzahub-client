"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UserRound,
  Settings,
  LogOut,
  Pizza,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";

/* ---------------------------------- */
/* Small reusable pieces              */
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

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-orange-500/15 to-orange-500/5 text-orange-400"
          : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-orange-500" />
      )}
      <span
        className={
          active
            ? "text-orange-400"
            : "text-gray-500 group-hover:text-orange-400 transition-colors"
        }
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

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
/* Main page                          */
/* ---------------------------------- */

export default function CustomerDashboard() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Customer";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <main className="relative min-h-screen bg-[#0B0907] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        {/* ---------- Sidebar ---------- */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] bg-[#0F0C0A]/80 backdrop-blur-xl p-5 lg:flex lg:flex-col">
          <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
            <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-1.5 shadow-lg shadow-orange-500/20">
              <Pizza className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Pizza<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
            Menu
          </p>

          <nav className="space-y-1">
            <NavItem
              href="/customer/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active
            />
            <NavItem
              href="/customer/orders"
              icon={<ShoppingBag size={18} />}
              label="My Orders"
            />
            <NavItem
              href="/customer/favorites"
              icon={<Heart size={18} />}
              label="Favorites"
            />
            <NavItem
              href="/customer/profile"
              icon={<UserRound size={18} />}
              label="My Profile"
            />
          </nav>

          <div className="mt-auto space-y-1 border-t border-white/[0.06] pt-4">
            <NavItem
              href="/"
              icon={<Settings size={18} />}
              label="Back to Website"
            />
            <button
              onClick={async () => {
                await authClient.signOut();
                window.location.href = "/sign-in";
              }}
              className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut
                size={18}
                className="text-gray-500 group-hover:text-red-400 transition-colors"
              />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ---------- Main ---------- */}
        <div className="min-w-0 flex-1 pb-20 lg:pb-0">
          {/* Top bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-[#0B0907]/80 px-4 py-4 backdrop-blur-xl sm:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer Panel
              </p>
              <h2 className="mt-0.5 text-lg font-semibold sm:text-xl">
                Dashboard
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-sm text-gray-300 transition hover:border-orange-500/30 hover:text-white sm:block">
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className="text-orange-400" />
                  What's new
                </span>
              </button>

              <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] py-1.5 pl-1.5 pr-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-sm font-bold text-white shadow-lg shadow-orange-500/25">
                  {initial}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium leading-tight">{userName}</p>
                  <p className="text-[11px] text-gray-500">Customer</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-8">
            {/* Stats — moved to top */}
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
                  className="group hidden items-center gap-1.5 rounded-xl border border-orange-500/25 bg-orange-500/5 px-3.5 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10 sm:inline-flex"
                >
                  <Plus size={16} />
                  New Order
                </Link>
              </div>

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

            {/* Recent + Quick actions */}
            <section className="mt-8 grid gap-6 xl:grid-cols-3">
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
                    Your orders will appear here once you order something
                    delicious.
                  </p>
                  <Link
                    href="/menu"
                    className="mt-5 rounded-xl border border-orange-500/25 bg-orange-500/5 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10"
                  >
                    Browse Menu
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
                <h2 className="font-semibold">Quick Actions</h2>
                <p className="mt-0.5 text-sm text-gray-500">Explore PizzaHub</p>

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

            {/* Account info */}
           
          </div>
        </div>
      </div>

      {/* ---------- Mobile bottom nav ---------- */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-[#0F0C0A]/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-2">
          <Link
            href="/customer/dashboard"
            className="flex flex-col items-center gap-1 rounded-xl bg-orange-500/10 py-2 text-orange-400"
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            href="/customer/orders"
            className="flex flex-col items-center gap-1 py-2 text-gray-500 transition hover:text-white"
          >
            <ShoppingBag size={20} />
            <span className="text-[10px] font-medium">Orders</span>
          </Link>
          <Link
            href="/customer/favorites"
            className="flex flex-col items-center gap-1 py-2 text-gray-500 transition hover:text-white"
          >
            <Heart size={20} />
            <span className="text-[10px] font-medium">Favorites</span>
          </Link>
          <Link
            href="/customer/profile"
            className="flex flex-col items-center gap-1 py-2 text-gray-500 transition hover:text-white"
          >
            <UserRound size={20} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}