
"use client";

import { API_URL, apiFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  CreditCard,
  DollarSign,
  CheckCircle2,
  ChevronDown,
  Receipt,
  X,
  User,
  CalendarDays,
  Wallet,
  RefreshCw,
  Crown,
  AlertCircle,
} from "lucide-react";

interface Transaction {
  _id: string;
  sessionId: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  plan: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(
          `${API_URL}/admin/transactions`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Unable to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Format Currency
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  // Format Date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format Time
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Search and Filter
  const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      transaction.vendorName?.toLowerCase().includes(searchText) ||
      transaction.vendorEmail?.toLowerCase().includes(searchText) ||
      transaction.plan?.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "all" || transaction.paymentStatus === filter;

    return matchesSearch && matchesFilter;
  });

  // Statistics
  const successfulTransactions = transactions.filter(
    (transaction) => transaction.paymentStatus === "paid",
  );

  const totalRevenue = successfulTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const stats = [
    {
      title: "Total Revenue",
      value: formatAmount(totalRevenue, "usd"),
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
      value: successfulTransactions.length,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Premium Sales",
      value: transactions.filter(
        (transaction) => transaction.plan === "premium",
      ).length,
      icon: Crown,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor vendor premium payments and revenue.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
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
              className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon size={18} className={stat.color} />
                </div>

                <span className="break-all text-base font-bold text-foreground sm:text-xl">
                  {stat.value}
                </span>
              </div>

              <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:p-4">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-orange-500/50"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground outline-none focus:border-orange-500/50"
          >
            <option value="all">All Transactions</option>
            <option value="paid">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-4">
          <h2 className="font-semibold text-foreground">Payment History</h2>

          <span className="text-xs text-muted-foreground">
            {filteredTransactions.length} transactions
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <RefreshCw size={28} className="animate-spin text-orange-400" />
            <p className="mt-3 text-sm text-muted-foreground">
              Loading transactions...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <AlertCircle size={35} className="text-red-400" />

            <h3 className="mt-3 font-medium text-foreground">
              Something went wrong
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black hover:bg-orange-400"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-5 py-4 font-medium">VENDOR</th>
                    <th className="px-5 py-4 font-medium">PLAN</th>
                    <th className="px-5 py-4 font-medium">AMOUNT</th>
                    <th className="px-5 py-4 font-medium">STATUS</th>
                    <th className="px-5 py-4 font-medium">DATE</th>
                    <th className="px-5 py-4 font-medium">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b border-border transition hover:bg-muted/40"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm text-foreground">
                          {transaction.vendorName}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {transaction.vendorEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs capitalize text-purple-400">
                          {transaction.plan}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-foreground">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency,
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs capitalize ${
                            statusStyles[transaction.paymentStatus] ||
                            statusStyles.pending
                          }`}
                        >
                          {transaction.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            setSelectedTransaction(transaction)
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-orange-500/30 hover:text-orange-400"
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
                  key={transaction._id}
                  className="min-w-0 rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {transaction.vendorName}
                      </p>

                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {transaction.vendorEmail}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 text-[10px] capitalize ${
                        statusStyles[transaction.paymentStatus] ||
                        statusStyles.pending
                      }`}
                    >
                      {transaction.paymentStatus}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-foreground">
                        {formatAmount(
                          transaction.amount,
                          transaction.currency,
                        )}
                      </p>

                      <p className="mt-1 text-xs capitalize text-muted-foreground">
                        {transaction.plan} ·{" "}
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="flex shrink-0 items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-sm text-orange-400 hover:bg-orange-500/20"
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
                <Receipt
                  size={35}
                  className="mx-auto mb-3 text-muted-foreground"
                />

                <h3 className="font-medium text-foreground">
                  No transactions found
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try another search or filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Transaction Details
                </p>

                <h2 className="mt-1 font-bold text-foreground">
                  Payment Information
                </h2>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="ml-3 shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4 sm:p-5">
              {/* Amount */}
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.05] p-5 text-center">
                <p className="text-xs text-muted-foreground">
                  Transaction Amount
                </p>

                <h3 className="mt-2 text-3xl font-bold text-orange-400">
                  {formatAmount(
                    selectedTransaction.amount,
                    selectedTransaction.currency,
                  )}
                </h3>

                <span
                  className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs capitalize ${
                    statusStyles[selectedTransaction.paymentStatus] ||
                    statusStyles.pending
                  }`}
                >
                  {selectedTransaction.paymentStatus}
                </span>
              </div>

              {/* Payment Details */}
              <div className="space-y-4 rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <Receipt size={15} />
                  <span className="text-xs font-medium">
                    PAYMENT INFORMATION
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Payment Method
                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-foreground">
                    <CreditCard size={13} />
                    Stripe
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Subscription Plan
                  </span>

                  <span className="text-xs capitalize text-purple-400">
                    {selectedTransaction.plan}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Date
                  </span>

                  <span className="text-xs text-foreground">
                    {formatDate(selectedTransaction.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Time
                  </span>

                  <span className="text-xs text-foreground">
                    {formatTime(selectedTransaction.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Currency
                  </span>

                  <span className="text-xs uppercase text-foreground">
                    {selectedTransaction.currency}
                  </span>
                </div>
              </div>

              {/* Vendor */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-orange-400">
                  <User size={15} />

                  <span className="text-xs font-medium">
                    VENDOR INFORMATION
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground">
                  {selectedTransaction.vendorName}
                </p>

                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {selectedTransaction.vendorEmail}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4">
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
