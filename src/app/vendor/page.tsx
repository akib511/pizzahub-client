"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  MoreHorizontal,
  Crown,
  Package,
  RefreshCw,
} from "lucide-react";

// Types
type MenuItem = {
  _id: string;
  vendorEmail: string;
  name: string;
  image?: string;
  category?: string;
  price: number;
  status: string;
  available: boolean;
};

type VendorOrder = {
  _id: string;
  itemId: string;
  itemName: string;
  itemImage?: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  customerName: string;
  customerEmail: string;
};

type VendorProfile = {
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string;
};

// Helpers
const formatTime = (date: string) => {
  const now = new Date();
  const orderDate = new Date(date);

  const minutes = Math.floor((now.getTime() - orderDate.getTime()) / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);

  return `${days} days ago`;
};

export default function VendorOverviewPage() {
  const { data: session, isPending } = authClient.useSession();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(
    null,
  );

  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const vendorEmail = session?.user?.email;

  // Fetch Overview Data
  useEffect(() => {
    if (isPending) return;

    if (!vendorEmail) {
      setLoading(false);
      return;
    }

    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        setError("");

        const [menuResponse, orderResponse, profileResponse] =
          await Promise.all([
            fetch("http://localhost:5000/menu"),

            fetch(
              `http://localhost:5000/orders/vendor/${encodeURIComponent(vendorEmail)}`,
            ),

            fetch(
              `http://localhost:5000/vendor/profile/${encodeURIComponent(vendorEmail)}`,
            ),
          ]);

        if (!menuResponse.ok || !orderResponse.ok || !profileResponse.ok) {
          throw new Error("Failed to load overview data");
        }

        const menuData = await menuResponse.json();
        const orderData = await orderResponse.json();
        const profileData = await profileResponse.json();

        const vendorMenu = menuData.filter(
          (item: MenuItem) => item.vendorEmail === vendorEmail,
        );

        setMenuItems(vendorMenu);
        setOrders(orderData);
        setVendorProfile(profileData);
      } catch (error) {
        console.error("Overview loading error:", error);

        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [vendorEmail, isPending]);

  // Statistics
  const totalMenuItems = menuItems.length;

  const activeMenuItems = menuItems.filter(
    (item) => item.status === "approved" && item.available,
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted",
  ).length;

  const stats = [
    {
      title: "Total Menu Items",
      value: totalMenuItems,
      change: "Your total menu items",
      icon: UtensilsCrossed,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Active Items",
      value: activeMenuItems,
      change: "Approved and available",
      icon: ShoppingBag,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      change: "Waiting for your response",
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Accepted Orders",
      value: acceptedOrders,
      change: "Orders accepted by you",
      icon: CheckCircle2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  // Recent Orders
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Monthly Orders
  const currentYear = new Date().getFullYear();

  const monthlyOrders = Array.from({ length: 12 }, (_, index) => {
    const count = orders.filter((order) => {
      const date = new Date(order.createdAt);

      return date.getFullYear() === currentYear && date.getMonth() === index;
    }).length;

    return {
      month: new Date(currentYear, index).toLocaleDateString("en-US", {
        month: "short",
      }),
      value: count,
    };
  });

  const maxOrders = Math.max(...monthlyOrders.map((item) => item.value), 1);

  const totalOrders = orders.length;

  // Popular Menu Items
  const popularItems = menuItems
    .map((item) => {
      const itemOrders = orders.filter(
        (order) => order.itemId === item._id || order.itemName === item.name,
      );

      return {
        ...item,
        orders: itemOrders.reduce((total, order) => total + order.quantity, 0),
      };
    })
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 3);

  // Subscription Usage
  const isPremiumActive = vendorProfile?.subscriptionPlan === "premium";

  const subscriptionPlan = isPremiumActive ? "Premium" : "Free";

  const freePlanLimit = 3;

  const isFreeLimitReached =
    !isPremiumActive && activeMenuItems >= freePlanLimit;

  const planUsage = isPremiumActive
    ? 100
    : Math.min((activeMenuItems / freePlanLimit) * 100, 100);

  // Loading State
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="animate-spin text-orange-500" size={35} />

        <p className="text-sm text-[#A8A29E]">Loading your dashboard...</p>
      </div>
    );
  }

  // Authentication State
  if (!vendorEmail) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Package size={45} className="text-orange-500" />

        <h2 className="mt-4 text-xl font-bold">Please Login</h2>

        <p className="mt-2 text-sm text-[#A8A29E]">
          Login to access your vendor dashboard.
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-red-400">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 text-white">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-orange-500">Welcome back!</p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Vendor Overview
          </h1>

          <p className="mt-2 text-sm text-[#A8A29E]">
            Here's what's happening with your restaurant today.
          </p>
        </div>

        <button
          onClick={() => {
            if (isFreeLimitReached) {
              setShowLimitDialog(true);
            } else {
              window.location.href = "/vendor/add-menu";
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </section>

      {/* Subscription Banner */}
      <section
        className={`relative overflow-hidden rounded-2xl border p-4 sm:p-6 ${
          isPremiumActive
            ? "border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 via-[#211C12] to-[#1C1715]"
            : "border-orange-500/20 bg-gradient-to-r from-orange-500/15 via-[#24160F] to-[#1C1715]"
        }`}
      >
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isPremiumActive
                  ? "bg-yellow-500/15 text-yellow-400"
                  : "bg-orange-500/20 text-orange-400"
              }`}
            >
              <Crown size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold sm:text-lg">
                  {subscriptionPlan} Plan
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                    isPremiumActive
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-orange-500/15 text-orange-400"
                  }`}
                >
                  {isPremiumActive ? "PREMIUM MEMBER" : "CURRENT PLAN"}
                </span>
              </div>

              <p className="mt-1 text-xs leading-relaxed text-[#A8A29E] sm:text-sm">
                {isPremiumActive
                  ? "Enjoy unlimited active menu items and all Premium benefits."
                  : `You are using ${activeMenuItems} of ${freePlanLimit} active menu item slots.`}
              </p>

              {isPremiumActive ? (
                <p className="mt-2 text-xs font-medium text-yellow-400">
                  Unlimited Menu Access
                </p>
              ) : (
                <>
                  <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{ width: `${planUsage}%` }}
                      className={`h-full rounded-full transition-all ${
                        isFreeLimitReached ? "bg-red-500" : "bg-orange-500"
                      }`}
                    />
                  </div>

                  {isFreeLimitReached && (
                    <p className="mt-2 text-xs font-medium text-red-400">
                      Your free plan limit is reached. Upgrade to Premium!
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <Link
            href="/vendor/subscription"
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
              isPremiumActive
                ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                : "border-orange-500/40 text-orange-400 hover:bg-orange-500 hover:text-white"
            }`}
          >
            {isPremiumActive ? "Manage Premium" : "Upgrade to Premium"}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-[#302824] bg-[#1C1715] p-3.5 transition hover:border-orange-500/30 sm:rounded-2xl sm:p-5"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                  <Icon size={19} className="sm:h-[22px] sm:w-[22px]" />
                </div>

                <MoreHorizontal size={21} className="text-[#78716C]" />
              </div>

              <p className="mt-5 text-sm text-[#A8A29E]">{stat.title}</p>

              <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
                {stat.value}
              </h3>

              <p className="mt-2 text-xs text-[#78716C]">{stat.change}</p>
            </div>
          );
        })}
      </section>

      {/* Charts and Summary */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Monthly Orders Chart */}
        <div className="rounded-2xl border border-[#302824] bg-[#1C1715] p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Orders Overview</h2>

              <p className="mt-1 text-xs text-[#78716C]">
                Monthly order performance - {currentYear}
              </p>
            </div>

            <span className="w-fit rounded-lg border border-[#302824] bg-[#100D0B] px-3 py-2 text-xs text-[#A8A29E]">
              This Year
            </span>
          </div>

          <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4">
            {monthlyOrders.map((item) => (
              <div
                key={item.month}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="flex h-full w-full items-end">
                  <div
                    style={{
                      height: `${
                        item.value === 0 ? 2 : (item.value / maxOrders) * 100
                      }%`,
                    }}
                    className="w-full rounded-t-md bg-orange-500/80 transition hover:bg-orange-400"
                    title={`${item.value} orders`}
                  />
                </div>

                <span className="text-[9px] text-[#78716C] sm:text-xs">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#302824] pt-5">
            <div>
              <p className="text-xs text-[#78716C]">Total Orders</p>

              <h3 className="mt-1 text-2xl font-bold">{totalOrders}</h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-400">
              <TrendingUp size={17} />
              <span>All time orders</span>
            </div>
          </div>
        </div>

        {/* Restaurant Summary */}
        <div className="rounded-2xl border border-[#302824] bg-[#1C1715] p-5 sm:p-6">
          <h2 className="text-lg font-bold">Restaurant Summary</h2>

          <p className="mt-1 text-xs text-[#78716C]">
            Your restaurant performance
          </p>

          <div className="mt-7 space-y-6">
            {/* Active Items */}
            <div>
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-[#A8A29E]">Active Items</span>

                <span className="font-semibold">
                  {activeMenuItems} / {totalMenuItems}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  style={{
                    width: `${
                      totalMenuItems
                        ? (activeMenuItems / totalMenuItems) * 100
                        : 0
                    }%`,
                  }}
                  className="h-full rounded-full bg-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Pending Orders */}
            <div>
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-[#A8A29E]">Pending Orders</span>

                <span className="font-semibold">{pendingOrders}</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  style={{
                    width: `${
                      totalOrders ? (pendingOrders / totalOrders) * 100 : 0
                    }%`,
                  }}
                  className="h-full rounded-full bg-yellow-500 transition-all"
                />
              </div>
            </div>

            {/* Accepted Orders */}
            <div>
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-[#A8A29E]">Accepted Orders</span>

                <span className="font-semibold">{acceptedOrders}</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  style={{
                    width: `${
                      totalOrders ? (acceptedOrders / totalOrders) * 100 : 0
                    }%`,
                  }}
                  className="h-full rounded-full bg-green-500 transition-all"
                />
              </div>
            </div>
          </div>

          <Link
            href="/vendor/orders"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-[#302824] py-3 text-sm font-medium transition hover:border-orange-500 hover:text-orange-400"
          >
            Manage Orders
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-2xl border border-[#302824] bg-[#1C1715]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#302824] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-lg font-bold">Recent Customer Orders</h2>

            <p className="mt-1 text-xs text-[#78716C]">
              Keep track of your latest orders
            </p>
          </div>

          <Link
            href="/vendor/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-400"
          >
            View All Orders
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <ShoppingBag size={35} className="text-[#57534E]" />

            <h3 className="mt-3 font-semibold">No Orders Yet</h3>

            <p className="mt-1 text-sm text-[#78716C]">
              Your customer orders will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#100D0B] text-xs text-[#78716C]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>

                    <th className="px-6 py-4 font-medium">Customer</th>

                    <th className="px-6 py-4 font-medium">Menu Item</th>

                    <th className="px-6 py-4 font-medium">Amount</th>

                    <th className="px-6 py-4 font-medium">Status</th>

                    <th className="px-6 py-4 font-medium">Time</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#302824]">
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-medium text-orange-400">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="px-6 py-4">{order.customerName}</td>

                      <td className="px-6 py-4 text-[#A8A29E]">
                        {order.itemName}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            order.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : order.status === "accepted"
                                ? "bg-green-500/10 text-green-400"
                                : order.status === "rejected"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-[#78716C]">
                        {formatTime(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 md:hidden">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-[#302824] bg-[#100D0B] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-orange-400">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${
                        order.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : order.status === "accepted"
                            ? "bg-green-500/10 text-green-400"
                            : order.status === "rejected"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-semibold">
                    {order.itemName}
                  </h3>

                  <p className="mt-1 text-xs text-[#78716C]">
                    {order.customerName}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#302824] pt-3">
                    <span className="text-xs text-[#78716C]">
                      {formatTime(order.createdAt)}
                    </span>

                    <span className="font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Popular Items */}
      <section className="rounded-2xl border border-[#302824] bg-[#1C1715] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Popular Menu Items</h2>

            <p className="mt-1 text-xs text-[#78716C]">
              Your best-selling food items
            </p>
          </div>

          <Link
            href="/vendor/menu"
            className="text-sm font-medium text-orange-500 hover:text-orange-400"
          >
            View Menu
          </Link>
        </div>

        {popularItems.length === 0 ? (
          <div className="py-10 text-center">
            <UtensilsCrossed size={35} className="mx-auto text-[#57534E]" />

            <p className="mt-3 text-sm text-[#78716C]">
              No menu items available yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {popularItems.map((item, index) => (
              <div
                key={item._id}
                className="flex items-center gap-4 rounded-xl border border-[#302824] bg-[#100D0B] p-3 transition hover:border-orange-500/30"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#302824]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <UtensilsCrossed size={22} className="text-[#78716C]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#78716C]">
                    {item.category || "Menu Item"}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-orange-400">
                      ${item.price.toFixed(2)}
                    </span>

                    <span className="text-xs text-[#A8A29E]">
                      {item.orders} orders
                    </span>
                  </div>
                </div>

                {index === 0 && item.orders > 0 && (
                  <span className="self-start rounded-md bg-orange-500/10 px-2 py-1 text-[10px] font-semibold text-orange-400">
                    #1
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Free Plan Limit Dialog */}
      {showLimitDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setShowLimitDialog(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-orange-500/20 bg-[#1C1715] p-5 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <Crown size={30} />
            </div>

            <h2 className="mt-5 text-center text-xl font-bold text-white">
              Free Plan Limit Reached!
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-[#A8A29E]">
              You have already used all {freePlanLimit} active menu item slots
              in your Free Plan. Upgrade to Premium to publish unlimited menu
              items.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/vendor/subscription"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <Crown size={17} />
                Upgrade to Premium
                <ArrowUpRight size={16} />
              </Link>

              <button
                onClick={() => setShowLimitDialog(false)}
                className="rounded-xl border border-[#302824] px-5 py-3 text-sm font-medium text-[#A8A29E] transition hover:bg-white/5 hover:text-white"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
