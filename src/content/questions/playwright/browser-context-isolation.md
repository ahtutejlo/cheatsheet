---
ua_question: "Як працює ізоляція BrowserContext і чому Playwright швидший за Selenium?"
en_question: "How does BrowserContext isolation work and why is Playwright faster than Selenium?"
ua_answer: |
  **BrowserContext** -- це ключова абстракція Playwright, що забезпечує повну ізоляцію між тестами без накладних витрат на запуск нового браузера. Кожен контекст має власні cookies, localStorage, sessionStorage, service workers та кеш -- як окремий інкогніто-профіль.

  У Selenium для ізоляції зазвичай потрібно створювати новий WebDriver-інстанс (новий процес браузера), що займає 2-5 секунд. У Playwright створення BrowserContext займає мілісекунди, бо використовується той самий процес браузера. Це фундаментальна різниця в архітектурі.

  Playwright комунікує з браузером через **WebSocket** на основі CDP (Chrome DevTools Protocol) або аналогічних протоколів для Firefox/WebKit. Selenium використовує **HTTP REST API** (WebDriver protocol), де кожна команда -- це окремий HTTP-запит з усіма його накладними витратами (TCP handshake, сериалізація, десериалізація).

  ```typescript
  import { test, expect } from '@playwright/test';

  // Each test gets its own isolated BrowserContext automatically
  test('user A session', async ({ page }) => {
    // This page has its own cookies, localStorage, etc.
    await page.goto('https://example.com');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  });

  test('user B session', async ({ page }) => {
    // Completely isolated from test above
    await page.goto('https://example.com');
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    // theme is null -- no state leaked from previous test
    expect(theme).toBeNull();
  });

  test('multiple users in same test', async ({ browser }) => {
    // Simulate two users interacting simultaneously
    const adminContext = await browser.newContext({
      storageState: 'auth/admin.json',
    });
    const userContext = await browser.newContext({
      storageState: 'auth/user.json',
    });

    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();

    await adminPage.goto('https://example.com/admin');
    await userPage.goto('https://example.com/dashboard');

    // Admin creates content
    await adminPage.getByRole('button', { name: 'Publish' }).click();

    // User sees it immediately
    await userPage.reload();
    await expect(userPage.getByText('New article')).toBeVisible();

    await adminContext.close();
    await userContext.close();
  });
  ```

  Ця архітектура дає Playwright три переваги: 1) швидший старт тестів (мілісекунди vs секунди), 2) нижче споживання пам'яті (один процес браузера), 3) можливість паралельно тестувати різні ролі без окремих браузерів.
en_answer: |
  **BrowserContext** is Playwright's key abstraction that provides full isolation between tests without the overhead of launching a new browser. Each context has its own cookies, localStorage, sessionStorage, service workers, and cache -- like a separate incognito profile.

  In Selenium, isolation typically requires creating a new WebDriver instance (new browser process), which takes 2-5 seconds. In Playwright, creating a BrowserContext takes milliseconds because the same browser process is used. This is a fundamental architectural difference.

  Playwright communicates with the browser via **WebSocket** based on CDP (Chrome DevTools Protocol) or analogous protocols for Firefox/WebKit. Selenium uses an **HTTP REST API** (WebDriver protocol), where each command is a separate HTTP request with all its overhead (TCP handshake, serialization, deserialization).

  ```typescript
  import { test, expect } from '@playwright/test';

  // Each test gets its own isolated BrowserContext automatically
  test('user A session', async ({ page }) => {
    // This page has its own cookies, localStorage, etc.
    await page.goto('https://example.com');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  });

  test('user B session', async ({ page }) => {
    // Completely isolated from test above
    await page.goto('https://example.com');
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    // theme is null -- no state leaked from previous test
    expect(theme).toBeNull();
  });

  test('multiple users in same test', async ({ browser }) => {
    // Simulate two users interacting simultaneously
    const adminContext = await browser.newContext({
      storageState: 'auth/admin.json',
    });
    const userContext = await browser.newContext({
      storageState: 'auth/user.json',
    });

    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();

    await adminPage.goto('https://example.com/admin');
    await userPage.goto('https://example.com/dashboard');

    // Admin creates content
    await adminPage.getByRole('button', { name: 'Publish' }).click();

    // User sees it immediately
    await userPage.reload();
    await expect(userPage.getByText('New article')).toBeVisible();

    await adminContext.close();
    await userContext.close();
  });
  ```

  This architecture gives Playwright three advantages: 1) faster test startup (milliseconds vs seconds), 2) lower memory consumption (single browser process), 3) ability to test different roles in parallel without separate browsers.
section: "playwright"
order: 16
tags:
  - architecture
  - internals
type: "deep"
---
