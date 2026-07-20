const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory where your test files are located
  testDir: './tests',

  // Maximum time one test can run for (30 seconds)
  timeout: 30 * 1000,

  expect: {
    // Maximum time expect() should wait for conditions to be met
    timeout: 5000,
  },

  // Run tests in files in parallel to save time
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only (0 retries locally, 2 on CI to catch flaky tests)
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI if needed, otherwise use default
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use. 'html' opens a beautiful browser dashboard on failure
  reporter: 'html',

  // Shared settings for all the projects below
  use: {
    // Base URL for shorter page.goto('/') calls if you choose to use them
    baseUrl: 'https://www.saucedemo.com',

    // Run headless (without opening a visible browser window)
    headless: true,

    // Collect trace when retrying a failed test
    trace: 'on-first-retry',

    // Automatically capture a screenshot if a test fails
    screenshot: 'only-on-failure',

    // Records video if a test fails
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // @ts-ignore
  use: {
  extraHTTPHeaders: {
    // Pass authentication tokens here globally for all API tests
    'Authorization': 'Bearer secret_sauce_token',
    'Accept': 'application/json',
  },
}
});