---
ua_question: "Налаштуйте візуальну регресію з управлінням baseline для команди"
en_question: "Set up visual regression with baseline management for a team"
ua_answer: |
  **Сценарій:** Команда з 5 розробників працює над UI-бібліотекою. Потрібно налаштувати візуальну регресію, де baseline-скріншоти консистентні між усіма розробниками та CI, а оновлення baseline проходить через code review.

  **Підхід:** Docker для консистентного рендерингу, baseline-и в git, CI pipeline з автоматичним оновленням та PR для ревью.

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './visual-tests',

    expect: {
      toHaveScreenshot: {
        maxDiffPixelRatio: 0.005,
        threshold: 0.2,
        animations: 'disabled', // Disable CSS animations for stability
      },
    },

    // Consistent snapshot paths across team
    snapshotPathTemplate:
      '{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}',

    projects: [
      {
        name: 'desktop',
        use: {
          ...devices['Desktop Chrome'],
          // Fixed viewport for consistency
          viewport: { width: 1280, height: 720 },
        },
      },
      {
        name: 'mobile',
        use: {
          ...devices['iPhone 14'],
        },
      },
    ],

    use: {
      // Disable all dynamic content
      locale: 'en-US',
      timezoneId: 'UTC',
      colorScheme: 'light',
    },
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('component library -- buttons', async ({ page }) => {
    await page.goto('/storybook/buttons');

    // Freeze time for consistent timestamps
    await page.clock.setFixedTime(new Date('2024-01-01T00:00:00Z'));

    // Mask dynamic content
    await expect(page).toHaveScreenshot('buttons-all-variants.png', {
      fullPage: true,
      mask: [page.locator('.build-version')],
    });
  });

  test('component library -- forms', async ({ page }) => {
    await page.goto('/storybook/forms');

    // Screenshot specific component
    const formSection = page.getByTestId('form-examples');
    await expect(formSection).toHaveScreenshot('form-variants.png');
  });

  test('component library -- dark mode', async ({ page }) => {
    await page.goto('/storybook/buttons');
    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(page).toHaveScreenshot('buttons-dark-mode.png', {
      fullPage: true,
    });
  });
  ```

  ```typescript
  // scripts/update-screenshots.sh (run via Docker for consistency)
  // #!/bin/bash
  // docker run --rm -v $(pwd):/app -w /app \
  //   mcr.microsoft.com/playwright:v1.49.0-noble \
  //   npx playwright test --update-snapshots
  //
  // git add visual-tests/__screenshots__/
  // git commit -m "chore: update visual regression baselines"

  // .github/workflows/visual-regression.yml
  // name: Visual Regression
  // on: pull_request
  // jobs:
  //   visual:
  //     runs-on: ubuntu-latest
  //     container:
  //       image: mcr.microsoft.com/playwright:v1.49.0-noble
  //     steps:
  //       - uses: actions/checkout@v4
  //       - run: npm ci
  //       - run: npx playwright test visual-tests/
  //       - uses: actions/upload-artifact@v4
  //         if: failure()
  //         with:
  //           name: visual-diff
  //           path: test-results/
  ```

  **Ключові правила для команди:** 1) Baseline-и оновлюються тільки через Docker-скрипт (не локально), 2) Оновлення baseline -- окремий commit для зручного ревью, 3) PR з оновленням baseline потребує approval від дизайнера, 4) `animations: 'disabled'` та фіксований час усувають недетерміновані відмінності.
en_answer: |
  **Scenario:** A team of 5 developers works on a UI library. Need to set up visual regression where baseline screenshots are consistent across all developers and CI, and baseline updates go through code review.

  **Approach:** Docker for consistent rendering, baselines in git, CI pipeline with automated updates and PR for review.

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './visual-tests',

    expect: {
      toHaveScreenshot: {
        maxDiffPixelRatio: 0.005,
        threshold: 0.2,
        animations: 'disabled', // Disable CSS animations for stability
      },
    },

    // Consistent snapshot paths across team
    snapshotPathTemplate:
      '{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}',

    projects: [
      {
        name: 'desktop',
        use: {
          ...devices['Desktop Chrome'],
          // Fixed viewport for consistency
          viewport: { width: 1280, height: 720 },
        },
      },
      {
        name: 'mobile',
        use: {
          ...devices['iPhone 14'],
        },
      },
    ],

    use: {
      // Disable all dynamic content
      locale: 'en-US',
      timezoneId: 'UTC',
      colorScheme: 'light',
    },
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('component library -- buttons', async ({ page }) => {
    await page.goto('/storybook/buttons');

    // Freeze time for consistent timestamps
    await page.clock.setFixedTime(new Date('2024-01-01T00:00:00Z'));

    // Mask dynamic content
    await expect(page).toHaveScreenshot('buttons-all-variants.png', {
      fullPage: true,
      mask: [page.locator('.build-version')],
    });
  });

  test('component library -- forms', async ({ page }) => {
    await page.goto('/storybook/forms');

    // Screenshot specific component
    const formSection = page.getByTestId('form-examples');
    await expect(formSection).toHaveScreenshot('form-variants.png');
  });

  test('component library -- dark mode', async ({ page }) => {
    await page.goto('/storybook/buttons');
    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(page).toHaveScreenshot('buttons-dark-mode.png', {
      fullPage: true,
    });
  });
  ```

  ```typescript
  // scripts/update-screenshots.sh (run via Docker for consistency)
  // #!/bin/bash
  // docker run --rm -v $(pwd):/app -w /app \
  //   mcr.microsoft.com/playwright:v1.49.0-noble \
  //   npx playwright test --update-snapshots
  //
  // git add visual-tests/__screenshots__/
  // git commit -m "chore: update visual regression baselines"

  // .github/workflows/visual-regression.yml
  // name: Visual Regression
  // on: pull_request
  // jobs:
  //   visual:
  //     runs-on: ubuntu-latest
  //     container:
  //       image: mcr.microsoft.com/playwright:v1.49.0-noble
  //     steps:
  //       - uses: actions/checkout@v4
  //       - run: npm ci
  //       - run: npx playwright test visual-tests/
  //       - uses: actions/upload-artifact@v4
  //         if: failure()
  //         with:
  //           name: visual-diff
  //           path: test-results/
  ```

  **Key team rules:** 1) Baselines are updated only via Docker script (not locally), 2) Baseline updates are a separate commit for easy review, 3) PR with baseline updates requires approval from a designer, 4) `animations: 'disabled'` and fixed time eliminate non-deterministic differences.
section: "playwright"
order: 40
tags:
  - visual-regression
  - team
type: "practical"
---
