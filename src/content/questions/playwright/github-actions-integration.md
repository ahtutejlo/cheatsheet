---
ua_question: "Як інтегрувати Playwright з GitHub Actions та GitLab CI?"
en_question: "How to integrate Playwright with GitHub Actions and GitLab CI?"
ua_answer: |
  Playwright має офіційну підтримку для **GitHub Actions** та **GitLab CI**. Ключові аспекти інтеграції: встановлення браузерів, кешування, артефакти та sharding.

  **GitHub Actions** -- рекомендований підхід з офіційним Docker-образом або `setup-node` + кешування браузерів.

  ```typescript
  // .github/workflows/playwright.yml
  // name: Playwright Tests
  // on: [push, pull_request]
  // jobs:
  //   test:
  //     runs-on: ubuntu-latest
  //     container:
  //       image: mcr.microsoft.com/playwright:v1.49.0-noble
  //     strategy:
  //       matrix:
  //         shard: [1/4, 2/4, 3/4, 4/4]
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //         with:
  //           node-version: 20
  //           cache: 'npm'
  //       - run: npm ci
  //       - run: npx playwright test --shard=${{ matrix.shard }}
  //       - uses: actions/upload-artifact@v4
  //         if: ${{ !cancelled() }}
  //         with:
  //           name: blob-report-${{ strategy.job-index }}
  //           path: blob-report/
  //
  //   merge-reports:
  //     needs: test
  //     if: ${{ !cancelled() }}
  //     runs-on: ubuntu-latest
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //       - run: npm ci
  //       - uses: actions/download-artifact@v4
  //         with:
  //           path: all-blob-reports
  //           pattern: blob-report-*
  //           merge-multiple: true
  //       - run: npx playwright merge-reports --reporter=html ./all-blob-reports
  //       - uses: actions/upload-artifact@v4
  //         with:
  //           name: playwright-report
  //           path: playwright-report/
  ```

  ```typescript
  // .gitlab-ci.yml
  // playwright:
  //   image: mcr.microsoft.com/playwright:v1.49.0-noble
  //   stage: test
  //   parallel: 4
  //   script:
  //     - npm ci
  //     - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  //   artifacts:
  //     when: always
  //     paths:
  //       - playwright-report/
  //       - test-results/
  //     expire_in: 7 days
  ```

  ```typescript
  // playwright.config.ts -- CI-optimized
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,
    reporter: process.env.CI
      ? [['blob'], ['github']]
      : [['html', { open: 'on-failure' }]],
    use: {
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },
  });
  ```

  GitHub Actions `github` reporter автоматично додає анотації до PR з інформацією про невдалі тести. Це дозволяє бачити результати тестів безпосередньо в pull request без відкриття окремого звіту.
en_answer: |
  Playwright has official support for **GitHub Actions** and **GitLab CI**. Key integration aspects: browser installation, caching, artifacts, and sharding.

  **GitHub Actions** -- the recommended approach uses the official Docker image or `setup-node` + browser caching.

  ```typescript
  // .github/workflows/playwright.yml
  // name: Playwright Tests
  // on: [push, pull_request]
  // jobs:
  //   test:
  //     runs-on: ubuntu-latest
  //     container:
  //       image: mcr.microsoft.com/playwright:v1.49.0-noble
  //     strategy:
  //       matrix:
  //         shard: [1/4, 2/4, 3/4, 4/4]
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //         with:
  //           node-version: 20
  //           cache: 'npm'
  //       - run: npm ci
  //       - run: npx playwright test --shard=${{ matrix.shard }}
  //       - uses: actions/upload-artifact@v4
  //         if: ${{ !cancelled() }}
  //         with:
  //           name: blob-report-${{ strategy.job-index }}
  //           path: blob-report/
  //
  //   merge-reports:
  //     needs: test
  //     if: ${{ !cancelled() }}
  //     runs-on: ubuntu-latest
  //     steps:
  //       - uses: actions/checkout@v4
  //       - uses: actions/setup-node@v4
  //       - run: npm ci
  //       - uses: actions/download-artifact@v4
  //         with:
  //           path: all-blob-reports
  //           pattern: blob-report-*
  //           merge-multiple: true
  //       - run: npx playwright merge-reports --reporter=html ./all-blob-reports
  //       - uses: actions/upload-artifact@v4
  //         with:
  //           name: playwright-report
  //           path: playwright-report/
  ```

  ```typescript
  // .gitlab-ci.yml
  // playwright:
  //   image: mcr.microsoft.com/playwright:v1.49.0-noble
  //   stage: test
  //   parallel: 4
  //   script:
  //     - npm ci
  //     - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  //   artifacts:
  //     when: always
  //     paths:
  //       - playwright-report/
  //       - test-results/
  //     expire_in: 7 days
  ```

  ```typescript
  // playwright.config.ts -- CI-optimized
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,
    reporter: process.env.CI
      ? [['blob'], ['github']]
      : [['html', { open: 'on-failure' }]],
    use: {
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },
  });
  ```

  The GitHub Actions `github` reporter automatically adds annotations to PRs with information about failed tests. This allows seeing test results directly in the pull request without opening a separate report.
section: "playwright"
order: 35
tags:
  - ci-cd
  - pipeline
type: "basic"
---
