#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { parseArgs } from 'node:util';

import { createTokenList } from './lib/createTokenList.mjs';
import { getSheetIdsFromConfig } from './lib/getSheetIdsFromConfig.mjs';
import { isEnabled } from './lib/isEnabled.mjs';
import { loadConfig } from './lib/loadConfig.mjs';

const UPDATE_SEARCH_INDEX_ENDPOINT = 'create-vector-store';

/**
 * Create the full API URL
 * This can be set to a full URL (with path; like previously supported), or only the origin (minimal required value).
 *
 * @param {string} value
 * @return {string} The full API URL
 */
function createApiUrl(value) {
  try {
    const url = new URL(value);
    url.pathname = UPDATE_SEARCH_INDEX_ENDPOINT;
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid URL provided in SEARCH_API: "${value}".`, {
      cause: error,
    });
  }
}

/**
 * @param {string} apiUrl
 * @param {'local' | 'id-only'} from - Whether to read local data or send only the ID
 * @param {string} sheetId
 *
 * @returns {Promise<void>}
 */
async function processSheet(apiUrl, from, sheetId) {
  console.log(`Processing sheet ID: ${sheetId}...`);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const requestBody = {
    googleSheetId: sheetId,
  };

  try {
    if (from === 'local') {
      console.log(`Reading local data...`);
      try {
        headers.append('Authorization', process.env.SEARCH_API_KEY?.trim());

        const sheetFile = readFileSync(
          resolve(
            join(import.meta.dirname, `../www/data/${sheetId}/values/Q&As`),
          ),
          'utf-8',
        );
        requestBody.data = JSON.parse(sheetFile);
        console.log(`Found: ${requestBody.data.values.length} rows.`);
      } catch (err) {
        throw new Error(`Failed to read or parse data: ${err.message}`, {
          cause: err,
        });
      }
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log(`API Response: ${response.status} - ${await response.text()}`);
  } catch (error) {
    console.error(`Error processing sheet ID ${sheetId}:`, error);
  }
}

/**
 * @param {string} apiUrl
 * @param {'local' | 'id-only'} from - Whether to read local data or send only the ID
 * @param {string[]} sheetIds
 *
 * @returns {Promise<void>}
 */
async function processAllSheetIds(apiUrl, from, sheetIds) {
  for (const [index, sheetId] of sheetIds.entries()) {
    await processSheet(apiUrl, from, sheetId);
    console.log(`Progress: ${index + 1} of ${sheetIds.length}`);
  }
}

// ----------------------------------------------------------------------------

// Load environment-variables from .env file
try {
  loadEnvFile(join(import.meta.dirname, '../.env'));
} catch (_error) {
  console.info('No .env file found, proceeding without it.');
}

const cli = parseArgs({
  options: {
    from: {
      type: 'string',
      short: 'f',
      default: 'id-only',
    },
  },
});

try {
  if (!isEnabled(process.env.NG_USE_SEARCH_VIA_API)) {
    console.log('Search-via-API not set-up, skipping update of search-index.');
    console.info(
      'To enable, set all appropriate environment-variables. See: .env.example',
    );
    process.exit(0);
  }

  const apiUrl = createApiUrl(process.env.SEARCH_API);
  if (!apiUrl) {
    throw new Error(
      'Environment-variable `SEARCH_API` is required to update the search-index.',
    );
  }

  if (
    cli.values.from === 'local' &&
    (!process.env.SEARCH_API_KEY || !process.env.SEARCH_API_KEY.trim())
  ) {
    throw new Error(
      'Environment-variable `SEARCH_API_KEY` is required to update the search-index with local-data.',
    );
  }

  let sheetIds = [];

  if (process.env.REGIONS_SHEET_IDS?.length >= 1) {
    console.log('Using Sheet IDs from environment-variable: REGIONS_SHEET_IDS');
    sheetIds = createTokenList(process.env.REGIONS_SHEET_IDS);
  } else if (process.env.REGION_CONFIG?.length >= 40) {
    console.log('Using Sheet IDs from environment-variable: REGION_CONFIG');
    const regionSets = JSON.parse(process.env.REGION_CONFIG);

    const config = { regionSets: regionSets };
    sheetIds = getSheetIdsFromConfig(config);
  } else if (process.env.REGION_CONFIG?.length > 10) {
    console.log('Using Sheet IDs from configuration-file.');
    const config = loadConfig();
    sheetIds = getSheetIdsFromConfig(config);
  } else {
    throw new Error('No Sheet IDs found in environment-variables or config.');
  }

  console.log(`Found: ${sheetIds.length} sheets.`);

  // Run the process
  processAllSheetIds(apiUrl, cli.values.from, sheetIds)
    .then(() => {
      console.log('Finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to update search index:', error);
    });
} catch (error) {
  console.error('Script error:', error.message);
  process.exit(1);
}
