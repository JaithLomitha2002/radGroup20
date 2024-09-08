import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests/tests',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:5174/',
    headless: false,
  },
});
