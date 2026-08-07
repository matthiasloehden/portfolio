import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 2,
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: process.env.CI ? true : false,
    launchOptions: {
      args: ['--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader'],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
      },
    },
  ],
  webServer: {
    command: 'yarn dev --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/projects',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
