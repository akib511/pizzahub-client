import Link from "next/link";
import { redirect } from "next/navigation";
import { XCircle, ArrowLeft, Home } from "lucide-react";
import { getUserSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export default async function PaymentCancelPage({
  searchParams,
}: PageProps<"/cancel">) {
  
  const session = await getUserSession();

  if (!session) {
    redirect("/sign-in");
  }

  const role = session.user.role;

  if (role !== "vendor") {
    redirect(role === "admin" ? "/admin" : "/customer/dashboard");
  }


  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;

  let sessionBelongsToVendor = true;

  if (sessionId) {
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId,
      );

      const ownerEmail = checkoutSession.metadata?.vendorEmail;

      sessionBelongsToVendor =
        !!ownerEmail &&
        ownerEmail.toLowerCase() === session.user.email.toLowerCase();
    } catch {
      
      sessionBelongsToVendor = true;
    }
  }

  if (!sessionBelongsToVendor) {
    redirect("/vendor/subscription");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl sm:p-10">

        {/* Cancel Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="h-12 w-12 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
          Payment Cancelled!
        </h1>

        <p className="mb-8 text-sm leading-6 text-muted-foreground">
          Your payment was not completed. No payment has been processed.
          You can try again whenever you are ready.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/menu"
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <ArrowLeft size={18} />
            Browse Menu
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
