---
ua_question: "Як працюють selector engines у Playwright? Як створити кастомний engine?"
en_question: "How do selector engines work in Playwright? How to create a custom engine?"
ua_answer: |
  Playwright використовує систему **selector engines** для розв'язання локаторів. Кожен тип селектора (`css`, `text`, `role`, `data-testid`) обробляється окремим engine. Коли ви пишете `page.getByRole('button')`, Playwright транслює це у внутрішній селектор `role=button`.

  Selector engines виконуються **всередині браузера** (у контексті сторінки). Playwright інжектує JS-код engines через CDP і викликає їх для пошуку елементів. Це означає, що кожен engine -- це JavaScript-функція, яка виконується в DOM.

  Локатори можна комбінувати ланцюжком (`locator('div').locator('span')`) -- кожен наступний локатор шукає всередині результату попереднього. Це створює дерево пошуку, яке обчислюється ліниво (lazy evaluation).

  ```typescript
  import { test, expect } from '@playwright/test';

  // Register custom selector engine
  test.beforeEach(async ({ playwright }) => {
    await playwright.selectors.register('tag', {
      // Runs in browser context
      query(root: HTMLElement, selector: string) {
        return root.querySelector(selector);
      },
      queryAll(root: HTMLElement, selector: string) {
        return Array.from(root.querySelectorAll(selector));
      },
    });
  });

  test('custom selector engine', async ({ page }) => {
    await page.goto('https://example.com');

    // Use custom engine with tag= prefix
    const heading = page.locator('tag=h1');
    await expect(heading).toBeVisible();
  });

  test('selector engine composition', async ({ page }) => {
    await page.goto('https://example.com');

    // Internal representation of chained locators:
    // page.getByRole('list').getByRole('listitem').filter({ hasText: 'Apple' })
    // becomes: role=list >> role=listitem >> internal:has-text="Apple"

    // nth selector for indexing
    const thirdItem = page.getByRole('listitem').nth(2);
    await expect(thirdItem).toBeVisible();

    // has filter -- find parent that contains specific child
    const rowWithEdit = page.getByRole('row').filter({
      has: page.getByRole('button', { name: 'Edit' }),
    });
    await rowWithEdit.click();
  });
  ```

  Кастомні selector engines корисні для фреймворків зі специфічними атрибутами (наприклад, `data-cy` для Cypress-мігрантів або кастомних web-компонентів). Engine реєструється один раз і доступний у всіх тестах.
en_answer: |
  Playwright uses a system of **selector engines** to resolve locators. Each selector type (`css`, `text`, `role`, `data-testid`) is handled by a separate engine. When you write `page.getByRole('button')`, Playwright translates it into the internal selector `role=button`.

  Selector engines execute **inside the browser** (in the page context). Playwright injects the engine JS code via CDP and calls them to find elements. This means each engine is a JavaScript function that runs in the DOM.

  Locators can be chained (`locator('div').locator('span')`) -- each subsequent locator searches within the result of the previous one. This creates a search tree evaluated lazily.

  ```typescript
  import { test, expect } from '@playwright/test';

  // Register custom selector engine
  test.beforeEach(async ({ playwright }) => {
    await playwright.selectors.register('tag', {
      // Runs in browser context
      query(root: HTMLElement, selector: string) {
        return root.querySelector(selector);
      },
      queryAll(root: HTMLElement, selector: string) {
        return Array.from(root.querySelectorAll(selector));
      },
    });
  });

  test('custom selector engine', async ({ page }) => {
    await page.goto('https://example.com');

    // Use custom engine with tag= prefix
    const heading = page.locator('tag=h1');
    await expect(heading).toBeVisible();
  });

  test('selector engine composition', async ({ page }) => {
    await page.goto('https://example.com');

    // Internal representation of chained locators:
    // page.getByRole('list').getByRole('listitem').filter({ hasText: 'Apple' })
    // becomes: role=list >> role=listitem >> internal:has-text="Apple"

    // nth selector for indexing
    const thirdItem = page.getByRole('listitem').nth(2);
    await expect(thirdItem).toBeVisible();

    // has filter -- find parent that contains specific child
    const rowWithEdit = page.getByRole('row').filter({
      has: page.getByRole('button', { name: 'Edit' }),
    });
    await rowWithEdit.click();
  });
  ```

  Custom selector engines are useful for frameworks with specific attributes (e.g., `data-cy` for Cypress migrants or custom web components). The engine is registered once and available in all tests.
section: "playwright"
order: 19
tags:
  - selectors
  - internals
type: "deep"
---
