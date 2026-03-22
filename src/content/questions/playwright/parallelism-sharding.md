---
ua_question: "Як налаштувати паралелізм та sharding у Playwright?"
en_question: "How to configure parallelism and sharding in Playwright?"
ua_answer: |
  Playwright підтримує два рівні паралелізму: **workers** (паралелізм всередині одної машини) та **sharding** (розподіл між кількома CI-машинами).

  **Workers** -- це окремі процеси Node.js, що виконують тести паралельно. За замовчуванням тести з одного файлу йдуть послідовно, а файли розподіляються між workers. `fullyParallel: true` дозволяє паралельно виконувати навіть тести з одного файлу.

  **Sharding** розбиває весь набір тестів на N частин. Кожен CI-job отримує свою частину (`--shard=K/N`). Playwright розподіляє тести рівномірно.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    fullyParallel: true,

    // Workers per machine
    workers: process.env.CI ? 4 : undefined,

    // Stop after too many failures
    maxFailures: process.env.CI ? 10 : undefined,
  });
  ```

  ```typescript
  import { test } from '@playwright/test';

  // Force sequential execution for dependent tests
  test.describe.configure({ mode: 'serial' });

  test.describe('multi-step checkout', () => {
    test('step 1: add items', async ({ page }) => {});
    test('step 2: enter address', async ({ page }) => {});
    test('step 3: payment', async ({ page }) => {});
  });

  // Parallel by default (each test gets fresh context)
  test.describe('independent tests', () => {
    test('homepage loads', async ({ page }) => {});
    test('about page loads', async ({ page }) => {});
    test('contact page loads', async ({ page }) => {});
  });
  ```

  Команди для sharding у CI:
  ```typescript
  // Split tests across 4 CI machines:
  // Machine 1: npx playwright test --shard=1/4
  // Machine 2: npx playwright test --shard=2/4
  // Machine 3: npx playwright test --shard=3/4
  // Machine 4: npx playwright test --shard=4/4

  // Merge reports from all shards:
  // npx playwright merge-reports --reporter=html ./all-blob-reports
  ```

  Для ефективного sharding використовуйте blob reporter для збереження результатів кожного shard, а потім об'єднуйте їх у єдиний HTML-звіт. Це дозволяє бачити повну картину навіть при розподіленому виконанні.
en_answer: |
  Playwright supports two levels of parallelism: **workers** (parallelism within a single machine) and **sharding** (distribution across multiple CI machines).

  **Workers** are separate Node.js processes that execute tests in parallel. By default, tests from the same file run sequentially, while files are distributed across workers. `fullyParallel: true` allows parallel execution of tests even from the same file.

  **Sharding** splits the entire test suite into N parts. Each CI job gets its portion (`--shard=K/N`). Playwright distributes tests evenly.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    fullyParallel: true,

    // Workers per machine
    workers: process.env.CI ? 4 : undefined,

    // Stop after too many failures
    maxFailures: process.env.CI ? 10 : undefined,
  });
  ```

  ```typescript
  import { test } from '@playwright/test';

  // Force sequential execution for dependent tests
  test.describe.configure({ mode: 'serial' });

  test.describe('multi-step checkout', () => {
    test('step 1: add items', async ({ page }) => {});
    test('step 2: enter address', async ({ page }) => {});
    test('step 3: payment', async ({ page }) => {});
  });

  // Parallel by default (each test gets fresh context)
  test.describe('independent tests', () => {
    test('homepage loads', async ({ page }) => {});
    test('about page loads', async ({ page }) => {});
    test('contact page loads', async ({ page }) => {});
  });
  ```

  Commands for CI sharding:
  ```typescript
  // Split tests across 4 CI machines:
  // Machine 1: npx playwright test --shard=1/4
  // Machine 2: npx playwright test --shard=2/4
  // Machine 3: npx playwright test --shard=3/4
  // Machine 4: npx playwright test --shard=4/4

  // Merge reports from all shards:
  // npx playwright merge-reports --reporter=html ./all-blob-reports
  ```

  For efficient sharding, use the blob reporter to save results from each shard, then merge them into a single HTML report. This allows seeing the full picture even with distributed execution.
section: "playwright"
order: 32
tags:
  - ci-cd
  - parallelism
type: "basic"
---
