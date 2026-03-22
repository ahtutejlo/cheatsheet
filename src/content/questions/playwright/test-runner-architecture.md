---
ua_question: "Як працює test runner Playwright: workers, паралелізм, sharding?"
en_question: "How does the Playwright test runner work: workers, parallelism, sharding?"
ua_answer: |
  Playwright Test runner використовує **worker processes** для паралельного виконання тестів. Кожен worker -- це окремий процес Node.js, що забезпечує повну ізоляцію між тестами на рівні процесу.

  За замовчуванням кількість workers дорівнює половині кількості CPU-ядер. Тести з одного файлу виконуються послідовно в одному worker (за замовчуванням), а файли розподіляються між workers. Це можна змінити через `fullyParallel: true`.

  **Sharding** дозволяє розподілити тести між кількома CI-машинами. Кожен shard виконує свою частину тестів, а результати об'єднуються.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // Number of parallel workers
    workers: process.env.CI ? 4 : undefined,

    // Run all tests in parallel (not just files)
    fullyParallel: true,

    // Fail fast: stop after N failures
    maxFailures: process.env.CI ? 10 : undefined,

    // Retry failed tests
    retries: process.env.CI ? 2 : 0,

    // Reporter configuration
    reporter: process.env.CI
      ? [['html'], ['github']]
      : [['html', { open: 'never' }]],
  });
  ```

  ```typescript
  import { test } from '@playwright/test';

  // Sequential within describe block
  test.describe.configure({ mode: 'serial' });

  test.describe('checkout flow', () => {
    test('add to cart', async ({ page }) => {
      // Step 1
    });

    test('fill shipping', async ({ page }) => {
      // Step 2 -- depends on step 1
    });

    test('complete payment', async ({ page }) => {
      // Step 3 -- depends on step 2
    });
  });
  ```

  Для CI sharding виконується через CLI: `npx playwright test --shard=1/4` (перший shard з чотирьох). Playwright розбиває список тестів рівномірно між shards на основі часу виконання (якщо доступний `.last-run.json`). Результати HTML-репортів з різних shards можна об'єднати через `npx playwright merge-reports`.
en_answer: |
  The Playwright Test runner uses **worker processes** for parallel test execution. Each worker is a separate Node.js process, ensuring full process-level isolation between tests.

  By default, the number of workers equals half the CPU cores. Tests from the same file run sequentially in one worker (by default), while files are distributed across workers. This can be changed with `fullyParallel: true`.

  **Sharding** allows distributing tests across multiple CI machines. Each shard executes its portion of tests, and results are merged.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // Number of parallel workers
    workers: process.env.CI ? 4 : undefined,

    // Run all tests in parallel (not just files)
    fullyParallel: true,

    // Fail fast: stop after N failures
    maxFailures: process.env.CI ? 10 : undefined,

    // Retry failed tests
    retries: process.env.CI ? 2 : 0,

    // Reporter configuration
    reporter: process.env.CI
      ? [['html'], ['github']]
      : [['html', { open: 'never' }]],
  });
  ```

  ```typescript
  import { test } from '@playwright/test';

  // Sequential within describe block
  test.describe.configure({ mode: 'serial' });

  test.describe('checkout flow', () => {
    test('add to cart', async ({ page }) => {
      // Step 1
    });

    test('fill shipping', async ({ page }) => {
      // Step 2 -- depends on step 1
    });

    test('complete payment', async ({ page }) => {
      // Step 3 -- depends on step 2
    });
  });
  ```

  For CI, sharding is done via CLI: `npx playwright test --shard=1/4` (first shard out of four). Playwright splits the test list evenly across shards based on execution time (if `.last-run.json` is available). HTML reports from different shards can be merged using `npx playwright merge-reports`.
section: "playwright"
order: 18
tags:
  - architecture
  - parallelism
type: "deep"
---
