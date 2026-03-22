---
ua_question: "CDP vs WebDriver: в чому різниця протоколів?"
en_question: "CDP vs WebDriver: what is the difference between the protocols?"
ua_answer: |
  **Chrome DevTools Protocol (CDP)** та **WebDriver** -- це два протоколи для автоматизації браузерів. Playwright використовує CDP (та аналогічні протоколи для Firefox/WebKit), тоді як Selenium використовує WebDriver. Ця різниця є фундаментальною для розуміння переваг Playwright.

  **WebDriver** -- це W3C-стандарт, який працює через HTTP REST API. Кожна команда (клік, введення тексту) -- це окремий HTTP-запит до WebDriver-сервера (chromedriver, geckodriver), який передає команду браузеру. Це додає латентність на кожну операцію та обмежує можливості (немає доступу до DevTools, network, console).

  **CDP** -- це протокол Chrome DevTools, який працює через WebSocket. Це двостороннє з'єднання, яке дозволяє як відправляти команди, так і отримувати події від браузера в реальному часі. CDP надає доступ до мережевого рівня, JavaScript-консолі, DOM, продуктивності та багато іншого.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('CDP capabilities not available in WebDriver', async ({ page }) => {
    // Network interception -- CDP exclusive
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, body: '[]' })
    );

    // Console log capture -- CDP exclusive
    page.on('console', (msg) => console.log('Browser:', msg.text()));

    // JavaScript coverage -- CDP exclusive
    await page.coverage.startJSCoverage();
    await page.goto('https://example.com');
    const coverage = await page.coverage.stopJSCoverage();

    // Geolocation emulation -- CDP exclusive
    await page.context().grantPermissions(['geolocation']);

    // Request interception with modification -- CDP exclusive
    await page.route('**/api/users', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.push({ id: 999, name: 'Injected User' });
      await route.fulfill({ response, json });
    });

    await page.goto('https://example.com');
  });
  ```

  **WebDriver BiDi** -- це новий стандарт W3C, який намагається закрити розрив між WebDriver та CDP, додаючи двосторонню комунікацію та події. Playwright вже підтримує свій протокол для Firefox та WebKit, тому для нього WebDriver BiDi менш критичний.

  Головна перевага CDP -- це швидкість (WebSocket vs HTTP) та повнота API (network, console, coverage, emulation). Головна перевага WebDriver -- це стандартизація W3C та підтримка всіма браузерами без vendor-specific адаптацій.
en_answer: |
  **Chrome DevTools Protocol (CDP)** and **WebDriver** are two protocols for browser automation. Playwright uses CDP (and analogous protocols for Firefox/WebKit), while Selenium uses WebDriver. This difference is fundamental to understanding Playwright's advantages.

  **WebDriver** is a W3C standard that operates via HTTP REST API. Each command (click, type text) is a separate HTTP request to a WebDriver server (chromedriver, geckodriver), which relays the command to the browser. This adds latency to every operation and limits capabilities (no access to DevTools, network, console).

  **CDP** is the Chrome DevTools protocol that operates over WebSocket. This is a bidirectional connection that allows both sending commands and receiving events from the browser in real time. CDP provides access to the network layer, JavaScript console, DOM, performance, and much more.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('CDP capabilities not available in WebDriver', async ({ page }) => {
    // Network interception -- CDP exclusive
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, body: '[]' })
    );

    // Console log capture -- CDP exclusive
    page.on('console', (msg) => console.log('Browser:', msg.text()));

    // JavaScript coverage -- CDP exclusive
    await page.coverage.startJSCoverage();
    await page.goto('https://example.com');
    const coverage = await page.coverage.stopJSCoverage();

    // Geolocation emulation -- CDP exclusive
    await page.context().grantPermissions(['geolocation']);

    // Request interception with modification -- CDP exclusive
    await page.route('**/api/users', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.push({ id: 999, name: 'Injected User' });
      await route.fulfill({ response, json });
    });

    await page.goto('https://example.com');
  });
  ```

  **WebDriver BiDi** is a new W3C standard that attempts to close the gap between WebDriver and CDP by adding bidirectional communication and events. Playwright already supports its own protocol for Firefox and WebKit, so WebDriver BiDi is less critical for it.

  The main advantage of CDP is speed (WebSocket vs HTTP) and API completeness (network, console, coverage, emulation). The main advantage of WebDriver is W3C standardization and support by all browsers without vendor-specific adaptations.
section: "playwright"
order: 20
tags:
  - architecture
  - internals
type: "deep"
---
