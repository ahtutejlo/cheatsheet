---
ua_question: "Що таке Playwright і яка його архітектура?"
en_question: "What is Playwright and what is its architecture?"
ua_answer: |
  **Playwright** -- це фреймворк для end-to-end тестування веб-додатків від Microsoft. Він підтримує Chromium, Firefox та WebKit з єдиним API, що дозволяє тестувати на всіх основних браузерних рушіях.

  Архітектура Playwright побудована на протоколі Chrome DevTools Protocol (CDP) для Chromium та аналогічних внутрішніх протоколах для Firefox і WebKit. Playwright запускає окремий серверний процес, який спілкується з браузером через WebSocket-з'єднання. Це забезпечує повний контроль над браузером без HTTP-оверхеду, який притаманний Selenium WebDriver.

  Ключові архітектурні концепції -- це **Browser**, **BrowserContext** та **Page**. Browser -- це інстанс браузера. BrowserContext -- ізольований профіль (cookies, localStorage, сесії), що дозволяє запускати паралельні тести без інтерференції. Page -- окрема вкладка всередині контексту.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('basic architecture demo', async ({ browser }) => {
    // Create two isolated contexts in the same browser
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('https://example.com');
    await page2.goto('https://example.com');

    // These pages share no state -- fully isolated
    await expect(page1.getByRole('heading')).toBeVisible();
    await expect(page2.getByRole('heading')).toBeVisible();

    await context1.close();
    await context2.close();
  });
  ```

  Ця архітектура робить Playwright швидшим за Selenium, бо він спілкується з браузером напряму, а не через HTTP-сервер. Auto-waiting, network interception та tracing вбудовані в ядро фреймворку.
en_answer: |
  **Playwright** is an end-to-end testing framework for web applications by Microsoft. It supports Chromium, Firefox, and WebKit with a single API, enabling testing across all major browser engines.

  Playwright's architecture is built on Chrome DevTools Protocol (CDP) for Chromium and analogous internal protocols for Firefox and WebKit. Playwright runs a separate server process that communicates with the browser via WebSocket connections. This provides full browser control without the HTTP overhead inherent to Selenium WebDriver.

  The key architectural concepts are **Browser**, **BrowserContext**, and **Page**. Browser is a browser instance. BrowserContext is an isolated profile (cookies, localStorage, sessions) that allows running parallel tests without interference. Page is a single tab within a context.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('basic architecture demo', async ({ browser }) => {
    // Create two isolated contexts in the same browser
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('https://example.com');
    await page2.goto('https://example.com');

    // These pages share no state -- fully isolated
    await expect(page1.getByRole('heading')).toBeVisible();
    await expect(page2.getByRole('heading')).toBeVisible();

    await context1.close();
    await context2.close();
  });
  ```

  This architecture makes Playwright faster than Selenium because it communicates with the browser directly rather than through an HTTP server. Auto-waiting, network interception, and tracing are built into the framework core.
section: "playwright"
order: 1
tags:
  - fundamentals
  - architecture
type: "basic"
---
