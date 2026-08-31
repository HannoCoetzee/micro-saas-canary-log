import { defineConfig, devices } from '@playwright/test';

// Use a unique port in CI to avoid conflicts when multiple repos run
// Playwright concurrently on the same self-hosted runner. Falls back to
// the standard port 3000 in local development.
const PORT = process.env.CI ? Number(process.env.E2E_PORT) || 3456 : 3000;

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: `npm run start -- -p ${PORT}`,
        port: PORT,
        reuseExistingServer: false,
        timeout: 120000,
      }
    : {
        command: `npm run dev -- -p ${PORT}`,
        port: PORT,
        reuseExistingServer: true,
        timeout: 120000,
      },
});
