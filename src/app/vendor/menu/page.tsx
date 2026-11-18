"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Package,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from "lucide-react";

const initialItems = [
  {
    id: 1,
    name: "Classic Pepperoni Pizza",
    category: "Classic Pizza",
    price: 18,
    orders: 48,
    status: "Active",
    description: "Classic pizza topped with mozzarella and pepperoni.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
  },
  {
    id: 2,
    name: "Chicken BBQ Pizza",
    category: "Special Pizza",
    price: 22,
    orders: 36,
    status: "Active",
    description: "Delicious BBQ chicken pizza with special sauce.",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500",
  },
  {
    id: 3,
    name: "Margherita Pizza",
    category: "Classic Pizza",
    price: 15,
    orders: 29,
    status: "Active",
    description: "Fresh mozzarella, tomato sauce and basil.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
  },
  {
    id: 4,
    name: "Cheese Burst Pizza",
    category: "Special Pizza",
    price: 25,
    orders: 21,
    status: "Inactive",
    description: "Extra cheesy pizza with a delicious cheese-filled crust.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
  },
  {
    id: 5,
    name: "Veggie Supreme Pizza",
    category: "Vegetarian",
    price: 17,
    orders: 18,
    status: "Active",
    description: "Fresh vegetables with mozzarella and special herbs.",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500",
  },
  {
    id: 6,
    name: "Chicken Sausage Pizza",
    category: "Special Pizza",
    price: 20,
    orders: 14,
    status: "Inactive",
    description: "Tasty chicken sausage with cheese and tomato sauce.",
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500",
  },
];

export default function VendorMenuPage() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    const matchesStatus =
      status === "All" || item.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeItems = items.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveItems = items.filter(
    (item) => item.status === "Inactive"
  ).length;

  const toggleStatus = (id: number) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );

    setShowDeleteId(null);
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-orange-500">Restaurant Management</p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            My Menu Items
          </h1>

          <p className="mt-2 text-sm text-[#A8A29E]">
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
        <div className="rounded-xl border border-[#302824] bg-[#1C1715] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A8A29E]">Total Items</p>
            <Package className="text-orange-500" size={21} />
          </div>

          <h2 className="mt-3 text-3xl font-bold">{items.length}</h2>

          <p className="mt-1 text-xs text-[#78716C]">
            All menu items
          </p>
        </div>

        <div className="rounded-xl border border-[#302824] bg-[#1C1715] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A8A29E]">Active Items</p>
            <CheckCircle2 className="text-green-400" size={21} />
          </div>

          <h2 className="mt-3 text-3xl font-bold">{activeItems}</h2>

          <p className="mt-1 text-xs text-[#78716C]">
            Currently available
          </p>
        </div>

        <div className="rounded-xl border border-[#302824] bg-[#1C1715] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A8A29E]">Inactive Items</p>
            <XCircle className="text-red-400" size={21} />
          </div>

          <h2 className="mt-3 text-3xl font-bold">{inactiveItems}</h2>

          <p className="mt-1 text-xs text-[#78716C]">
            Currently unavailable
          </p>
        </div>
      </section>

      {/* Free Plan Notice */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-semibold">Free Plan Usage</h3>

          <p className="mt-1 text-sm text-[#A8A29E]">
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
      <section className="rounded-xl border border-[#302824] bg-[#1C1715] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]"
            />

            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#302824] bg-[#100D0B] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#78716C] focus:border-orange-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 sm:w-48">
              <SlidersHorizontal
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#302824] bg-[#100D0B] py-3 pl-9 pr-3 text-sm outline-none focus:border-orange-500"
              >
                <option value="All">All Categories</option>
                <option value="Classic Pizza">Classic Pizza</option>
                <option value="Special Pizza">Special Pizza</option>
                <option value="Vegetarian">Vegetarian</option>
              </select>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-[#302824] bg-[#100D0B] px-4 py-3 text-sm outline-none focus:border-orange-500 sm:w-40"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">All Menu Items</h2>
          <p className="mt-1 text-xs text-[#78716C]">
            Showing {filteredItems.length} of {items.length} items
          </p>
        </div>
      </div>

      {/* Menu Cards */}
      {filteredItems.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-[#302824] bg-[#1C1715] transition hover:border-orange-500/40"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    item.status === "Active"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {item.status}
                </span>

                <button
                  className="absolute right-3 top-3 rounded-lg bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/80"
                  title="More options"
                >
                  <MoreVertical size={18} />
                </button>
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
                    ${item.price}
                  </p>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-[#A8A29E]">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-[#302824] pt-4">
                  <div className="flex items-center gap-2 text-xs text-[#A8A29E]">
                    <UtensilsCrossed size={15} />
                    {item.orders} Orders
                  </div>

                  <span className="text-xs text-[#78716C]">
                    Menu Item #{item.id}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-semibold transition ${
                      item.status === "Active"
                        ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                        : "border-green-500/20 text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    {item.status === "Active" ? (
                      <>
                        <EyeOff size={15} />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye size={15} />
                        Activate
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowDeleteId(item.id)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#302824] py-2.5 text-xs font-semibold text-[#A8A29E] transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {showDeleteId === item.id && (
                <div className="border-t border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm font-medium">
                    Delete this menu item?
                  </p>

                  <p className="mt-1 text-xs text-[#A8A29E]">
                    This action cannot be undone.
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-semibold hover:bg-red-600"
                    >
                      Confirm Delete
                    </button>

                    <button
                      onClick={() => setShowDeleteId(null)}
                      className="flex-1 rounded-lg border border-[#302824] py-2 text-xs font-semibold hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-[#302824] bg-[#1C1715] px-5 py-16 text-center">
          <Package size={40} className="mx-auto text-[#78716C]" />

          <h3 className="mt-4 text-lg font-bold">
            No Menu Items Found
          </h3>

          <p className="mt-2 text-sm text-[#A8A29E]">
            Try changing your search or filters.
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
    </div>
  );
}