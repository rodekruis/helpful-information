#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { loadEnvFile } from 'node:process';

// Load environment-variables from .env file
try {
  loadEnvFile(join(import.meta.dirname, '../.env'));
} catch (error) {
  console.warn('No .env file found, proceeding without it.', error);
}

const require = createRequire(import.meta.url);

const configFileTemplate = require(
  join(
    import.meta.dirname,
    '../src/environments/environment.prod.ts.template.mjs',
  ),
).default;

if (process.env.DEBUG || process.env.CI) {
  console.log(configFileTemplate);
}

const targetPath = join(
  import.meta.dirname,
  '../src/environments/environment.prod.ts',
);

console.log(`Writing to: ${targetPath}`);
writeFileSync(targetPath, configFileTemplate);
