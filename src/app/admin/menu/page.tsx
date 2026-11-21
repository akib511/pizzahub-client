"use client";

import { useState, useEffect } from "react";
import {
  Search,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Check,
  X,
  MapPin,
  Store,
  DollarSign,
  Tag,
  CalendarDays,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

// Menu Item Type
interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  location: string;
  vendor: string;
  vendorEmail: string;
  status: "Pending" | "Approved" | "Rejected";
  submitted: string;
  available: boolean;
}

// API Response Type
interface ApiMenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  location: string;
  vendorName?: string;
  vendorEmail: string;
  status?: string;
  available?: boolean;
  createdAt?: string;
}

// Stat Card Props
interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "orange" | "green" | "blue" | "red";
}

// Detail Item Props
interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  // Show Toast
  const showToast = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch Menu Items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }

        const data: ApiMenuItem[] = await response.json();

        const formattedItems: MenuItem[] = data.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          image: item.image,
          location: item.location,
          vendor: item.vendorName || item.vendorEmail,
          vendorEmail: item.vendorEmail,

          status:
            item.status?.toLowerCase() === "approved"
              ? "Approved"
              : item.status?.toLowerCase() === "rejected"
                ? "Rejected"
                : "Pending",

          available: item.available ?? false,

          submitted: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "Recently",
        }));

        setItems(formattedItems);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Search and Filter
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Statistics
  const pendingCount = items.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = items.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = items.filter(
    (item) => item.status === "Rejected"
  ).length;

  // Update Menu Status
  const updateStatus = async (
    id: string,
    status: MenuItem["status"]
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/menu/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status.toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update menu status");
      }

      const updatedStatus: MenuItem["status"] = status;

      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updatedStatus,
                available: data.available ?? false,
              }
            : item
        )
      );

      setSelectedItem((previousItem) =>
        previousItem?.id === id
          ? {
              ...previousItem,
              status: updatedStatus,
              available: data.available ?? false,
            }
          : previousItem
      );

      showToast(
        data.limitReached
          ? "Menu approved, but remains inactive. Vendor needs Premium."
          : data.message,
        data.limitReached ? "warning" : "success"
      );

      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to update menu status:", error);

      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading menu items...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-xl ${
            toast.type === "success"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : toast.type === "warning"
                ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-orange-400">
            <UtensilsCrossed size={14} />
            MENU MODERATION
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Menu Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Review food listings and manage menu approvals.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.04] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Clock size={19} />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Awaiting Review</p>
            <p className="text-xl font-bold text-foreground">
              {pendingCount} Items
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          title="Total Items"
          value={items.length}
          icon={UtensilsCrossed}
          color="orange"
        />

        <StatCard
          title="Pending Review"
          value={pendingCount}
          icon={Clock}
          color="blue"
        />

        <StatCard
          title="Approved Items"
          value={approvedCount}
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          title="Rejected Items"
          value={rejectedCount}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.04] p-4">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-orange-400"
          />

          <div>
            <p className="text-sm font-medium text-foreground">
              {pendingCount} menu items need your attention
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Review the submitted items and approve or reject them.
              Approved items become eligible to appear on the customer menu.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Menu Items
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {filteredItems.length} items found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 sm:w-64">
                <Search size={16} className="text-muted-foreground" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item or vendor..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Classic Pizzas">Classic Pizzas</option>
                <option value="Vegetarian Pizzas">Vegetarian Pizzas</option>
                <option value="Meat Lovers">Meat Lovers</option>
                <option value="Specialty / Gourmet Pizzas">
                  Specialty / Gourmet Pizzas
                </option>
                <option value="Sides & Appetizers">
                  Sides & Appetizers
                </option>
                <option value="Beverages & Desserts">
                  Beverages & Desserts
                </option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-orange-500 text-white"
                    : "border border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                {status}

                {status === "Pending" && pendingCount > 0 && (
                  <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-border bg-background transition hover:border-orange-500/20"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                <div className="absolute left-3 top-3">
                  <MenuStatus status={item.status} />
                </div>

                {/* Availability Status */}
                {item.status === "Approved" && (
                  <span
                    className={`absolute left-3 top-12 rounded-md px-2 py-1 text-[10px] font-medium ${
                      item.available
                        ? "bg-green-500/15 text-green-400"
                        : "bg-muted text-foreground/70"
                    }`}
                  >
                    {item.available ? "Active" : "Inactive"}
                  </span>
                )}

                <div className="absolute right-3 top-3 rounded-lg border border-border bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
                  ৳{item.price.toFixed(2)}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-foreground/60">
                    {item.category}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Vendor */}
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    <Store size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">
                      {item.vendor}
                    </p>

                    <p className="truncate text-[10px] text-muted-foreground">
                      Vendor
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={13} />
                  {item.location}
                </div>

                {/* Submitted */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays size={13} />
                  Submitted {item.submitted}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Eye size={14} />
                    View Details
                  </button>

                  {item.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, "Approved")}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-500/15 bg-green-500/10 text-green-400 transition hover:bg-green-500/20"
                        title="Approve"
                      >
                        <Check size={15} />
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "Rejected")}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/15 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                        title="Reject"
                      >
                        <X size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && <EmptyState />}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">

            {/* Image */}
            <div className="relative h-52">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex flex-wrap items-center gap-2">
                  <MenuStatus status={selectedItem.status} />

                  {/* Availability Status */}
                  {selectedItem.status === "Approved" && (
                    <span
                      className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-medium ${
                        selectedItem.available
                          ? "border-green-500/15 bg-green-500/10 text-green-400"
                          : "border-border bg-muted text-foreground/60"
                      }`}
                    >
                      {selectedItem.available ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  {selectedItem.name}
                </h2>

                <p className="mt-1 text-sm text-foreground/70">
                  {selectedItem.category}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-foreground">
                  {selectedItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailItem
                  icon={DollarSign}
                  label="Price"
                  value={`৳${selectedItem.price.toFixed(2)}`}
                />

                <DetailItem
                  icon={Tag}
                  label="Category"
                  value={selectedItem.category}
                />

                <DetailItem
                  icon={Store}
                  label="Vendor"
                  value={selectedItem.vendor}
                />

                <DetailItem
                  icon={MapPin}
                  label="Location"
                  value={selectedItem.location}
                />
              </div>

              {/* Vendor Info */}
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">
                  Submitted By
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedItem.vendor}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedItem.vendorEmail}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Submitted on {selectedItem.submitted}
                </p>
              </div>

              {/* Review Actions */}
              {selectedItem.status === "Pending" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      updateStatus(selectedItem.id, "Approved")
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 py-3 text-sm font-semibold text-green-400 transition hover:bg-green-500/20"
                  >
                    <CheckCircle2 size={16} />
                    Approve Item
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(selectedItem.id, "Rejected")
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    <XCircle size={16} />
                    Reject Item
                  </button>
                </div>
              )}

              {selectedItem.status === "Approved" && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/10 bg-green-500/[0.04] py-3 text-sm text-green-400">
                  <CheckCircle2 size={16} />
                  This item has been approved.
                </div>
              )}

              {selectedItem.status === "Rejected" && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.04] py-3 text-sm text-red-400">
                  <XCircle size={16} />
                  This item has been rejected.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Statistics Card
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  const styles: Record<StatCardProps["color"], string> = {
    orange: "bg-orange-500/10 text-orange-400",
    green: "bg-green-500/10 text-green-400",
    blue: "bg-blue-500/10 text-blue-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 transition hover:border-border sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[color]}`}
      >
        <Icon size={19} />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {title}
      </p>

      <h3 className="mt-1 text-2xl font-bold text-foreground">
        {value.toLocaleString()}
      </h3>
    </div>
  );
}

// Status Badge
function MenuStatus({ status }: { status: MenuItem["status"] }) {
  const styles: Record<MenuItem["status"], string> = {
    Approved: "bg-green-500/10 text-green-400 border-green-500/15",
    Pending: "bg-orange-500/10 text-orange-400 border-orange-500/15",
    Rejected: "bg-red-500/10 text-red-400 border-red-500/15",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-medium backdrop-blur-md ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// Detail Item
function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
      <Icon size={16} className="shrink-0 text-orange-400" />

      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
        <Search size={20} className="text-muted-foreground" />
      </div>

      <p className="mt-3 text-sm font-medium text-foreground">
        No menu items found
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Try changing your search or filters.
      </p>
    </div>
  );
}