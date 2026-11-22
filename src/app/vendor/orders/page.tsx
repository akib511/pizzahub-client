"use client";

import { apiFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  CalendarDays,
  Phone,
  User,
  ShoppingBag,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
  quantity: number;
  price: number;
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
}

export default function VendorOrdersPage() {
  const { data: session, isPending } = authClient.useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch Vendor Orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (isPending) return;

      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await apiFetch(
          `http://localhost:5000/orders/vendor/${encodeURIComponent(
            session.user.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vendor orders");
        }

        const data = await response.json();

        const formattedOrders: Order[] = data.map(
          (order: {
            _id: string;
            customerName: string;
            customerEmail: string;
            itemName: string;
            quantity: number;
            totalPrice: number;
            createdAt: string;
            deliveryDate: string;
            deliveryAddress: string;
            message?: string;
            status: "pending" | "accepted" | "rejected";
          }) => ({
            id: order._id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: "N/A",
            itemName: order.itemName,
            quantity: order.quantity,
            price: order.totalPrice,

            orderDate: new Date(order.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),

            deliveryDate: new Date(order.deliveryDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),

            deliveryAddress: order.deliveryAddress,
            message: order.message || "",
            status: order.status,
          })
        );

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to fetch vendor orders:", error);
        toast.error("Failed to load customer orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.email, isPending]);

  // Search and Filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.itemName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "all" || order.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Statistics
  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedCount = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const rejectedCount = orders.filter(
    (order) => order.status === "rejected"
  ).length;

  // Update Order Status
  const handleStatusChange = async (
    orderId: string,
    status: "accepted" | "rejected"
  ) => {
    if (!session?.user?.email || updating) return;

    try {
      setUpdating(true);

      const response = await apiFetch(
        `http://localhost:5000/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorEmail: session.user.email,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      setSelectedOrder(null);

      toast.success(`Order ${status} successfully!`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Status Style
  const statusStyle = (status: Order["status"]) => {
    if (status === "accepted") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (status === "rejected") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  };

  // Status Icon
  const statusIcon = (status: Order["status"]) => {
    if (status === "accepted") return <CheckCircle2 size={14} />;
    if (status === "rejected") return <XCircle size={14} />;

    return <Clock size={14} />;
  };

  // Loading
  if (loading || isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />

          <p className="text-sm text-muted-foreground">
            Loading customer orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Customer Orders
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage and track all your customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3">
          <Package size={18} className="text-orange-400" />

          <span className="text-sm font-medium text-orange-400">
            {pendingCount} Pending Orders
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <ShoppingBag size={18} className="text-orange-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-foreground">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending</p>
            <Clock size={18} className="text-orange-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-orange-400">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <CheckCircle2 size={18} className="text-green-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-green-400">
            {acceptedCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <XCircle size={18} className="text-red-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-red-400">
            {rejectedCount}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search customer, order or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-orange-500/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              { label: "All Orders", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Accepted", value: "accepted" },
              { label: "Rejected", value: "rejected" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  activeFilter === filter.value
                    ? "bg-orange-500 text-white"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-border bg-card transition hover:border-orange-500/20"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10">
                    <ShoppingBag size={20} className="text-orange-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      {order.id}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Ordered {order.orderDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${statusStyle(
                    order.status
                  )}`}
                >
                  {statusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              {/* Order Details */}
              <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
                {/* Customer */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer Information
                  </p>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User size={18} className="text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {order.customerName}
                      </p>

                      <p className="mt-1 break-all text-sm text-muted-foreground">
                        {order.customerEmail}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone size={13} />
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Item */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ordered Item
                  </p>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {order.itemName}
                      </h4>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Quantity: {order.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-400">
                        ৳{order.price}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Total price
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Delivery Information
                  </p>

                  <div className="space-y-2">
                    <p className="flex items-start gap-2 text-sm text-foreground">
                      <CalendarDays
                        size={15}
                        className="mt-0.5 shrink-0 text-orange-400"
                      />

                      <span>
                        Delivery Date: {order.deliveryDate}
                      </span>
                    </p>

                    <p className="flex items-start gap-2 text-sm text-foreground">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-orange-400"
                      />

                      <span>{order.deliveryAddress}</span>
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer Message
                  </p>

                  <div className="flex items-start gap-2 rounded-xl bg-background p-3">
                    <MessageSquare
                      size={15}
                      className="mt-0.5 shrink-0 text-orange-400"
                    />

                    <p className="text-sm text-muted-foreground">
                      {order.message || "No special instructions."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  View Order Details
                  <ArrowRight size={15} />
                </button>

                {order.status === "pending" ? (
                  <div className="grid grid-cols-2 gap-2 sm:flex">
                    <button
                      onClick={() =>
                        handleStatusChange(order.id, "rejected")
                      }
                      disabled={updating}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(order.id, "accepted")
                      }
                      disabled={updating}
                      className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                    >
                      <CheckCircle2 size={16} />
                      Accept Order
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This order has already been {order.status}.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-border bg-card px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
              <Package size={28} className="text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No Orders Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              No orders match your search or selected filter.
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Order Details
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-background p-4">
                <p className="text-xs text-muted-foreground">Order ID</p>

                <p className="mt-1 break-all font-semibold text-foreground">
                  {selectedOrder.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Customer</p>

                <p className="mt-1 font-medium text-foreground">
                  {selectedOrder.customerName}
                </p>

                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {selectedOrder.customerEmail}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Item</p>

                <p className="mt-1 font-medium text-foreground">
                  {selectedOrder.itemName} × {selectedOrder.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total</p>

                <p className="mt-1 text-xl font-bold text-orange-400">
                  ৳{selectedOrder.price}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Delivery Address
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {selectedOrder.deliveryAddress}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Customer Message
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {selectedOrder.message || "No message"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>

                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${statusStyle(
                    selectedOrder.status
                  )}`}
                >
                  {statusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {selectedOrder.status === "pending" && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    handleStatusChange(selectedOrder.id, "rejected")
                  }
                  disabled={updating}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  Reject Order
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(selectedOrder.id, "accepted")
                  }
                  disabled={updating}
                  className="rounded-xl bg-orange-500 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  Accept Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}