---
ua_question: "Як працює auto-waiting зсередини? Які actionability checks виконуються?"
en_question: "How does auto-waiting work internally? What actionability checks are performed?"
ua_answer: |
  Auto-waiting у Playwright базується на концепції **actionability checks** -- серії перевірок, які виконуються перед кожною дією. Playwright не просто чекає появи елемента -- він перевіряє, що елемент дійсно готовий до конкретної взаємодії.

  **Повний список actionability checks для `click()`:**
  1. **Attached** -- елемент існує в DOM
  2. **Visible** -- елемент видимий (не `display: none`, не `visibility: hidden`, має ненульові розміри)
  3. **Stable** -- елемент не анімується (bounding box не змінюється між двома послідовними animation frames)
  4. **Receives events** -- елемент не перекритий іншим елементом (hit test проходить)
  5. **Enabled** -- елемент не має атрибуту `disabled`

  Різні дії мають різні набори перевірок. Наприклад, `fill()` додатково перевіряє, що елемент є `<input>`, `<textarea>` або має `contenteditable`. `check()` перевіряє, що елемент є checkbox або radio.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('actionability in practice', async ({ page }) => {
    await page.goto('https://example.com');

    // Playwright performs ALL checks before clicking:
    // 1. Waits for element to appear in DOM
    // 2. Waits for it to become visible
    // 3. Waits for animations to complete
    // 4. Scrolls element into view
    // 5. Checks that no overlay blocks it
    // 6. Verifies element is enabled
    await page.getByRole('button', { name: 'Submit' }).click();

    // Override timeout per action
    await page.getByRole('button', { name: 'Slow action' }).click({
      timeout: 30_000,
    });

    // For debugging: see what check failed
    // Playwright error message will tell you exactly which check failed:
    // "element is not visible"
    // "element is not stable - waiting for animation to finish"
    // "element is disabled"
  });

  test('waiting for specific states', async ({ page }) => {
    await page.goto('https://example.com');

    // Wait for specific element state (useful before assertions)
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.locator('.spinner').waitFor({ state: 'detached' });
  });
  ```

  Внутрішньо Playwright використовує **polling з requestAnimationFrame** для stability check і **document.elementFromPoint()** для hit test. Це гарантує, що перевірки відбуваються синхронно з рендерингом браузера, а не на основі таймерів.
en_answer: |
  Auto-waiting in Playwright is based on the concept of **actionability checks** -- a series of verifications performed before each action. Playwright does not simply wait for an element to appear -- it verifies the element is truly ready for the specific interaction.

  **Full list of actionability checks for `click()`:**
  1. **Attached** -- element exists in the DOM
  2. **Visible** -- element is visible (not `display: none`, not `visibility: hidden`, has non-zero dimensions)
  3. **Stable** -- element is not animating (bounding box does not change between two consecutive animation frames)
  4. **Receives events** -- element is not obscured by another element (hit test passes)
  5. **Enabled** -- element does not have the `disabled` attribute

  Different actions have different sets of checks. For example, `fill()` additionally verifies the element is an `<input>`, `<textarea>`, or has `contenteditable`. `check()` verifies the element is a checkbox or radio button.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('actionability in practice', async ({ page }) => {
    await page.goto('https://example.com');

    // Playwright performs ALL checks before clicking:
    // 1. Waits for element to appear in DOM
    // 2. Waits for it to become visible
    // 3. Waits for animations to complete
    // 4. Scrolls element into view
    // 5. Checks that no overlay blocks it
    // 6. Verifies element is enabled
    await page.getByRole('button', { name: 'Submit' }).click();

    // Override timeout per action
    await page.getByRole('button', { name: 'Slow action' }).click({
      timeout: 30_000,
    });

    // For debugging: see what check failed
    // Playwright error message will tell you exactly which check failed:
    // "element is not visible"
    // "element is not stable - waiting for animation to finish"
    // "element is disabled"
  });

  test('waiting for specific states', async ({ page }) => {
    await page.goto('https://example.com');

    // Wait for specific element state (useful before assertions)
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.locator('.spinner').waitFor({ state: 'detached' });
  });
  ```

  Internally, Playwright uses **requestAnimationFrame polling** for the stability check and **document.elementFromPoint()** for the hit test. This ensures checks happen synchronously with browser rendering rather than based on timers.
section: "playwright"
order: 17
tags:
  - auto-waiting
  - internals
type: "deep"
---
