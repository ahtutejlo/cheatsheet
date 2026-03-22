---
ua_question: "Яка стратегія крос-браузерного тестування у Playwright?"
en_question: "What is the cross-browser testing strategy in Playwright?"
ua_answer: |
  Playwright підтримує три браузерних рушії: **Chromium** (Chrome, Edge), **Firefox** і **WebKit** (Safari). На відміну від Selenium, де потрібні окремі драйвери, Playwright постачається з усіма трьома рушіями та оновлює їх разом з фреймворком.

  Стратегія крос-браузерного тестування базується на **projects** у конфігурації. Кожен project -- це окрема конфігурація запуску тестів з певним браузером, viewport та іншими параметрами. Всі тести виконуються для кожного project.

  **Рекомендована стратегія:**
  - Основне тестування на Chromium (найшвидший, найбільша частка ринку)
  - Повний набір тестів на Firefox та WebKit у CI (нічний запуск або перед релізом)
  - Критичні user flows -- на всіх трьох рушіях при кожному PR

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    projects: [
      // Desktop browsers
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },

      // Mobile browsers
      {
        name: 'mobile-chrome',
        use: { ...devices['Pixel 7'] },
      },
      {
        name: 'mobile-safari',
        use: { ...devices['iPhone 14'] },
      },

      // Branded browsers (use same engine)
      {
        name: 'edge',
        use: {
          ...devices['Desktop Edge'],
          channel: 'msedge',
        },
      },
      {
        name: 'chrome',
        use: {
          ...devices['Desktop Chrome'],
          channel: 'chrome',
        },
      },
    ],
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  // Skip test for specific browser
  test('webkit-only feature', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');
    await page.goto('https://example.com');
  });

  // Conditional logic per browser
  test('cross-browser aware test', async ({ page, browserName }) => {
    await page.goto('https://example.com');

    if (browserName === 'firefox') {
      // Firefox-specific assertion
      await expect(page.locator('.ff-fallback')).toBeVisible();
    }
  });
  ```

  Важливо: WebKit у Playwright -- це headless-версія рушія Safari, а не повноцінний Safari. Для фінальної валідації Safari-специфічних функцій потрібне тестування на реальних Apple-пристроях.
en_answer: |
  Playwright supports three browser engines: **Chromium** (Chrome, Edge), **Firefox**, and **WebKit** (Safari). Unlike Selenium, which requires separate drivers, Playwright ships with all three engines and updates them alongside the framework.

  The cross-browser testing strategy is based on **projects** in the configuration. Each project is a separate test run configuration with a specific browser, viewport, and other parameters. All tests execute for each project.

  **Recommended strategy:**
  - Primary testing on Chromium (fastest, largest market share)
  - Full test suite on Firefox and WebKit in CI (nightly run or before release)
  - Critical user flows -- on all three engines for every PR

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    projects: [
      // Desktop browsers
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },

      // Mobile browsers
      {
        name: 'mobile-chrome',
        use: { ...devices['Pixel 7'] },
      },
      {
        name: 'mobile-safari',
        use: { ...devices['iPhone 14'] },
      },

      // Branded browsers (use same engine)
      {
        name: 'edge',
        use: {
          ...devices['Desktop Edge'],
          channel: 'msedge',
        },
      },
      {
        name: 'chrome',
        use: {
          ...devices['Desktop Chrome'],
          channel: 'chrome',
        },
      },
    ],
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  // Skip test for specific browser
  test('webkit-only feature', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');
    await page.goto('https://example.com');
  });

  // Conditional logic per browser
  test('cross-browser aware test', async ({ page, browserName }) => {
    await page.goto('https://example.com');

    if (browserName === 'firefox') {
      // Firefox-specific assertion
      await expect(page.locator('.ff-fallback')).toBeVisible();
    }
  });
  ```

  Important: WebKit in Playwright is a headless version of the Safari engine, not the full Safari browser. For final validation of Safari-specific features, testing on real Apple devices is required.
section: "playwright"
order: 26
tags:
  - ci-cd
  - strategy
type: "deep"
---
