import { defineConfig, devices } from '@playwright/test'

import type { SmokeOptions } from './smoke/fixtures.ts'

/**
 * Smoke test with screenshot comparison: proves that a refactoring
 * changes neither look nor behavior. Reference images are platform
 * specific and only regenerated on purpose (`--update-snapshots`).
 */
export default defineConfig<SmokeOptions>({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 0,
      threshold: 0,
    },
  },
  fullyParallel: true,
  projects: [
    {
      name: 'light',
      use: { theme: 'light' },
    },
    {
      name: 'dark',
      use: { theme: 'dark' },
    },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{platform}/{testFilePath}/{arg}-{projectName}{ext}',
  testDir: './smoke',
  testMatch: '**/*.smoke.ts',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:5173',
    launchOptions: { args: ['--disable-partial-raster'] },
    viewport: { height: 900, width: 1440 },
  },
  webServer: [
    {
      command: 'uv run uvicorn app.main:app --port 8000',
      cwd: '../backend',
      reuseExistingServer: !process.env.CI,
      url: 'http://localhost:8000/health',
    },
    {
      command: 'npm run dev',
      reuseExistingServer: !process.env.CI,
      url: 'http://localhost:5173',
    },
  ],
})
