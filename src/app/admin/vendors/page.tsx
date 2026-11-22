"use client";

import { apiFetch } from "@/lib/api";

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
  ChevronRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Vendor = {
  _id: string;
  name?: string;
  email: string;
  restaurantName?: string;
  restaurantLogo?: string;
  phone?: string;
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

  // Bumped by the "Refresh" buttons to re-run the load effect below.
  const [reloadKey, setReloadKey] = useState(0);

  const refreshVendors = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(`${API_URL}/admin/vendors`);

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

    fetchVendors();
  }, [reloadKey]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (selectedVendor) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedVendor]);

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
    (vendor) => vendor.subscriptionPlan?.toLowerCase() === "premium",
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
    <div className="space-y-5 sm:space-y-7">
      {/*  HEADER  */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-[10px] text-orange-400 sm:mb-2 sm:text-xs">
            <Store size={12} className="sm:size-3.5" />
            VENDOR MANAGEMENT
          </div>

          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            Manage Vendors
          </h1>

          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            View restaurants, vendor profiles and subscription details.
          </p>
        </div>

        {/* Mobile: compact inline stat — Desktop: card */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-orange-500/10 bg-orange-500/[0.04] px-3.5 py-2.5 sm:block sm:px-4 sm:py-3">
          <p className="text-[11px] text-muted-foreground sm:text-xs">Total Vendors</p>

          <div className="mt-0 flex items-center gap-1.5 sm:mt-1 sm:gap-2">
            <Store size={15} className="text-orange-400 sm:size-[17px]" />
            <span className="text-lg font-bold text-foreground sm:text-xl">
              {vendors.length}
            </span>
            <span className="hidden text-xs text-orange-400 sm:inline">
              Registered vendors
            </span>
          </div>
        </div>
      </div>

      {/* ============ STATS ============ */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 xl:grid-cols-3">
        <StatCard
          title="Total"
          value={vendors.length}
          icon={Store}
          color="orange"
        />

        <StatCard
          title="Premium"
          value={premiumCount}
          icon={Crown}
          color="purple"
        />

        <StatCard
          title="Free"
          value={freeCount}
          icon={UtensilsCrossed}
          color="blue"
        />
      </div>

      {/*  OVERVIEW CARDS  */}
      {/* Mobile: 2 cols compact — Desktop: 2 lg cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-2">
        {/* Vendor Overview */}
        <div className="relative overflow-hidden rounded-xl border border-orange-500/10 bg-card p-3.5 sm:rounded-2xl sm:p-5">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/[0.05] blur-3xl sm:h-40 sm:w-40" />

          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-medium uppercase tracking-wider text-orange-400 sm:text-xs">
                Restaurant Network
              </p>

              <h2 className="mt-1 truncate text-sm font-bold text-foreground sm:mt-2 sm:text-xl">
                Vendor Directory
              </h2>

              <p className="mt-0.5 hidden text-sm text-muted-foreground sm:mt-1 sm:block">
                All registered restaurant partners.
              </p>
            </div>

            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 sm:size-11 sm:rounded-xl">
              <Store size={15} className="sm:size-5" />
            </div>
          </div>

          <div className="relative mt-2.5 sm:mt-5">
            <span className="text-2xl font-bold text-foreground sm:text-4xl">
              {vendors.length}
            </span>

            <span className="ml-1 text-[10px] text-muted-foreground sm:ml-2 sm:text-sm">
              vendors
            </span>
          </div>
        </div>

        {/* Premium Overview */}
        <div className="relative overflow-hidden rounded-xl border border-purple-500/10 bg-card p-3.5 sm:rounded-2xl sm:p-5">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/[0.05] blur-3xl sm:h-40 sm:w-40" />

          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-medium uppercase tracking-wider text-purple-400 sm:text-xs">
                Subscription
              </p>

              <h2 className="mt-1 truncate text-sm font-bold text-foreground sm:mt-2 sm:text-xl">
                Premium Partners
              </h2>

              <p className="mt-0.5 hidden text-sm text-muted-foreground sm:mt-1 sm:block">
                Vendors with premium subscriptions.
              </p>
            </div>

            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 sm:size-11 sm:rounded-xl">
              <Crown size={15} className="sm:size-5" />
            </div>
          </div>

          <div className="relative mt-2.5 sm:mt-5">
            <span className="text-2xl font-bold text-foreground sm:text-4xl">
              {premiumCount}
            </span>

            <span className="ml-1 text-[10px] text-muted-foreground sm:ml-2 sm:text-sm">
              premium
            </span>
          </div>
        </div>
      </div>

      {/*  VENDOR DIRECTORY  */}
      <div className="rounded-xl border border-border bg-card sm:rounded-2xl">
        {/* Toolbar */}
        <div className="border-b border-border p-3.5 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Vendor Directory
              </h2>

              <p className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1 sm:text-xs">
                {filteredVendors.length}{" "}
                {filteredVendors.length === 1 ? "restaurant" : "restaurants"}{" "}
                found
              </p>
            </div>

            {/* Refresh — icon only on mobile */}
            <button
              onClick={refreshVendors}
              disabled={loading}
              aria-label="Refresh vendors"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 disabled:opacity-50 sm:hidden"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            {/* Desktop refresh with label */}
            <button
              onClick={refreshVendors}
              disabled={loading}
              className="hidden items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50 sm:flex"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Search — full width on mobile */}
          <div className="mt-3 flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 transition-colors focus-within:border-orange-500/40 sm:mt-4 sm:h-10 sm:max-w-sm sm:rounded-xl sm:px-3.5">
            <Search size={15} className="shrink-0 text-muted-foreground sm:size-4" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              aria-label="Search vendors"
              className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-orange-400" />

            <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <p className="text-sm text-red-400">{error}</p>

            <button
              onClick={refreshVendors}
              className="mt-4 h-11 rounded-lg bg-orange-500/10 px-5 text-xs font-medium text-orange-400 transition hover:bg-orange-500/20 active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Vendor Cards */}
        {!loading && !error && (
          <>
            <div className="grid gap-3 p-3.5 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:grid-cols-3">
              {filteredVendors.map((vendor) => {
                const restaurantImage = vendor.restaurantLogo;
                const premium = getPlan(vendor) === "Premium";

                return (
                  <div
                    key={vendor._id}
                    className="group overflow-hidden rounded-xl border border-border bg-background transition hover:border-orange-500/20"
                  >
                    {/* Restaurant Image */}
                    <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-36">
                      {restaurantImage ? (
                        <img
                          src={restaurantImage}
                          alt={getRestaurantName(vendor)}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Store
                            size={32}
                            className="text-orange-400/40 sm:size-[35px]"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Plan Badge */}
                      <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
                        {premium ? (
                          <span className="flex items-center gap-1 rounded-md border border-purple-400/20 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-purple-300 backdrop-blur-md sm:rounded-lg sm:py-1">
                            <Crown size={10} className="sm:size-[11px]" />
                            Premium
                          </span>
                        ) : (
                          <span className="rounded-md border border-border bg-black/50 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-md sm:rounded-lg sm:py-1">
                            Free
                          </span>
                        )}
                      </div>

                      {/* Restaurant Name */}
                      <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3">
                        <h3 className="line-clamp-1 text-base font-bold text-foreground sm:text-lg">
                          {getRestaurantName(vendor)}
                        </h3>

                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-foreground/60 sm:mt-1 sm:text-xs">
                          <MapPin size={11} className="shrink-0" />
                          <span className="truncate">Location not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 sm:p-4">
                      {/* Vendor Profile */}
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange-500/10 text-[10px] font-bold text-orange-400 sm:size-10 sm:rounded-xl sm:text-xs">
                          {vendor.profileImage ? (
                            <img
                              src={vendor.profileImage}
                              alt={getVendorName(vendor)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(getVendorName(vendor))
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-foreground sm:text-sm">
                            {getVendorName(vendor)}
                          </p>

                          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                            {vendor.email}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
                        <div className="rounded-lg border border-border bg-muted/40 p-2.5 sm:p-3">
                          <div className="flex items-center gap-1 text-muted-foreground sm:gap-1.5">
                            <UtensilsCrossed size={11} className="sm:size-[13px]" />
                            <span className="text-[9px] uppercase tracking-wider sm:text-[10px]">
                              Menu
                            </span>
                          </div>

                          <p className="mt-0.5 text-base font-bold text-foreground sm:mt-1 sm:text-lg">
                            {vendor.menuItems}
                          </p>
                        </div>

                        <div className="rounded-lg border border-border bg-muted/40 p-2.5 sm:p-3">
                          <div className="flex items-center gap-1 text-muted-foreground sm:gap-1.5">
                            <Store size={11} className="sm:size-[13px]" />
                            <span className="text-[9px] uppercase tracking-wider sm:text-[10px]">
                              Orders
                            </span>
                          </div>

                          <p className="mt-0.5 text-base font-bold text-foreground sm:mt-1 sm:text-lg">
                            {vendor.orders}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 sm:mt-4">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/50 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-[0.98] sm:min-h-0 sm:gap-2 sm:py-2.5"
                        >
                          <Eye size={13} className="sm:size-[14px]" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredVendors.length === 0 && <EmptyState onClear={() => setSearch("")} hasSearch={!!search} />}
          </>
        )}
      </div>

      {/* ============ VENDOR DETAILS MODAL ============ */}
      {selectedVendor && (
        <div
          onClick={() => setSelectedVendor(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border-t border-border bg-card shadow-2xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl sm:border"
          >
            {/* Mobile drag handle */}
            <div className="sticky top-0 z-10 flex justify-center pt-2 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Cover */}
            <div className="relative h-36 sm:h-40">
              {selectedVendor.restaurantLogo ? (
                <img
                  src={selectedVendor.restaurantLogo}
                  alt={getRestaurantName(selectedVendor)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <Store size={40} className="text-orange-400/40" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

              <button
                onClick={() => setSelectedVendor(null)}
                aria-label="Close details"
                className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 active:scale-95 sm:size-8"
              >
                <X size={16} className="sm:size-4" />
              </button>

              <div className="absolute inset-x-4 bottom-3">
                <h2 className="line-clamp-1 text-lg font-bold text-foreground sm:text-xl">
                  {getRestaurantName(selectedVendor)}
                </h2>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3.5 p-4 sm:space-y-4 sm:p-5">
              {/* Vendor Profile */}
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400 sm:size-12 sm:rounded-xl sm:text-sm">
                  {selectedVendor.profileImage ? (
                    <img
                      src={selectedVendor.profileImage}
                      alt={getVendorName(selectedVendor)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(getVendorName(selectedVendor))
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                    {getVendorName(selectedVendor)}
                  </h3>

                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    Vendor Account
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
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

              <div className="grid grid-cols-2 gap-2 sm:gap-2">
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
                  <div className="rounded-lg border border-purple-500/10 bg-purple-500/[0.04] p-3 sm:rounded-xl">
                    <p className="text-[10px] text-purple-400 sm:text-xs">
                      Subscription Expires
                    </p>

                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDate(
                        selectedVendor.subscriptionExpiresAt,
                      )}
                    </p>
                  </div>
                )}

              <div
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm sm:rounded-xl sm:py-3 ${
                  getPlan(selectedVendor) === "Premium"
                    ? "border-purple-500/10 bg-purple-500/[0.04] text-purple-400"
                    : "border-border bg-muted/40 text-muted-foreground"
                }`}
              >
                <Crown size={14} className="sm:size-4" />
                {getPlan(selectedVendor)} Subscription
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ STAT CARD ============ */
type StatCardProps = {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "orange" | "blue" | "purple";
};

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const styles = {
    orange: "bg-orange-500/10 text-orange-400",
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3 transition hover:border-border sm:rounded-2xl sm:p-4 md:p-5">
      <div
        className={`flex size-8 items-center justify-center rounded-lg sm:size-10 sm:rounded-xl ${styles[color]}`}
      >
        <Icon size={15} className="sm:size-[19px]" />
      </div>

      <p className="mt-2.5 truncate text-[10px] uppercase tracking-wider text-muted-foreground sm:mt-4 sm:text-xs sm:normal-case sm:tracking-normal">
        {title}
      </p>

      <h3 className="mt-0.5 text-lg font-bold text-foreground sm:mt-1 sm:text-2xl">
        {value.toLocaleString()}
      </h3>
    </div>
  );
}

/* ============ DETAIL ITEM ============ */
type DetailItemProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 p-2.5 sm:gap-3 sm:rounded-xl sm:p-3">
      <Icon size={14} className="shrink-0 text-orange-400 sm:size-4" />

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px] sm:normal-case sm:tracking-normal">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-foreground sm:mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============ MINI STAT ============ */
type MiniStatProps = {
  label: string;
  value: number;
};

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-2.5 sm:rounded-xl sm:p-3">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px] sm:normal-case sm:tracking-normal">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-bold text-foreground sm:mt-1">
        {value}
      </p>
    </div>
  );
}

/* ============ EMPTY STATE ============ */
function EmptyState({
  onClear,
  hasSearch,
}: {
  onClear: () => void;
  hasSearch: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 sm:py-16">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted/50 sm:size-14">
        <Search size={20} className="text-muted-foreground sm:size-6" />
      </div>

      <p className="mt-3 text-sm font-medium text-foreground sm:text-base">
        No vendors found
      </p>

      <p className="mt-1 max-w-xs px-2 text-center text-xs text-muted-foreground sm:text-sm">
        {hasSearch
          ? "Try changing your search term."
          : "No vendors have registered yet."}
      </p>

      {hasSearch && (
        <button
          onClick={onClear}
          className="mt-4 inline-flex h-10 items-center gap-1 rounded-lg bg-orange-500/10 px-4 text-xs font-medium text-orange-400 transition hover:bg-orange-500/20 active:scale-95"
        >
          Clear search
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}