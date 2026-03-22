---
ua_question: "Які типи селекторів підтримує Playwright?"
en_question: "What types of selectors does Playwright support?"
ua_answer: |
  Playwright пропонує кілька стратегій вибору елементів, причому рекомендований підхід -- використання **user-facing locators**, які імітують спосіб взаємодії користувача зі сторінкою.

  **Рекомендовані локатори** (стійкі до змін верстки):
  - `getByRole()` -- за ARIA-роллю (button, heading, link)
  - `getByText()` -- за видимим текстом
  - `getByLabel()` -- за label форми
  - `getByPlaceholder()` -- за placeholder
  - `getByTestId()` -- за data-testid атрибутом

  **CSS та XPath** локатори також підтримуються через `page.locator()`, але вони менш стійкі до рефакторингу UI.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('selector examples', async ({ page }) => {
    await page.goto('https://example.com/login');

    // Recommended: user-facing locators
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // CSS selector
    await page.locator('.dashboard-header').isVisible();

    // Combining locators with filter
    await page.getByRole('listitem')
      .filter({ hasText: 'Product A' })
      .getByRole('button', { name: 'Add to cart' })
      .click();

    // Chaining locators
    const row = page.getByRole('row', { name: 'John' });
    await row.getByRole('button', { name: 'Edit' }).click();
  });
  ```

  Playwright рекомендує уникати CSS/XPath селекторів, які залежать від структури DOM. Локатори на основі ролей та тексту роблять тести більш зрозумілими та стійкими до рефакторингу.
en_answer: |
  Playwright offers multiple element selection strategies, with the recommended approach being **user-facing locators** that mimic how users interact with the page.

  **Recommended locators** (resilient to layout changes):
  - `getByRole()` -- by ARIA role (button, heading, link)
  - `getByText()` -- by visible text
  - `getByLabel()` -- by form label
  - `getByPlaceholder()` -- by placeholder
  - `getByTestId()` -- by data-testid attribute

  **CSS and XPath** locators are also supported via `page.locator()`, but they are less resilient to UI refactoring.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('selector examples', async ({ page }) => {
    await page.goto('https://example.com/login');

    // Recommended: user-facing locators
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // CSS selector
    await page.locator('.dashboard-header').isVisible();

    // Combining locators with filter
    await page.getByRole('listitem')
      .filter({ hasText: 'Product A' })
      .getByRole('button', { name: 'Add to cart' })
      .click();

    // Chaining locators
    const row = page.getByRole('row', { name: 'John' });
    await row.getByRole('button', { name: 'Edit' }).click();
  });
  ```

  Playwright recommends avoiding CSS/XPath selectors that depend on DOM structure. Role-based and text-based locators make tests more readable and resilient to refactoring.
section: "playwright"
order: 2
tags:
  - selectors
  - locators
type: "basic"
---
