#!/usr/bin/env node

import { writeFile } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { config } from 'dotenv';

const require = createRequire(import.meta.url);

// Load environment-variables from .env file
config({
  debug: process.env.DEBUG,
  override: true,
});

const configFileTemplate = require(
  join(
    import.meta.dirname,
    '../src/environments/environment.prod.ts.template.mjs',
  ),
).default;

const targetPath = join(
  import.meta.dirname,
  '../src/environments/environment.prod.ts',
);

writeFile(targetPath, configFileTemplate, (err) => {
  if (process.env.DEBUG || process.env.CI) {
    console.log(configFileTemplate);
  }

  if (err) {
    console.error(err);
  }

  console.info(`Output generated at: ${targetPath}`);
});
