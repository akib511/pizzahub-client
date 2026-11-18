"use client";

import {
  Check,
  Crown,
  Package,
  Sparkles,
} from "lucide-react";

export default function VendorSubscriptionPage() {
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

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Subscription
        </h1>

        <p className="mt-1 text-sm text-[#A8A29E]">
          Manage your plan and unlock more features.
        </p>
      </div>

      {/* Current Plan */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-[#1C1715] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05]">
            <Package size={20} className="text-orange-400" />
          </div>

          <div>
            <p className="text-xs text-[#A8A29E]">
              Current Plan
            </p>

            <h2 className="font-semibold text-white">
              Free Plan
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-xs text-[#A8A29E]">
              Active Menu Items
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              2 <span className="text-[#78716C]">/ 3</span>
            </p>
          </div>

          <div className="h-8 w-24 overflow-hidden rounded-full bg-white/[0.05]">
            <div className="h-full w-2/3 rounded-full bg-orange-500" />
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-xl border border-white/[0.06] bg-[#1C1715] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Free
            </h2>

            <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-[#A8A29E]">
              Current Plan
            </span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-white">
              $0
            </span>

            <span className="text-sm text-[#78716C]">
              {" "}
              / month
            </span>
          </div>

          <p className="mt-2 text-sm text-[#A8A29E]">
            Get started with your restaurant.
          </p>

          <div className="my-5 h-px bg-white/[0.06]" />

          <div className="space-y-3">
            {freeFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5"
              >
                <Check size={15} className="text-green-400" />

                <span className="text-sm text-[#D6D3D1]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            disabled
            className="mt-6 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2.5 text-sm text-[#78716C]"
          >
            Your Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="relative rounded-xl border border-orange-500/30 bg-[#1C1715] p-5">
          <div className="absolute right-4 top-4 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400">
            Recommended
          </div>

          <div className="flex items-center gap-2">
            <Crown size={19} className="text-orange-400" />

            <h2 className="text-lg font-semibold text-white">
              Premium
            </h2>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-white">
              $9.99
            </span>

            <span className="text-sm text-[#78716C]">
              {" "}
              / month
            </span>
          </div>

          <p className="mt-2 text-sm text-[#A8A29E]">
            Grow your restaurant without limits.
          </p>

          <div className="my-5 h-px bg-white/[0.06]" />

          <div className="space-y-3">
            {premiumFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5"
              >
                <Check size={15} className="text-orange-400" />

                <span className="text-sm text-[#D6D3D1]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              alert("Stripe subscription will be connected later!")
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Sparkles size={15} />
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Small Note */}
      <p className="text-center text-xs text-[#78716C]">
        You can upgrade your plan anytime. Premium subscription payments
        will be securely processed through Stripe.
      </p>
    </div>
  );
}