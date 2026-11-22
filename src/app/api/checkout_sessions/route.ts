import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get logged-in user session
    const headersList = await headers();

    const sessionData = await auth.api.getSession({
      headers: headersList,
    });

    if (!sessionData) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    const vendor = sessionData.user;

    // Only Vendor can purchase Premium
    if (vendor.role !== "vendor") {
      return NextResponse.json(
        { error: "Only vendors can purchase Premium" },
        { status: 403 }
      );
    }

    if (vendor.subscriptionPlan === "premium") {
  return NextResponse.json(
    {
      error: "You have already purchased Premium. No need to pay again!",
    },
    { status: 409 }
  );
}

    const origin = headersList.get("origin") || request.nextUrl.origin;

    if (!origin) {
      return NextResponse.json(
        { error: "Origin not found" },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1UeBWfA3jFSCMLqEUNSiv0Xq",
          quantity: 1,
        },
      ],

      mode: "payment",

      customer_email: vendor.email,

      metadata: {
        vendorEmail: vendor.email,
        plan: "premium",
      },

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.redirect(checkoutSession.url!, 303);
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}