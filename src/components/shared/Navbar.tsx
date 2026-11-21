"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Check,
  Trash2,
  Clock,
  ShieldCheck,
  Info,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/theme/theme-toggle";

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Menu", href: "/menu" },
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [storedNotifications, setStoredNotifications] = useState<Notification[]>([]);
  const [storedUnreadCount, setStoredUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navbarRef = useRef<HTMLElement>(null);

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

  // Only signed-in admins receive notifications — derive what is displayed
  // instead of clearing state inside an effect.
  const canLoadNotifications = role === "admin" && !!user?.email;
  const notifications = canLoadNotifications ? storedNotifications : [];
  const unreadCount = canLoadNotifications ? storedUnreadCount : 0;

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

  // Close All Menus
  const closeMenus = () => {
    setIsOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
  };

  // Close Dropdown When Clicking Outside
  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        closeMenus();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenus();
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Fetch Admin Notifications
  useEffect(() => {
    if (role !== "admin" || !user?.email) {
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/admin/notifications/${encodeURIComponent(user.email)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        setStoredNotifications(data.notifications || []);
        setStoredUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Notification fetch failed:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [role, user?.email]);

  // Logout
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

  // Mark Notification as Read
  const markNotificationAsRead = async (notificationId: string) => {
    if (!user?.email) return;

    const selectedNotification = notifications.find(
      (notification) => notification._id === notificationId
    );

    if (!selectedNotification || selectedNotification.isRead) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/read/${encodeURIComponent(user.email)}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setStoredNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setStoredUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  // Mark Notification as Unread
  const markNotificationAsUnread = async (notificationId: string) => {
    if (!user?.email) return;

    const selectedNotification = notifications.find(
      (notification) => notification._id === notificationId
    );

    if (!selectedNotification || !selectedNotification.isRead) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/unread/${encodeURIComponent(user.email)}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as unread");
      }

      setStoredNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: false }
            : notification
        )
      );

      setStoredUnreadCount((prev) => prev + 1);
    } catch (error) {
      console.error("Mark as unread failed:", error);
    }
  };

  // Delete Notification
  const deleteNotification = async (notificationId: string) => {
    if (!user?.email) return;

    const selectedNotification = notifications.find(
      (notification) => notification._id === notificationId
    );

    if (!selectedNotification) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/${encodeURIComponent(user.email)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setStoredNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );

      if (!selectedNotification.isRead) {
        setStoredUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Delete notification failed:", error);
    }
  };

  // Notification Dropdown
  const notificationContent = () => (
    <div className="absolute right-0 top-14 z-[100] w-[min(90vw,390px)] overflow-hidden rounded-2xl border border-border bg-popover shadow-[0_20px_70px_rgba(0,0,0,0.25)]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Bell size={19} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">
              Notifications
            </h3>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Stay updated with PizzaHub
            </p>
          </div>
        </div>

        <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
          {unreadCount} Unread
        </span>

      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bell size={27} />
            </div>

            <h4 className="text-sm font-semibold text-foreground">
              All caught up!
            </h4>

            <p className="mt-2 max-w-[220px] text-xs leading-5 text-muted-foreground">
              You don&apos;t have any notifications right now.
            </p>

          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => markNotificationAsRead(notification._id)}
              className={`group relative border-b border-border px-5 py-4 transition duration-200 hover:bg-muted/60 ${
                !notification.isRead ? "bg-orange-500/[0.045]" : ""
              }`}
            >
              <div className="flex items-start gap-3">

                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    !notification.isRead
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {notification.type === "approval" ? (
                    <ShieldCheck size={19} />
                  ) : notification.type === "warning" ? (
                    <Info size={19} />
                  ) : (
                    <Bell size={19} />
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold leading-5 text-foreground">
                      {notification.title}
                    </h4>

                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    )}
                  </div>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {notification.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

                    <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Clock size={12} />
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={(event) => {
                          event.stopPropagation();

                          if (notification.isRead) {
                            markNotificationAsUnread(notification._id);
                          } else {
                            markNotificationAsRead(notification._id);
                          }
                        }}
                        className="flex items-center gap-1 text-[11px] font-medium text-orange-400 transition hover:text-orange-300"
                      >
                        <Check size={13} />
                        {notification.isRead ? "Unread" : "Read"}
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="flex items-center gap-1 text-[11px] font-medium text-red-400 transition hover:text-red-300"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border bg-muted/40 px-5 py-3">
          <p className="text-center text-[11px] text-muted-foreground">
            You&apos;re viewing your latest notifications
          </p>
        </div>
      )}

    </div>
  );

  // Notification Button
  const notificationButton = (
    <button
      onClick={() => {
        setNotificationOpen(!notificationOpen);
        setProfileOpen(false);
        setIsOpen(false);
      }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition duration-200 ${
        notificationOpen
          ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
          : "border-border bg-secondary text-muted-foreground hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
      }`}
      aria-label="Notifications"
      aria-expanded={notificationOpen}
    >
      <Bell size={20} />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[9px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl"
    >

      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl">
            🍕
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              Pizza<span className="text-orange-500">Hub</span>
            </h1>

            <p className="text-[9px] font-semibold uppercase tracking-[2px] text-muted-foreground">
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
                  : "text-muted-foreground hover:text-orange-400"
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
                  : "text-muted-foreground hover:text-orange-400"
              }`}
            >
              Dashboard
            </Link>
          )}

        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          <ThemeToggle />

          {/* Desktop Notification */}
          {!isPending && role === "admin" && (
            <div className="relative">
              {notificationButton}
              {notificationOpen && notificationContent()}
            </div>
          )}

          {/* Authentication */}
          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
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

          {/* Desktop Profile */}
          {!isPending && user && (
            <div className="relative">

              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-border bg-secondary py-1.5 pl-2 pr-3 transition hover:bg-muted"
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

                <span className="max-w-28 truncate text-sm font-semibold text-foreground">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-xl border border-border bg-popover p-2 shadow-2xl">

                  <div className="border-b border-border px-3 py-3">
                    <p className="truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={dashboardPath}
                    onClick={closeMenus}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-orange-400"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    href={profilePath}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-orange-400"
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

        {/* Mobile Actions */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          {/* Mobile Notification */}
          {!isPending && role === "admin" && (
            <div className="relative">
              {notificationButton}
              {notificationOpen && notificationContent()}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setProfileOpen(false);
              setNotificationOpen(false);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              isOpen
                ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                : "border-border text-foreground hover:bg-muted"
            }`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-200 border-t border-border bg-background px-4 py-5 md:hidden">

          <div className="mx-auto max-w-7xl space-y-5">

            {/* User Profile Card */}
            {!isPending && user && (
              <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4">

                <div className="flex items-center gap-3">

                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 rounded-full border-2 border-orange-500/30 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-black">
                      <User size={23} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold capitalize text-orange-400">
                      {role || "Customer"}
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">

              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground">
                Navigation
              </p>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenus}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    isActive(link.href)
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-muted-foreground hover:bg-muted hover:text-orange-400"
                  }`}
                >
                  {link.name}

                  {isActive(link.href) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  )}
                </Link>
              ))}

              {!isPending && user && (
                <Link
                  href={dashboardPath}
                  onClick={closeMenus}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    pathname.startsWith(dashboardPath)
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-muted-foreground hover:bg-muted hover:text-orange-400"
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}

            </div>

            {/* Account Settings */}
            {!isPending && user && (
              <div className="border-t border-border pt-4">

                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground">
                  Account
                </p>

                <Link
                  href={profilePath}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-orange-400"
                >
                  <Settings size={18} />
                  Profile Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            )}

            {/* Authentication */}
            {!isPending && !user && (
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">

                <Link
                  href="/sign-in"
                  onClick={closeMenus}
                  className="flex items-center justify-center rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="flex items-center justify-center rounded-xl bg-orange-500 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
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