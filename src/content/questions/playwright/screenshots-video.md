---
ua_question: "Як працюють скріншоти та відеозапис у Playwright?"
en_question: "How do screenshots and video recording work in Playwright?"
ua_answer: |
  Playwright підтримує створення скріншотів окремих елементів або цілої сторінки, а також запис відео тестів. Ці можливості важливі для дебагу та звітності.

  **Скріншоти** можна робити програмно через `page.screenshot()` або автоматично при падінні тесту через конфігурацію. Playwright підтримує full-page скріншоти (з прокруткою), скріншоти окремих елементів та маскування динамічного контенту.

  **Відео** записується на рівні BrowserContext і зберігається як `.webm` файл. Відео доступне тільки після закриття контексту.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('screenshot examples', async ({ page }) => {
    await page.goto('https://example.com');

    // Full page screenshot (scrolls entire page)
    await page.screenshot({ path: 'full-page.png', fullPage: true });

    // Element screenshot
    await page.getByRole('navigation').screenshot({ path: 'nav.png' });

    // Screenshot with mask (hide dynamic content)
    await page.screenshot({
      path: 'masked.png',
      mask: [page.locator('.dynamic-timestamp')],
    });
  });
  ```

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    use: {
      // Capture screenshot on failure
      screenshot: 'only-on-failure',
      // Record video on failure
      video: 'on-first-retry',
    },
  });
  ```

  Автоматичні скріншоти при падінні тестів (`screenshot: 'only-on-failure'`) -- найпоширеніша конфігурація. Відео краще вмикати тільки при retry (`video: 'on-first-retry'`), щоб не витрачати ресурси на успішні тести.
en_answer: |
  Playwright supports taking screenshots of individual elements or the full page, as well as recording test videos. These capabilities are important for debugging and reporting.

  **Screenshots** can be taken programmatically via `page.screenshot()` or automatically on test failure through configuration. Playwright supports full-page screenshots (with scrolling), element screenshots, and masking dynamic content.

  **Video** is recorded at the BrowserContext level and saved as a `.webm` file. Video is available only after the context is closed.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('screenshot examples', async ({ page }) => {
    await page.goto('https://example.com');

    // Full page screenshot (scrolls entire page)
    await page.screenshot({ path: 'full-page.png', fullPage: true });

    // Element screenshot
    await page.getByRole('navigation').screenshot({ path: 'nav.png' });

    // Screenshot with mask (hide dynamic content)
    await page.screenshot({
      path: 'masked.png',
      mask: [page.locator('.dynamic-timestamp')],
    });
  });
  ```

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    use: {
      // Capture screenshot on failure
      screenshot: 'only-on-failure',
      // Record video on failure
      video: 'on-first-retry',
    },
  });
  ```

  Automatic screenshots on test failure (`screenshot: 'only-on-failure'`) is the most common configuration. Video is best enabled only on retry (`video: 'on-first-retry'`) to avoid wasting resources on successful tests.
section: "playwright"
order: 8
tags:
  - debugging
  - artifacts
type: "basic"
---
