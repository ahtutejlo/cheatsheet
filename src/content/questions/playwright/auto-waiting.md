---
ua_question: "Як працює auto-waiting у Playwright і чому це краще за явні очікування?"
en_question: "How does auto-waiting work in Playwright and why is it better than explicit waits?"
ua_answer: |
  **Auto-waiting** -- це вбудований механізм Playwright, який автоматично чекає, поки елемент стане готовим до взаємодії перед виконанням дії. Це усуває необхідність писати явні `waitFor` або `sleep` виклики.

  Перед кожною дією (click, fill, check тощо) Playwright виконує серію **actionability checks**: елемент повинен бути visible, stable (не анімується), enabled, не перекритий іншим елементом (receives events). Ці перевірки відбуваються автоматично з кожним action-методом.

  Assertions через `expect(locator)` також мають auto-waiting -- вони автоматично повторюються протягом таймауту (за замовчуванням 5 секунд), поки умова не стане true або таймаут не спливе.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('auto-waiting in action', async ({ page }) => {
    await page.goto('https://example.com');

    // Playwright waits for button to be visible, stable, enabled
    // before clicking -- no explicit wait needed
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assertion retries automatically until element appears
    await expect(page.getByText('Success')).toBeVisible();

    // Compare with Selenium-style explicit waits (NOT needed):
    // await page.waitForSelector('.success-message'); // anti-pattern
    // await page.waitForTimeout(3000); // anti-pattern
  });
  ```

  Auto-waiting робить тести стабільнішими та швидшими одночасно. Тести не містять зайвих пауз (`sleep`), а Playwright чекає рівно стільки, скільки потрібно. Це головна причина, чому Playwright-тести менш flaky порівняно з Selenium.
en_answer: |
  **Auto-waiting** is Playwright's built-in mechanism that automatically waits for an element to be ready for interaction before performing an action. This eliminates the need to write explicit `waitFor` or `sleep` calls.

  Before each action (click, fill, check, etc.), Playwright performs a series of **actionability checks**: the element must be visible, stable (not animating), enabled, and not obscured by another element (receives events). These checks happen automatically with every action method.

  Assertions via `expect(locator)` also have auto-waiting -- they automatically retry for the duration of the timeout (default 5 seconds) until the condition becomes true or the timeout expires.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('auto-waiting in action', async ({ page }) => {
    await page.goto('https://example.com');

    // Playwright waits for button to be visible, stable, enabled
    // before clicking -- no explicit wait needed
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assertion retries automatically until element appears
    await expect(page.getByText('Success')).toBeVisible();

    // Compare with Selenium-style explicit waits (NOT needed):
    // await page.waitForSelector('.success-message'); // anti-pattern
    // await page.waitForTimeout(3000); // anti-pattern
  });
  ```

  Auto-waiting makes tests both more stable and faster simultaneously. Tests contain no unnecessary pauses (`sleep`), and Playwright waits exactly as long as needed. This is the main reason why Playwright tests are less flaky compared to Selenium.
section: "playwright"
order: 3
tags:
  - auto-waiting
  - fundamentals
type: "basic"
---
