"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ShoppingBag,
  ChevronDown,
  MapPin,
  CalendarDays,
  User,
  Store,
  Phone,
  X,
  ArrowUpRight,
} from "lucide-react";

const initialOrders = [
  {
    id: "ORD-1001",
    customer: "Rahim Ahmed",
    customerEmail: "rahim@gmail.com",
    vendor: "Pizza Palace",
    vendorEmail: "pizza@gmail.com",
    items: [
      { name: "Pepperoni Pizza", quantity: 2, price: 18 },
      { name: "Garlic Bread", quantity: 1, price: 5 },
    ],
    total: 41,
    status: "pending",
    payment: "Paid",
    date: "Nov 19, 2026",
    address: "Dhanmondi, Dhaka, Bangladesh",
    phone: "+880 1712-345678",
  },
  {
    id: "ORD-1002",
    customer: "Sadia Islam",
    customerEmail: "sadia@gmail.com",
    vendor: "Italian Corner",
    vendorEmail: "italian@gmail.com",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 15 },
      { name: "Coke", quantity: 2, price: 3 },
    ],
    total: 21,
    status: "processing",
    payment: "Paid",
    date: "Nov 18, 2026",
    address: "Banani, Dhaka, Bangladesh",
    phone: "+880 1812-456789",
  },
  {
    id: "ORD-1003",
    customer: "Tanvir Hasan",
    customerEmail: "tanvir@gmail.com",
    vendor: "Pizza Palace",
    vendorEmail: "pizza@gmail.com",
    items: [
      { name: "BBQ Chicken Pizza", quantity: 2, price: 20 },
    ],
    total: 40,
    status: "delivered",
    payment: "Paid",
    date: "Nov 18, 2026",
    address: "Uttara, Dhaka, Bangladesh",
    phone: "+880 1912-567890",
  },
  {
    id: "ORD-1004",
    customer: "Nusrat Jahan",
    customerEmail: "nusrat@gmail.com",
    vendor: "Pizza House",
    vendorEmail: "house@gmail.com",
    items: [
      { name: "Four Cheese Pizza", quantity: 1, price: 22 },
      { name: "French Fries", quantity: 1, price: 6 },
    ],
    total: 28,
    status: "cancelled",
    payment: "Refunded",
    date: "Nov 17, 2026",
    address: "Mirpur, Dhaka, Bangladesh",
    phone: "+880 1612-678901",
  },
  {
    id: "ORD-1005",
    customer: "Fahim Rahman",
    customerEmail: "fahim@gmail.com",
    vendor: "Italian Corner",
    vendorEmail: "italian@gmail.com",
    items: [
      { name: "Spicy Beef Pizza", quantity: 1, price: 19 },
      { name: "Coke", quantity: 1, price: 3 },
    ],
    total: 22,
    status: "pending",
    payment: "Paid",
    date: "Nov 17, 2026",
    address: "Mohammadpur, Dhaka, Bangladesh",
    phone: "+880 1512-789012",
  },
  {
    id: "ORD-1006",
    customer: "Mehedi Hasan",
    customerEmail: "mehedi@gmail.com",
    vendor: "Pizza House",
    vendorEmail: "house@gmail.com",
    items: [
      { name: "Veggie Garden Pizza", quantity: 2, price: 16 },
    ],
    total: 32,
    status: "processing",
    payment: "Paid",
    date: "Nov 16, 2026",
    address: "Gulshan, Dhaka, Bangladesh",
    phone: "+880 1312-890123",
  },
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.vendor.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );

    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

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
      title: "Processing",
      value: orders.filter((o) => o.status === "processing").length,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Cancelled",
      value: orders.filter((o) => o.status === "cancelled").length,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Orders Management
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Monitor and manage all platform orders.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#1C1715] px-4 py-2.5 text-sm text-stone-300">
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
              className="rounded-xl border border-white/[0.06] bg-[#1C1715] p-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon size={18} className={stat.color} />
                </div>

                <span className="text-xl font-bold text-white">
                  {stat.value}
                </span>
              </div>

              <p className="mt-3 text-xs text-stone-400 sm:text-sm">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#1C1715] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
          />

          <input
            type="text"
            placeholder="Search order, customer or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.07] bg-[#100D0B] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-orange-500/50"
          />
        </div>

        <div className="relative sm:w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-white/[0.07] bg-[#100D0B] px-3 py-2.5 text-sm text-stone-300 outline-none focus:border-orange-500/50"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#1C1715]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
          <h2 className="font-semibold text-white">All Orders</h2>

          <span className="text-xs text-stone-500">
            Showing {filteredOrders.length} orders
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-stone-500">
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
                  key={order.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-orange-400">
                      {order.id}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">
                      {order.customer}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {order.customerEmail}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-stone-300">{order.vendor}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-stone-400">
                    {order.date}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] px-3 py-2 text-xs text-stone-300 transition hover:border-orange-500/30 hover:text-orange-400"
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
              key={order.id}
              className="rounded-xl border border-white/[0.06] bg-[#100D0B] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-orange-400">{order.id}</p>
                  <p className="mt-1 text-sm text-white">{order.customer}</p>
                  <p className="text-xs text-stone-500">{order.vendor}</p>
                </div>

                <span
                  className={`rounded-full border px-2 py-1 text-[10px] capitalize ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <div>
                  <p className="text-lg font-bold text-white">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-stone-500">{order.date}</p>
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
              className="mx-auto mb-3 text-stone-600"
            />
            <h3 className="font-medium text-white">No orders found</h3>
            <p className="mt-1 text-sm text-stone-500">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#1C1715] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-[#1C1715] px-5 py-4">
              <div>
                <p className="text-xs text-stone-500">Order Details</p>
                <h2 className="mt-1 text-lg font-bold text-white">
                  {selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Status & Payment */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1.5 text-xs capitalize ${statusStyles[selectedOrder.status]}`}
                >
                  {selectedOrder.status}
                </span>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                  Payment: {selectedOrder.payment}
                </span>
              </div>

              {/* Customer & Vendor */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.06] bg-[#100D0B] p-4">
                  <div className="mb-3 flex items-center gap-2 text-orange-400">
                    <User size={16} />
                    <span className="text-xs font-medium">CUSTOMER</span>
                  </div>

                  <p className="font-medium text-white">
                    {selectedOrder.customer}
                  </p>

                  <p className="mt-1 break-all text-xs text-stone-500">
                    {selectedOrder.customerEmail}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-stone-400">
                    <Phone size={13} />
                    {selectedOrder.phone}
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#100D0B] p-4">
                  <div className="mb-3 flex items-center gap-2 text-orange-400">
                    <Store size={16} />
                    <span className="text-xs font-medium">VENDOR</span>
                  </div>

                  <p className="font-medium text-white">
                    {selectedOrder.vendor}
                  </p>

                  <p className="mt-1 break-all text-xs text-stone-500">
                    {selectedOrder.vendorEmail}
                  </p>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="rounded-xl border border-white/[0.06] bg-[#100D0B] p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                  <MapPin size={16} className="text-orange-400" />
                  Delivery Information
                </h3>

                <p className="text-sm text-stone-300">
                  {selectedOrder.address}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                  <CalendarDays size={14} />
                  Order Date: {selectedOrder.date}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-white">
                  Ordered Items
                </h3>

                <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-white">{item.name}</p>
                        <p className="mt-1 text-xs text-stone-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-medium text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/[0.05] p-4">
                <span className="text-sm text-stone-300">Total Amount</span>
                <span className="text-xl font-bold text-orange-400">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-white">
                  Update Order Status
                </h3>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    "pending",
                    "processing",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateStatus(selectedOrder.id, status)
                      }
                      disabled={selectedOrder.status === status}
                      className={`rounded-lg border px-3 py-2 text-xs capitalize transition ${
                        selectedOrder.status === status
                          ? `${statusStyles[status]} cursor-default`
                          : "border-white/[0.06] bg-[#100D0B] text-stone-400 hover:border-orange-500/30 hover:text-orange-400"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] p-4">
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