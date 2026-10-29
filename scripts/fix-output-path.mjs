#!/usr/bin/env node

import { existsSync, readdir, rename } from 'node:fs';
import { join } from 'node:path';

const possibleOutputPaths = [
  join(import.meta.dirname, '../www'),
  join(import.meta.dirname, '../../www'),
  join(import.meta.dirname, '../../public'),
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
