"use client";

import { useEffect, useState } from "react";
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
  Settings,
  Home,
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

  const [profileImage, setProfileImage] = useState("");

  const userName = session?.user?.name || "Customer";
  const initial = userName.charAt(0).toUpperCase();

  // Keep the avatar in sync with the session while rendering (instead of
  // copying it into state inside an effect).
  const sessionImage = session?.user?.image || "";
  const [prevSessionImage, setPrevSessionImage] = useState("");

  if (sessionImage !== prevSessionImage) {
    setPrevSessionImage(sessionImage);
    setProfileImage(sessionImage);
  }

  // Listen for Profile Updates
  useEffect(() => {
    const updateProfile = async () => {
      const { data } = await authClient.getSession();

      setProfileImage(data?.user?.image || "");
    };

    window.addEventListener("profile-updated", updateProfile);

    return () => {
      window.removeEventListener("profile-updated", updateProfile);
    };
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/sign-in";
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">

        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Customer Menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
          <div className="mt-auto space-y-2 border-t border-border pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Settings size={18} />
              Back to Website
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1 pb-20 lg:pb-0">
          <div className="min-h-screen">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 px-1 py-2">

          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 transition ${
              pathname === "/"
                ? "bg-orange-500/10 text-orange-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Dashboard & Other Routes */}
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl py-2 transition ${
                  active
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={20} />

                <span className="text-[10px] font-medium">
                  {item.name === "My Orders"
                    ? "Orders"
                    : item.name === "My Profile"
                      ? "Profile"
                      : item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}