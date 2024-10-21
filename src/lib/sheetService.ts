import { google, sheets_v4 } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Definiere den Typ für die Google Service Account Credentials
interface GoogleServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Lese die Google Service Account Credentials aus der Umgebung oder einer JSON-Datei
let credentials: GoogleServiceAccountCredentials;

if (fs.existsSync(path.join(process.cwd(), 'lib', 'service-account.json'))) {
  const keyFile = path.join(process.cwd(), 'lib', 'service-account.json');
  credentials = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
} else {
  // Debugging: Überprüfe, ob die Umgebungsvariable definiert ist
  const privateKey = import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not defined.');
  }

  // Ersetze die Zeilenumbrüche und initialisiere das Credentials-Objekt
  credentials = {
    type: import.meta.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
    project_id: import.meta.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: privateKey.replace(/\\n/g, '\n'),
    client_email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: import.meta.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: import.meta.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI,
    token_uri: import.meta.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url: import.meta.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: import.meta.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  };
}

console.log('Credentials:', credentials);

export async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    const authClient = (await auth.getClient()) as sheets_v4.Params$Resource$Spreadsheets$Values$Get['auth'];
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Typ für die gesamte API-Antwort
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: import.meta.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A2:K',
    });

    // Greife auf die Daten in response.data zu
    const data = response.data;

    // Typüberprüfung: Existiert data.values und ist es ein Array?
    if (!data.values || !Array.isArray(data.values)) {
      throw new Error('No data found');
    }

    // Typ für die Werte als Array von Arrays von Strings
    const rows = data.values as string[][];

    if (!rows || rows.length === 0) {
      throw new Error('No data found');
    }

    console.log('Rows:', rows); // Debugging-Ausgabe der Zeilen
    return rows;
  } catch (error) {
    // Typüberprüfung für Error-Objekt
    if (error instanceof Error) {
      console.error('Error fetching data from Google Sheets:', error.message);
      throw new Error(`Failed to fetch data from Google Sheets: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
      throw new Error('An unknown error occurred while fetching data from Google Sheets.');
    }
  }
}
