"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  ChevronDown,
  Receipt,
  X,
  User,
  ShoppingBag,
  CalendarDays,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

const initialTransactions = [
  {
    id: "TXN-2001",
    orderId: "ORD-1001",
    customer: "Rahim Ahmed",
    email: "rahim@gmail.com",
    amount: 41,
    method: "Stripe",
    status: "successful",
    date: "Nov 19, 2026",
    time: "10:42 AM",
    description: "Pizza order payment",
  },
  {
    id: "TXN-2002",
    orderId: "ORD-1002",
    customer: "Sadia Islam",
    email: "sadia@gmail.com",
    amount: 21,
    method: "Card",
    status: "successful",
    date: "Nov 18, 2026",
    time: "02:15 PM",
    description: "Pizza order payment",
  },
  {
    id: "TXN-2003",
    orderId: "ORD-1003",
    customer: "Tanvir Hasan",
    email: "tanvir@gmail.com",
    amount: 40,
    method: "Stripe",
    status: "successful",
    date: "Nov 18, 2026",
    time: "12:30 PM",
    description: "Pizza order payment",
  },
  {
    id: "TXN-2004",
    orderId: "ORD-1004",
    customer: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    amount: 28,
    method: "Card",
    status: "refunded",
    date: "Nov 17, 2026",
    time: "04:20 PM",
    description: "Cancelled order refund",
  },
  {
    id: "TXN-2005",
    orderId: "ORD-1005",
    customer: "Fahim Rahman",
    email: "fahim@gmail.com",
    amount: 22,
    method: "Stripe",
    status: "pending",
    date: "Nov 17, 2026",
    time: "09:10 AM",
    description: "Pizza order payment",
  },
  {
    id: "TXN-2006",
    orderId: "ORD-1006",
    customer: "Mehedi Hasan",
    email: "mehedi@gmail.com",
    amount: 32,
    method: "Card",
    status: "failed",
    date: "Nov 16, 2026",
    time: "06:45 PM",
    description: "Payment failed",
  },
];

const statusStyles: Record<string, string> = {
  successful:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  refunded: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(search.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(search.toLowerCase()) ||
      transaction.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || transaction.status === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      title: "Total Revenue",
      value: `$${transactions
        .filter((t) => t.status === "successful")
        .reduce((sum, t) => sum + t.amount, 0)
        .toLocaleString()}`,
      icon: DollarSign,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Transactions",
      value: transactions.length,
      icon: Receipt,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Successful",
      value: transactions.filter((t) => t.status === "successful").length,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Refunded",
      value: transactions.filter((t) => t.status === "refunded").length,
      icon: RotateCcw,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  const updateStatus = (id: string, status: string) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status }
          : transaction
      )
    );

    if (selectedTransaction?.id === id) {
      setSelectedTransaction({ ...selectedTransaction, status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Monitor payments, revenue and refunds.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#1C1715] px-4 py-2.5 text-sm text-stone-300">
          <Wallet size={16} className="text-orange-400" />
          Payment Overview
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

                <span className="text-lg font-bold text-white sm:text-xl">
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

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#1C1715] p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
          />

          <input
            type="text"
            placeholder="Search transaction, order or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.07] bg-[#100D0B] py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500/50"
          />
        </div>

        <div className="relative sm:w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-white/[0.07] bg-[#100D0B] px-3 py-2.5 text-sm text-stone-300 outline-none focus:border-orange-500/50"
          >
            <option value="all">All Transactions</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#1C1715]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
          <h2 className="font-semibold text-white">Payment History</h2>

          <span className="text-xs text-stone-500">
            {filteredTransactions.length} transactions
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-stone-500">
                <th className="px-5 py-4 font-medium">TRANSACTION</th>
                <th className="px-5 py-4 font-medium">CUSTOMER</th>
                <th className="px-5 py-4 font-medium">ORDER</th>
                <th className="px-5 py-4 font-medium">AMOUNT</th>
                <th className="px-5 py-4 font-medium">METHOD</th>
                <th className="px-5 py-4 font-medium">STATUS</th>
                <th className="px-5 py-4 font-medium">DATE</th>
                <th className="px-5 py-4 font-medium">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-orange-400">
                      {transaction.id}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {transaction.description}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-white">
                      {transaction.customer}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {transaction.email}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-stone-400">
                    {transaction.orderId}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-white">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="flex items-center gap-2 text-sm text-stone-300">
                      <CreditCard size={14} />
                      {transaction.method}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyles[transaction.status]}`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-stone-400">
                    {transaction.date}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
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

        {/* Mobile */}
        <div className="space-y-3 p-3 lg:hidden">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-xl border border-white/[0.06] bg-[#100D0B] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-orange-400">
                    {transaction.id}
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {transaction.customer}
                  </p>
                  <p className="text-xs text-stone-500">
                    {transaction.orderId}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-2 py-1 text-[10px] capitalize ${statusStyles[transaction.status]}`}
                >
                  {transaction.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <div>
                  <p className="text-lg font-bold text-white">
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-stone-500">
                    {transaction.method} · {transaction.date}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTransaction(transaction)}
                  className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-sm text-orange-400 hover:bg-orange-500/20"
                >
                  <Eye size={15} />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center">
            <Receipt size={35} className="mx-auto mb-3 text-stone-600" />
            <h3 className="font-medium text-white">
              No transactions found
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Try another search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1715] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="text-xs text-stone-500">
                  Transaction Details
                </p>
                <h2 className="mt-1 font-bold text-white">
                  {selectedTransaction.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-stone-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {/* Amount */}
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.05] p-5 text-center">
                <p className="text-xs text-stone-400">Transaction Amount</p>
                <h3 className="mt-2 text-3xl font-bold text-orange-400">
                  ${selectedTransaction.amount.toFixed(2)}
                </h3>

                <span
                  className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs capitalize ${statusStyles[selectedTransaction.status]}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 rounded-xl border border-white/[0.06] bg-[#100D0B] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">
                    Transaction ID
                  </span>
                  <span className="text-xs font-medium text-white">
                    {selectedTransaction.id}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">Order ID</span>
                  <span className="text-xs text-orange-400">
                    {selectedTransaction.orderId}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">Payment Method</span>
                  <span className="flex items-center gap-1.5 text-xs text-white">
                    <CreditCard size={13} />
                    {selectedTransaction.method}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">Date</span>
                  <span className="text-xs text-white">
                    {selectedTransaction.date}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">Time</span>
                  <span className="text-xs text-white">
                    {selectedTransaction.time}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">Description</span>
                  <span className="text-xs text-white">
                    {selectedTransaction.description}
                  </span>
                </div>
              </div>

              {/* Customer */}
              <div className="rounded-xl border border-white/[0.06] bg-[#100D0B] p-4">
                <div className="mb-3 flex items-center gap-2 text-orange-400">
                  <User size={15} />
                  <span className="text-xs font-medium">CUSTOMER</span>
                </div>

                <p className="text-sm font-medium text-white">
                  {selectedTransaction.customer}
                </p>

                <p className="mt-1 break-all text-xs text-stone-500">
                  {selectedTransaction.email}
                </p>
              </div>

              {/* Status Management */}
              <div>
                <p className="mb-2 text-sm font-medium text-white">
                  Manage Transaction
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    "successful",
                    "pending",
                    "refunded",
                    "failed",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateStatus(selectedTransaction.id, status)
                      }
                      disabled={selectedTransaction.status === status}
                      className={`rounded-lg border px-3 py-2.5 text-xs capitalize transition ${
                        selectedTransaction.status === status
                          ? `${statusStyles[status]}`
                          : "border-white/[0.06] bg-[#100D0B] text-stone-400 hover:border-orange-500/30 hover:text-orange-400"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.06] p-4">
              <button
                onClick={() => setSelectedTransaction(null)}
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