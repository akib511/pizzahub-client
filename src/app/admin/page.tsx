"use client";

import { apiFetch } from "@/lib/api";

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

        const response = await apiFetch(`${API_URL}/admin/dashboard`);

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

  const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s === "accepted")
      return {
        pill: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
        dot: "bg-emerald-400",
      };
    if (s === "rejected" || s === "cancelled")
      return {
        pill: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20",
        dot: "bg-rose-400",
      };
    return {
      pill: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
      dot: "bg-amber-400",
    };
  };

  return (
    <div className="space-y-5 pb-10 sm:space-y-6 md:space-y-7">
      {/* ============ HEADER ============ */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-muted via-card to-background p-4 shadow-xl sm:rounded-2xl sm:p-5 md:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl sm:h-56 sm:w-56" />

        <div className="relative flex flex-col gap-4 sm:gap-5">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-medium text-orange-400 sm:px-3 sm:text-xs">
              <Sparkles size={11} className="sm:size-3" />
              PizzaHub Admin Control
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Welcome back! Live insights into your restaurants and orders.
            </p>
          </div>

          {/* Actions — stack on mobile */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-black/25 px-3 py-2 text-xs font-medium text-foreground backdrop-blur-md sm:inline-flex sm:rounded-xl sm:px-3.5 sm:py-2.5">
              <Calendar size={13} className="text-orange-400 sm:size-3.5" />
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <button
              type="button"
              onClick={exportReport}
              disabled={!dashboard}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-4 text-xs font-semibold text-foreground shadow-lg shadow-orange-500/20 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-auto sm:w-auto sm:rounded-xl sm:py-2.5"
            >
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* ============ LOADING & ERROR ============ */}
      {loading && (
        <div className="rounded-xl border border-border bg-card p-5 text-center text-sm text-orange-400">
          Loading dashboard data...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-center text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* ============ CONTENT ============ */}
      {!loading && !error && dashboard && (
        <>
          {/* KPI Statistics — 2 cols on mobile, 4 on xl */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl hover:shadow-black/40 sm:rounded-2xl sm:p-4 md:p-5"
                >
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${stat.accent} opacity-40 transition-opacity group-hover:opacity-70 sm:h-24`}
                  />

                  <div className="relative flex items-center justify-between gap-1">
                    <p className="text-[10px] font-medium uppercase leading-tight tracking-wider text-muted-foreground sm:text-xs">
                      {stat.title}
                    </p>

                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 sm:size-10 sm:rounded-xl ${stat.iconBg}`}
                    >
                      <Icon size={15} className="sm:size-[18px]" />
                    </div>
                  </div>

                  <h2 className="relative mt-2.5 break-words text-lg font-bold leading-tight tracking-tight text-foreground sm:mt-4 sm:text-2xl md:text-3xl">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </h2>

                  <div className="relative mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400 sm:px-2 sm:text-xs">
                      <TrendingUp size={9} className="sm:size-3" />
                      Live
                    </span>

                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      From database
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Actions */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-3.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground sm:text-base">
                  Pending Actions
                </h2>

                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500 sm:h-2.5 sm:w-2.5" />
                </span>
              </div>

              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-medium text-orange-400 sm:px-3 sm:py-1 sm:text-xs">
                {pendingTotal} items require attention
              </span>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
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
                    className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-background p-3.5 transition-all duration-300 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 sm:rounded-2xl sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20 transition group-hover:bg-orange-500 group-hover:text-white sm:size-11 sm:rounded-xl">
                        <Icon size={17} className="sm:size-[19px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-orange-300">
                          {task.title}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                      <span className="rounded-lg bg-orange-500/10 px-2 py-1 text-sm font-bold text-orange-400 sm:px-2.5 sm:text-base">
                        {task.count}
                      </span>

                      <ArrowRight
                        size={15}
                        className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-400 sm:size-4"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Analytics + Top Vendors */}
          <div className="grid gap-4 sm:gap-5 xl:grid-cols-3">
            {/* Order Value Chart */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-5 md:p-6 xl:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground sm:text-base">
                    Order Value Overview
                  </h2>

                  <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                    Monthly order value from the last 6 months
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-base font-bold text-foreground sm:text-lg">
                    {formatCurrency(
                      monthlyRevenue.reduce(
                        (total, item) => total + item.totalOrderValue,
                        0
                      )
                    )}
                  </p>

                  <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                    Total order value
                  </p>
                </div>
              </div>

              {/* Chart — smaller bars on mobile, no overflow */}
              <div className="mt-6 grid h-44 grid-cols-6 items-end gap-1.5 border-b border-border pb-3 pt-6 sm:mt-8 sm:h-52 sm:gap-3 md:gap-6">
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
                      className="group flex h-full flex-col items-center justify-end gap-1 sm:gap-2"
                    >
                      <span className="whitespace-nowrap rounded-md bg-muted px-1 py-0.5 text-center text-[9px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:px-2 sm:text-[10px]">
                        {formatCurrency(item.totalOrderValue)}
                      </span>

                      <div className="relative flex w-full max-w-[40px] flex-1 items-end rounded-lg bg-muted/50 p-0.5 sm:max-w-[44px] sm:rounded-xl sm:p-1">
                        <div
                          style={{ height }}
                          className={`w-full rounded-md transition-all duration-500 sm:rounded-lg ${
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

              <div className="mt-2 grid grid-cols-6 text-center text-[10px] font-medium text-muted-foreground sm:mt-3 sm:text-xs">
                {monthlyRevenue.map((item, idx) => (
                  <span
                    key={`${item.month}-${item.year}`}
                    className={`truncate ${
                      idx === monthlyRevenue.length - 1
                        ? "font-semibold text-orange-400"
                        : ""
                    }`}
                  >
                    {item.month}
                  </span>
                ))}
              </div>

              {monthlyRevenue.length === 0 && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  No order data available for this period.
                </p>
              )}
            </div>

            {/* Top Vendors */}
            <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl">
              <div className="border-b border-border p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-foreground sm:text-base">
                    Top Vendors
                  </h2>

                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:px-2 sm:py-1 sm:text-[11px]">
                    All Time
                  </span>
                </div>

                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  Highest performing partner kitchens
                </p>
              </div>

              <div className="divide-y divide-white/[0.04] px-4 sm:px-5">
                {topVendors.map((vendor, index) => {
                  const rankBadge =
                    index === 0
                      ? "bg-amber-400 text-black"
                      : index === 1
                        ? "bg-zinc-300 text-black"
                        : index === 2
                          ? "bg-amber-700 text-foreground"
                          : "bg-muted text-muted-foreground";

                  const initials = vendor.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <div key={vendor.email} className="py-3 sm:py-3.5">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/5 text-[10px] font-bold text-orange-400 ring-1 ring-orange-500/20 sm:size-10 sm:rounded-xl sm:text-xs">
                          {initials}

                          <span
                            className={`absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full text-[9px] font-extrabold sm:h-4 sm:w-4 ${rankBadge}`}
                          >
                            {index + 1}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-foreground sm:text-sm">
                            {vendor.name}
                          </p>

                          <p className="text-[10px] text-muted-foreground sm:text-xs">
                            {vendor.totalOrders} orders
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-[13px] font-bold text-foreground sm:text-sm">
                            {formatCurrency(vendor.totalOrderValue)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted sm:mt-2.5 sm:h-1.5">
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
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    No vendor order data available.
                  </p>
                )}
              </div>

              <Link
                href="/admin/vendors"
                className="flex items-center justify-center gap-1.5 border-t border-border py-3 text-[11px] font-medium text-orange-400 transition hover:bg-muted/40 hover:text-orange-300 sm:py-3.5 sm:text-xs"
              >
                View All Vendors
                <ArrowRight size={13} className="sm:size-3.5" />
              </Link>
            </div>
          </div>

          {/* ============ RECENT ORDERS ============ */}
          <div className="overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4 sm:gap-3 sm:p-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground sm:text-base">
                  Recent Orders
                </h2>

                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  Latest customer orders across all vendors
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 px-2.5 py-1.5 text-[11px] font-medium text-orange-400 transition hover:bg-orange-500/20 sm:px-3 sm:text-xs"
              >
                View All
                <ArrowRight size={13} className="sm:size-3.5" />
              </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
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
                    const styles = getStatusStyles(order.status);

                    return (
                      <tr
                        key={order._id}
                        className="transition-colors hover:bg-muted"
                      >
                        <td className="px-5 py-4 text-xs font-semibold text-orange-400">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-foreground">
                          {order.customerName}
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {order.vendorEmail}
                        </td>

                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {getTimeAgo(order.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-foreground">
                          {formatCurrency(order.totalPrice)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${styles.pill}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
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
                        className="px-5 py-10 text-center text-sm text-muted-foreground"
                      >
                        No orders found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile card list — replaces horizontal scroll table */}
            <div className="divide-y divide-white/[0.04] md:hidden">
              {recentOrders.map((order) => {
                const styles = getStatusStyles(order.status);

                return (
                  <div key={order._id} className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-orange-400">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>

                        <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                          {order.customerName}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${styles.pill}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                        />
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] text-muted-foreground">
                          {order.vendorEmail}
                        </p>

                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {getTimeAgo(order.createdAt)}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-foreground">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {recentOrders.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No orders found yet.
                </p>
              )}
            </div>
          </div>

          {/* ============ BOTTOM HIGHLIGHTS ============ */}
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {/* Premium Vendors */}
            <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-muted to-card p-4 sm:rounded-2xl sm:p-5">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg shadow-orange-500/20 sm:size-12 sm:rounded-xl">
                    <Crown size={20} className="sm:size-[22px]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground sm:text-sm">
                      Premium Tier Vendors
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                      Vendors with active premium subscriptions
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <h3 className="text-2xl font-extrabold text-amber-400 sm:text-3xl">
                    {dashboard.statistics.premiumVendors}
                  </h3>

                  <p className="text-[10px] text-amber-400/80 sm:text-[11px]">
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Health */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 sm:gap-4 sm:rounded-2xl sm:p-5">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 sm:size-12 sm:rounded-xl">
                  <Activity size={20} className="sm:size-[22px]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-foreground sm:text-sm">
                    Platform & API Health
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                    Dashboard API connection successful
                  </p>
                </div>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400 sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-xs">
                <CheckCircle2 size={12} className="sm:size-3.5" />
                <span className="hidden xs:inline sm:inline">Connected</span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}