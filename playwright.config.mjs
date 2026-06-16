import { defineConfig, devices } from '@playwright/test';

// E2E tests for the Hero4 building reliability (see tests/hero4-building.spec.mjs).
// The dev server is started automatically; reused if already running.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321/option3',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
