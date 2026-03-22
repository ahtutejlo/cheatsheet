---
ua_question: "Як працює візуальна регресія у Playwright: снапшоти та стратегії порівняння?"
en_question: "How does visual regression work in Playwright: snapshots and diff strategies?"
ua_answer: |
  Playwright має вбудовану підтримку **visual regression testing** через `toHaveScreenshot()` та `toMatchSnapshot()`. Тести порівнюють поточний скріншот з еталонним (baseline) і фейляться, якщо різниця перевищує поріг.

  При першому запуску тест створює baseline-скріншот у директорії `__snapshots__`. Наступні запуски порівнюють поточний стан з baseline. Якщо є відмінності, Playwright зберігає actual, expected та diff зображення для аналізу.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('full page visual regression', async ({ page }) => {
    await page.goto('https://example.com');

    // Compare full page screenshot with baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      // Allow 0.2% pixel difference (animations, anti-aliasing)
      maxDiffPixelRatio: 0.002,
    });
  });

  test('component visual regression', async ({ page }) => {
    await page.goto('https://example.com');

    // Screenshot of specific element
    await expect(page.getByRole('navigation')).toHaveScreenshot('nav.png');
  });

  test('visual regression with dynamic content', async ({ page }) => {
    await page.goto('https://example.com/dashboard');

    // Mask dynamic areas (timestamps, avatars, ads)
    await expect(page).toHaveScreenshot('dashboard.png', {
      mask: [
        page.locator('.timestamp'),
        page.locator('.user-avatar'),
        page.locator('.ad-banner'),
      ],
      // Mask color
      maskColor: '#FF00FF',
    });
  });

  test('visual regression with threshold', async ({ page }) => {
    await page.goto('https://example.com');

    await expect(page).toHaveScreenshot('styled-page.png', {
      // Maximum number of different pixels
      maxDiffPixels: 100,
      // Or use ratio
      maxDiffPixelRatio: 0.01,
      // Threshold for individual pixel color difference (0-1)
      threshold: 0.3,
    });
  });
  ```

  ```typescript
  // Update baselines when UI intentionally changes:
  // npx playwright test --update-snapshots

  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    expect: {
      toHaveScreenshot: {
        maxDiffPixelRatio: 0.005,
        threshold: 0.2,
      },
    },
    // Snapshots are platform-specific (fonts differ between OS)
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
  });
  ```

  Скріншоти залежать від платформи (шрифти, рендеринг), тому baseline-и потрібно генерувати на тій самій платформі, де виконуються тести (зазвичай Docker у CI). Це ключова вимога для стабільних візуальних тестів.
en_answer: |
  Playwright has built-in support for **visual regression testing** through `toHaveScreenshot()` and `toMatchSnapshot()`. Tests compare the current screenshot with a baseline and fail if the difference exceeds a threshold.

  On the first run, the test creates a baseline screenshot in the `__snapshots__` directory. Subsequent runs compare the current state with the baseline. If there are differences, Playwright saves actual, expected, and diff images for analysis.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('full page visual regression', async ({ page }) => {
    await page.goto('https://example.com');

    // Compare full page screenshot with baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      // Allow 0.2% pixel difference (animations, anti-aliasing)
      maxDiffPixelRatio: 0.002,
    });
  });

  test('component visual regression', async ({ page }) => {
    await page.goto('https://example.com');

    // Screenshot of specific element
    await expect(page.getByRole('navigation')).toHaveScreenshot('nav.png');
  });

  test('visual regression with dynamic content', async ({ page }) => {
    await page.goto('https://example.com/dashboard');

    // Mask dynamic areas (timestamps, avatars, ads)
    await expect(page).toHaveScreenshot('dashboard.png', {
      mask: [
        page.locator('.timestamp'),
        page.locator('.user-avatar'),
        page.locator('.ad-banner'),
      ],
      // Mask color
      maskColor: '#FF00FF',
    });
  });

  test('visual regression with threshold', async ({ page }) => {
    await page.goto('https://example.com');

    await expect(page).toHaveScreenshot('styled-page.png', {
      // Maximum number of different pixels
      maxDiffPixels: 100,
      // Or use ratio
      maxDiffPixelRatio: 0.01,
      // Threshold for individual pixel color difference (0-1)
      threshold: 0.3,
    });
  });
  ```

  ```typescript
  // Update baselines when UI intentionally changes:
  // npx playwright test --update-snapshots

  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    expect: {
      toHaveScreenshot: {
        maxDiffPixelRatio: 0.005,
        threshold: 0.2,
      },
    },
    // Snapshots are platform-specific (fonts differ between OS)
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
  });
  ```

  Screenshots are platform-dependent (fonts, rendering), so baselines must be generated on the same platform where tests run (usually Docker in CI). This is a key requirement for stable visual tests.
section: "playwright"
order: 27
tags:
  - visual-regression
  - testing
type: "deep"
---
