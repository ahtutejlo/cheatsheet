---
ua_question: "Налаштуйте sharding pipeline для Playwright у CI"
en_question: "Set up a sharding pipeline for Playwright in CI"
ua_answer: |
  **Сценарій:** 500+ E2E тестів, які виконуються 45 хвилин на одній машині. Потрібно зменшити час до 15 хвилин через sharding на 4 CI-машини з об'єднанням звітів.

  **Підхід:** Використати matrix strategy в GitHub Actions, blob reporter для збереження результатів кожного shard, та окремий job для merge.

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,

    reporter: process.env.CI
      ? [['blob'], ['github'], ['list']]
      : [['html', { open: 'on-failure' }]],

    use: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },

    projects: [
      { name: 'setup', testMatch: /.*\.setup\.ts/ },
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup'],
      },
    ],
  });
  ```

  ```typescript
  // .github/workflows/e2e.yml
  // name: E2E Tests
  // on:
  //   push:
  //     branches: [main]
  //   pull_request:
  //     branches: [main]
  //
  // jobs:
  //   e2e-tests:
  //     runs-on: ubuntu-latest
  //     container:
  //       image: mcr.microsoft.com/playwright:v1.49.0-noble
  //       options: --shm-size=2gb
  //     strategy:
  //       fail-fast: false
  //       matrix:
  //         shardIndex: [1, 2, 3, 4]
  //         shardTotal: [4]
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //         with:
  //           node-version: 20
  //           cache: npm
  //       - run: npm ci
  //       - name: Run tests
  //         run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
  //         env:
  //           BASE_URL: ${{ secrets.STAGING_URL }}
  //       - name: Upload blob report
  //         uses: actions/upload-artifact@v4
  //         if: ${{ !cancelled() }}
  //         with:
  //           name: blob-report-${{ matrix.shardIndex }}
  //           path: blob-report/
  //           retention-days: 3
  //
  //   merge-reports:
  //     if: ${{ !cancelled() }}
  //     needs: e2e-tests
  //     runs-on: ubuntu-latest
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //         with:
  //           node-version: 20
  //           cache: npm
  //       - run: npm ci
  //       - name: Download all blob reports
  //         uses: actions/download-artifact@v4
  //         with:
  //           path: all-blob-reports
  //           pattern: blob-report-*
  //           merge-multiple: true
  //       - name: Merge reports
  //         run: npx playwright merge-reports --reporter=html ./all-blob-reports
  //       - name: Upload HTML report
  //         uses: actions/upload-artifact@v4
  //         with:
  //           name: playwright-report
  //           path: playwright-report/
  //           retention-days: 14
  ```

  **Ключові моменти:** `fail-fast: false` -- всі shards виконуються до кінця, навіть якщо один впав. `!cancelled()` -- merge виконується навіть при невдачах. `retention-days` -- контроль розміру артефактів. `--shm-size=2gb` -- критично для стабільності браузерів у Docker.
en_answer: |
  **Scenario:** 500+ E2E tests that take 45 minutes on a single machine. Need to reduce time to 15 minutes through sharding across 4 CI machines with report merging.

  **Approach:** Use matrix strategy in GitHub Actions, blob reporter to save results from each shard, and a separate job for merging.

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,

    reporter: process.env.CI
      ? [['blob'], ['github'], ['list']]
      : [['html', { open: 'on-failure' }]],

    use: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },

    projects: [
      { name: 'setup', testMatch: /.*\.setup\.ts/ },
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup'],
      },
    ],
  });
  ```

  ```typescript
  // .github/workflows/e2e.yml
  // name: E2E Tests
  // on:
  //   push:
  //     branches: [main]
  //   pull_request:
  //     branches: [main]
  //
  // jobs:
  //   e2e-tests:
  //     runs-on: ubuntu-latest
  //     container:
  //       image: mcr.microsoft.com/playwright:v1.49.0-noble
  //       options: --shm-size=2gb
  //     strategy:
  //       fail-fast: false
  //       matrix:
  //         shardIndex: [1, 2, 3, 4]
  //         shardTotal: [4]
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //         with:
  //           node-version: 20
  //           cache: npm
  //       - run: npm ci
  //       - name: Run tests
  //         run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
  //         env:
  //           BASE_URL: ${{ secrets.STAGING_URL }}
  //       - name: Upload blob report
  //         uses: actions/upload-artifact@v4
  //         if: ${{ !cancelled() }}
  //         with:
  //           name: blob-report-${{ matrix.shardIndex }}
  //           path: blob-report/
  //           retention-days: 3
  //
  //   merge-reports:
  //     if: ${{ !cancelled() }}
  //     needs: e2e-tests
  //     runs-on: ubuntu-latest
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //         with:
  //           node-version: 20
  //           cache: npm
  //       - run: npm ci
  //       - name: Download all blob reports
  //         uses: actions/download-artifact@v4
  //         with:
  //           path: all-blob-reports
  //           pattern: blob-report-*
  //           merge-multiple: true
  //       - name: Merge reports
  //         run: npx playwright merge-reports --reporter=html ./all-blob-reports
  //       - name: Upload HTML report
  //         uses: actions/upload-artifact@v4
  //         with:
  //           name: playwright-report
  //           path: playwright-report/
  //           retention-days: 14
  ```

  **Key points:** `fail-fast: false` -- all shards run to completion even if one fails. `!cancelled()` -- merge runs even on failures. `retention-days` -- controls artifact size. `--shm-size=2gb` -- critical for browser stability in Docker.
section: "playwright"
order: 37
tags:
  - ci-cd
  - parallelism
type: "practical"
---
