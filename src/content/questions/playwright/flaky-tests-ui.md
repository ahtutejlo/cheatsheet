---
ua_question: "Як боротися з flaky тестами в UI-автоматизації?"
en_question: "How to deal with flaky tests in UI automation?"
ua_answer: |
  **Flaky тести** -- це тести, які іноді проходять, а іноді падають без змін у коді. У UI-автоматизації це найпоширеніша проблема, що підриває довіру до тестового набору.

  **Основні причини flaky тестів:**
  - Timing issues -- тест не чекає на готовність елемента
  - Shared state -- тести залежать один від одного
  - Недетерміновані дані -- timestamp, random ID, порядок API-відповідей
  - Анімації та transitions -- елемент рухається під час кліку
  - Third-party залежності -- реклама, analytics, CDN

  **Playwright-специфічні інструменти проти flakiness:**

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // Auto-retry failed tests
    retries: process.env.CI ? 2 : 0,

    // Timeout per test
    timeout: 30_000,

    // Assertion timeout
    expect: { timeout: 10_000 },

    use: {
      // Record trace for debugging flaky tests
      trace: 'on-first-retry',
      // Screenshot on failure
      screenshot: 'only-on-failure',
    },
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('stable test practices', async ({ page }) => {
    await page.goto('https://example.com');

    // GOOD: wait for specific state, not arbitrary time
    await expect(page.getByRole('heading')).toBeVisible();

    // GOOD: mock unstable external dependencies
    await page.route('**/analytics/**', (route) => route.abort());

    // GOOD: mask dynamic content in visual tests
    await expect(page).toHaveScreenshot('page.png', {
      mask: [page.locator('.timestamp'), page.locator('.random-ad')],
    });

    // GOOD: use test isolation -- each test has fresh context
    // No shared state between tests by default
  });

  test('finding flaky tests', async ({ page }) => {
    // Run specific test multiple times to detect flakiness:
    // npx playwright test --repeat-each=10 tests/checkout.spec.ts

    // Use --last-failed to re-run only failed tests:
    // npx playwright test --last-failed

    // Analyze trace from retry:
    // npx playwright show-trace test-results/checkout-retry1/trace.zip
  });
  ```

  Стратегія боротьби з flakiness: 1) увімкнути retries для раннього виявлення, 2) використовувати trace для діагностики, 3) виправити root cause (не маскувати retry), 4) регулярно запускати `--repeat-each` для виявлення нових flaky тестів.
en_answer: |
  **Flaky tests** are tests that sometimes pass and sometimes fail without code changes. In UI automation, this is the most common problem that undermines trust in the test suite.

  **Main causes of flaky tests:**
  - Timing issues -- test does not wait for element readiness
  - Shared state -- tests depend on each other
  - Non-deterministic data -- timestamp, random ID, API response order
  - Animations and transitions -- element moves during click
  - Third-party dependencies -- ads, analytics, CDN

  **Playwright-specific tools against flakiness:**

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // Auto-retry failed tests
    retries: process.env.CI ? 2 : 0,

    // Timeout per test
    timeout: 30_000,

    // Assertion timeout
    expect: { timeout: 10_000 },

    use: {
      // Record trace for debugging flaky tests
      trace: 'on-first-retry',
      // Screenshot on failure
      screenshot: 'only-on-failure',
    },
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('stable test practices', async ({ page }) => {
    await page.goto('https://example.com');

    // GOOD: wait for specific state, not arbitrary time
    await expect(page.getByRole('heading')).toBeVisible();

    // GOOD: mock unstable external dependencies
    await page.route('**/analytics/**', (route) => route.abort());

    // GOOD: mask dynamic content in visual tests
    await expect(page).toHaveScreenshot('page.png', {
      mask: [page.locator('.timestamp'), page.locator('.random-ad')],
    });

    // GOOD: use test isolation -- each test has fresh context
    // No shared state between tests by default
  });

  test('finding flaky tests', async ({ page }) => {
    // Run specific test multiple times to detect flakiness:
    // npx playwright test --repeat-each=10 tests/checkout.spec.ts

    // Use --last-failed to re-run only failed tests:
    // npx playwright test --last-failed

    // Analyze trace from retry:
    // npx playwright show-trace test-results/checkout-retry1/trace.zip
  });
  ```

  Strategy for fighting flakiness: 1) enable retries for early detection, 2) use traces for diagnosis, 3) fix the root cause (do not mask with retries), 4) regularly run `--repeat-each` to detect new flaky tests.
section: "playwright"
order: 30
tags:
  - flaky-tests
  - stability
type: "basic"
---
