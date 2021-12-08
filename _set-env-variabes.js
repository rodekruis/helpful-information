#!/usr/bin/env node

const fs = require('fs');

const configFileTemplate = require('./src/environments/environment.prod.ts.template.js');
const targetPath = './src/environments/environment.prod.ts';

fs.writeFile(targetPath, configFileTemplate, (err) => {
  if (process.env.DEBUG || process.env.CI) {
    console.log(configFileTemplate);
  }

  if (err) {
    console.error(err);
  }

  console.info(`Output generated at: ${targetPath}`);
});
