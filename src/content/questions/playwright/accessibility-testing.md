---
ua_question: "Як тестувати доступність (accessibility) у Playwright?"
en_question: "How to test accessibility in Playwright?"
ua_answer: |
  Playwright підтримує тестування доступності (a11y) через вбудовані ARIA-локатори та інтеграцію з **axe-core** -- найпопулярнішим інструментом автоматичної перевірки доступності.

  **Вбудовані ARIA-локатори** (`getByRole`, `getByLabel`) самі по собі є тестом доступності -- якщо елемент не має правильної ARIA-ролі або label, тест не знайде його. Це заохочує розробників створювати доступний UI.

  Для повної перевірки WCAG-стандартів використовується бібліотека `@axe-core/playwright`, яка аналізує DOM на наявність порушень доступності.

  ```typescript
  import { test, expect } from '@playwright/test';
  import AxeBuilder from '@axe-core/playwright';

  test('full page accessibility scan', async ({ page }) => {
    await page.goto('https://example.com');

    const results = await new AxeBuilder({ page }).analyze();

    // Fail if there are any violations
    expect(results.violations).toEqual([]);
  });

  test('accessibility scan with rules', async ({ page }) => {
    await page.goto('https://example.com');

    const results = await new AxeBuilder({ page })
      // Only check specific rules
      .withRules(['color-contrast', 'label', 'image-alt'])
      // Exclude known issues
      .exclude('.third-party-widget')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('ARIA locators as accessibility test', async ({ page }) => {
    await page.goto('https://example.com/form');

    // These locators verify correct ARIA implementation
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('combobox', { name: 'Country' }).selectOption('UA');
    await page.getByRole('checkbox', { name: 'Accept terms' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify ARIA live region for screen readers
    await expect(page.getByRole('alert')).toHaveText('Form submitted');
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto('https://example.com');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Products' })).toBeFocused();

    // Enter activates focused element
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/products/);
  });
  ```

  Комбінація ARIA-локаторів, axe-core сканування та тестування клавіатурної навігації забезпечує комплексну перевірку доступності. Рекомендується запускати a11y-сканування на кожному PR.
en_answer: |
  Playwright supports accessibility (a11y) testing through built-in ARIA locators and integration with **axe-core** -- the most popular automated accessibility checking tool.

  **Built-in ARIA locators** (`getByRole`, `getByLabel`) are themselves an accessibility test -- if an element does not have a correct ARIA role or label, the test will not find it. This encourages developers to build accessible UI.

  For full WCAG standard verification, the `@axe-core/playwright` library is used to analyze the DOM for accessibility violations.

  ```typescript
  import { test, expect } from '@playwright/test';
  import AxeBuilder from '@axe-core/playwright';

  test('full page accessibility scan', async ({ page }) => {
    await page.goto('https://example.com');

    const results = await new AxeBuilder({ page }).analyze();

    // Fail if there are any violations
    expect(results.violations).toEqual([]);
  });

  test('accessibility scan with rules', async ({ page }) => {
    await page.goto('https://example.com');

    const results = await new AxeBuilder({ page })
      // Only check specific rules
      .withRules(['color-contrast', 'label', 'image-alt'])
      // Exclude known issues
      .exclude('.third-party-widget')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('ARIA locators as accessibility test', async ({ page }) => {
    await page.goto('https://example.com/form');

    // These locators verify correct ARIA implementation
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('combobox', { name: 'Country' }).selectOption('UA');
    await page.getByRole('checkbox', { name: 'Accept terms' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify ARIA live region for screen readers
    await expect(page.getByRole('alert')).toHaveText('Form submitted');
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto('https://example.com');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Products' })).toBeFocused();

    // Enter activates focused element
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/products/);
  });
  ```

  The combination of ARIA locators, axe-core scanning, and keyboard navigation testing provides comprehensive accessibility verification. Running a11y scans on every PR is recommended.
section: "playwright"
order: 28
tags:
  - accessibility
  - testing
type: "basic"
---
