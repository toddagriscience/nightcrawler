// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Google Sheets source reader for sheet-backed DB importers.
 */

import { GoogleAuth } from 'google-auth-library';

/** Google Sheet file ID for the General IMPs workbook. */
const GENERAL_IMPS_SPREADSHEET_ID =
  '1CWjHsNkOcv7Dw7qLmWDDUFKlQNsgfx9RNIzSsZhDKGk';

/** Exact IMP tab name, including the source sheet's misspellings. */
const GENERAL_IMPS_TAB_NAME = 'Intergrated Managment Practices (IMPs)';

/** Explicit A:E range preserves leading blank column A for importer alignment. */
const GENERAL_IMPS_RANGE = `${GENERAL_IMPS_TAB_NAME}!A:E`;

/** Read-only Google Sheets API OAuth scope. */
const GOOGLE_SHEETS_READONLY_SCOPE =
  'https://www.googleapis.com/auth/spreadsheets.readonly';

/**
 * Fetches the General IMPs tab as display-value rows shaped for classify().
 *
 * @returns Sheet rows where cells[1..4] are Category, Trigger, Title, Body
 */
export async function fetchImpSheetRows(): Promise<string[][]> {
  const auth = new GoogleAuth({
    scopes: [GOOGLE_SHEETS_READONLY_SCOPE],
  });

  const client = await auth.getClient();
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${GENERAL_IMPS_SPREADSHEET_ID}` +
    `/values/${encodeURIComponent(GENERAL_IMPS_RANGE)}` +
    '?valueRenderOption=FORMATTED_VALUE';

  const response = await client.request<{ values?: string[][] }>({ url });
  return response.data.values ?? [];
}
