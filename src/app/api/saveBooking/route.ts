import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis"; // Import Google Sheets API

// Example: Your Google Sheets credentials and ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = "Bookings!A1:D"; // Adjust based on your sheet structure

// Set up Google Sheets API client
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse request body

    // Extract data
    const { name, email, tour, date } = body;

    // Validate inputs
    if (!name || !email || !tour || !date) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Data to be written to Google Sheets
    const values = [[name, email, tour, date]];

    // Insert the data into the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    console.log("Booking saved to Google Sheets:", response.data);

    // Return a success response
    return NextResponse.json(
      { message: "Booking saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving booking:", error);
    return NextResponse.json(
      { error: "Failed to save booking." },
      { status: 500 }
    );
  }
}
