"use client";

import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  MoreHorizontal,
  DollarSign,
  Crown,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Menu Items",
    value: "24",
    change: "+4 this month",
    icon: UtensilsCrossed,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Active Items",
    value: "18",
    change: "75% of total items",
    icon: ShoppingBag,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Pending Orders",
    value: "08",
    change: "Needs your attention",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Accepted Orders",
    value: "32",
    change: "+12% this month",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

const recentOrders = [
  {
    id: "#PH-1024",
    customer: "John Smith",
    item: "Pepperoni Pizza",
    amount: "$24.00",
    status: "Pending",
    time: "10 min ago",
  },
  {
    id: "#PH-1023",
    customer: "Sarah Wilson",
    item: "Chicken BBQ Pizza",
    amount: "$32.00",
    status: "Accepted",
    time: "25 min ago",
  },
  {
    id: "#PH-1022",
    customer: "Michael Brown",
    item: "Margherita Pizza",
    amount: "$18.00",
    status: "Accepted",
    time: "1 hour ago",
  },
  {
    id: "#PH-1021",
    customer: "Emily Davis",
    item: "Cheese Burst Pizza",
    amount: "$28.00",
    status: "Pending",
    time: "2 hours ago",
  },
];

const popularItems = [
  {
    name: "Pepperoni Pizza",
    category: "Classic Pizza",
    price: "$18.00",
    orders: 48,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200",
  },
  {
    name: "Chicken BBQ Pizza",
    category: "Special Pizza",
    price: "$22.00",
    orders: 36,
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=200",
  },
  {
    name: "Margherita Pizza",
    category: "Classic Pizza",
    price: "$15.00",
    orders: 29,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200",
  },
];

const monthlyOrders = [
  { month: "Jan", value: 35 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 42 },
  { month: "Apr", value: 75 },
  { month: "May", value: 60 },
  { month: "Jun", value: 90 },
  { month: "Jul", value: 68 },
  { month: "Aug", value: 100 },
  { month: "Sep", value: 78 },
  { month: "Oct", value: 88 },
  { month: "Nov", value: 65 },
  { month: "Dec", value: 95 },
];

export default function VendorOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-orange-500">Welcome back!</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Vendor Overview
          </h1>
          <p className="mt-2 text-sm text-[#A8A29E]">
            Here&apos;s what&apos;s happening with your restaurant today.
          </p>
        </div>

        <Link
          href="/vendor/add-menu"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add New Item
        </Link>
      </section>

      {/* Subscription Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/15 via-[#24160F] to-[#1C1715] p-5 sm:p-6">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
              <Crown size={26} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold">Free Plan</h2>
                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-400">
                  Current Plan
                </span>
              </div>

              <p className="mt-1 text-sm text-[#A8A29E]">
                You are currently using 3 of 3 active menu item slots.
              </p>

              <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full rounded-full bg-orange-500" />
              </div>
            </div>
          </div>

          <Link
            href="/vendor/subscription"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-orange-500/40 px-4 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500 hover:text-white"
          >
            Upgrade Plan
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-[#302824] bg-[#1C1715] p-5 transition hover:border-orange-500/30"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${stat.bg} ${stat.color}`}>
                  <Icon size={22} />
                </div>

                <button className="text-[#78716C] hover:text-white">
                  <MoreHorizontal size={21} />
                </button>
              </div>

              <p className="mt-5 text-sm text-[#A8A29E]">
                {stat.title}
              </p>

              <h3 className="mt-1 text-3xl font-bold">{stat.value}</h3>

              <p className="mt-2 text-xs text-[#78716C]">
                {stat.change}
              </p>
            </div>
          );
        })}
      </section>

      {/* Charts and Subscription Info */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Monthly Orders Chart */}
        <div className="rounded-xl border border-[#302824] bg-[#1C1715] p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Orders Overview</h2>
              <p className="mt-1 text-xs text-[#78716C]">
                Monthly order performance
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
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="flex h-full w-full items-end">
                  <div
                    style={{ height: `${item.value}%` }}
                    className="w-full rounded-t-md bg-orange-500/80 transition hover:bg-orange-400"
                    title={`${item.value} orders`}
                  />
                </div>

                <span className="text-[10px] text-[#78716C] sm:text-xs">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#302824] pt-5">
            <div>
              <p className="text-xs text-[#78716C]">Total Orders</p>
              <h3 className="mt-1 text-2xl font-bold">842</h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-400">
              <TrendingUp size={17} />
              <span>12.5% from last month</span>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="rounded-xl border border-[#302824] bg-[#1C1715] p-5 sm:p-6">
          <h2 className="text-lg font-bold">Restaurant Summary</h2>
          <p className="mt-1 text-xs text-[#78716C]">
            Your restaurant performance
          </p>

          <div className="mt-7 space-y-6">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A8A29E]">Active Items</span>
                <span className="font-semibold">18 / 24</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-orange-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A8A29E]">Pending Orders</span>
                <span className="font-semibold">08</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 rounded-full bg-yellow-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A8A29E]">Accepted Orders</span>
                <span className="font-semibold">32</span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-green-500" />
              </div>
            </div>
          </div>

          <Link
            href="/vendor/orders"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-[#302824] py-3 text-sm font-medium transition hover:border-orange-500 hover:text-orange-400"
          >
            Manage Orders
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-xl border border-[#302824] bg-[#1C1715]">
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
                <tr key={order.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-orange-400">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-[#A8A29E]">
                    {order.item}
                  </td>
                  <td className="px-6 py-4 font-medium">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#78716C]">
                    {order.time}
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
              key={order.id}
              className="rounded-lg border border-[#302824] bg-[#100D0B] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-orange-400">
                  {order.id}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                    order.status === "Pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-semibold">
                {order.item}
              </h3>

              <p className="mt-1 text-xs text-[#78716C]">
                {order.customer}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-[#302824] pt-3">
                <span className="text-xs text-[#78716C]">
                  {order.time}
                </span>

                <span className="font-semibold">{order.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Items */}
      <section className="rounded-xl border border-[#302824] bg-[#1C1715] p-5 sm:p-6">
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

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {popularItems.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center gap-4 rounded-xl border border-[#302824] bg-[#100D0B] p-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-[#78716C]">
                  {item.category}
                </p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-orange-400">
                    {item.price}
                  </span>

                  <span className="text-xs text-[#A8A29E]">
                    {item.orders} orders
                  </span>
                </div>
              </div>

              {index === 0 && (
                <span className="self-start rounded-md bg-orange-500/10 px-2 py-1 text-[10px] font-semibold text-orange-400">
                  #1
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}