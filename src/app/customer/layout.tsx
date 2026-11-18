"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UserRound,
  LogOut,
  Pizza,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/customer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Orders",
    href: "/customer/orders",
    icon: ShoppingBag,
  },
  {
    name: "Favorites",
    href: "/customer/favorites",
    icon: Heart,
  },
  {
    name: "My Profile",
    href: "/customer/profile",
    icon: UserRound,
  },
];

export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name || "Customer";
  const initial = userName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  return (
    <div className="min-h-screen bg-[#0B0907] text-white">

      <div className="mx-auto flex min-h-screen max-w-[1600px]">

        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] bg-[#0F0C0A] p-5 lg:flex">

          {/* Logo */}
          <Link href="/" className="mb-10 flex items-center gap-2.5 px-2">
            <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-2">
              <Pizza size={21} />
            </div>

            <span className="text-xl font-bold">
              Pizza<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
            Customer Menu
          </p>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-orange-500" />
                  )}

                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="mt-auto space-y-2 border-t border-white/[0.06] pt-4">

            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Settings size={18} />
              Back to Website
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1 pb-20 lg:pb-0">

          {/* Top Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#0B0907]/90 px-4 py-4 backdrop-blur-xl sm:px-8">

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Customer Panel
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                {navigation.find((item) => item.href === pathname)?.name ||
                  "Customer"}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] py-1.5 pl-1.5 pr-4">

              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-sm font-bold">
                {initial}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-[11px] text-gray-500">Customer</p>
              </div>

            </div>
          </header>

          {/* Every page renders here */}
          <div className="min-h-[calc(100vh-73px)]">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#0F0C0A]/95 backdrop-blur-xl lg:hidden">

        <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-2">

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl py-2 transition ${
                  active
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">
                  {item.name === "Dashboard"
                    ? "Home"
                    : item.name === "My Orders"
                      ? "Orders"
                      : item.name === "Favorites"
                        ? "Favorites"
                        : "Profile"}
                </span>
              </Link>
            );
          })}

        </div>
      </nav>
    </div>
  );
}