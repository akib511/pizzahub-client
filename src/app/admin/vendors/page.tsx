"use client";

import { useState } from "react";
import {
  Search,
  Store,
  CheckCircle2,
  Clock,
  Crown,
  MapPin,
  UtensilsCrossed,
  Eye,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  Ban,
  Check,
  XCircle,
} from "lucide-react";

const vendorsData = [
  {
    id: 1,
    name: "James Wilson",
    email: "james.wilson@gmail.com",
    restaurant: "Bella Italia",
    location: "New York, USA",
    phone: "+1 234 567 8901",
    status: "Approved",
    plan: "Premium",
    menuItems: 24,
    orders: 156,
    joined: "Nov 10, 2026",
    avatar: "BI",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael.brown@gmail.com",
    restaurant: "Urban Pizza",
    location: "Chicago, USA",
    phone: "+1 234 567 8902",
    status: "Pending",
    plan: "Free",
    menuItems: 8,
    orders: 89,
    joined: "Nov 05, 2026",
    avatar: "UP",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Sophia Johnson",
    email: "sophia.johnson@gmail.com",
    restaurant: "The Food Corner",
    location: "Los Angeles, USA",
    phone: "+1 234 567 8903",
    status: "Approved",
    plan: "Free",
    menuItems: 3,
    orders: 203,
    joined: "Oct 25, 2026",
    avatar: "FC",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "David Miller",
    email: "david.miller@gmail.com",
    restaurant: "Fire Crust",
    location: "Miami, USA",
    phone: "+1 234 567 8904",
    status: "Rejected",
    plan: "Free",
    menuItems: 0,
    orders: 0,
    joined: "Oct 22, 2026",
    avatar: "FC",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Daniel Smith",
    email: "daniel.smith@gmail.com",
    restaurant: "Slice House",
    location: "Houston, USA",
    phone: "+1 234 567 8905",
    status: "Approved",
    plan: "Premium",
    menuItems: 32,
    orders: 412,
    joined: "Oct 18, 2026",
    avatar: "SH",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Robert Taylor",
    email: "robert.taylor@gmail.com",
    restaurant: "Cheesy Bites",
    location: "Dallas, USA",
    phone: "+1 234 567 8906",
    status: "Pending",
    plan: "Free",
    menuItems: 5,
    orders: 12,
    joined: "Oct 15, 2026",
    avatar: "CB",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(vendorsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.restaurant.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || vendor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const approvedCount = vendors.filter(
    (vendor) => vendor.status === "Approved"
  ).length;

  const pendingCount = vendors.filter(
    (vendor) => vendor.status === "Pending"
  ).length;

  const premiumCount = vendors.filter(
    (vendor) => vendor.plan === "Premium"
  ).length;

  const updateVendorStatus = (
    vendorId: number,
    status: string
  ) => {
    setVendors((previous) =>
      previous.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, status }
          : vendor
      )
    );

    setSelectedVendor(null);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-orange-400">
            <Store size={14} />
            VENDOR MANAGEMENT
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Manage Vendors
          </h1>

          <p className="mt-1 text-sm text-[#A8A29E]">
            Review restaurants, manage applications and monitor vendors.
          </p>
        </div>

        <div className="rounded-xl border border-orange-500/10 bg-orange-500/[0.04] px-4 py-3">
          <p className="text-xs text-[#A8A29E]">Vendor Applications</p>

          <div className="mt-1 flex items-center gap-2">
            <Clock size={17} className="text-orange-400" />

            <span className="text-xl font-bold text-white">
              {pendingCount}
            </span>

            <span className="text-xs text-orange-400">
              Awaiting review
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          title="Total Vendors"
          value={vendors.length}
          icon={Store}
          color="orange"
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          title="Pending Review"
          value={pendingCount}
          icon={Clock}
          color="blue"
        />

        <StatCard
          title="Premium Vendors"
          value={premiumCount}
          icon={Crown}
          color="purple"
        />
      </div>

      {/* Featured Overview */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Pending Applications */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/10 bg-[#17110E] p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/[0.05] blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-orange-400">
                APPLICATION REVIEW
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Pending Applications
              </h2>

              <p className="mt-1 text-sm text-[#A8A29E]">
                Vendors waiting for admin approval.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Clock size={20} />
            </div>
          </div>

          <div className="relative mt-5 flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-white">
                {pendingCount}
              </span>

              <span className="ml-2 text-sm text-[#78716C]">
                applications
              </span>
            </div>

            <button
              onClick={() => setStatusFilter("Pending")}
              className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-medium text-orange-400 transition hover:bg-orange-500/15"
            >
              Review Applications
            </button>
          </div>
        </div>

        {/* Premium Overview */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/10 bg-[#17110E] p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/[0.05] blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-purple-400">
                SUBSCRIPTION OVERVIEW
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Premium Partners
              </h2>

              <p className="mt-1 text-sm text-[#A8A29E]">
                Vendors with active premium plans.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Crown size={20} />
            </div>
          </div>

          <div className="relative mt-5 flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-white">
                {premiumCount}
              </span>

              <span className="ml-2 text-sm text-[#78716C]">
                premium vendors
              </span>
            </div>

            <span className="rounded-lg bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-400">
              Premium
            </span>
          </div>
        </div>
      </div>

      {/* Vendor Directory */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#15110F]">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-4 sm:p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Vendor Directory
            </h2>

            <p className="mt-1 text-xs text-[#78716C]">
              {filteredVendors.length} restaurants found
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0D0A09] px-3 py-2.5 sm:w-64">
              <Search size={16} className="text-[#78716C]" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor or restaurant..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#57534E]"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/[0.07] bg-[#0D0A09] px-3 py-2.5 text-sm text-white outline-none"
            >
              <option value="All">All Vendors</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Vendor Cards */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0A09] transition hover:border-orange-500/20"
            >
              {/* Restaurant Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.restaurant}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Status */}
                <div className="absolute left-3 top-3">
                  <VendorStatus status={vendor.status} />
                </div>

                {/* Plan */}
                <div className="absolute right-3 top-3">
                  {vendor.plan === "Premium" ? (
                    <span className="flex items-center gap-1 rounded-lg border border-purple-400/20 bg-black/50 px-2 py-1 text-[10px] font-medium text-purple-300 backdrop-blur-md">
                      <Crown size={11} />
                      Premium
                    </span>
                  ) : (
                    <span className="rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-white/70 backdrop-blur-md">
                      Free Plan
                    </span>
                  )}
                </div>

                {/* Restaurant Name */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white">
                    {vendor.restaurant}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
                    <MapPin size={12} />
                    {vendor.location}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Vendor */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-xs font-bold text-orange-400">
                    {vendor.avatar}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {vendor.name}
                    </p>

                    <p className="truncate text-xs text-[#78716C]">
                      {vendor.email}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 text-[#78716C]">
                      <UtensilsCrossed size={13} />
                      <span className="text-[10px]">Menu Items</span>
                    </div>

                    <p className="mt-1 text-lg font-bold text-white">
                      {vendor.menuItems}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 text-[#78716C]">
                      <Store size={13} />
                      <span className="text-[10px]">Total Orders</span>
                    </div>

                    <p className="mt-1 text-lg font-bold text-white">
                      {vendor.orders}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] py-2.5 text-xs font-medium text-[#A8A29E] transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Eye size={14} />
                    View Details
                  </button>

                  {vendor.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateVendorStatus(vendor.id, "Approved")
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/15 bg-green-500/10 text-green-400 transition hover:bg-green-500/20"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={() =>
                          updateVendorStatus(vendor.id, "Rejected")
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/15 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#181310] shadow-2xl">
            {/* Cover */}
            <div className="relative h-40">
              <img
                src={selectedVendor.image}
                alt={selectedVendor.restaurant}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#181310] to-transparent" />

              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-3 left-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedVendor.restaurant}
                </h2>

                <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
                  <MapPin size={12} />
                  {selectedVendor.location}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 font-bold text-orange-400">
                  {selectedVendor.avatar}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {selectedVendor.name}
                  </h3>

                  <p className="text-xs text-[#78716C]">
                    Vendor Account
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={selectedVendor.email}
                />

                <DetailItem
                  icon={Phone}
                  label="Phone"
                  value={selectedVendor.phone}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Joined"
                  value={selectedVendor.joined}
                />

                <DetailItem
                  icon={ShieldCheck}
                  label="Subscription"
                  value={selectedVendor.plan}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MiniStat
                  label="Menu Items"
                  value={selectedVendor.menuItems}
                />

                <MiniStat
                  label="Orders"
                  value={selectedVendor.orders}
                />

                <MiniStat
                  label="Status"
                  value={selectedVendor.status}
                />
              </div>

              {/* Approval Actions */}
              {selectedVendor.status === "Pending" && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() =>
                      updateVendorStatus(
                        selectedVendor.id,
                        "Approved"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 py-3 text-sm font-semibold text-green-400 transition hover:bg-green-500/20"
                  >
                    <CheckCircle2 size={16} />
                    Approve Vendor
                  </button>

                  <button
                    onClick={() =>
                      updateVendorStatus(
                        selectedVendor.id,
                        "Rejected"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    <XCircle size={16} />
                    Reject Vendor
                  </button>
                </div>
              )}

              {selectedVendor.status === "Approved" && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/10 bg-green-500/[0.04] py-3 text-sm text-green-400">
                  <CheckCircle2 size={16} />
                  Vendor is approved
                </div>
              )}

              {selectedVendor.status === "Rejected" && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.04] py-3 text-sm text-red-400">
                  <XCircle size={16} />
                  Application rejected
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
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#15110F] p-4 sm:p-5 transition hover:border-white/[0.1]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[color]}`}>
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-xs text-[#A8A29E]">{title}</p>

      <h3 className="mt-1 text-2xl font-bold text-white">
        {value.toLocaleString()}
      </h3>
    </div>
  );
}

/* Vendor Status */
function VendorStatus({ status }: { status: string }) {
  const styles: any = {
    Approved: "bg-green-500/10 text-green-400 border-green-500/15",
    Pending: "bg-orange-500/10 text-orange-400 border-orange-500/15",
    Rejected: "bg-red-500/10 text-red-400 border-red-500/15",
  };

  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium backdrop-blur-md ${styles[status]}`}
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

/* Mini Stat */
function MiniStat({ label, value }: any) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <p className="text-[10px] text-[#78716C]">{label}</p>

      <p className="mt-1 truncate text-sm font-bold text-white">
        {value}
      </p>
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
        No vendors found
      </p>

      <p className="mt-1 text-xs text-[#78716C]">
        Try changing your search or filter.
      </p>
    </div>
  );
}