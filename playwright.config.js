// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Playwright config for the Norpeak website (Expo Router / React Native Web).
 *
 * The frontend is served by Metro via `expo start --web` on port 8081. The first
 * web bundle can take a while, so the webServer + navigation timeouts are generous.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // First Metro bundle is slow; give each test room before the server is warm.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:8081",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 60_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },

    // Cross-browser coverage — enable with:
    //   npx playwright install firefox webkit
    // then uncomment:
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    // Starts the Expo web dev server from the repo root (see root package.json scripts).
    command: "npm run dev:frontend",
    url: "http://localhost:8081",
    reuseExistingServer: !process.env.CI,
    // Metro's first web build is heavy — allow up to 3 minutes to come online.
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
