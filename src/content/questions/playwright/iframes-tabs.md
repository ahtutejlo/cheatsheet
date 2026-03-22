---
ua_question: "Як працювати з iframe та кількома вкладками/вікнами у Playwright?"
en_question: "How to work with iframes and multiple tabs/windows in Playwright?"
ua_answer: |
  Playwright надає зручний API для роботи з iframe та новими вкладками/вікнами. Для iframe використовується `frameLocator()` або `frame()`, а для нових вкладок -- подія `page` на BrowserContext.

  **Iframes** доступні через `page.frameLocator()`, який повертає локатор, що автоматично скопується всередину iframe. Це дозволяє використовувати звичайні локатори всередині фрейму без ручного перемикання контексту.

  **Нові вкладки/вікна** створюються при кліку на посилання з `target="_blank"` або через `window.open()`. Playwright перехоплює їх через `context.waitForEvent('page')`.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('interact with iframe', async ({ page }) => {
    await page.goto('https://example.com/embedded');

    // Access elements inside iframe
    const frame = page.frameLocator('#payment-iframe');
    await frame.getByLabel('Card number').fill('4242424242424242');
    await frame.getByRole('button', { name: 'Pay' }).click();

    // Nested iframes
    const nested = page
      .frameLocator('#outer-frame')
      .frameLocator('#inner-frame');
    await expect(nested.getByText('Success')).toBeVisible();
  });

  test('handle new tab', async ({ page, context }) => {
    await page.goto('https://example.com');

    // Wait for new page (tab) to open after click
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Open in new tab' }).click(),
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/\/new-page/);
    await expect(newPage.getByRole('heading')).toBeVisible();
  });

  test('handle popup window', async ({ page }) => {
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: 'Open popup' }).click(),
    ]);

    await popup.waitForLoadState();
    await popup.getByLabel('Name').fill('Test');
  });
  ```

  Важливо використовувати `Promise.all()` для одночасного очікування події та дії, що її спричиняє. Інакше є ризик пропустити подію, якщо вона відбудеться до початку очікування.
en_answer: |
  Playwright provides a convenient API for working with iframes and new tabs/windows. For iframes, `frameLocator()` or `frame()` is used, and for new tabs -- the `page` event on BrowserContext.

  **Iframes** are accessed via `page.frameLocator()`, which returns a locator scoped inside the iframe. This allows using regular locators inside the frame without manual context switching.

  **New tabs/windows** are created when clicking links with `target="_blank"` or via `window.open()`. Playwright captures them through `context.waitForEvent('page')`.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('interact with iframe', async ({ page }) => {
    await page.goto('https://example.com/embedded');

    // Access elements inside iframe
    const frame = page.frameLocator('#payment-iframe');
    await frame.getByLabel('Card number').fill('4242424242424242');
    await frame.getByRole('button', { name: 'Pay' }).click();

    // Nested iframes
    const nested = page
      .frameLocator('#outer-frame')
      .frameLocator('#inner-frame');
    await expect(nested.getByText('Success')).toBeVisible();
  });

  test('handle new tab', async ({ page, context }) => {
    await page.goto('https://example.com');

    // Wait for new page (tab) to open after click
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Open in new tab' }).click(),
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/\/new-page/);
    await expect(newPage.getByRole('heading')).toBeVisible();
  });

  test('handle popup window', async ({ page }) => {
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: 'Open popup' }).click(),
    ]);

    await popup.waitForLoadState();
    await popup.getByLabel('Name').fill('Test');
  });
  ```

  It is important to use `Promise.all()` for simultaneously waiting for the event and the action that triggers it. Otherwise, there is a risk of missing the event if it fires before listening starts.
section: "playwright"
order: 11
tags:
  - advanced
  - browser
type: "basic"
---
