"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Crown,
  Package,
  Sparkles,
  X,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function VendorSubscriptionPage() {
  const { data: session, isPending } = authClient.useSession();

  const [isPremium, setIsPremium] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const vendorEmail = session?.user?.email;

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

  // Get the latest subscription status
  useEffect(() => {
    let isMounted = true;

    const checkSubscription = async () => {
      try {
        const { data } = await authClient.getSession({
          query: {
            disableCookieCache: true,
          },
        });

        if (isMounted) {
          setIsPremium(
            data?.user?.subscriptionPlan === "premium"
          );
        }
      } catch (error) {
        console.error("Subscription check failed:", error);

        if (isMounted) {
          setIsPremium(
            session?.user?.subscriptionPlan === "premium"
          );
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    if (!isPending && session?.user) {
      checkSubscription();
    }

    return () => {
      isMounted = false;
    };
  }, [session, isPending]);

  const handleUpgrade = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (isPremium) {
      event.preventDefault();
      setShowDialog(true);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">

      {/* Already Premium Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowDialog(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="premium-dialog-title"
            className="relative w-full max-w-sm rounded-2xl border border-orange-500/20 bg-card p-6 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setShowDialog(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
              <Crown size={32} className="text-orange-400" />
            </div>

            <h2
              id="premium-dialog-title"
              className="mt-4 text-xl font-bold text-foreground"
            >
              You&apos;re Already Premium!
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You&apos;ve already completed your Premium payment.
              There&apos;s no need to pay again. Enjoy all your
              Premium features!
            </p>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-green-500/10 px-3 py-2.5 text-sm font-medium text-green-400">
              <ShieldCheck size={17} />
              Payment Successfully Completed
            </div>

            <button
              onClick={() => setShowDialog(false)}
              className="mt-5 w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Got it
            </button>
          </div>
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
              {" "} / forever
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Get started with your restaurant.
          </p>

          <div className="my-5 h-px bg-muted" />

          <div className="space-y-3">
            {freeFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
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
              {" "} / one-time
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Pay once and unlock premium features.
          </p>

          <div className="my-5 h-px bg-muted" />

          <div className="space-y-3">
            {premiumFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
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
              disabled={
                isPending ||
                isChecking ||
                !vendorEmail
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles size={15} />

              {isPending || isChecking
                ? "Checking Plan..."
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