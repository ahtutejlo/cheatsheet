---
ua_question: "Як налаштувати стратегію retry у Playwright?"
en_question: "How to configure retry strategy in Playwright?"
ua_answer: |
  Playwright підтримує автоматичний **retry** невдалих тестів. При retry тест виконується повністю з нуля -- з новим BrowserContext, новою Page та новими fixtures. Це гарантує, що повторне виконання не залежить від стану попередньої спроби.

  **Конфігурація retry** задається глобально або per-project. `maxFailures` зупиняє весь прогін після N невдач -- корисно для швидкого fail-fast у CI.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // Retry only in CI
    retries: process.env.CI ? 2 : 0,

    // Stop the entire run after 10 failures
    maxFailures: process.env.CI ? 10 : undefined,

    projects: [
      {
        name: 'critical-tests',
        testMatch: /critical\/.*/,
        retries: 3, // More retries for critical tests
      },
      {
        name: 'regular-tests',
        testMatch: /tests\/.*/,
        retries: 1,
      },
    ],
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('retry-aware test', async ({ page }, testInfo) => {
    await page.goto('https://example.com');

    // Check if this is a retry
    if (testInfo.retry > 0) {
      console.log(`Retry attempt ${testInfo.retry}`);
      // Maybe add extra waiting or different strategy on retry
    }

    await expect(page.getByRole('heading')).toBeVisible();
  });

  // Conditional logic based on retry count
  test('test with retry hooks', async ({ page }, testInfo) => {
    // testInfo.retry: 0 = first attempt, 1 = first retry, etc.
    await page.goto('https://example.com');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Success')).toBeVisible({
      // Increase timeout on retry
      timeout: testInfo.retry > 0 ? 30_000 : 10_000,
    });
  });
  ```

  **Важливо:** retry -- це інструмент для виявлення flaky тестів, а не для їх маскування. Якщо тест постійно потребує retry, потрібно знайти і виправити root cause. Використовуйте `trace: 'on-first-retry'` для діагностики причин невдач.
en_answer: |
  Playwright supports automatic **retry** of failed tests. On retry, the test executes completely from scratch -- with a new BrowserContext, new Page, and new fixtures. This guarantees that the re-execution does not depend on the state of the previous attempt.

  **Retry configuration** is set globally or per-project. `maxFailures` stops the entire run after N failures -- useful for fast fail-fast in CI.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // Retry only in CI
    retries: process.env.CI ? 2 : 0,

    // Stop the entire run after 10 failures
    maxFailures: process.env.CI ? 10 : undefined,

    projects: [
      {
        name: 'critical-tests',
        testMatch: /critical\/.*/,
        retries: 3, // More retries for critical tests
      },
      {
        name: 'regular-tests',
        testMatch: /tests\/.*/,
        retries: 1,
      },
    ],
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('retry-aware test', async ({ page }, testInfo) => {
    await page.goto('https://example.com');

    // Check if this is a retry
    if (testInfo.retry > 0) {
      console.log(`Retry attempt ${testInfo.retry}`);
      // Maybe add extra waiting or different strategy on retry
    }

    await expect(page.getByRole('heading')).toBeVisible();
  });

  // Conditional logic based on retry count
  test('test with retry hooks', async ({ page }, testInfo) => {
    // testInfo.retry: 0 = first attempt, 1 = first retry, etc.
    await page.goto('https://example.com');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Success')).toBeVisible({
      // Increase timeout on retry
      timeout: testInfo.retry > 0 ? 30_000 : 10_000,
    });
  });
  ```

  **Important:** retry is a tool for detecting flaky tests, not for masking them. If a test consistently requires retries, the root cause needs to be found and fixed. Use `trace: 'on-first-retry'` for diagnosing failure causes.
section: "playwright"
order: 34
tags:
  - ci-cd
  - configuration
type: "basic"
---
