import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// Google Sheet ID
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID; // Replace with your Sheet ID

let credentialsObject: any; // Declaramos una variable para almacenar el objeto JSON de credenciales

try {
  const base64Credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;// Log para verificar que la variable de entorno está definida
  if (!base64Credentials) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 environment variable not set.");
  }

  // Decodificar la cadena Base64 y parsear el JSON
  const decodedCredentialsString = Buffer.from(base64Credentials, 'base64').toString('utf8').trim();
  

  credentialsObject = JSON.parse(decodedCredentialsString); // Asignamos el objeto JSON parseado
  
  // Verificar que las credenciales esenciales estén presentes
  if (!credentialsObject.client_email || !credentialsObject.private_key) {
    throw new Error("Decoded credentials JSON is missing client_email or private_key.");
  }

} catch (e) {
  console.error("Error loading or parsing Google service account credentials:", e);
  throw new Error("Failed to load Google credentials securely."); 
}

if (!SPREADSHEET_ID) {
  console.error("Missing GOOGLE_SPREADSHEET_ID in environment variables.");
  throw new Error("Google Spreadsheet ID is not configured.");
}

  



export async function POST(request: NextRequest) {
  try {
    const { attendance, visitDate, information } = await request.json();

    // ¡ESTA ES LA MANERA CORRECTA PARA VERCEL Y GoogleAuth!
    // Usamos la opción 'credentials' para pasar el objeto JSON directamente
    const auth = new google.auth.GoogleAuth({
      credentials: credentialsObject, // ¡Aquí pasas el objeto JSON parseado!
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

  // try {
  //   const { attendance, visitDate, information } = await request.json();

  //   // const auth = new google.auth.JWT({
  //   //   email: credentials.client_email,
  //   //   key: credentials.private_key,
  //   //   scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  //   // });

  //   const auth = new google.auth.GoogleAuth({
  //     credentials: credentials, // Path to your service account key file,
  //     scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  //   });

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
