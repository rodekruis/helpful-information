#!/usr/bin/env node

import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { writeFile } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment-variables from .env file
dotenv.config({
  debug: process.env.DEBUG,
  override: true,
});

const { default: configFileTemplate } = await import(
  join(__dirname, '../src/environments/environment.prod.ts.template.js')
);
const targetPath = join(__dirname, '../src/environments/environment.prod.ts');

writeFile(targetPath, configFileTemplate, (err) => {
  if (process.env.DEBUG || process.env.CI) {
    console.log(configFileTemplate);
  }

  if (err) {
    console.error(err);
  }

  console.info(`Output generated at: ${targetPath}`);
});
