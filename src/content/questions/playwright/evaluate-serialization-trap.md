---
ua_question: "Які підводні камені серіалізації у page.evaluate()?"
en_question: "What are the serialization pitfalls of page.evaluate()?"
ua_answer: |
  > **Trap:** `page.evaluate()` виглядає як звичайний JavaScript, але код всередині виконується в контексті браузера, а не Node.js. Аргументи та результати серіалізуються через JSON-подібний протокол, що створює несподівані обмеження.

  **Головні пастки:**
  1. Замикання (closures) не передаються -- функція не має доступу до зовнішніх змінних Node.js
  2. Не-серіалізовані типи (функції, Map, Set, WeakRef, DOM-елементи) губляться
  3. Циклічні посилання викликають помилку
  4. Великі об'єкти можуть спричинити проблеми з продуктивністю

  ```typescript
  import { test, expect } from '@playwright/test';

  test('serialization pitfalls', async ({ page }) => {
    await page.goto('https://example.com');

    // BAD: closure does not work -- variable is not accessible in browser
    const name = 'Alice';
    // await page.evaluate(() => document.title = name); // ReferenceError!

    // GOOD: pass data as argument
    await page.evaluate((n) => {
      document.title = n;
    }, name);

    // BAD: functions are not serializable
    const formatter = (s: string) => s.toUpperCase();
    // await page.evaluate((fn) => fn('hello'), formatter); // Error!

    // GOOD: define function inside evaluate
    const result = await page.evaluate(() => {
      const formatter = (s: string) => s.toUpperCase();
      return formatter('hello');
    });
    expect(result).toBe('HELLO');

    // BAD: DOM elements cannot be returned
    // const el = await page.evaluate(() => document.body); // returns {}

    // GOOD: return serializable data from DOM
    const text = await page.evaluate(() => document.body.textContent);

    // BAD: Map/Set lose their type
    const map = await page.evaluate(() => {
      const m = new Map([['a', 1]]);
      return m; // Returns empty object {}
    });
    // map is {} not Map!

    // GOOD: convert to serializable format
    const mapData = await page.evaluate(() => {
      const m = new Map([['a', 1]]);
      return Object.fromEntries(m); // { a: 1 }
    });
  });

  test('passing complex data', async ({ page }) => {
    await page.goto('https://example.com');

    // Multiple arguments -- use object
    const config = { name: 'Alice', role: 'admin', ids: [1, 2, 3] };
    await page.evaluate((cfg) => {
      console.log(cfg.name, cfg.role, cfg.ids);
    }, config);

    // Using ElementHandle as argument (not serialized -- passed by reference)
    const handle = await page.$('h1');
    const tagName = await page.evaluate((el) => el?.tagName, handle);
    expect(tagName).toBe('H1');
  });
  ```

  Правило: все, що передається в `evaluate` або повертається з нього, повинно бути JSON-серіалізованим. Для роботи з DOM-елементами використовуйте `locator.evaluate()` або передавайте ElementHandle як аргумент.
en_answer: |
  > **Trap:** `page.evaluate()` looks like regular JavaScript, but the code inside executes in the browser context, not Node.js. Arguments and results are serialized through a JSON-like protocol, creating unexpected limitations.

  **Main pitfalls:**
  1. Closures do not transfer -- the function has no access to outer Node.js variables
  2. Non-serializable types (functions, Map, Set, WeakRef, DOM elements) are lost
  3. Circular references cause errors
  4. Large objects can cause performance issues

  ```typescript
  import { test, expect } from '@playwright/test';

  test('serialization pitfalls', async ({ page }) => {
    await page.goto('https://example.com');

    // BAD: closure does not work -- variable is not accessible in browser
    const name = 'Alice';
    // await page.evaluate(() => document.title = name); // ReferenceError!

    // GOOD: pass data as argument
    await page.evaluate((n) => {
      document.title = n;
    }, name);

    // BAD: functions are not serializable
    const formatter = (s: string) => s.toUpperCase();
    // await page.evaluate((fn) => fn('hello'), formatter); // Error!

    // GOOD: define function inside evaluate
    const result = await page.evaluate(() => {
      const formatter = (s: string) => s.toUpperCase();
      return formatter('hello');
    });
    expect(result).toBe('HELLO');

    // BAD: DOM elements cannot be returned
    // const el = await page.evaluate(() => document.body); // returns {}

    // GOOD: return serializable data from DOM
    const text = await page.evaluate(() => document.body.textContent);

    // BAD: Map/Set lose their type
    const map = await page.evaluate(() => {
      const m = new Map([['a', 1]]);
      return m; // Returns empty object {}
    });
    // map is {} not Map!

    // GOOD: convert to serializable format
    const mapData = await page.evaluate(() => {
      const m = new Map([['a', 1]]);
      return Object.fromEntries(m); // { a: 1 }
    });
  });

  test('passing complex data', async ({ page }) => {
    await page.goto('https://example.com');

    // Multiple arguments -- use object
    const config = { name: 'Alice', role: 'admin', ids: [1, 2, 3] };
    await page.evaluate((cfg) => {
      console.log(cfg.name, cfg.role, cfg.ids);
    }, config);

    // Using ElementHandle as argument (not serialized -- passed by reference)
    const handle = await page.$('h1');
    const tagName = await page.evaluate((el) => el?.tagName, handle);
    expect(tagName).toBe('H1');
  });
  ```

  Rule: everything passed to `evaluate` or returned from it must be JSON-serializable. For working with DOM elements, use `locator.evaluate()` or pass ElementHandle as an argument.
section: "playwright"
order: 25
tags:
  - advanced
  - gotchas
type: "trick"
---
