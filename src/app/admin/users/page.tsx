"use client";

import { useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle2,
  Mail,
  CalendarDays,
  X,
  Filter,
} from "lucide-react";

const usersData = [
  {
    id: 1,
    name: "Sarah Ahmed",
    email: "sarah.ahmed@gmail.com",
    role: "Customer",
    status: "Active",
    joined: "Nov 12, 2026",
    orders: 24,
    avatar: "SA",
    color: "bg-purple-500/15 text-purple-400",
  },
  {
    id: 2,
    name: "James Wilson",
    email: "james.wilson@gmail.com",
    role: "Vendor",
    status: "Active",
    joined: "Nov 10, 2026",
    orders: 156,
    avatar: "JW",
    color: "bg-blue-500/15 text-blue-400",
  },
  {
    id: 3,
    name: "Emily Carter",
    email: "emily.carter@gmail.com",
    role: "Customer",
    status: "Active",
    joined: "Nov 08, 2026",
    orders: 12,
    avatar: "EC",
    color: "bg-pink-500/15 text-pink-400",
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael.brown@gmail.com",
    role: "Vendor",
    status: "Blocked",
    joined: "Nov 05, 2026",
    orders: 89,
    avatar: "MB",
    color: "bg-amber-500/15 text-amber-400",
  },
  {
    id: 5,
    name: "Olivia Martin",
    email: "olivia.martin@gmail.com",
    role: "Customer",
    status: "Active",
    joined: "Nov 03, 2026",
    orders: 31,
    avatar: "OM",
    color: "bg-green-500/15 text-green-400",
  },
  {
    id: 6,
    name: "Daniel Smith",
    email: "daniel.smith@gmail.com",
    role: "Admin",
    status: "Active",
    joined: "Oct 29, 2026",
    orders: 0,
    avatar: "DS",
    color: "bg-orange-500/15 text-orange-400",
  },
  {
    id: 7,
    name: "Sophia Johnson",
    email: "sophia.johnson@gmail.com",
    role: "Vendor",
    status: "Active",
    joined: "Oct 25, 2026",
    orders: 203,
    avatar: "SJ",
    color: "bg-cyan-500/15 text-cyan-400",
  },
  {
    id: 8,
    name: "William Davis",
    email: "william.davis@gmail.com",
    role: "Customer",
    status: "Blocked",
    joined: "Oct 21, 2026",
    orders: 7,
    avatar: "WD",
    color: "bg-red-500/15 text-red-400",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked"
  ).length;

  const vendorUsers = users.filter(
    (user) => user.role === "Vendor"
  ).length;

  const toggleStatus = (userId: number) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "Active" ? "Blocked" : "Active",
            }
          : user
      )
    );

    setSelectedUser(null);
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

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-1 text-sm text-[#A8A29E]">
            Manage accounts, permissions and user activity.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#1C1715] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
            <Users size={18} className="text-orange-400" />
          </div>

          <div>
            <p className="text-xs text-[#A8A29E]">Total registered</p>
            <p className="text-lg font-bold text-white">
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
          percentage="+12.8%"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          color="green"
          percentage="Currently active"
        />

        <StatCard
          title="Vendors"
          value={vendorUsers}
          icon={ShieldCheck}
          color="blue"
          percentage="Business accounts"
        />

        <StatCard
          title="Blocked Users"
          value={blockedUsers}
          icon={UserX}
          color="red"
          percentage="Restricted accounts"
        />
      </div>

      {/* Main section */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#15110F]">
        {/* Filters */}
        <div className="space-y-4 border-b border-white/[0.06] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                All Users
              </h2>

              <p className="mt-1 text-xs text-[#78716C]">
                {filteredUsers.length} users found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0D0A09] px-3 py-2.5 sm:w-64">
                <Search size={16} className="text-[#78716C]" />

                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#57534E]"
                />
              </div>

              {/* Role filter */}
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0D0A09] px-3">
                <Filter size={15} className="text-[#78716C]" />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent py-2.5 text-sm text-white outline-none"
                >
                  <option value="All" className="bg-[#15110F]">
                    All Roles
                  </option>

                  <option value="Customer" className="bg-[#15110F]">
                    Customer
                  </option>

                  <option value="Vendor" className="bg-[#15110F]">
                    Vendor
                  </option>

                  <option value="Admin" className="bg-[#15110F]">
                    Admin
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Blocked"].map((status) => (
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
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-5 py-3 text-xs font-medium text-[#78716C]">
                  USER
                </th>

                <th className="px-4 py-3 text-xs font-medium text-[#78716C]">
                  ROLE
                </th>

                <th className="px-4 py-3 text-xs font-medium text-[#78716C]">
                  STATUS
                </th>

                <th className="px-4 py-3 text-xs font-medium text-[#78716C]">
                  JOINED
                </th>

                <th className="px-4 py-3 text-xs font-medium text-[#78716C]">
                  ORDERS
                </th>

                <th className="px-4 py-3 text-xs font-medium text-[#78716C] text-right">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.025]"
                >
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${user.color}`}
                      >
                        {user.avatar}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[#78716C]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-4 text-xs text-[#A8A29E]">
                    {user.joined}
                  </td>

                  {/* Orders */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-white">
                      {user.orders}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-[#A8A29E] transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-3 md:hidden">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-white/[0.06] bg-[#0D0A09] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${user.color}`}
                  >
                    {user.avatar}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#78716C]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] text-[#A8A29E]"
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3 text-xs text-[#78716C]">
                <span>Joined {user.joined}</span>
                <span>{user.orders} orders</span>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && <EmptyState />}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#181310] shadow-2xl">
            {/* Modal Header */}
            <div className="relative border-b border-white/[0.06] p-5">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-white/[0.05] hover:text-white"
              >
                <X size={17} />
              </button>

              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold ${selectedUser.color}`}
                >
                  {selectedUser.avatar}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedUser.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#78716C]">
                    User ID: #{selectedUser.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <Mail size={17} className="text-orange-400" />

                <div>
                  <p className="text-[10px] text-[#78716C]">EMAIL ADDRESS</p>
                  <p className="mt-1 text-sm text-white">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <CalendarDays size={17} className="text-orange-400" />

                <div>
                  <p className="text-[10px] text-[#78716C]">JOINED DATE</p>
                  <p className="mt-1 text-sm text-white">
                    {selectedUser.joined}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                  <p className="text-xs text-[#78716C]">Account Role</p>
                  <div className="mt-2">
                    <RoleBadge role={selectedUser.role} />
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                  <p className="text-xs text-[#78716C]">Account Status</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <p className="text-xs text-[#78716C]">Total Orders</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {selectedUser.orders}
                </p>
              </div>

              {/* Action */}
              {selectedUser.role !== "Admin" && (
                <button
                  onClick={() => toggleStatus(selectedUser.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                    selectedUser.status === "Active"
                      ? "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15"
                      : "border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/15"
                  }`}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <Ban size={16} />
                      Block User
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Unblock User
                    </>
                  )}
                </button>
              )}

              {selectedUser.role === "Admin" && (
                <p className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-3 text-center text-xs text-orange-400">
                  Admin accounts cannot be blocked from this panel.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Stats Card */
function StatCard({ title, value, icon: Icon, color, percentage }: any) {
  const colors: any = {
    orange: "bg-orange-500/10 text-orange-400",
    green: "bg-green-500/10 text-green-400",
    blue: "bg-blue-500/10 text-blue-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#15110F] p-4 transition hover:border-white/[0.1] sm:p-5">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon size={19} />
        </div>

        <span className="text-[10px] text-[#78716C] sm:text-xs">
          {percentage}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs text-[#A8A29E]">{title}</p>

        <h3 className="mt-1 text-2xl font-bold text-white">
          {value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}

/* Role Badge */
function RoleBadge({ role }: { role: string }) {
  const styles: any = {
    Customer: "bg-purple-500/10 text-purple-400 border-purple-500/10",
    Vendor: "bg-blue-500/10 text-blue-400 border-blue-500/10",
    Admin: "bg-orange-500/10 text-orange-400 border-orange-500/10",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-medium ${styles[role]}`}
    >
      {role}
    </span>
  );
}

/* Status Badge */
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium ${
        status === "Active"
          ? "bg-green-500/10 text-green-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Active" ? "bg-green-400" : "bg-red-400"
        }`}
      />

      {status}
    </span>
  );
}

/* Empty State */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03]">
        <Search size={20} className="text-[#78716C]" />
      </div>

      <p className="mt-3 text-sm font-medium text-white">
        No users found
      </p>

      <p className="mt-1 text-xs text-[#78716C]">
        Try changing your search or filters.
      </p>
    </div>
  );
}