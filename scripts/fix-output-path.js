#!/usr/bin/env node

import { dirname, join } from 'path';
import { existsSync, readdir, rename } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const possibleOutputPaths = [
  join(__dirname, '../www'),
  join(__dirname, '../../www'),
  join(__dirname, '../../public'),
];

const outputPath = possibleOutputPaths.find((option) => {
  return existsSync(option) && existsSync(join(option, 'browser'));
});

if (!outputPath) {
  console.log(`Output browser-path not found. Nothing to move.`);
  process.exit(0);
}

const browserPath = join(outputPath, 'browser');

readdir(browserPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Move all files from browserPath to outputPath
  files.forEach((file) => {
    const oldPath = join(browserPath, file);
    const newPath = join(outputPath, file);

    rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  console.log(`Moved files from ${browserPath} to ${outputPath}`);
});
