#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const possibleOutputPaths = [
  path.join(__dirname, '../www'),
  path.join(__dirname, '../../www'),
  path.join(__dirname, '../../public'),
];

const outputPath = possibleOutputPaths.find((option) => {
  return fs.existsSync(option) && fs.existsSync(path.join(option, 'browser'));
});

if (!outputPath) {
  console.log(`Output browser-path not found. Nothing to move.`);
  process.exit(0);
}

const browserPath = path.join(outputPath, 'browser');

fs.readdir(browserPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Move all files from browserPath to outputPath
  files.forEach((file) => {
    const oldPath = path.join(browserPath, file);
    const newPath = path.join(outputPath, file);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });

  console.log(`Moved files from ${browserPath} to ${outputPath}`);
});
