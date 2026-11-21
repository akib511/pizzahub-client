import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center rounded-2xl border p-8">
        <div className="text-5xl mb-4">✓</div>

        <h1 className="text-2xl font-bold mb-3">
          Payment Received!
        </h1>

        <p className="text-muted-foreground mb-6">
          Your payment has been received. Stripe is confirming your
          payment. Your Premium plan will be activated shortly.
        </p>

        <Link
          href="/vendor/subscription"
          className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground"
        >
          Back to Subscription
        </Link>
      </div>
    </div>
  );
}