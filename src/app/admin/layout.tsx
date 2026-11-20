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
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Vendors",
    href: "/admin/vendors",
    icon: Store,
  },
  {
    name: "Menu Management",
    href: "/admin/menu",
    icon: Pizza,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: CreditCard,
  },
  {
    name: "Profile Settings",
    href: "/admin/profile",
    icon: Settings,
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = session?.user?.name || "Administrator";

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  const sidebarContent = (
    <>
      Logo
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
          <ShieldCheck size={22} className="text-white" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            PizzaHub
          </h1>

          <p className="text-[11px] text-orange-400">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#78716C]">
          Management
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
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

      {/* Bottom */}
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/[0.06] bg-[#0B0907]">
            <div className="absolute right-3 top-4 z-10">
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-[#A8A29E] hover:bg-white/[0.05] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#100D0B]/95 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-white/[0.06] p-2 text-[#A8A29E] lg:hidden"
            >
              <Menu size={20} />
            </button>

         
          </div>

        
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}