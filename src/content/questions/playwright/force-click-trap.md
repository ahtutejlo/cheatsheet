---
ua_question: "Чому force: true при кліку маскує реальні проблеми?"
en_question: "Why does force: true on click mask real problems?"
ua_answer: |
  > **Trap:** Коли `click()` падає через actionability check, розробники часто додають `{ force: true }` як "виправлення". Насправді `force: true` лише маскує проблему, яку побачить реальний користувач.

  `force: true` пропускає ВСІ actionability checks: visibility, stability, enabled, receives events. Це означає, що Playwright клікне по елементу, навіть якщо він прихований, перекритий оверлеєм, disabled або анімується. Реальний користувач не зміг би натиснути на такий елемент.

  **Реальні причини, які маскує force: true:**
  - Елемент перекритий модальним вікном або cookie-банером
  - Елемент ще анімується (CSS transition/animation)
  - Елемент disabled (наприклад, кнопка Submit до заповнення форми)
  - Z-index конфлікт з іншим елементом

  ```typescript
  import { test, expect } from '@playwright/test';

  test('BAD: force click hides a real bug', async ({ page }) => {
    await page.goto('https://example.com');

    // Cookie banner covers the button -- this is a real UX bug!
    // force: true "fixes" the test but hides the problem
    await page.getByRole('button', { name: 'Buy' }).click({ force: true });
    // Test passes but users cannot click this button in production
  });

  test('GOOD: fix the root cause', async ({ page }) => {
    await page.goto('https://example.com');

    // Dismiss the cookie banner first (what a real user would do)
    await page.getByRole('button', { name: 'Accept cookies' }).click();

    // Now the button is clickable without force
    await page.getByRole('button', { name: 'Buy' }).click();
  });

  test('GOOD: wait for overlay to disappear', async ({ page }) => {
    await page.goto('https://example.com');

    // Wait for loading overlay to disappear
    await expect(page.locator('.loading-overlay')).not.toBeVisible();

    // Now click normally
    await page.getByRole('button', { name: 'Submit' }).click();
  });

  test('RARE legitimate use of force', async ({ page }) => {
    await page.goto('https://example.com');

    // Legitimate: testing custom dropdown where click target
    // is intentionally behind a transparent overlay
    await page.locator('.custom-select-trigger').click({ force: true });
  });
  ```

  Якщо actionability check падає -- це сигнал про проблему в тесті або додатку. Правильне рішення -- зрозуміти причину і виправити її, а не пропускати перевірки.
en_answer: |
  > **Trap:** When `click()` fails due to an actionability check, developers often add `{ force: true }` as a "fix". In reality, `force: true` only masks a problem that a real user would encounter.

  `force: true` skips ALL actionability checks: visibility, stability, enabled, receives events. This means Playwright will click the element even if it is hidden, covered by an overlay, disabled, or animating. A real user would not be able to click such an element.

  **Real problems masked by force: true:**
  - Element is covered by a modal window or cookie banner
  - Element is still animating (CSS transition/animation)
  - Element is disabled (e.g., Submit button before form is filled)
  - Z-index conflict with another element

  ```typescript
  import { test, expect } from '@playwright/test';

  test('BAD: force click hides a real bug', async ({ page }) => {
    await page.goto('https://example.com');

    // Cookie banner covers the button -- this is a real UX bug!
    // force: true "fixes" the test but hides the problem
    await page.getByRole('button', { name: 'Buy' }).click({ force: true });
    // Test passes but users cannot click this button in production
  });

  test('GOOD: fix the root cause', async ({ page }) => {
    await page.goto('https://example.com');

    // Dismiss the cookie banner first (what a real user would do)
    await page.getByRole('button', { name: 'Accept cookies' }).click();

    // Now the button is clickable without force
    await page.getByRole('button', { name: 'Buy' }).click();
  });

  test('GOOD: wait for overlay to disappear', async ({ page }) => {
    await page.goto('https://example.com');

    // Wait for loading overlay to disappear
    await expect(page.locator('.loading-overlay')).not.toBeVisible();

    // Now click normally
    await page.getByRole('button', { name: 'Submit' }).click();
  });

  test('RARE legitimate use of force', async ({ page }) => {
    await page.goto('https://example.com');

    // Legitimate: testing custom dropdown where click target
    // is intentionally behind a transparent overlay
    await page.locator('.custom-select-trigger').click({ force: true });
  });
  ```

  If an actionability check fails -- it is a signal about a problem in the test or the application. The correct solution is to understand the cause and fix it, not skip the checks.
section: "playwright"
order: 24
tags:
  - actions
  - gotchas
type: "trick"
---
