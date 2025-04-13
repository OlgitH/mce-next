import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any, // Explicit cast to bypass type checking
});

export async function POST(req: NextRequest) {
  console.log("✅ API HIT: /api/checkout"); // Debugging log

  try {
    const body = await req.json();
    console.log("Received booking data:", body);

    if (
      !body.tour ||
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: body.tour,
            },
            unit_amount: body.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}/cancel`,
      customer_email: body.email,
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        phone: body.phone, // stored, but not shown in customer_details
        tour: body.tour,
        date: body.date,
      },
    });

    console.log("✅ Stripe session created:", session.id);
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
