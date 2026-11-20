"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Pizza,
  Crown,
  Calendar,
  Download,
  Sparkles,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalOrders: number;
  pendingMenuApprovals: number;
  pendingOrders: number;
  premiumVendors: number;
}

interface RecentOrder {
  _id: string;
  customerName: string;
  vendorEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface TopVendor {
  email: string;
  name: string;
  totalOrders: number;
  totalOrderValue: number;
}

interface MonthlyOrderValue {
  month: string;
  year: number;
  totalOrderValue: number;
  totalOrders: number;
}

interface DashboardData {
  statistics: DashboardStats;
  recentOrders: RecentOrder[];
  topVendors: TopVendor[];
  monthlyRevenue: MonthlyOrderValue[];
}

const API_URL = "http://localhost:5000";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCurrency = (amount: number) => {
  return currencyFormatter.format(amount || 0);
};

const getTimeAgo = (date: string) => {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (Number.isNaN(seconds)) return "Unknown";

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;

  return `${Math.floor(seconds / 86400)} days ago`;
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/admin/dashboard`);

        if (!response.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const data: DashboardData = await response.json();

        setDashboard(data);
      } catch (error) {
        console.error("Dashboard Error:", error);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: dashboard?.statistics.totalUsers ?? 0,
      icon: Users,
      accent: "from-blue-500/20 to-transparent",
      iconBg: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
    },
    {
      title: "Total Vendors",
      value: dashboard?.statistics.totalVendors ?? 0,
      icon: Store,
      accent: "from-purple-500/20 to-transparent",
      iconBg: "bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/30",
    },
    {
      title: "Total Orders",
      value: dashboard?.statistics.totalOrders ?? 0,
      icon: ShoppingBag,
      accent: "from-orange-500/20 to-transparent",
      iconBg: "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30",
    },
    {
      title: "Total Order Value",
      value: formatCurrency(
        dashboard?.monthlyRevenue.reduce(
          (total, item) => total + item.totalOrderValue,
          0
        ) ?? 0
      ),
      icon: DollarSign,
      accent: "from-emerald-500/20 to-transparent",
      iconBg: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
    },
  ];

  const monthlyRevenue = dashboard?.monthlyRevenue ?? [];
  const recentOrders = dashboard?.recentOrders ?? [];
  const topVendors = dashboard?.topVendors ?? [];

  const maxOrderValue = Math.max(
    ...monthlyRevenue.map((item) => item.totalOrderValue),
    1
  );

  const maxVendorOrders = Math.max(
    ...topVendors.map((vendor) => vendor.totalOrders),
    1
  );

  const pendingTotal =
    (dashboard?.statistics.pendingMenuApprovals ?? 0) +
    (dashboard?.statistics.pendingOrders ?? 0);

  const exportReport = () => {
    if (!dashboard) return;

    const rows = [
      ["Order ID", "Customer", "Vendor", "Amount", "Status", "Date"],
      ...recentOrders.map((order) => [
        order._id,
        order.customerName,
        order.vendorEmail,
        order.totalPrice.toString(),
        order.status,
        new Date(order.createdAt).toLocaleString(),
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pizzahub-dashboard-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#231C19] via-[#1C1715] to-[#191412] p-6 shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
              <Sparkles size={12} />
              PizzaHub Admin Control
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-sm text-[#A8A29E]">
              Welcome back! Live insights into your restaurants and orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/25 px-3.5 py-2.5 text-xs font-medium text-[#D6D3D1] backdrop-blur-md">
              <Calendar size={14} className="text-orange-400" />
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <button
              type="button"
              onClick={exportReport}
              disabled={!dashboard}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="rounded-xl border border-white/[0.07] bg-[#1C1715] p-5 text-center text-sm text-orange-400">
          Loading dashboard data...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-center text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && dashboard && (
        <>
          {/* KPI Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#1C1715] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/40"
                >
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${stat.accent} opacity-40 transition-opacity group-hover:opacity-70`}
                  />

                  <div className="relative flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#A8A29E]">
                      {stat.title}
                    </p>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${stat.iconBg}`}
                    >
                      <Icon size={18} />
                    </div>
                  </div>

                  <h2 className="relative mt-4 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {stat.value.toLocaleString
                      ? typeof stat.value === "number"
                        ? stat.value.toLocaleString()
                        : stat.value
                      : stat.value}
                  </h2>

                  <div className="relative mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      <TrendingUp size={12} />
                      Live Data
                    </span>

                    <span className="text-xs text-[#78716C]">
                      From database
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Actions */}
          <div>
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">
                  Pending Actions
                </h2>

                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                </span>
              </div>

              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
                {pendingTotal} items require attention
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Menu Approvals",
                  count: dashboard.statistics.pendingMenuApprovals,
                  description: "New pizza items pending review",
                  href: "/admin/menu",
                  icon: Pizza,
                },
                {
                  title: "Pending Orders",
                  count: dashboard.statistics.pendingOrders,
                  description: "Orders requiring attention",
                  href: "/admin/orders",
                  icon: ShoppingBag,
                },
              ].map((task) => {
                const Icon = task.icon;

                return (
                  <Link
                    key={task.title}
                    href={task.href}
                    className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#211B18] to-[#1A1513] p-4 transition-all duration-300 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20 transition group-hover:bg-orange-500 group-hover:text-white">
                        <Icon size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white transition-colors group-hover:text-orange-300">
                          {task.title}
                        </p>

                        <p className="mt-0.5 text-xs text-[#8C8580]">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="rounded-lg bg-orange-500/10 px-2.5 py-1 text-base font-bold text-orange-400">
                        {task.count}
                      </span>

                      <ArrowRight
                        size={16}
                        className="text-[#78716C] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-400"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Analytics Chart + Top Vendors */}
          <div className="grid gap-5 xl:grid-cols-3">
            {/* Order Value Chart */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#1C1715] p-6 xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Order Value Overview
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8C8580]">
                    Monthly order value from the last 6 months
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(
                      monthlyRevenue.reduce(
                        (total, item) => total + item.totalOrderValue,
                        0
                      )
                    )}
                  </p>

                  <p className="text-[11px] text-[#A8A29E]">
                    Total order value
                  </p>
                </div>
              </div>

              <div className="mt-8 grid h-52 grid-cols-6 items-end gap-3 border-b border-white/[0.06] pb-3 pt-6 sm:gap-6">
                {monthlyRevenue.map((item, idx) => {
                  const isLatest = idx === monthlyRevenue.length - 1;

                  const height =
                    item.totalOrderValue > 0
                      ? `${Math.max(
                          (item.totalOrderValue / maxOrderValue) * 100,
                          5
                        )}%`
                      : "0%";

                  return (
                    <div
                      key={`${item.month}-${item.year}`}
                      className="group flex h-full flex-col items-center justify-end gap-2"
                    >
                      <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-center text-[10px] font-medium text-[#D6D3D1] opacity-0 transition-opacity group-hover:opacity-100">
                        {formatCurrency(item.totalOrderValue)}
                      </span>

                      <div className="relative flex w-full max-w-[44px] flex-1 items-end rounded-xl bg-white/[0.03] p-1">
                        <div
                          style={{ height }}
                          className={`w-full rounded-lg transition-all duration-500 ${
                            isLatest
                              ? "bg-gradient-to-t from-orange-600 to-amber-400 shadow-lg shadow-orange-500/25"
                              : "bg-gradient-to-t from-orange-500/30 to-orange-400/60 group-hover:from-orange-500 group-hover:to-amber-400"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-6 text-center text-xs font-medium text-[#8C8580]">
                {monthlyRevenue.map((item, idx) => (
                  <span
                    key={`${item.month}-${item.year}`}
                    className={
                      idx === monthlyRevenue.length - 1
                        ? "font-semibold text-orange-400"
                        : ""
                    }
                  >
                    {item.month}
                  </span>
                ))}
              </div>

              {monthlyRevenue.length === 0 && (
                <p className="mt-4 text-center text-xs text-[#8C8580]">
                  No order data available for this period.
                </p>
              )}
            </div>

            {/* Top Vendors */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#1C1715]">
              <div className="border-b border-white/[0.06] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">
                    Top Vendors
                  </h2>

                  <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-[#A8A29E]">
                    All Time
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-[#8C8580]">
                  Highest performing partner kitchens
                </p>
              </div>

              <div className="divide-y divide-white/[0.04] px-5">
                {topVendors.map((vendor, index) => {
                  const rankBadge =
                    index === 0
                      ? "bg-amber-400 text-black"
                      : index === 1
                        ? "bg-zinc-300 text-black"
                        : index === 2
                          ? "bg-amber-700 text-white"
                          : "bg-white/10 text-[#A8A29E]";

                  const initials = vendor.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <div key={vendor.email} className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/5 text-xs font-bold text-orange-400 ring-1 ring-orange-500/20">
                          {initials}

                          <span
                            className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-extrabold ${rankBadge}`}
                          >
                            {index + 1}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {vendor.name}
                          </p>

                          <p className="text-xs text-[#78716C]">
                            {vendor.totalOrders} orders
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-white">
                            {formatCurrency(vendor.totalOrderValue)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          style={{
                            width: `${
                              (vendor.totalOrders / maxVendorOrders) * 100
                            }%`,
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                        />
                      </div>
                    </div>
                  );
                })}

                {topVendors.length === 0 && (
                  <p className="py-8 text-center text-xs text-[#8C8580]">
                    No vendor order data available.
                  </p>
                )}
              </div>

              <Link
                href="/admin/vendors"
                className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-3.5 text-xs font-medium text-orange-400 transition hover:bg-white/[0.02] hover:text-orange-300"
              >
                View All Vendors
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#1C1715]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-5">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Recent Orders
                </h2>

                <p className="mt-0.5 text-xs text-[#8C8580]">
                  Latest customer orders across all vendors
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 transition hover:bg-orange-500/20"
              >
                View All Orders
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02] text-[11px] uppercase tracking-wider text-[#8C8580]">
                    <th className="px-5 py-3.5 font-semibold">Order ID</th>
                    <th className="px-5 py-3.5 font-semibold">Customer</th>
                    <th className="px-5 py-3.5 font-semibold">Vendor</th>
                    <th className="px-5 py-3.5 font-semibold">Time</th>
                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {recentOrders.map((order) => {
                    const status = order.status.toLowerCase();

                    return (
                      <tr
                        key={order._id}
                        className="transition-colors hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4 text-xs font-semibold text-orange-400">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-white">
                          {order.customerName}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#A8A29E]">
                          {order.vendorEmail}
                        </td>

                        <td className="px-5 py-4 text-xs text-[#78716C]">
                          {getTimeAgo(order.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-white">
                          {formatCurrency(order.totalPrice)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                              status === "accepted"
                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                                : status === "rejected" ||
                                    status === "cancelled"
                                  ? "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"
                                  : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                status === "accepted"
                                  ? "bg-emerald-400"
                                  : status === "rejected" ||
                                      status === "cancelled"
                                    ? "bg-rose-400"
                                    : "bg-amber-400"
                              }`}
                            />

                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {recentOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-sm text-[#8C8580]"
                      >
                        No orders found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Highlights */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Premium Vendors */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-[#1F1916] to-[#1C1715] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg shadow-orange-500/20">
                    <Crown size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Premium Tier Vendors
                    </p>

                    <p className="mt-0.5 text-xs text-[#A8A29E]">
                      Vendors with active premium subscriptions
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="text-3xl font-extrabold text-amber-400">
                    {dashboard.statistics.premiumVendors}
                  </h3>

                  <p className="text-[11px] text-amber-400/80">Active</p>
                </div>
              </div>
            </div>

            {/* Platform Health */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#1C1715] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <Activity size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Platform & API Health
                  </p>

                  <p className="mt-0.5 text-xs text-[#A8A29E]">
                    Dashboard API connection successful
                  </p>
                </div>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 size={14} />
                Connected
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}