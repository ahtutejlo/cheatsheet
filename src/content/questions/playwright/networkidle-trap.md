---
ua_question: "Чому waitForLoadState('networkidle') -- це антипаттерн?"
en_question: "Why is waitForLoadState('networkidle') an anti-pattern?"
ua_answer: |
  > **Trap:** Багато тестувальників використовують `waitForLoadState('networkidle')` як "надійний" спосіб дочекатися завантаження сторінки. Насправді це антипаттерн, який робить тести повільнішими та менш стабільними.

  `networkidle` означає "відсутність мережевих запитів протягом 500мс". Проблеми з цим підходом:
  1. **Повільно** -- завжди чекає мінімум 500мс, навіть коли сторінка давно готова
  2. **Нестабільно** -- long-polling, WebSocket, analytics, heartbeat-запити ніколи не дають мережі "замовкнути"
  3. **Не гарантує готовність UI** -- мережа може замовкнути до того, як React/Vue завершить рендеринг
  4. **Race condition** -- на SPA нові запити можуть початися після "idle"

  ```typescript
  import { test, expect } from '@playwright/test';

  test('BAD: using networkidle', async ({ page }) => {
    await page.goto('https://example.com');

    // Anti-pattern: waits 500ms minimum, unreliable with analytics/websockets
    await page.waitForLoadState('networkidle');

    // Another anti-pattern: arbitrary timeout
    await page.waitForTimeout(3000);
  });

  test('GOOD: wait for specific UI state', async ({ page }) => {
    await page.goto('https://example.com');

    // Wait for the specific element you care about
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Or wait for specific API response
    await page.goto('https://example.com/users');
    await expect(page.getByRole('listitem')).toHaveCount(10);
  });

  test('GOOD: wait for specific network request', async ({ page }) => {
    // Wait for specific API call to complete
    const responsePromise = page.waitForResponse('**/api/users');
    await page.goto('https://example.com/users');
    const response = await responsePromise;
    expect(response.status()).toBe(200);

    // Now verify UI
    await expect(page.getByRole('listitem').first()).toBeVisible();
  });
  ```

  Правильний підхід -- чекати на конкретний елемент або конкретний API-запит, а не на абстрактний стан мережі. `expect(locator).toBeVisible()` з auto-retry -- це найнадійніший спосіб переконатися, що сторінка готова.
en_answer: |
  > **Trap:** Many testers use `waitForLoadState('networkidle')` as a "reliable" way to wait for page load. In reality, this is an anti-pattern that makes tests slower and less stable.

  `networkidle` means "no network requests for 500ms". Problems with this approach:
  1. **Slow** -- always waits at least 500ms, even when the page is long ready
  2. **Unstable** -- long-polling, WebSocket, analytics, heartbeat requests never let the network go "quiet"
  3. **Does not guarantee UI readiness** -- network can go idle before React/Vue finishes rendering
  4. **Race condition** -- on SPAs, new requests may start after "idle"

  ```typescript
  import { test, expect } from '@playwright/test';

  test('BAD: using networkidle', async ({ page }) => {
    await page.goto('https://example.com');

    // Anti-pattern: waits 500ms minimum, unreliable with analytics/websockets
    await page.waitForLoadState('networkidle');

    // Another anti-pattern: arbitrary timeout
    await page.waitForTimeout(3000);
  });

  test('GOOD: wait for specific UI state', async ({ page }) => {
    await page.goto('https://example.com');

    // Wait for the specific element you care about
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Or wait for specific API response
    await page.goto('https://example.com/users');
    await expect(page.getByRole('listitem')).toHaveCount(10);
  });

  test('GOOD: wait for specific network request', async ({ page }) => {
    // Wait for specific API call to complete
    const responsePromise = page.waitForResponse('**/api/users');
    await page.goto('https://example.com/users');
    const response = await responsePromise;
    expect(response.status()).toBe(200);

    // Now verify UI
    await expect(page.getByRole('listitem').first()).toBeVisible();
  });
  ```

  The correct approach is to wait for a specific element or specific API request, not an abstract network state. `expect(locator).toBeVisible()` with auto-retry is the most reliable way to ensure the page is ready.
section: "playwright"
order: 22
tags:
  - auto-waiting
  - gotchas
type: "trick"
---
