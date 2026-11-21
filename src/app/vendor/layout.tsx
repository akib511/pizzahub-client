"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ClipboardList,
  CreditCard,
  Settings,
  Home,
  Store,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const sidebarLinks = [
  {
    name: "Overview",
    shortName: "Overview",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    name: "My Menu Items",
    shortName: "My Menu",
    href: "/vendor/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Add Menu Item",
    shortName: "Add Item",
    href: "/vendor/add-menu",
    icon: PlusCircle,
  },
  {
    name: "Customer Orders",
    shortName: "Orders",
    href: "/vendor/orders",
    icon: ClipboardList,
  },
  {
    name: "Subscription",
    shortName: "Plan",
    href: "/vendor/subscription",
    icon: CreditCard,
  },
  {
    name: "Profile Settings",
    shortName: "Profile",
    href: "/vendor/profile",
    icon: Settings,
  },
];

// Mobile Navigation
const mobileLinks = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Overview",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    name: "My Menu",
    href: "/vendor/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Orders",
    href: "/vendor/orders",
    icon: ClipboardList,
  },
  {
    name: "Plan",
    href: "/vendor/subscription",
    icon: CreditCard,
  },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { data: session } = authClient.useSession();

  const vendorName = session?.user?.name || "Vendor";

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

const isActive = (href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return href === "/vendor"
    ? pathname === "/vendor"
    : pathname.startsWith(href);
};
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">


          {/* Vendor Information */}
          <div className="mx-4 mt-6 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                <Store size={22} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {vendorName}
                </p>

                <p className="text-xs text-muted-foreground">
                  Restaurant Partner
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="mt-7 flex-1 space-y-2 overflow-y-auto px-4">

            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Vendor Menu
            </p>

            {sidebarLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out - Desktop Only */}
          <div className="border-t border-border p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={19} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">

          <div className="mx-auto w-full max-w-[1600px] p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8">

            {children}

          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border bg-sidebar/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-5px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl lg:hidden">

        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">

          {mobileLinks.map((item) => {
            const Icon = item.icon;

            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all duration-200 ${
                  active
                    ? "bg-orange-500/15 text-orange-500"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon
                  size={21}
                  strokeWidth={active ? 2.5 : 1.8}
                />

                <span className="truncate text-[10px] font-medium sm:text-xs">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>
      </nav>

    </div>
  );
}