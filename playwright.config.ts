
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  testMatch: '*.pl.tsx',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: 'list',

  use: {
    baseURL: 'http://localhost:4000',

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],

  webServer: {
    command: 'npm run start',

    url: 'http://localhost:4000',

    reuseExistingServer: !process.env.CI,

    timeout: 120000
  }
});
