"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Store,
  Crown,
  MapPin,
  UtensilsCrossed,
  Eye,
  X,
  Mail,
  Phone,
  CalendarDays,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Vendor = {
  _id: string;
  name?: string;
  email: string;
  restaurantName?: string;
  phone?: string;
  image?: string;
  profileImage?: string;
  createdAt?: string;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string;
  menuItems: number;
  orders: number;
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/admin/vendors`);

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data: Vendor[] = await response.json();
      setVendors(data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      setError("Unable to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    const name = (vendor.name || "").toLowerCase();
    const restaurant = (vendor.restaurantName || "").toLowerCase();
    const email = (vendor.email || "").toLowerCase();
    const searchText = search.toLowerCase();

    return (
      name.includes(searchText) ||
      restaurant.includes(searchText) ||
      email.includes(searchText)
    );
  });

  const premiumCount = vendors.filter(
    (vendor) =>
      vendor.subscriptionPlan?.toLowerCase() === "premium",
  ).length;

  const freeCount = vendors.length - premiumCount;

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRestaurantName = (vendor: Vendor) =>
    vendor.restaurantName || "Restaurant not added";

  const getVendorName = (vendor: Vendor) =>
    vendor.name || "Unknown Vendor";

  const getPlan = (vendor: Vendor) =>
    vendor.subscriptionPlan?.toLowerCase() === "premium"
      ? "Premium"
      : "Free";

  const getInitials = (name?: string) => {
    if (!name) return "V";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
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
            View restaurants, vendor profiles and subscription details.
          </p>
        </div>

        <div className="rounded-xl border border-orange-500/10 bg-orange-500/[0.04] px-4 py-3">
          <p className="text-xs text-[#A8A29E]">Total Vendors</p>

          <div className="mt-1 flex items-center gap-2">
            <Store size={17} className="text-orange-400" />

            <span className="text-xl font-bold text-white">
              {vendors.length}
            </span>

            <span className="text-xs text-orange-400">
              Registered vendors
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          title="Total Vendors"
          value={vendors.length}
          icon={Store}
          color="orange"
        />

        <StatCard
          title="Premium Vendors"
          value={premiumCount}
          icon={Crown}
          color="purple"
        />

        <StatCard
          title="Free Vendors"
          value={freeCount}
          icon={UtensilsCrossed}
          color="blue"
        />
      </div>

      {/* Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Vendor Overview */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/10 bg-[#17110E] p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/[0.05] blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-orange-400">
                RESTAURANT NETWORK
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Vendor Directory
              </h2>

              <p className="mt-1 text-sm text-[#A8A29E]">
                All registered restaurant partners.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Store size={20} />
            </div>
          </div>

          <div className="relative mt-5">
            <span className="text-4xl font-bold text-white">
              {vendors.length}
            </span>

            <span className="ml-2 text-sm text-[#78716C]">
              total vendors
            </span>
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
                Vendors with premium subscriptions.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Crown size={20} />
            </div>
          </div>

          <div className="relative mt-5">
            <span className="text-4xl font-bold text-white">
              {premiumCount}
            </span>

            <span className="ml-2 text-sm text-[#78716C]">
              premium vendors
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
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0D0A09] px-3 py-2.5 sm:w-64">
              <Search size={16} className="text-[#78716C]" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor or restaurant..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#57534E]"
              />
            </div>

            <button
              onClick={fetchVendors}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-[#0D0A09] px-4 py-2.5 text-sm text-[#A8A29E] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={30} className="animate-spin text-orange-400" />

            <p className="mt-3 text-sm text-[#A8A29E]">
              Loading ...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-red-400">{error}</p>

            <button
              onClick={fetchVendors}
              className="mt-4 rounded-lg bg-orange-500/10 px-4 py-2 text-xs font-medium text-orange-400 hover:bg-orange-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Vendor Cards */}
        {!loading && !error && (
          <>
            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
              {filteredVendors.map((vendor) => {
                const restaurantImage =
                  vendor.image || vendor.profileImage;

                const premium = getPlan(vendor) === "Premium";

                return (
                  <div
                    key={vendor._id}
                    className="group overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0A09] transition hover:border-orange-500/20"
                  >
                    {/* Restaurant Image */}
                    <div className="relative h-36 overflow-hidden">
                      {restaurantImage ? (
                        <img
                          src={restaurantImage}
                          alt={getRestaurantName(vendor)}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#211914]">
                          <Store
                            size={35}
                            className="text-orange-400/40"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Plan */}
                      <div className="absolute right-3 top-3">
                        {premium ? (
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
                          {getRestaurantName(vendor)}
                        </h3>

                        <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
                          <MapPin size={12} />
                          <span>Location not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      {/* Vendor */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-xs font-bold text-orange-400">
                          {getInitials(getVendorName(vendor))}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {getVendorName(vendor)}
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
                            <span className="text-[10px]">
                              Menu Items
                            </span>
                          </div>

                          <p className="mt-1 text-lg font-bold text-white">
                            {vendor.menuItems}
                          </p>
                        </div>

                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                          <div className="flex items-center gap-1.5 text-[#78716C]">
                            <Store size={13} />
                            <span className="text-[10px]">
                              Total Orders
                            </span>
                          </div>

                          <p className="mt-1 text-lg font-bold text-white">
                            {vendor.orders}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] py-2.5 text-xs font-medium text-[#A8A29E] transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredVendors.length === 0 && <EmptyState />}
          </>
        )}
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div
          onClick={() => setSelectedVendor(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#181310] shadow-2xl"
          >
            {/* Cover */}
            <div className="relative h-40">
              {selectedVendor.image || selectedVendor.profileImage ? (
                <img
                  src={
                    selectedVendor.image ||
                    selectedVendor.profileImage
                  }
                  alt={getRestaurantName(selectedVendor)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#211914]">
                  <Store size={40} className="text-orange-400/40" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#181310] to-transparent" />

              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-3 left-4">
                <h2 className="text-xl font-bold text-white">
                  {getRestaurantName(selectedVendor)}
                </h2>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 font-bold text-orange-400">
                  {getInitials(getVendorName(selectedVendor))}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-white">
                    {getVendorName(selectedVendor)}
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
                  value={selectedVendor.phone || "Not available"}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Joined"
                  value={formatDate(selectedVendor.createdAt)}
                />

                <DetailItem
                  icon={Crown}
                  label="Subscription"
                  value={getPlan(selectedVendor)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <MiniStat
                  label="Menu Items"
                  value={selectedVendor.menuItems}
                />

                <MiniStat
                  label="Total Orders"
                  value={selectedVendor.orders}
                />
              </div>

              {getPlan(selectedVendor) === "Premium" &&
                selectedVendor.subscriptionExpiresAt && (
                  <div className="rounded-xl border border-purple-500/10 bg-purple-500/[0.04] p-3">
                    <p className="text-xs text-purple-400">
                      Subscription Expires
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {formatDate(
                        selectedVendor.subscriptionExpiresAt,
                      )}
                    </p>
                  </div>
                )}

              <div
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm ${
                  getPlan(selectedVendor) === "Premium"
                    ? "border-purple-500/10 bg-purple-500/[0.04] text-purple-400"
                    : "border-white/[0.06] bg-white/[0.02] text-[#A8A29E]"
                }`}
              >
                <Crown size={16} />
                {getPlan(selectedVendor)} Subscription
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Stats Card */
type StatCardProps = {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "orange" | "blue" | "purple";
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  const styles = {
    orange: "bg-orange-500/10 text-orange-400",
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#15110F] p-4 transition hover:border-white/[0.1] sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[color]}`}
      >
        <Icon size={19} />
      </div>

      <p className="mt-4 text-xs text-[#A8A29E]">{title}</p>

      <h3 className="mt-1 text-2xl font-bold text-white">
        {value.toLocaleString()}
      </h3>
    </div>
  );
}

/* Detail Item */
type DetailItemProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function DetailItem({
  icon: Icon,
  label,
  value,
}: DetailItemProps) {
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
type MiniStatProps = {
  label: string;
  value: number;
};

function MiniStat({ label, value }: MiniStatProps) {
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
        Try changing your search.
      </p>
    </div>
  );
}