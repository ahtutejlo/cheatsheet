---
ua_question: "Як тестувати мобільну емуляцію та адаптивний дизайн у Playwright?"
en_question: "How to test mobile emulation and responsive design in Playwright?"
ua_answer: |
  Playwright підтримує емуляцію мобільних пристроїв, включаючи viewport, user agent, touch events, device scale factor та геолокацію. Це дозволяє тестувати адаптивний дизайн без реальних мобільних пристроїв.

  Playwright надає каталог попередньо налаштованих пристроїв (`playwright.devices`), що містить параметри для iPhone, Pixel, Galaxy та інших. Можна також задавати кастомний viewport.

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    projects: [
      { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
      { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
      { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
      {
        name: 'Tablet',
        use: {
          ...devices['iPad (gen 7)'],
          // Override specific properties
          locale: 'uk-UA',
        },
      },
    ],
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('responsive layout', async ({ page }) => {
    await page.goto('https://example.com');

    // Custom viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Mobile menu should be visible on small screens
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();

    // Desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).not.toBeVisible();
  });

  test('geolocation emulation', async ({ context, page }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 50.4501, longitude: 30.5234 });

    await page.goto('https://example.com/nearby');
    await expect(page.getByText('Kyiv')).toBeVisible();
  });
  ```

  Мобільна емуляція не замінює тестування на реальних пристроях для фінальної валідації, але є ефективним інструментом для раннього виявлення проблем адаптивності на етапі CI.
en_answer: |
  Playwright supports mobile device emulation, including viewport, user agent, touch events, device scale factor, and geolocation. This allows testing responsive design without real mobile devices.

  Playwright provides a catalog of preconfigured devices (`playwright.devices`) containing parameters for iPhone, Pixel, Galaxy, and others. Custom viewports can also be set.

  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    projects: [
      { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
      { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
      { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
      {
        name: 'Tablet',
        use: {
          ...devices['iPad (gen 7)'],
          // Override specific properties
          locale: 'uk-UA',
        },
      },
    ],
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('responsive layout', async ({ page }) => {
    await page.goto('https://example.com');

    // Custom viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Mobile menu should be visible on small screens
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();

    // Desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).not.toBeVisible();
  });

  test('geolocation emulation', async ({ context, page }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 50.4501, longitude: 30.5234 });

    await page.goto('https://example.com/nearby');
    await expect(page.getByText('Kyiv')).toBeVisible();
  });
  ```

  Mobile emulation does not replace testing on real devices for final validation, but it is an effective tool for early detection of responsiveness issues during CI.
section: "playwright"
order: 13
tags:
  - mobile
  - responsive
type: "basic"
---
