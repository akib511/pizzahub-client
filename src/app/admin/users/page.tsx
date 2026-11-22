"use client";

import { apiFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Users,
  UserCheck,
  ShieldCheck,
  MoreHorizontal,
  Mail,
  CalendarDays,
  X,
  Filter,
  Store,
} from "lucide-react";

type User = {
  _id: string;
  name?: string;
  email: string;
  role: string;
  image?: string;
  profileImage?: string;
  restaurantName?: string;
  phone?: string;
  createdAt?: string | Date;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | Date;
  orders: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(`${API_URL}/admin/users`);

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await response.json();

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Unable to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search and role filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
     (user.role || "unknown").toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  // Statistics
  const customerUsers = users.filter(
    (user) => user.role === "customer",
  ).length;

  const vendorUsers = users.filter(
    (user) => user.role === "vendor",
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "admin",
  ).length;

  const getUserName = (user: User) => {
    return user.name || "Unnamed User";
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (role: string) => {
    if (role === "vendor") {
      return "bg-blue-500/15 text-blue-400";
    }

    if (role === "admin") {
      return "bg-orange-500/15 text-orange-400";
    }

    return "bg-purple-500/15 text-purple-400";
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            USER MANAGEMENT
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage accounts, permissions and user activity.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
            <Users size={18} className="text-orange-400" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total registered</p>
            <p className="text-lg font-bold text-foreground">
              {users.length.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          color="orange"
          percentage="All accounts"
        />

        <StatCard
          title="Customers"
          value={customerUsers}
          icon={UserCheck}
          color="green"
          percentage="Customer accounts"
        />

        <StatCard
          title="Vendors"
          value={vendorUsers}
          icon={Store}
          color="blue"
          percentage="Business accounts"
        />

        <StatCard
          title="Admins"
          value={adminUsers}
          icon={ShieldCheck}
          color="red"
          percentage="Admin accounts"
        />
      </div>

      {/* Main section */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Filters */}
        <div className="space-y-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                All Users
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {filteredUsers.length} users found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 sm:w-64">
                <Search size={16} className="text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Role filter */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                <Filter size={15} className="text-muted-foreground" />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent py-2.5 text-sm text-foreground outline-none"
                >
                  <option value="All" className="bg-card">
                    All Roles
                  </option>

                  <option value="customer" className="bg-card">
                    Customer
                  </option>

                  <option value="vendor" className="bg-card">
                    Vendor
                  </option>

                  <option value="admin" className="bg-card">
                    Admin
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-5 py-3 text-xs font-medium text-muted-foreground">
                      USER
                    </th>

                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      ROLE
                    </th>

                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      JOINED
                    </th>

                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      ORDERS
                    </th>

                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-border transition hover:bg-muted"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />

                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {getUserName(user)}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Orders */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-foreground">
                          {user.orders}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
                          >
                            <MoreHorizontal size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && <EmptyState />}
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-3 md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <UserAvatar user={user} />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {getUserName(user)}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <RoleBadge role={user.role} />
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>
                      Joined {formatDate(user.createdAt)}
                    </span>

                    <span>{user.orders} orders</span>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && <EmptyState />}
            </div>
          </>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Modal Header */}
            <div className="relative border-b border-border p-5">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={17} />
              </button>

              <div className="flex items-center gap-4">
                <UserAvatar user={selectedUser} large />

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-foreground">
                    {getUserName(selectedUser)}
                  </h3>

                  <p className="mt-1 break-all text-xs text-muted-foreground">
                    User ID: {selectedUser._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                <Mail size={17} className="shrink-0 text-orange-400" />

                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">
                    EMAIL ADDRESS
                  </p>

                  <p className="mt-1 break-all text-sm text-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                <CalendarDays
                  size={17}
                  className="shrink-0 text-orange-400"
                />

                <div>
                  <p className="text-[10px] text-muted-foreground">
                    JOINED DATE
                  </p>

                  <p className="mt-1 text-sm text-foreground">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>

              {selectedUser.role === "vendor" && (
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">
                    RESTAURANT NAME
                  </p>

                  <p className="mt-1 text-sm text-foreground">
                    {selectedUser.restaurantName || "Not provided"}
                  </p>

                  <p className="mt-3 text-xs text-muted-foreground">
                    SUBSCRIPTION PLAN
                  </p>

                  <p className="mt-1 text-sm capitalize text-foreground">
                    {selectedUser.subscriptionPlan || "Free"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">
                    Account Role
                  </p>

                  <div className="mt-2">
                    <RoleBadge role={selectedUser.role} />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">
                    Total Orders
                  </p>

                  <p className="mt-2 text-xl font-bold text-foreground">
                    {selectedUser.orders}
                  </p>
                </div>
              </div>

              {selectedUser.phone && (
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Phone Number</p>

                  <p className="mt-1 text-sm text-foreground">
                    {selectedUser.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function UserAvatar({
  user,
  large = false,
}: {
  user: User;
  large?: boolean;
}) {
  const image = user.image || user.profileImage;

  const color =
    user.role === "vendor"
      ? "bg-blue-500/15 text-blue-400"
      : user.role === "admin"
        ? "bg-orange-500/15 text-orange-400"
        : "bg-purple-500/15 text-purple-400";

  const initials = (user.name || "U")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl font-bold ${
        large ? "h-14 w-14 text-base" : "h-10 w-10 text-xs"
      } ${color}`}
    >
      {image ? (
       
        <img
          src={image}
          alt={user.name || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

/* Stats Card */
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  percentage,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "orange" | "green" | "blue" | "red";
  percentage: string;
}) {
  const colors = {
    orange: "bg-orange-500/10 text-orange-400",
    green: "bg-green-500/10 text-green-400",
    blue: "bg-blue-500/10 text-blue-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 transition hover:border-border sm:p-5">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon size={19} />
        </div>

        <span className="text-[10px] text-muted-foreground sm:text-xs">
          {percentage}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground">{title}</p>

        <h3 className="mt-1 text-2xl font-bold text-foreground">
          {value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}

/* Role Badge */
function RoleBadge({ role }: { role?: string }) {
  const normalizedRole = (role || "unknown").toLowerCase();

  const styles: Record<string, string> = {
    customer: "bg-purple-500/10 text-purple-400 border-purple-500/10",
    vendor: "bg-blue-500/10 text-blue-400 border-blue-500/10",
    admin: "bg-orange-500/10 text-orange-400 border-orange-500/10",
    unknown: "bg-gray-500/10 text-muted-foreground border-gray-500/10",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-medium ${
        styles[normalizedRole] || styles.unknown
      }`}
    >
      {normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)}
    </span>
  );
}

/* Empty State */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
        <Search size={20} className="text-muted-foreground" />
      </div>

      <p className="mt-3 text-sm font-medium text-foreground">
        No users found
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Try changing your search or filters.
      </p>
    </div>
  );
}