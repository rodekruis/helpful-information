#!/usr/bin/env node

const { google } = require('googleapis');
const fs = require('fs');

let credentials;

try {
  // Required:
  // GOOGLE_SHEETS_API_SERVICE_ACCOUNT='{"client_email":"user@example.org","private_key":"secret"}'
  credentials = JSON.parse(process.env.GOOGLE_SHEETS_API_SERVICE_ACCOUNT);
} catch (error) {
  console.error(
    'Error parsing Google Sheets API service account credentials:',
    error,
  );
}

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets.readonly'],
);

const sheets = google.sheets({
  version: 'v4',
  auth,
});

async function downloadSheet(spreadsheetId, range, outputFile) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = res.data.values;
    if (rows.length) {
      fs.writeFileSync(outputFile, JSON.stringify(res.data));
      console.log(`Google Sheet downloaded as: ${outputFile}`);
    } else {
      console.log('No data found.');
    }
  } catch (err) {
    console.error('The API says: ', err);
  }
}

//
// --------------------------------------------------------------------------
//

// Get variables from command-line arguments
const spreadsheetId = process.argv[2];

// Create the path(s) required to store the sheets
const path = `./www/data/${spreadsheetId}/values`;

if (!fs.existsSync(path)) {
  fs.mkdirSync(path, { recursive: true });
}

// See "SheetName"-enum in: ../src/app/services/spreadsheet.service.ts
const ranges = [
  'Referral Page',
  'Categories',
  'Sub-Categories',
  'Offers',
  'Q&As',
];

for (const range of ranges) {
  downloadSheet(spreadsheetId, range, `${path}/${range}`);
}
