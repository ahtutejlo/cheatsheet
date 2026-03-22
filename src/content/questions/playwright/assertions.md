---
ua_question: "Як працюють assertions у Playwright? Що таке soft assertions?"
en_question: "How do assertions work in Playwright? What are soft assertions?"
ua_answer: |
  Playwright має вбудовану бібліотеку assertions, яка працює з **auto-retrying**. На відміну від звичайних assertion-бібліотек (Jest, Chai), `expect(locator)` повторює перевірку протягом таймауту, поки умова не виконається.

  Основні web-first assertions: `toBeVisible()`, `toBeEnabled()`, `toBeChecked()`, `toHaveText()`, `toHaveValue()`, `toHaveURL()`, `toHaveTitle()`, `toContainText()`, `toHaveAttribute()`, `toHaveCount()`. Вони всі автоматично чекають на виконання умови.

  **Soft assertions** (`expect.soft()`) не зупиняють тест при невдачі -- тест продовжує виконуватись, а всі помилки збираються і показуються в кінці. Це корисно, коли потрібно перевірити кілька незалежних умов на одній сторінці.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('standard assertions', async ({ page }) => {
    await page.goto('https://example.com/dashboard');

    // Web-first assertions (auto-retry)
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading')).toHaveText('Welcome');
    await expect(page.getByRole('listitem')).toHaveCount(5);

    // Negation
    await expect(page.getByText('Error')).not.toBeVisible();
  });

  test('soft assertions -- collect all failures', async ({ page }) => {
    await page.goto('https://example.com/profile');

    // Test continues even if assertion fails
    await expect.soft(page.getByLabel('Name')).toHaveValue('John');
    await expect.soft(page.getByLabel('Email')).toHaveValue('john@example.com');
    await expect.soft(page.getByLabel('Role')).toHaveValue('Admin');

    // All failures reported at the end of the test
  });
  ```

  Важливо розрізняти web-first assertions (`expect(locator)`) та generic assertions (`expect(value)`). Generic assertions не мають auto-retry і працюють як звичайні Jest-перевірки -- використовуйте їх тільки для статичних значень.
en_answer: |
  Playwright has a built-in assertions library that works with **auto-retrying**. Unlike regular assertion libraries (Jest, Chai), `expect(locator)` retries the check for the duration of the timeout until the condition is met.

  Key web-first assertions: `toBeVisible()`, `toBeEnabled()`, `toBeChecked()`, `toHaveText()`, `toHaveValue()`, `toHaveURL()`, `toHaveTitle()`, `toContainText()`, `toHaveAttribute()`, `toHaveCount()`. They all automatically wait for the condition to be fulfilled.

  **Soft assertions** (`expect.soft()`) do not stop the test on failure -- the test continues executing, and all errors are collected and shown at the end. This is useful when you need to verify multiple independent conditions on one page.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('standard assertions', async ({ page }) => {
    await page.goto('https://example.com/dashboard');

    // Web-first assertions (auto-retry)
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading')).toHaveText('Welcome');
    await expect(page.getByRole('listitem')).toHaveCount(5);

    // Negation
    await expect(page.getByText('Error')).not.toBeVisible();
  });

  test('soft assertions -- collect all failures', async ({ page }) => {
    await page.goto('https://example.com/profile');

    // Test continues even if assertion fails
    await expect.soft(page.getByLabel('Name')).toHaveValue('John');
    await expect.soft(page.getByLabel('Email')).toHaveValue('john@example.com');
    await expect.soft(page.getByLabel('Role')).toHaveValue('Admin');

    // All failures reported at the end of the test
  });
  ```

  It is important to distinguish between web-first assertions (`expect(locator)`) and generic assertions (`expect(value)`). Generic assertions do not have auto-retry and work like regular Jest checks -- use them only for static values.
section: "playwright"
order: 4
tags:
  - assertions
  - fundamentals
type: "basic"
---
