"use client";

import { apiFetch } from "@/lib/api";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type VerificationStatus = "verifying" | "verified" | "failed";

export default function SuccessPage() {
  const router = useRouter();

  const { data: session, isPending, refetch } = authClient.useSession();

  const [status, setStatus] =
    useState<VerificationStatus>("verifying");

  const [message, setMessage] = useState(
    "Your payment has been received. Verifying your payment with Stripe...",
  );

  const signedInEmail = session?.user?.email;

  // Only run the verification once per visit
  const verificationStarted = useRef(false);

  // Verify the actual payment on the backend (never trust the URL alone)
  useEffect(() => {
    if (isPending || verificationStarted.current) return;

    // Only signed-in vendors reach this page (enforced by src/proxy.ts);
    // this is a safety net for unauthenticated visitors.
    if (!signedInEmail) {
      router.push("/sign-in");
      return;
    }

    verificationStarted.current = true;

    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(
        window.location.search,
      ).get("session_id");

      if (!sessionId) {
        setStatus("failed");
        setMessage(
          "Payment session not found. Please contact support.",
        );
        return;
      }

      try {
        const response = await apiFetch(
          `${API_URL}/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
        );

        const data = await response.json();

        if (response.ok && data.verified) {
          // The session must belong to the vendor who is signed in right now
          // (the backend already confirmed the session is actually paid).
          const ownerEmail =
            typeof data.vendorEmail === "string"
              ? data.vendorEmail.toLowerCase()
              : "";

          if (!ownerEmail || ownerEmail !== signedInEmail.toLowerCase()) {
            setStatus("failed");
            setMessage(
              "This payment session belongs to another account.",
            );
            return;
          }

          setStatus("verified");
          setMessage(
            "Your payment has been verified. Premium is now active!",
          );

          // Fetch fresh session data so the website shows Premium
          await refetch();
          return;
        }

        setStatus("failed");
        setMessage(
          data.message || "Payment could not be verified.",
        );
      } catch (error) {
        console.error("Payment verification failed:", error);

        setStatus("failed");
        setMessage(
          "Unable to verify your payment. Please try again.",
        );
      }
    };

    verifyPayment();
  }, [isPending, signedInEmail, refetch, router]);

  const icon =
    status === "verified" ? "✓" : status === "failed" ? "✕" : "…";

  const title =
    status === "verified"
      ? "Payment Received!"
      : status === "failed"
        ? "Payment Not Verified"
        : "Verifying Payment...";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center rounded-2xl border p-8">
        <div className="text-5xl mb-4">{icon}</div>

        <h1 className="text-2xl font-bold mb-3">
          {title}
        </h1>

        <p
          className={`mb-6 ${
            status === "verified"
              ? "text-green-400"
              : status === "failed"
                ? "text-red-400"
                : "text-muted-foreground"
          }`}
        >
          {message}
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
