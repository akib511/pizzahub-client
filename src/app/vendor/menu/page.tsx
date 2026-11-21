"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EditMenuDialog, { type MenuItem } from "./components/EditMenuDialog";

import {
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Loader2,
  Pencil,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface ApiMenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  image: string;
  available: boolean;
  status: string;
  orders?: number;
  vendorEmail: string;
  preparationTime?: number;
}

export default function VendorMenuPage() {
  const { data: session, isPending } = authClient.useSession();

  const vendorEmail = session?.user?.email;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  // Derived: still loading while the session resolves, or while fetching.
  const isLoadingItems = isPending || (loadingItems && !!vendorEmail);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Toast auto hide
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Load vendor menu items
  useEffect(() => {
    if (!vendorEmail) return;

    const loadMenuItems = async () => {
      try {
        setLoadingItems(true);
        setError("");

        const response = await fetch("http://localhost:5000/menu");

        if (!response.ok) {
          throw new Error("Failed to load menu items");
        }

        const data: ApiMenuItem[] = await response.json();

        const vendorItems: MenuItem[] = data
          .filter((item) => item.vendorEmail === vendorEmail)
          .map((item) => ({
            id: String(item._id),
            name: item.name,
            description: item.description,
            category: item.category,
            price: item.price,
            location: item.location,
            image: item.image,
            available: item.available,
            vendorEmail: item.vendorEmail,
            preparationTime: item.preparationTime ?? 0,
            status:
              item.status === "approved"
                ? item.available
                  ? "Active"
                  : "Inactive"
                : "Pending",
            orders: item.orders ?? 0,
          }));

        setItems(vendorItems);
      } catch (error) {
        console.error("Menu loading error:", error);
        setError("Failed to load menu items. Please try again.");
      } finally {
        setLoadingItems(false);
      }
    };

    loadMenuItems();
  }, [vendorEmail, isPending]);

  // Search and filter
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "All" || item.category === category;

    const matchesStatus = status === "All" || item.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeItems = items.filter((item) => item.status === "Active").length;

  const inactiveItems = items.filter(
    (item) => item.status === "Inactive",
  ).length;

  // Update menu item availability
  const toggleStatus = async (id: string) => {
    const selectedItem = items.find((item) => item.id === id);

    if (!selectedItem || selectedItem.status === "Pending") return;

    const newAvailability = !selectedItem.available;

    try {
      setTogglingId(id);

      const response = await fetch(
        `http://localhost:5000/menu/${id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: newAvailability,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update availability");
      }

      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === id
            ? {
                ...item,
                available: newAvailability,
                status: newAvailability ? "Active" : "Inactive",
              }
            : item,
        ),
      );

      setToast({
        message: newAvailability
          ? "Menu item is now available!"
          : "Menu item is now unavailable!",
        type: "success",
      });
    } catch (error) {
      console.error("Availability update error:", error);

      setToast({
        message:
          error instanceof Error ? error.message : "Something went wrong!",
        type: "error",
      });
    } finally {
      setTogglingId(null);
    }
  };

  // Update item after editing
  const handleUpdateItem = (updatedItem: MenuItem) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );

    setEditingItem(null);

    setToast({
      message: "Menu item updated successfully!",
      type: "success",
    });
  };

  // Delete menu item
  const deleteItem = async () => {
    if (!showDeleteId) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `http://localhost:5000/menu/${showDeleteId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete menu item");
      }

      setItems((previousItems) =>
        previousItems.filter((item) => item.id !== showDeleteId),
      );

      setShowDeleteId(null);

      setToast({
        message: "Menu item deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);

      setToast({
        message:
          error instanceof Error ? error.message : "Something went wrong!",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (isLoadingItems) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading menu items...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <h2 className="text-xl font-bold">Please Login</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Login to manage your menu items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7 text-foreground">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border p-4 shadow-2xl ${
            toast.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}

          <p className="flex-1 text-sm font-medium">{toast.message}</p>

          <button
            onClick={() => setToast(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-orange-500">Restaurant Management</p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">My Menu Items</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your food items, prices and availability.
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

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <Package className="text-orange-500" size={21} />
          </div>

          <h2 className="mt-3 text-3xl font-bold">{items.length}</h2>

          <p className="mt-1 text-xs text-muted-foreground">All menu items</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Active Items</p>
            <CheckCircle2 className="text-green-400" size={21} />
          </div>

          <h2 className="mt-3 text-3xl font-bold">{activeItems}</h2>

          <p className="mt-1 text-xs text-muted-foreground">Currently available</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Inactive Items</p>
            <XCircle className="text-red-400" size={21} />
          </div>

          <h2 className="mt-3 text-3xl font-bold">{inactiveItems}</h2>

          <p className="mt-1 text-xs text-muted-foreground">Currently unavailable</p>
        </div>
      </section>

      {/* Free Plan Notice */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-semibold">Free Plan Usage</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            You can have up to 3 active menu items on your Free Plan.
          </p>
        </div>

        <Link
          href="/vendor/subscription"
          className="shrink-0 text-sm font-semibold text-orange-400 hover:text-orange-300"
        >
          Upgrade Plan →
        </Link>
      </section>

      {/* Search and Filters */}
      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-orange-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 sm:w-48">
              <SlidersHorizontal
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-orange-500"
              >
                <option value="All">All Categories</option>
                <option value="Classic Pizzas">Classic Pizzas</option>
                <option value="Vegetarian Pizzas">Vegetarian Pizzas</option>
                <option value="Meat Lovers">Meat Lovers</option>
                <option value="Specialty / Gourmet Pizzas">
                  Specialty / Gourmet Pizzas
                </option>
                <option value="Sides & Appetizers">Sides & Appetizers</option>
                <option value="Beverages & Desserts">
                  Beverages & Desserts
                </option>
              </select>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-orange-500 sm:w-40"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending Approval</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">All Menu Items</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Showing {filteredItems.length} of {items.length} items
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Menu Cards */}
      {filteredItems.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-orange-500/40"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image || ""}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    item.status === "Active"
                      ? "bg-green-500/15 text-green-400"
                      : item.status === "Pending"
                        ? "bg-orange-500/15 text-orange-400"
                        : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs text-orange-400">
                      {item.category}
                    </span>

                    <h3 className="mt-1 truncate text-lg font-bold">
                      {item.name}
                    </h3>
                  </div>

                  <p className="shrink-0 text-lg font-bold text-orange-400">
                    ৳{item.price}
                  </p>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <UtensilsCrossed size={15} />
                    {item.orders} Orders
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Menu Item #{item.id.slice(-5)}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-orange-500/20 py-2.5 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/10"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    disabled={
                      item.status === "Pending" || togglingId === item.id
                    }
                    onClick={() => toggleStatus(item.id)}
                    className={`flex items-center justify-center gap-1 rounded-lg border py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      item.available
                        ? "border-green-500/20 text-green-400 hover:bg-green-500/10"
                        : "border-red-500/20 text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    {togglingId === item.id ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Updating...
                      </>
                    ) : item.available ? (
                      <>
                        <Eye size={14} />
                        On
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} />
                        Off
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowDeleteId(item.id)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-border py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-border bg-card px-5 py-16 text-center">
          <Package size={40} className="mx-auto text-muted-foreground" />

          <h3 className="mt-4 text-lg font-bold">No Menu Items Found</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error
              ? "Unable to load menu items."
              : "Try changing your search or filters."}
          </p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setStatus("All");
            }}
            className="mt-5 text-sm font-semibold text-orange-400 hover:text-orange-300"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Edit Dialog Component */}
      {editingItem && (
        <EditMenuDialog
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleUpdateItem}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Trash2 size={23} />
              </div>

              <button
                disabled={deleting}
                onClick={() => setShowDeleteId(null)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold">Delete Menu Item?</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete this menu item? This action cannot
              be undone and the item will be permanently removed.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                disabled={deleting}
                onClick={() => setShowDeleteId(null)}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={deleteItem}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
