import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: NextRequest) {
  console.log("✅ API HIT: /api/checkout");

  try {
    const body = await req.json();
    console.log("Received booking data:", body);

    const { firstName, lastName, email, phone, tickets } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !tickets ||
      !tickets.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const lineItems = tickets.map((ticket: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: ticket.reference,
        },
        unit_amount: Math.round(ticket.price * 100),
      },
      quantity: ticket.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}/cancel`,
      customer_email: email,
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        tickets: JSON.stringify(tickets),
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
