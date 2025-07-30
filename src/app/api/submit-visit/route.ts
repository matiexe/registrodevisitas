import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// Google Sheet ID
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID; // Replace with your Sheet ID
 console.log(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID)
export async function POST(request: NextRequest) {
  try {
    const { attendance, visitDate, information } = await request.json();

    // const auth = new google.auth.JWT({
    //   email: credentials.client_email,
    //   key: credentials.private_key,
    //   scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    // });

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to your service account key file,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth: auth });
   
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "TESTAPP!A:C", // Assuming data goes into columns A, B, C
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[attendance,visitDate,information]],
      },
    });

    return NextResponse.json({ message: "Data submitted successfully", ...response.data });
  } catch (error: any) {
    console.error("Error submitting data:", error);
    return NextResponse.json({ message: "Error submitting data", error: error.message }, { status: 500 });
  }
}
