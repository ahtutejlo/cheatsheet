---
ua_question: "У чому різниця між toBeVisible, toBeAttached та toBeInViewport?"
en_question: "What is the difference between toBeVisible, toBeAttached, and toBeInViewport?"
ua_answer: |
  > **Trap:** Ці три assertions часто плутають, вважаючи їх взаємозамінними. Насправді вони перевіряють різні стани елемента, і неправильний вибір призводить до flaky тестів.

  **`toBeAttached()`** -- елемент існує в DOM. Він може бути прихованим (`display: none`, `visibility: hidden`, за межами viewport) -- це не має значення. Перевіряє лише наявність у DOM-дереві.

  **`toBeVisible()`** -- елемент видимий для користувача. Це означає: існує в DOM, має ненульові розміри, не має `display: none` або `visibility: hidden`, і opacity > 0. Не перевіряє, чи елемент у viewport.

  **`toBeInViewport()`** -- елемент знаходиться у видимій області сторінки (viewport). Елемент може бути "visible" (не прихований CSS), але поза viewport (потрібна прокрутка).

  ```typescript
  import { test, expect } from '@playwright/test';

  test('attached vs visible vs in viewport', async ({ page }) => {
    await page.setContent(`
      <div id="hidden" style="display: none">Hidden</div>
      <div id="invisible" style="visibility: hidden">Invisible</div>
      <div id="visible">Visible</div>
      <div id="offscreen" style="margin-top: 10000px">Far below</div>
    `);

    const hidden = page.locator('#hidden');
    const invisible = page.locator('#invisible');
    const visible = page.locator('#visible');
    const offscreen = page.locator('#offscreen');

    // #hidden: in DOM but not visible
    await expect(hidden).toBeAttached();
    await expect(hidden).not.toBeVisible();

    // #invisible: in DOM but not visible
    await expect(invisible).toBeAttached();
    await expect(invisible).not.toBeVisible();

    // #visible: in DOM, visible, and in viewport
    await expect(visible).toBeAttached();
    await expect(visible).toBeVisible();
    await expect(visible).toBeInViewport();

    // #offscreen: in DOM, visible (not hidden by CSS), but NOT in viewport
    await expect(offscreen).toBeAttached();
    await expect(offscreen).toBeVisible(); // true! CSS does not hide it
    await expect(offscreen).not.toBeInViewport(); // not scrolled into view
  });

  test('common mistake with lazy-loaded content', async ({ page }) => {
    await page.goto('https://example.com/infinite-scroll');

    // Wrong: element exists in DOM but user cannot see it
    // await expect(page.locator('.item-50')).toBeAttached(); // passes too early

    // Correct: verify user can actually see it
    await page.locator('.item-50').scrollIntoViewIfNeeded();
    await expect(page.locator('.item-50')).toBeInViewport();
  });
  ```

  Рекомендація: використовуйте `toBeVisible()` як основну перевірку видимості. `toBeAttached()` -- коли потрібно перевірити наявність прихованих елементів. `toBeInViewport()` -- для тестування lazy loading або нескінченної прокрутки.
en_answer: |
  > **Trap:** These three assertions are often confused as interchangeable. In reality, they check different element states, and the wrong choice leads to flaky tests.

  **`toBeAttached()`** -- element exists in the DOM. It can be hidden (`display: none`, `visibility: hidden`, outside viewport) -- that does not matter. Only checks for presence in the DOM tree.

  **`toBeVisible()`** -- element is visible to the user. This means: exists in DOM, has non-zero dimensions, does not have `display: none` or `visibility: hidden`, and opacity > 0. Does not check if the element is in the viewport.

  **`toBeInViewport()`** -- element is in the visible area of the page (viewport). An element can be "visible" (not hidden by CSS) but outside the viewport (requires scrolling).

  ```typescript
  import { test, expect } from '@playwright/test';

  test('attached vs visible vs in viewport', async ({ page }) => {
    await page.setContent(`
      <div id="hidden" style="display: none">Hidden</div>
      <div id="invisible" style="visibility: hidden">Invisible</div>
      <div id="visible">Visible</div>
      <div id="offscreen" style="margin-top: 10000px">Far below</div>
    `);

    const hidden = page.locator('#hidden');
    const invisible = page.locator('#invisible');
    const visible = page.locator('#visible');
    const offscreen = page.locator('#offscreen');

    // #hidden: in DOM but not visible
    await expect(hidden).toBeAttached();
    await expect(hidden).not.toBeVisible();

    // #invisible: in DOM but not visible
    await expect(invisible).toBeAttached();
    await expect(invisible).not.toBeVisible();

    // #visible: in DOM, visible, and in viewport
    await expect(visible).toBeAttached();
    await expect(visible).toBeVisible();
    await expect(visible).toBeInViewport();

    // #offscreen: in DOM, visible (not hidden by CSS), but NOT in viewport
    await expect(offscreen).toBeAttached();
    await expect(offscreen).toBeVisible(); // true! CSS does not hide it
    await expect(offscreen).not.toBeInViewport(); // not scrolled into view
  });

  test('common mistake with lazy-loaded content', async ({ page }) => {
    await page.goto('https://example.com/infinite-scroll');

    // Wrong: element exists in DOM but user cannot see it
    // await expect(page.locator('.item-50')).toBeAttached(); // passes too early

    // Correct: verify user can actually see it
    await page.locator('.item-50').scrollIntoViewIfNeeded();
    await expect(page.locator('.item-50')).toBeInViewport();
  });
  ```

  Recommendation: use `toBeVisible()` as the primary visibility check. `toBeAttached()` -- when you need to verify hidden elements exist. `toBeInViewport()` -- for testing lazy loading or infinite scrolling.
section: "playwright"
order: 23
tags:
  - assertions
  - gotchas
type: "trick"
---
