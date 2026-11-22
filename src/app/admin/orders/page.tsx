"use client";

import { apiFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Search,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ChevronDown,
  MapPin,
  CalendarDays,
  User,
  Store,
  X,
} from "lucide-react";

type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

interface Order {
  _id: string;
  itemId: string;
  itemName: string;
  itemImage?: string;
  vendorId: string;
  vendorEmail: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

const API_URL = "http://localhost:5000";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  accepted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  cancelled: "bg-stone-500/10 text-muted-foreground border-stone-500/20",
};

const formatDate = (date: string) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatOrderId = (id: string) => {
  return `ORD-${id.slice(-6).toUpperCase()}`;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch(`${API_URL}/admin/orders`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: Order[] = await response.json();

        setOrders(data);
      } catch (error) {
        console.error("Orders fetch error:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Search and Filter
  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      formatOrderId(order._id).toLowerCase().includes(searchValue) ||
      order.customerName?.toLowerCase().includes(searchValue) ||
      order.customerEmail?.toLowerCase().includes(searchValue) ||
      order.vendorEmail?.toLowerCase().includes(searchValue) ||
      order.itemName?.toLowerCase().includes(searchValue);

    const matchesFilter = filter === "all" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Dashboard statistics
  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Accepted",
      value: orders.filter((o) => o.status === "accepted").length,
      icon: CheckCircle2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Rejected",
      value: orders.filter((o) => o.status === "rejected").length,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      title: "Cancelled",
      value: orders.filter((o) => o.status === "cancelled").length,
      icon: XCircle,
      color: "text-muted-foreground",
      bg: "bg-stone-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Orders Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and view all platform orders.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
          <ShoppingBag size={16} className="text-orange-400" />
          {orders.length} Total Orders
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon size={18} className={stat.color} />
                </div>

                <span className="text-xl font-bold text-foreground">
                  {stat.value}
                </span>
              </div>

              <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search order, customer or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-orange-500/50"
          />
        </div>

        <div className="relative sm:w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none focus:border-orange-500/50"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="font-semibold text-foreground">All Orders</h2>

          <span className="text-xs text-muted-foreground">
            Showing {filteredOrders.length} orders
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading orders...
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-5 py-4 font-medium">ORDER ID</th>
                    <th className="px-5 py-4 font-medium">CUSTOMER</th>
                    <th className="px-5 py-4 font-medium">VENDOR</th>
                    <th className="px-5 py-4 font-medium">AMOUNT</th>
                    <th className="px-5 py-4 font-medium">STATUS</th>
                    <th className="px-5 py-4 font-medium">DATE</th>
                    <th className="px-5 py-4 font-medium">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-border transition hover:bg-muted/40"
                    >
                      <td className="px-5 py-4">
                        <span className="font-medium text-orange-400">
                          {formatOrderId(order._id)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-muted-foreground">
                          {order.vendorEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-foreground">
                          ${Number(order.totalPrice).toFixed(2)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-orange-500/30 hover:text-orange-400"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-3 lg:hidden">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-orange-400">
                        {formatOrderId(order._id)}
                      </p>

                      <p className="mt-1 text-sm text-foreground">
                        {order.customerName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {order.vendorEmail}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        ${Number(order.totalPrice).toFixed(2)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-sm text-orange-400 transition hover:bg-orange-500/20"
                    >
                      <Eye size={15} />
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="py-16 text-center">
                <ShoppingBag
                  size={35}
                  className="mx-auto mb-3 text-muted-foreground"
                />

                <h3 className="font-medium text-foreground">No orders found</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-5 py-4">
              <div>
                <p className="text-xs text-muted-foreground">Order Details</p>

                <h2 className="mt-1 text-lg font-bold text-foreground">
                  {formatOrderId(selectedOrder._id)}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1.5 text-xs capitalize ${statusStyles[selectedOrder.status]}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer & Vendor */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-2 text-orange-400">
                    <User size={16} />
                    <span className="text-xs font-medium">CUSTOMER</span>
                  </div>

                  <p className="font-medium text-foreground">
                    {selectedOrder.customerName}
                  </p>

                  <p className="mt-1 break-all text-xs text-muted-foreground">
                    {selectedOrder.customerEmail}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-2 text-orange-400">
                    <Store size={16} />
                    <span className="text-xs font-medium">VENDOR</span>
                  </div>

                  <p className="break-all font-medium text-foreground">
                    {selectedOrder.vendorEmail}
                  </p>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="rounded-xl border border-border bg-background p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin size={16} className="text-orange-400" />
                  Delivery Information
                </h3>

                <p className="text-sm text-muted-foreground">
                  {selectedOrder.deliveryAddress}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays size={14} />
                  Order Date: {formatDate(selectedOrder.createdAt)}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays size={14} />
                  Delivery Date: {formatDate(selectedOrder.deliveryDate)}
                </div>
              </div>

              {/* Ordered Item */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  Ordered Items
                </h3>

                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                      <p className="text-sm text-foreground">
                        {selectedOrder.itemName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Quantity: {selectedOrder.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-foreground">
                      $
                      {(
                        Number(selectedOrder.unitPrice) *
                        selectedOrder.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                {selectedOrder.message && (
                  <div className="mt-3 rounded-xl border border-border bg-background p-4">
                    <p className="mb-1 text-xs text-muted-foreground">
                      Customer Message
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/[0.05] p-4">
                <span className="text-sm text-muted-foreground">Total Amount</span>

                <span className="text-xl font-bold text-orange-400">
                  ${Number(selectedOrder.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}