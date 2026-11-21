
"use client";

import { Toaster } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ClipboardList,
  CreditCard,
  Settings,
  Pizza,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const sidebarLinks = [
  {
    name: "Overview",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    name: "My Menu Items",
    href: "/vendor/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Add Menu Item",
    href: "/vendor/add-menu",
    icon: PlusCircle,
  },
  {
    name: "Customer Orders",
    href: "/vendor/orders",
    icon: ClipboardList,
  },
  {
    name: "Subscription",
    href: "/vendor/subscription",
    icon: CreditCard,
  },
  {
    name: "Profile Settings",
    href: "/vendor/profile",
    icon: Settings,
  },
];

export default function VendorLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const vendorName = session?.user?.name || "Vendor";

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  return (
    <div className="min-h-screen bg-[#0B0907] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#302824] bg-[#100D0B] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-[#302824] px-6">
            <Link href="/" className="flex items-center gap-2">
              <Pizza className="text-orange-500" size={28} />

              <span className="text-2xl font-bold">
                Pizza<span className="text-orange-500">Hub</span>
              </span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden"
            >
              <X size={22} />
            </button>
          </div>

          {/* Vendor Information */}
          <div className="mx-4 mt-6 rounded-xl border border-[#302824] bg-[#1C1715] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                <Store size={22} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {vendorName}
                </p>
                <p className="text-xs text-[#A8A29E]">
                  Restaurant Partner
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-7 flex-1 space-y-2 overflow-y-auto px-4">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              Vendor Menu
            </p>

            {sidebarLinks.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/vendor"
                  ? pathname === "/vendor"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10"
                      : "text-[#A8A29E] hover:bg-[#1C1715] hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="border-t border-[#302824] p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#A8A29E] transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={19} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="fixed bottom-5 right-5 z-30 rounded-full bg-orange-500 p-3 text-white shadow-lg shadow-orange-500/20 lg:hidden"
          >
            <Menu size={23} />
          </button>

          {/* Page Content */}
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
