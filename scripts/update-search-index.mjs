#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { parseArgs } from 'node:util';

import { getSheetIdsFromConfig } from './lib/getSheetIdsFromConfig.mjs';
import { loadConfig } from './lib/loadConfig.mjs';

/**
 * @param {string} sheetId
 * @param {'local' | 'id-only'} from - Whether to read local data or send only the ID
 *
 * @returns {Promise<void>}
 */
async function processSheet(sheetId, from) {
  console.log(`Processing sheet ID: ${sheetId}...`);
  const requestBody = {
    googleSheetId: sheetId,
  };

  try {
    if (from === 'local') {
      console.log(`Reading local data...`);
      try {
        const sheetFile = readFileSync(
          resolve(`www/data/${sheetId}/values/Q&As`),
          'utf-8',
        );
        requestBody.data = JSON.parse(sheetFile);
        console.log(`Found: ${requestBody.data.values.length} rows.`);
      } catch (err) {
        console.error(`Failed to read or parse data: ${err.message}`);
      }
    }

    const response = await fetch(process.env.SEARCH_API_BACKEND, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.SEARCH_API_KEY_BACKEND,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`API Response: ${response.status} - ${await response.text()}`);
  } catch (error) {
    console.error(`Error processing sheet ID ${sheetId}:`, error);
  }
}

/**
 * @param {string[]} sheetIds
 * @param {'local' | 'id-only'} from - Whether to read local data or send only the ID
 *
 * @returns {Promise<void>}
 */
async function processAllSheetIds(sheetIds, from) {
  for (const [index, sheetId] of sheetIds.entries()) {
    await processSheet(sheetId, from);
    console.log(`Progress: ${index + 1} of ${sheetIds.length}`);
  }
}

// ----------------------------------------------------------------------------

// Load environment-variables from .env file
try {
  loadEnvFile(join(import.meta.dirname, '../.env'));
} catch (error) {
  console.warn('No .env file found, proceeding without it.', error);
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
  if (!process.env.SEARCH_API_BACKEND || !process.env.SEARCH_API_KEY_BACKEND) {
    throw new Error(
      'Environment-variables `SEARCH_API_BACKEND` and `SEARCH_API_KEY_BACKEND` not set or missing.',
    );
  }

  console.log('process.env: ', process.env);

  let sheetIds = [];

  if (process.env.REGIONS_SHEET_IDS?.length > 10) {
    console.log('Using Sheet IDs from environment-variable.');
    sheetIds = process.env.REGIONS_SHEET_IDS.split(',').map((id) => id.trim());
  } else if (process.env.REGION_CONFIG?.length > 10) {
    console.log('Using Sheet IDs from configuration-file.');
    const config = loadConfig();
    sheetIds = getSheetIdsFromConfig(config);
  } else {
    throw new Error('No Sheet IDs found in environment-variables or config.');
  }

  console.log(`Found: ${sheetIds.length} sheets.`);

  // Run the process
  processAllSheetIds(sheetIds, cli.values.from)
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
