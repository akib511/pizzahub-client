
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  Package,
  MapPin,
  CalendarDays,
  Pizza,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

const initialOrders = [
  {
    id: "PH-2026-001",
    name: "Pepperoni Pizza",
    description: "Classic pepperoni with mozzarella cheese",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
    date: "Nov 16, 2026",
    quantity: 2,
    price: 24.99,
    status: "Delivered",
    address: "Dhaka, Bangladesh",
  },
  {
    id: "PH-2026-002",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato and basil",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    date: "Nov 14, 2026",
    quantity: 1,
    price: 12.99,
    status: "Processing",
    address: "Dhaka, Bangladesh",
  },
  {
    id: "PH-2026-003",
    name: "BBQ Chicken Pizza",
    description: "Smoky BBQ chicken with fresh toppings",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    date: "Nov 12, 2026",
    quantity: 1,
    price: 16.99,
    status: "Pending",
    address: "Dhaka, Bangladesh",
  },
];

const filters = ["All Orders", "Pending", "Processing", "Delivered", "Cancelled"];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    Processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Pending: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
        styles[status] || styles.Pending
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "All Orders" || order.status === activeFilter;

    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.name.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const cancelOrder = () => {
    if (!selectedOrder) return;

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === selectedOrder
          ? { ...order, status: "Cancelled" }
          : order
      )
    );

    setSelectedOrder(null);
  };

  const getCount = (status: string) => {
    if (status === "All Orders") return orders.length;

    return orders.filter((order) => order.status === status).length;
  };

  return (
    <main className="min-h-screen bg-[#100D0B] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <Link
          href="/customer/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#A8A29E] hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-orange-500">
              CUSTOMER PANEL
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              My Orders<span className="text-orange-500">.</span>
            </h1>

            <p className="mt-2 text-sm text-[#A8A29E]">
              Manage your orders and keep track of your deliveries.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold transition hover:bg-orange-600"
          >
            <Pizza size={17} />
            Order More Pizza
          </Link>
        </div>

        {/* Order Overview */}
        <div className="mb-8 flex flex-wrap gap-3">
          <div className="flex min-w-32 flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1C1715] p-4">
            <ShoppingBag className="text-orange-500" size={21} />
            <div>
              <p className="text-xl font-bold">{orders.length}</p>
              <p className="text-xs text-[#A8A29E]">Total Orders</p>
            </div>
          </div>

          <div className="flex min-w-32 flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1C1715] p-4">
            <Clock3 className="text-orange-400" size={21} />
            <div>
              <p className="text-xl font-bold">{getCount("Pending")}</p>
              <p className="text-xs text-[#A8A29E]">Pending</p>
            </div>
          </div>

          <div className="flex min-w-32 flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1C1715] p-4">
            <Package className="text-blue-400" size={21} />
            <div>
              <p className="text-xl font-bold">{getCount("Processing")}</p>
              <p className="text-xs text-[#A8A29E]">Processing</p>
            </div>
          </div>

          <div className="flex min-w-32 flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#1C1715] p-4">
            <CheckCircle2 className="text-green-400" size={21} />
            <div>
              <p className="text-xl font-bold">{getCount("Delivered")}</p>
              <p className="text-xs text-[#A8A29E]">Delivered</p>
            </div>
          </div>
        </div>

        {/* Orders Workspace */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#171310]">

          {/* Filter Header */}
          <div className="border-b border-white/[0.07] p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Order Management</h2>
              <p className="mt-1 text-xs text-[#A8A29E]">
                View, track and manage your pizza orders.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium transition ${
                    activeFilter === filter
                      ? "bg-orange-500 text-white"
                      : "bg-white/[0.04] text-[#A8A29E] hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {filter}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                      activeFilter === filter
                        ? "bg-white/20"
                        : "bg-white/[0.07]"
                    }`}
                  >
                    {getCount(filter)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:px-6">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID or pizza..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#100D0B] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#78716C] focus:border-orange-500"
              />
            </div>

            <p className="text-xs text-[#A8A29E]">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredOrders.length}
              </span>{" "}
              of {orders.length} orders
            </p>
          </div>

          {/* Order List */}
          <div className="p-5 sm:p-6">
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1C1715] transition hover:border-orange-500/30"
                  >
                    {/* Order Top */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
                      <div>
                        <p className="text-[10px] font-medium text-[#78716C]">
                          ORDER NUMBER
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {order.id}
                        </p>
                      </div>

                      <StatusBadge status={order.status} />
                    </div>

                    {/* Order Content */}
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="h-36 w-full rounded-xl object-cover sm:h-24 sm:w-28"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold">
                          {order.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#A8A29E]">
                          {order.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#A8A29E]">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={13} />
                            {order.date}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <ShoppingBag size={13} />
                            Qty: {order.quantity}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} />
                            {order.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
                        <div>
                          <p className="text-xs text-[#78716C]">
                            Total Amount
                          </p>
                          <p className="mt-1 text-xl font-bold text-orange-500">
                            ${order.price.toFixed(2)}
                          </p>
                        </div>

                        <p className="mt-2 text-xs text-[#78716C]">
                          {order.quantity} item(s)
                        </p>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] bg-white/[0.015] px-4 py-3 sm:px-5">
                      <p className="text-xs text-[#78716C]">
                        {order.status === "Pending"
                          ? "Your order is waiting for vendor confirmation."
                          : order.status === "Processing"
                            ? "Your pizza is being prepared."
                            : order.status === "Delivered"
                              ? "Your order has been delivered successfully."
                              : "You cancelled this order."}
                      </p>

                      {order.status === "Pending" && (
                        <button
                          onClick={() => setSelectedOrder(order.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/15"
                        >
                          <Trash2 size={14} />
                          Cancel Order
                        </button>
                      )}

                      {order.status === "Delivered" && (
                        <Link
                          href="/menu"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-400"
                        >
                          Order Again
                          <ArrowRight size={14} />
                        </Link>
                      )}

                      {order.status === "Processing" && (
                        <span className="flex items-center gap-1.5 text-xs text-blue-400">
                          <Package size={14} />
                          Preparing Order
                        </span>
                      )}

                      {order.status === "Cancelled" && (
                        <span className="flex items-center gap-1.5 text-xs text-red-400">
                          <XCircle size={14} />
                          Order Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
                  <ShoppingBag size={28} className="text-[#78716C]" />
                </div>

                <h3 className="text-lg font-semibold">No Orders Found</h3>

                <p className="mt-2 max-w-xs text-sm text-[#A8A29E]">
                  {search
                    ? "No orders match your search. Try another keyword."
                    : "You don't have any orders in this category yet."}
                </p>

                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold hover:bg-orange-600"
                >
                  Explore Menu
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Support */}
        <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#1C1715] p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Need help with an order?</h3>
            <p className="mt-1 text-xs text-[#A8A29E]">
              Contact our support team if you need any assistance.
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-orange-500 hover:text-orange-400"
          >
            Contact Support <ArrowRight className="ml-1 inline" size={15} />
          </Link>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1C1715] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle size={24} className="text-red-400" />
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-[#A8A29E] hover:bg-white/[0.06] hover:text-white"
                aria-label="Close confirmation"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-bold">Cancel This Order?</h2>

            <p className="mt-2 text-sm leading-6 text-[#A8A29E]">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold text-white">
                {selectedOrder}
              </span>
              ? This action will change your order status to Cancelled.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-[#A8A29E] hover:bg-white/[0.05] hover:text-white"
              >
                Keep Order
              </button>

              <button
                onClick={cancelOrder}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
