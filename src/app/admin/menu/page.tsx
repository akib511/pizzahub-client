"use client";

import { useState } from "react";
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
} from "lucide-react";

const menuData = [
  {
    id: 1,
    name: "Pepperoni Feast",
    category: "Classic Pizza",
    vendor: "Bella Italia",
    vendorEmail: "james.wilson@gmail.com",
    price: 18.99,
    status: "Pending",
    availability: true,
    location: "New York, USA",
    submitted: "Nov 18, 2026",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    description:
      "Loaded with premium pepperoni, mozzarella cheese and our signature tomato sauce on a crispy golden crust.",
  },
  {
    id: 2,
    name: "BBQ Chicken Pizza",
    category: "Chicken Pizza",
    vendor: "Urban Pizza",
    vendorEmail: "michael.brown@gmail.com",
    price: 21.5,
    status: "Approved",
    availability: true,
    location: "Chicago, USA",
    submitted: "Nov 17, 2026",
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80",
    description:
      "Smoky BBQ sauce, grilled chicken, red onions and melted mozzarella cheese.",
  },
  {
    id: 3,
    name: "Margherita Supreme",
    category: "Vegetarian",
    vendor: "The Food Corner",
    vendorEmail: "sophia.johnson@gmail.com",
    price: 15.99,
    status: "Pending",
    availability: true,
    location: "Los Angeles, USA",
    submitted: "Nov 17, 2026",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    description:
      "Fresh basil, mozzarella, juicy tomatoes and a drizzle of extra virgin olive oil.",
  },
  {
    id: 4,
    name: "Spicy Beef Delight",
    category: "Special Pizza",
    vendor: "Fire Crust",
    vendorEmail: "david.miller@gmail.com",
    price: 24.99,
    status: "Rejected",
    availability: false,
    location: "Miami, USA",
    submitted: "Nov 16, 2026",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    description:
      "Spicy beef, jalapeños, bell peppers and a rich blend of hot sauces.",
  },
  {
    id: 5,
    name: "Four Cheese Pizza",
    category: "Classic Pizza",
    vendor: "Slice House",
    vendorEmail: "daniel.smith@gmail.com",
    price: 19.99,
    status: "Approved",
    availability: true,
    location: "Houston, USA",
    submitted: "Nov 15, 2026",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
    description:
      "A delicious combination of mozzarella, cheddar, parmesan and blue cheese.",
  },
  {
    id: 6,
    name: "Veggie Garden",
    category: "Vegetarian",
    vendor: "Cheesy Bites",
    vendorEmail: "robert.taylor@gmail.com",
    price: 16.5,
    status: "Pending",
    availability: true,
    location: "Dallas, USA",
    submitted: "Nov 14, 2026",
    image:
      "https://images.unsplash.com/photo-1548369937-4759db6a6b3c?auto=format&fit=crop&w=800&q=80",
    description:
      "Fresh mushrooms, olives, onions, bell peppers and sweet corn with mozzarella.",
  },
];

export default function AdminMenuPage() {
  const [items, setItems] = useState(menuData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null);

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

  const pendingCount = items.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = items.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = items.filter(
    (item) => item.status === "Rejected"
  ).length;

  const updateStatus = (id: number, status: string) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedItem(null);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-orange-400">
            <UtensilsCrossed size={14} />
            MENU MODERATION
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Menu Management
          </h1>

          <p className="mt-1 text-sm text-[#A8A29E]">
            Review food listings and manage menu approvals.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.04] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Clock size={19} />
          </div>

          <div>
            <p className="text-xs text-[#A8A29E]">Awaiting Review</p>
            <p className="text-xl font-bold text-white">
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
            <p className="text-sm font-medium text-white">
              {pendingCount} menu items need your attention
            </p>

            <p className="mt-1 text-xs text-[#A8A29E]">
              Review the submitted items and approve or reject them.
              Approved items become eligible to appear on the customer menu.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#15110F]">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Menu Items
              </h2>

              <p className="mt-1 text-xs text-[#78716C]">
                {filteredItems.length} items found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0D0A09] px-3 py-2.5 sm:w-64">
                <Search size={16} className="text-[#78716C]" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item or vendor..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#57534E]"
                />
              </div>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-white/[0.07] bg-[#0D0A09] px-3 py-2.5 text-sm text-white outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Classic Pizza">Classic Pizza</option>
                <option value="Chicken Pizza">Chicken Pizza</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Special Pizza">Special Pizza</option>
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
                    : "border border-white/[0.07] bg-white/[0.02] text-[#A8A29E] hover:bg-white/[0.05]"
                }`}
              >
                {status}
                {status === "Pending" && pendingCount > 0 && (
                  <span className="ml-2 rounded-full bg-white/15 px-1.5 py-0.5">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0A09] transition hover:border-orange-500/20"
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

                <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
                  ${item.price.toFixed(2)}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-white/60">
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
                    <p className="truncate text-xs font-medium text-white">
                      {item.vendor}
                    </p>

                    <p className="truncate text-[10px] text-[#78716C]">
                      Vendor
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#78716C]">
                  <MapPin size={13} />
                  {item.location}
                </div>

                {/* Submitted */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#78716C]">
                  <CalendarDays size={13} />
                  Submitted {item.submitted}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] py-2.5 text-xs font-medium text-[#A8A29E] transition hover:bg-white/[0.06] hover:text-white"
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
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#181310] shadow-2xl">
            {/* Image */}
            <div className="relative h-52">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#181310] to-transparent" />

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <MenuStatus status={selectedItem.status} />

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {selectedItem.name}
                </h2>

                <p className="mt-1 text-sm text-white/70">
                  {selectedItem.category}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <p className="text-xs text-[#78716C]">Description</p>

                <p className="mt-2 text-sm leading-6 text-[#D6D3D1]">
                  {selectedItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailItem
                  icon={DollarSign}
                  label="Price"
                  value={`$${selectedItem.price.toFixed(2)}`}
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
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <p className="text-xs text-[#78716C]">
                  Submitted By
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {selectedItem.vendor}
                </p>

                <p className="mt-1 text-xs text-[#A8A29E]">
                  {selectedItem.vendorEmail}
                </p>

                <p className="mt-2 text-xs text-[#78716C]">
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

/* Stats Card */
function StatCard({ title, value, icon: Icon, color }: any) {
  const styles: any = {
    orange: "bg-orange-500/10 text-orange-400",
    green: "bg-green-500/10 text-green-400",
    blue: "bg-blue-500/10 text-blue-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#15110F] p-4 transition hover:border-white/[0.1] sm:p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[color]}`}>
        <Icon size={19} />
      </div>

      <p className="mt-4 text-xs text-[#A8A29E]">{title}</p>

      <h3 className="mt-1 text-2xl font-bold text-white">
        {value.toLocaleString()}
      </h3>
    </div>
  );
}

/* Status Badge */
function MenuStatus({ status }: { status: string }) {
  const styles: any = {
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

/* Detail Item */
function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <Icon size={16} className="shrink-0 text-orange-400" />

      <div className="min-w-0">
        <p className="text-[10px] text-[#78716C]">{label}</p>

        <p className="mt-1 truncate text-xs font-medium text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* Empty State */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03]">
        <Search size={20} className="text-[#78716C]" />
      </div>

      <p className="mt-3 text-sm font-medium text-white">
        No menu items found
      </p>

      <p className="mt-1 text-xs text-[#78716C]">
        Try changing your search or filters.
      </p>
    </div>
  );
}