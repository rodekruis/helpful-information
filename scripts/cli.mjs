#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const [command, ...commandArgs] = process.argv.slice(2);

const hiaToolPath = resolve(join(import.meta.dirname, '../'));

/**
 * @param {string} executable
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function run(executable, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      stdio: 'inherit',
      env: process.env,
      cwd: hiaToolPath,
    });

    child.on('error', reject);
    child.on('exit', (exitCode, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      if (exitCode === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed with exit code ${exitCode}.`));
    });
  });
}

function printHelp() {
  console.log(`
The Helpful CLI

Usage:
  npx helpful-information <command> [args]

Commands:
  help, -h, --help            Show this help message
  update:search-index [args]  Update the search index
`);
}

try {
  switch (command) {
    case 'help':
    case '-h':
    case '--help': {
      printHelp();
      break;
    }

    case 'update-search-index': // Allow 'typos'
    case 'update:search-index': {
      await run(npmCommand, [
        'run',
        'update-search-index',
        '--',
        ...commandArgs,
      ]);
      break;
    }

    default: {
      if (command) {
        console.error(`Unknown command: ${command}`);
      }
      printHelp();
      process.exit(1);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
