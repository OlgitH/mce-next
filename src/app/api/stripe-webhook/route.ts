import { google } from "googleapis";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Google Sheets API credentials
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL!;
const SERVICE_ACCOUNT_PRIVATE_KEY =
  process.env.SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n");
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15" as any, // Casting apiVersion to `any` to bypass type checking
});

// Google Auth Setup
async function authenticateGoogleSheets() {
  const auth = new google.auth.JWT(
    SERVICE_ACCOUNT_EMAIL,
    undefined,
    SERVICE_ACCOUNT_PRIVATE_KEY,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  return google.sheets({ version: "v4", auth });
}

// Save data to Google Sheets
async function saveToSpreadsheet(session: any) {
  const sheets = await authenticateGoogleSheets();

  try {
    // Log session data to verify its structure
    console.log(
      "Attempting to save to Google Sheets with session data:",
      session
    );

    // Extract necessary details from the session object
    const customerName = session.customer_details?.name || "No name"; // Extract customer name
    const customerEmail = session.customer_details?.email || "No email"; // Extract customer email
    const customerPhone = session.customer_details?.phone || "No phone";
    const tourType = session.metadata?.tour || "Unknown"; // Assuming 'tour' metadata field is present
    const bookingDate = new Date().toLocaleDateString("en-GB");
    const sessionId = session.id || "N/A"; // Default fallback if not present

    // Create the row of values to append to the sheet
    const values = [
      [
        customerName,
        customerEmail,
        customerPhone,
        tourType,
        bookingDate,
        sessionId,
      ],
    ];

    // Append values to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID, // Spreadsheet ID
      range: "Bookings!A2:F", // Specify the range for the sheet (starting from A2 to E)
      requestBody: {
        values,
      },
      valueInputOption: "RAW",
    });

    // Log response for debugging
    console.log("Data successfully written to Google Sheets:", response);
  } catch (err: any) {
    // Typing `err` as `any` to catch all errors, as err may vary
    // Log error details for debugging
    console.error("Error saving to Google Sheets:", err.message);
    console.error("Detailed error:", err);
  }
}

export async function POST(request: Request) {
  try {
    // Retrieve the raw body and the Stripe signature from the request headers
    const body = await request.text(); // This gives the raw request body
    const signature = request.headers.get("stripe-signature"); // signature can be null

    if (!signature) {
      throw new Error("Missing stripe-signature header");
    }

    // Log the raw body and signature for debugging purposes
    console.log("Raw body:", body);
    console.log("Stripe Signature:", signature);

    // Verify the Stripe webhook signature with the raw body and the signature from the header
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    // Log the event data for debugging
    console.log("Event received from Stripe:", event);

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        console.log("Checkout session completed:", session);

        // Save the data to your spreadsheet
        await saveToSpreadsheet(session);
        break;

      default:
        console.log("Unhandled event type:", event.type);
    }

    // Return a response indicating that the webhook was successfully processed
    return new NextResponse("Webhook received successfully", { status: 200 });
  } catch (err: any) {
    // Typing `err` as `any` to catch all errors
    // Log any errors that occur in processing the webhook
    console.error("Error handling webhook:", err);

    // Respond with a 400 error for failed signature verification or other issues
    return new NextResponse("Webhook error: " + err.message, { status: 400 });
  }
}
