"use client";

import { useState } from "react";
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
  Filter,
} from "lucide-react";

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

const initialOrders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Rahim Ahmed",
    customerEmail: "rahim@example.com",
    customerPhone: "+880 1712-345678",
    itemName: "Pepperoni Pizza",
    quantity: 2,
    price: 24,
    orderDate: "Nov 19, 2026",
    deliveryDate: "Nov 20, 2026",
    deliveryAddress: "House 12, Road 5, Dhanmondi, Dhaka",
    message: "Please make the pizza extra spicy.",
    status: "pending",
  },
  {
    id: "ORD-1002",
    customerName: "Sadia Islam",
    customerEmail: "sadia@example.com",
    customerPhone: "+880 1812-456789",
    itemName: "Margherita Pizza",
    quantity: 1,
    price: 15,
    orderDate: "Nov 18, 2026",
    deliveryDate: "Nov 19, 2026",
    deliveryAddress: "Mirpur 10, Dhaka",
    message: "Please deliver before 7 PM.",
    status: "accepted",
  },
  {
    id: "ORD-1003",
    customerName: "Tanvir Hasan",
    customerEmail: "tanvir@example.com",
    customerPhone: "+880 1912-567890",
    itemName: "BBQ Chicken Pizza",
    quantity: 3,
    price: 36,
    orderDate: "Nov 18, 2026",
    deliveryDate: "Nov 21, 2026",
    deliveryAddress: "Uttara Sector 7, Dhaka",
    message: "No onions please.",
    status: "pending",
  },
  {
    id: "ORD-1004",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat@example.com",
    customerPhone: "+880 1612-678901",
    itemName: "Cheese Burst Pizza",
    quantity: 1,
    price: 18,
    orderDate: "Nov 17, 2026",
    deliveryDate: "Nov 18, 2026",
    deliveryAddress: "Banani, Dhaka",
    message: "Extra cheese would be great!",
    status: "rejected",
  },
  {
    id: "ORD-1005",
    customerName: "Mehedi Hasan",
    customerEmail: "mehedi@example.com",
    customerPhone: "+880 1512-789012",
    itemName: "Chicken Supreme Pizza",
    quantity: 2,
    price: 30,
    orderDate: "Nov 17, 2026",
    deliveryDate: "Nov 20, 2026",
    deliveryAddress: "Mohammadpur, Dhaka",
    message: "Call me when the order is ready.",
    status: "accepted",
  },
  {
    id: "ORD-1006",
    customerName: "Ayesha Rahman",
    customerEmail: "ayesha@example.com",
    customerPhone: "+880 1312-890123",
    itemName: "Veggie Delight Pizza",
    quantity: 1,
    price: 16,
    orderDate: "Nov 16, 2026",
    deliveryDate: "Nov 19, 2026",
    deliveryAddress: "Gulshan 2, Dhaka",
    message: "Less spicy please.",
    status: "pending",
  },
];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.itemName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "all" || order.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const acceptedCount = orders.filter(
    (order) => order.status === "accepted"
  ).length;

  const rejectedCount = orders.filter(
    (order) => order.status === "rejected"
  ).length;

  const handleStatusChange = (
    orderId: string,
    status: "accepted" | "rejected"
  ) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId && order.status === "pending"
          ? { ...order, status }
          : order
      )
    );

    setSelectedOrder(null);
  };

  const statusStyle = (status: Order["status"]) => {
    if (status === "accepted") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (status === "rejected") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  };

  const statusIcon = (status: Order["status"]) => {
    if (status === "accepted") return <CheckCircle2 size={14} />;
    if (status === "rejected") return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Customer Orders
          </h1>

          <p className="mt-2 text-sm text-[#A8A29E]">
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
        <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A8A29E]">Total Orders</p>

            <ShoppingBag size={18} className="text-orange-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-white">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A8A29E]">Pending</p>

            <Clock size={18} className="text-orange-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-orange-400">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A8A29E]">Accepted</p>

            <CheckCircle2 size={18} className="text-green-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-green-400">
            {acceptedCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A8A29E]">Rejected</p>

            <XCircle size={18} className="text-red-400" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-red-400">
            {rejectedCount}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]"
            />

            <input
              type="text"
              placeholder="Search customer, order or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#100D0B] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#78716C] focus:border-orange-500/50"
            />
          </div>

          {/* Filters */}
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
                    : "border border-white/[0.06] bg-[#100D0B] text-[#A8A29E] hover:text-white"
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
              className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1C1715] transition hover:border-orange-500/20"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10">
                    <ShoppingBag
                      size={20}
                      className="text-orange-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {order.id}
                    </h3>

                    <p className="mt-1 text-xs text-[#78716C]">
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
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Customer Information
                  </p>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                      <User size={18} className="text-[#A8A29E]" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-white">
                        {order.customerName}
                      </p>

                      <p className="mt-1 break-all text-sm text-[#A8A29E]">
                        {order.customerEmail}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#A8A29E]">
                        <Phone size={13} />
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Item */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Ordered Item
                  </p>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-white">
                        {order.itemName}
                      </h4>

                      <p className="mt-1 text-sm text-[#A8A29E]">
                        Quantity: {order.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-400">
                        ${order.price}
                      </p>

                      <p className="text-xs text-[#78716C]">
                        Total price
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Delivery Information
                  </p>

                  <div className="space-y-2">
                    <p className="flex items-start gap-2 text-sm text-[#D6D3D1]">
                      <CalendarDays
                        size={15}
                        className="mt-0.5 shrink-0 text-orange-400"
                      />

                      <span>
                        Delivery Date: {order.deliveryDate}
                      </span>
                    </p>

                    <p className="flex items-start gap-2 text-sm text-[#D6D3D1]">
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
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Customer Message
                  </p>

                  <div className="flex items-start gap-2 rounded-xl bg-[#100D0B] p-3">
                    <MessageSquare
                      size={15}
                      className="mt-0.5 shrink-0 text-orange-400"
                    />

                    <p className="text-sm text-[#A8A29E]">
                      {order.message || "No special instructions."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-[#A8A29E] transition hover:text-white"
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
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(order.id, "accepted")
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                    >
                      <CheckCircle2 size={16} />
                      Accept Order
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#78716C]">
                    This order has already been {order.status}.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-white/[0.06] bg-[#1C1715] px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Package size={28} className="text-[#78716C]" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              No Orders Found
            </h3>

            <p className="mt-2 text-sm text-[#A8A29E]">
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
            className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#1C1715] p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Order Details
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-[#A8A29E] transition hover:bg-white/[0.05] hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-[#100D0B] p-4">
                <p className="text-xs text-[#78716C]">Order ID</p>

                <p className="mt-1 font-semibold text-white">
                  {selectedOrder.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#78716C]">Customer</p>

                <p className="mt-1 font-medium text-white">
                  {selectedOrder.customerName}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#78716C]">Item</p>

                <p className="mt-1 font-medium text-white">
                  {selectedOrder.itemName} × {selectedOrder.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#78716C]">Total</p>

                <p className="mt-1 text-xl font-bold text-orange-400">
                  ${selectedOrder.price}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#78716C]">
                  Delivery Address
                </p>

                <p className="mt-1 text-sm text-white">
                  {selectedOrder.deliveryAddress}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#78716C]">
                  Customer Message
                </p>

                <p className="mt-1 text-sm text-white">
                  {selectedOrder.message || "No message"}
                </p>
              </div>
            </div>

            {selectedOrder.status === "pending" && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    handleStatusChange(selectedOrder.id, "rejected")
                  }
                  className="rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  Reject Order
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(selectedOrder.id, "accepted")
                  }
                  className="rounded-xl bg-orange-500 py-3 text-sm font-medium text-white transition hover:bg-orange-600"
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