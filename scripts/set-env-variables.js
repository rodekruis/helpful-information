#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment-variables from .env file
dotenv.config({
  debug: process.env.DEBUG,
  override: true,
});

const configFileTemplate = require(
  path.join(__dirname, '../src/environments/environment.prod.ts.template.js'),
);
const targetPath = path.join(
  __dirname,
  '../src/environments/environment.prod.ts',
);

fs.writeFile(targetPath, configFileTemplate, (err) => {
  if (process.env.DEBUG || process.env.CI) {
    console.log(configFileTemplate);
  }

  if (err) {
    console.error(err);
  }

  console.info(`Output generated at: ${targetPath}`);
});
