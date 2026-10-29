/**
 * @typedef {import('@playwright/test').PlaywrightTestConfig} PlaywrightTestConfig
 * @typedef {import('@playwright/test').Devices} Devices
 */
import { defineConfig, devices } from '@playwright/test';

const IS_CI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/tests/',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 1 : undefined,
  /* See: https://playwright.dev/docs/test-reporters */
  reporter: IS_CI ? [['list'], ['github']] : 'list',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry' /* See: https://playwright.dev/docs/trace-viewer */,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      name: 'data-server',
      command: 'npm run serve:local-data',
      url: 'http://localhost:3003',
      reuseExistingServer: !IS_CI,
    },
    {
      name: 'client',
      command: 'npm run build:e2e && npm run serve:production',
      url: 'http://localhost:8080',
      reuseExistingServer: !IS_CI,
    },
  ],
});
