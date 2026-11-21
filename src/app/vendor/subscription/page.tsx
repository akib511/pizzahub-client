"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Crown,
  Package,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function VendorSubscriptionPage() {
  const { data: session, isPending } = authClient.useSession();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const freeFeatures = [
    "Up to 3 active menu items",
    "Basic vendor dashboard",
    "Order management",
    "Customer order notifications",
  ];

  const premiumFeatures = [
    "Unlimited active menu items",
    "Premium vendor badge",
    "Featured homepage placement",
    "Priority visibility",
    "Advanced business analytics",
  ];

  const vendorEmail = session?.user?.email;
  const isPremium = session?.user?.subscriptionPlan === "premium";

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleUpgrade = (event: React.FormEvent<HTMLFormElement>) => {
    if (isPremium) {
      event.preventDefault();

      setToast({
        message: "You have already purchased Premium. No need to pay again!",
        type: "error",
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-5 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm font-medium shadow-xl ${
            toast.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Subscription
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan and unlock more features.
        </p>
      </div>

      {/* Current Plan */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            {isPremium ? (
              <Crown size={20} className="text-orange-400" />
            ) : (
              <Package size={20} className="text-orange-400" />
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Current Plan
            </p>

            <h2 className="font-semibold text-foreground">
              {isPremium ? "Premium Plan" : "Free Plan"}
            </h2>
          </div>
        </div>

        {!isPremium && (
          <div className="flex items-center gap-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Active Menu Items
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                2 <span className="text-muted-foreground">/ 3</span>
              </p>
            </div>

            <div className="h-8 w-24 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-orange-500" />
            </div>
          </div>
        )}

        {isPremium && (
          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
            Lifetime Premium
          </span>
        )}
      </div>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Free Plan */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Free
            </h2>

            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {isPremium ? "Previous Plan" : "Current Plan"}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-foreground">
              $0
            </span>

            <span className="text-sm text-muted-foreground">
              {" "}
              / forever
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Get started with your restaurant.
          </p>

          <div className="my-5 h-px bg-muted" />

          <div className="space-y-3">
            {freeFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5"
              >
                <Check size={15} className="text-green-400" />

                <span className="text-sm text-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            disabled
            className="mt-6 w-full rounded-lg border border-border bg-muted/50 py-2.5 text-sm text-muted-foreground"
          >
            {isPremium ? "Previous Plan" : "Your Current Plan"}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="relative rounded-xl border border-orange-500/30 bg-card p-5">
          <div className="absolute right-4 top-4 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400">
            {isPremium ? "Purchased" : "Recommended"}
          </div>

          <div className="flex items-center gap-2">
            <Crown size={19} className="text-orange-400" />

            <h2 className="text-lg font-semibold text-foreground">
              Premium
            </h2>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-foreground">
              $19.99
            </span>

            <span className="text-sm text-muted-foreground">
              {" "}
              / one-time
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Pay once and unlock premium features.
          </p>

          <div className="my-5 h-px bg-muted" />

          <div className="space-y-3">
            {premiumFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5"
              >
                <Check size={15} className="text-orange-400" />

                <span className="text-sm text-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <form
            action="/api/checkout_sessions"
            method="POST"
            onSubmit={handleUpgrade}
            className="mt-6"
          >
            <button
              type="submit"
              disabled={isPending || !vendorEmail}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles size={15} />

              {isPending
                ? "Loading..."
                : isPremium
                  ? "Already Premium"
                  : "Upgrade to Premium"}
            </button>
          </form>
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-muted-foreground">
        One-time payment of $19.99. Securely processed through Stripe.
      </p>
    </div>
  );
}