"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

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

  // Fetch Admin Notifications
  useEffect(() => {
    if (role !== "admin" || !user?.email) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/admin/notifications/${encodeURIComponent(user.email)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Notification fetch failed:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [role, user?.email]);

  // Close Menus
  const closeMenus = () => {
    setIsOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
  };

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
      (notification) => notification._id === notificationId,
    );

    if (!selectedNotification || selectedNotification.isRead) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/read/${encodeURIComponent(user.email)}`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  // Mark Notification as Unread
  const markNotificationAsUnread = async (notificationId: string) => {
    if (!user?.email) return;

    const selectedNotification = notifications.find(
      (notification) => notification._id === notificationId,
    );

    if (!selectedNotification || !selectedNotification.isRead) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/unread/${encodeURIComponent(user.email)}`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as unread");
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: false }
            : notification,
        ),
      );

      setUnreadCount((prev) => prev + 1);
    } catch (error) {
      console.error("Mark as unread failed:", error);
    }
  };

  // Delete Notification
  const deleteNotification = async (notificationId: string) => {
    if (!user?.email) return;

    const selectedNotification = notifications.find(
      (notification) => notification._id === notificationId,
    );

    if (!selectedNotification) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/${encodeURIComponent(user.email)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId),
      );

      if (!selectedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Delete notification failed:", error);
    }
  };

  // Notification Dropdown Content
  const notificationContent = () => (
    <div className="absolute right-0 top-14 z-[100] w-[min(90vw,390px)] overflow-hidden rounded-2xl border border-white/10 bg-[#1B1511] shadow-[0_20px_70px_rgba(0,0,0,0.6)]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Bell size={19} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              Notifications
            </h3>

            <p className="mt-0.5 text-[11px] text-stone-500">
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-stone-500">
              <Bell size={27} />
            </div>

            <h4 className="text-sm font-semibold text-white">
              All caught up!
            </h4>

            <p className="mt-2 max-w-[220px] text-xs leading-5 text-stone-500">
              You don't have any notifications right now.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() =>
                markNotificationAsRead(notification._id)
              }
              className={`group relative border-b border-white/[0.06] px-5 py-4 transition duration-200 hover:bg-white/[0.04] ${
                !notification.isRead
                  ? "bg-orange-500/[0.045]"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">

                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    !notification.isRead
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-white/5 text-stone-400"
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

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold leading-5 text-white">
                      {notification.title}
                    </h4>

                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    )}
                  </div>

                  <p className="mt-1.5 text-xs leading-5 text-stone-400">
                    {notification.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

                    <span className="flex items-center gap-1.5 text-[10px] text-stone-500">
                      <Clock size={12} />
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={(event) => {
                          event.stopPropagation();

                          if (notification.isRead) {
                            markNotificationAsUnread(
                              notification._id,
                            );
                          } else {
                            markNotificationAsRead(
                              notification._id,
                            );
                          }
                        }}
                        className="flex items-center gap-1 text-[11px] font-medium text-orange-400 transition hover:text-orange-300"
                      >
                        <Check size={13} />

                        {notification.isRead
                          ? "Unread"
                          : "Read"}
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
        <div className="border-t border-white/10 bg-white/[0.02] px-5 py-3">
          <p className="text-center text-[11px] text-stone-500">
            You're viewing your latest notifications
          </p>
        </div>
      )}
    </div>
  );

  // Notification Bell Button
  const notificationButton = (
    <button
      onClick={() => {
        setNotificationOpen(!notificationOpen);
        setProfileOpen(false);
      }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition duration-200 ${
        notificationOpen
          ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
          : "border-white/10 bg-white/5 text-stone-300 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
      }`}
      aria-label="Notifications"
      aria-expanded={notificationOpen}
    >
      <Bell size={20} />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#100D0B] bg-red-500 px-1 text-[9px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#100D0B]/95 backdrop-blur-xl">

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

          {/* Desktop Profile */}
          {!isPending && user && (
            <div className="relative">

              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
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

        {/* Mobile Actions: Bell + Hamburger */}
        <div className="flex items-center gap-3 md:hidden">

          {/* Mobile Notification Bell - Outside Hamburger */}
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
              setNotificationOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition hover:bg-white/5"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
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
                className={`text-sm font-medium transition hover:text-orange-400 ${
                  isActive(link.href)
                    ? "text-orange-400"
                    : "text-stone-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {!isPending && user && (
              <>
                <Link
                  href={dashboardPath}
                  onClick={closeMenus}
                  className="flex items-center gap-2 text-sm font-medium text-stone-300 transition hover:text-orange-400"
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
                    className="mb-4 flex items-center gap-2 text-sm text-stone-300 transition hover:text-orange-400"
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