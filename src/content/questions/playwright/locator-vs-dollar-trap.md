---
ua_question: "У чому різниця між page.locator() та page.$()?"
en_question: "What is the difference between page.locator() and page.$()?"
ua_answer: |
  > **Trap:** Багато хто вважає, що `page.locator()` та `page.$()` -- це просто два синтаксиси для одного й того ж. Насправді це фундаментально різні механізми з різною поведінкою.

  **`page.$()`** (та `page.$$()`) -- це eager evaluation. Метод одразу шукає елемент у DOM і повертає `ElementHandle` -- пряме посилання на DOM-вузол. Якщо елемент зникне або зміниться, handle стає невалідним. ElementHandle НЕ має auto-waiting.

  **`page.locator()`** -- це lazy evaluation. Локатор не шукає елемент при створенні -- він зберігає лише опис пошуку. Пошук відбувається при кожній дії (click, fill, expect), з auto-waiting та auto-retry. Якщо DOM змінюється, локатор знайде новий елемент.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('locator vs $ difference', async ({ page }) => {
    await page.goto('https://example.com');

    // BAD: page.$() -- eager, no auto-waiting, can become stale
    const handle = await page.$('.dynamic-button');
    // If the element re-renders, handle is stale!
    // await handle?.click(); // May throw "element is detached"

    // GOOD: page.locator() -- lazy, auto-waiting, always fresh
    const locator = page.locator('.dynamic-button');
    // Locator re-queries DOM on every action
    await locator.click(); // Always finds the current element

    // Locator works even if element does not exist yet
    const futureElement = page.locator('.will-appear-later');
    // No error here -- locator is just a description
    await futureElement.click(); // Waits for element to appear, then clicks
  });

  test('why locator is safer', async ({ page }) => {
    await page.goto('https://example.com/spa');

    // SPA re-renders the list after sorting
    const items = page.getByRole('listitem');

    await page.getByRole('button', { name: 'Sort' }).click();
    // Locator automatically finds the NEW elements after re-render
    await expect(items.first()).toHaveText('Apple');

    // With page.$$(), you would need to re-query manually:
    // const oldHandles = await page.$$('li'); // stale after sort!
    // const newHandles = await page.$$('li'); // must re-query
  });
  ```

  `page.$()` та `page.$$()` є застарілими (legacy API) і не рекомендуються. Завжди використовуйте `page.locator()` та user-facing локатори (`getByRole`, `getByText`). Єдиний виправданий випадок для ElementHandle -- коли потрібно передати елемент у `page.evaluate()`.
en_answer: |
  > **Trap:** Many assume that `page.locator()` and `page.$()` are just two syntaxes for the same thing. In reality, these are fundamentally different mechanisms with different behavior.

  **`page.$()`** (and `page.$$()`) uses eager evaluation. The method immediately searches for an element in the DOM and returns an `ElementHandle` -- a direct reference to the DOM node. If the element disappears or changes, the handle becomes invalid. ElementHandle does NOT have auto-waiting.

  **`page.locator()`** uses lazy evaluation. The locator does not search for the element upon creation -- it only stores the search description. The search happens on every action (click, fill, expect), with auto-waiting and auto-retry. If the DOM changes, the locator finds the new element.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('locator vs $ difference', async ({ page }) => {
    await page.goto('https://example.com');

    // BAD: page.$() -- eager, no auto-waiting, can become stale
    const handle = await page.$('.dynamic-button');
    // If the element re-renders, handle is stale!
    // await handle?.click(); // May throw "element is detached"

    // GOOD: page.locator() -- lazy, auto-waiting, always fresh
    const locator = page.locator('.dynamic-button');
    // Locator re-queries DOM on every action
    await locator.click(); // Always finds the current element

    // Locator works even if element does not exist yet
    const futureElement = page.locator('.will-appear-later');
    // No error here -- locator is just a description
    await futureElement.click(); // Waits for element to appear, then clicks
  });

  test('why locator is safer', async ({ page }) => {
    await page.goto('https://example.com/spa');

    // SPA re-renders the list after sorting
    const items = page.getByRole('listitem');

    await page.getByRole('button', { name: 'Sort' }).click();
    // Locator automatically finds the NEW elements after re-render
    await expect(items.first()).toHaveText('Apple');

    // With page.$$(), you would need to re-query manually:
    // const oldHandles = await page.$$('li'); // stale after sort!
    // const newHandles = await page.$$('li'); // must re-query
  });
  ```

  `page.$()` and `page.$$()` are legacy APIs and not recommended. Always use `page.locator()` and user-facing locators (`getByRole`, `getByText`). The only justified case for ElementHandle is when you need to pass an element to `page.evaluate()`.
section: "playwright"
order: 21
tags:
  - selectors
  - gotchas
type: "trick"
---
