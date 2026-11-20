"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Menu", href: "/menu" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const userInfo = user as
    | (typeof user & {
        role?: string;
        profileImage?: string;
      })
    | undefined;

  const role = userInfo?.role?.toLowerCase();

  const dashboardPath =
    role === "vendor"
      ? "/vendor"
      : role === "admin"
        ? "/admin"
        : "/customer/dashboard";

  const profilePath =
    role === "vendor"
      ? "/vendor/profile"
      : role === "admin"
        ? "/admin/profile"
        : "/customer/profile";

  const profileImage = userInfo?.image || userInfo?.profileImage;

  const closeMenus = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      closeMenus();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#100D0B]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link href="/" onClick={closeMenus} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl">
            🍕
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Pizza<span className="text-orange-500">Hub</span>
            </h1>

            <p className="text-[9px] font-semibold uppercase tracking-[2px] text-stone-500">
              Taste The Happiness
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-orange-400"
                  : "text-stone-400 hover:text-orange-400"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {!isPending && user && (
            <Link
              href={dashboardPath}
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname.startsWith(dashboardPath)
                  ? "text-orange-400"
                  : "text-stone-400 hover:text-orange-400"
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-stone-300 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/20"
              >
                Sign Up
              </Link>
            </>
          )}

          {!isPending && user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-3 transition hover:bg-white/10"
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-black">
                    <User size={19} />
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-white">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-stone-400 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#1B1511] p-2 shadow-2xl">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="truncate text-sm font-bold text-white">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-stone-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={dashboardPath}
                    onClick={closeMenus}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-300 transition hover:bg-white/5 hover:text-orange-400"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    href={profilePath}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-300 transition hover:bg-white/5 hover:text-orange-400"
                  >
                    <Settings size={17} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/5 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#100D0B] px-5 py-6 md:hidden">
          <div className="flex flex-col gap-5">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenus}
                className="text-sm font-medium text-stone-300 transition hover:text-orange-400"
              >
                {link.name}
              </Link>
            ))}

            {!isPending && user && (
              <>
                <Link
                  href={dashboardPath}
                  onClick={closeMenus}
                  className="flex items-center gap-2 text-sm font-medium text-stone-300 hover:text-orange-400"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <div className="border-t border-white/10 pt-5">
                  <div className="mb-4 flex items-center gap-3">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        width={42}
                        height={42}
                        unoptimized
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-black">
                        <User size={20} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-stone-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={profilePath}
                    onClick={closeMenus}
                    className="mb-4 flex items-center gap-2 text-sm text-stone-300 hover:text-orange-400"
                  >
                    <Settings size={18} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-semibold text-red-400"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isPending && !user && (
              <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
                <Link
                  href="/sign-in"
                  onClick={closeMenus}
                  className="text-sm font-semibold text-stone-300"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}