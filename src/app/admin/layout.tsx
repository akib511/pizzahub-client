"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Pizza,
  ShoppingBag,
  CreditCard,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Grid2X2,
  X,
  ArrowUpRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    name: "Dashboard",
    shortName: "Home",
    href: "/admin",
    icon: LayoutDashboard,
    mobile: true,
  },
  {
    name: "Users",
    shortName: "Users",
    href: "/admin/users",
    icon: Users,
    mobile: true,
  },
  {
    name: "Vendors",
    shortName: "Vendors",
    href: "/admin/vendors",
    icon: Store,
    mobile: false,
  },
  {
    name: "Menu Management",
    shortName: "Menu",
    href: "/admin/menu",
    icon: Pizza,
    mobile: false,
  },
  {
    name: "Orders",
    shortName: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    mobile: true,
  },
  {
    name: "Transactions",
    shortName: "Transactions",
    href: "/admin/transactions",
    icon: CreditCard,
    mobile: false,
  },
  {
    name: "Profile Settings",
    shortName: "Profile",
    href: "/admin/profile",
    icon: Settings,
    mobile: true,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const [moreOpen, setMoreOpen] = useState(false);

  const userName = session?.user?.name || "Administrator";

  const mobileNavigation = navigation.filter((item) => item.mobile);

  const moreNavigation = navigation.filter((item) => !item.mobile);

  const isActiveRoute = (href: string) => {
    return href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);
  };

  const isMoreActive = moreNavigation.some((item) =>
    isActiveRoute(item.href)
  );

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
          <ShieldCheck size={22} className="text-white" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">PizzaHub</h1>
          <p className="text-[11px] text-orange-400">Admin Panel</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#78716C]">
          Management
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-3 transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-[#A8A29E] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />

                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                </div>

                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Admin Badge */}
        <div className="mt-8 rounded-xl border border-orange-500/10 bg-orange-500/[0.04] p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-orange-400" />

            <span className="text-xs font-medium text-orange-400">
              Administrator
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-[#78716C]">
            Manage users, restaurants, orders and platform activities.
          </p>
        </div>
      </div>

      {/* Sign Out */}
      <div className="border-t border-white/[0.06] p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#A8A29E] transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#100D0B]">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-[#0B0907] lg:flex">
        {sidebarContent}
      </aside>

      {/* Main Area */}
      <div className="lg:pl-64">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#100D0B]/95 px-4 backdrop-blur-xl sm:px-6">
          <div>
            <p className="text-sm font-semibold text-white">
              Welcome, {userName}
            </p>

            <p className="text-xs text-stone-500">
              PizzaHub Administration
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="hidden items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-sm text-stone-400 transition hover:border-red-500/30 hover:text-red-400 lg:flex"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)] p-4 pb-28 sm:p-6 sm:pb-28 lg:p-7">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-[#100D0B]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.3)] backdrop-blur-2xl lg:hidden">

        <div className="mx-auto grid max-w-lg grid-cols-5 px-2 py-2">

          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1.5 py-1.5"
              >
                <div
                  className={`flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500/15 text-orange-400"
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>

                <span
                  className={`text-[10px] font-medium transition ${
                    isActive ? "text-orange-400" : "text-stone-500"
                  }`}
                >
                  {item.shortName}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 py-1.5"
          >
            <div
              className={`flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                moreOpen || isMoreActive
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <Grid2X2 size={21} />
            </div>

            <span
              className={`text-[10px] font-medium ${
                moreOpen || isMoreActive
                  ? "text-orange-400"
                  : "text-stone-500"
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Bottom Sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] border-t border-white/[0.08] bg-[#17120F] p-5 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-300">

            {/* Handle */}
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/20" />

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  More Options
                </h2>

                <p className="mt-1 text-xs text-stone-500">
                  Manage other admin sections
                </p>
              </div>

              <button
                onClick={() => setMoreOpen(false)}
                className="rounded-xl bg-white/[0.05] p-2 text-stone-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {/* More Navigation */}
            <div className="grid grid-cols-2 gap-3">
              {moreNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                      isActive
                        ? "border-orange-500/30 bg-orange-500/10"
                        : "border-white/[0.06] bg-[#100D0B] hover:border-white/15"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-white/[0.05] text-stone-400"
                      }`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-xs font-semibold ${
                          isActive ? "text-orange-400" : "text-white"
                        }`}
                      >
                        {item.name}
                      </p>

                      <p className="mt-1 text-[10px] text-stone-500">
                        Open section
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="mt-4 flex w-full items-center justify-between rounded-2xl border border-red-500/15 bg-red-500/[0.06] p-4 text-red-400 transition hover:bg-red-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                  <LogOut size={19} />
                </div>

                <span className="text-sm font-semibold">
                  Sign Out
                </span>
              </div>

              <ArrowUpRight size={17} />
            </button>

          </div>
        </div>
      )}

    </div>
  );
}