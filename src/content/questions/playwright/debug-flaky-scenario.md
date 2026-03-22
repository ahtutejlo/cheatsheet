---
ua_question: "Як відлагодити flaky тест за допомогою Trace Viewer?"
en_question: "How to debug a flaky test using Trace Viewer?"
ua_answer: |
  **Сценарій:** Тест checkout flow падає у CI з помилкою "element is not visible" приблизно в 20% запусків. Локально тест завжди проходить.

  **Підхід:** Увімкнити trace при retry, відтворити проблему, проаналізувати trace покроково.

  ```typescript
  // playwright.config.ts -- ensure trace is captured
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    retries: 2,
    use: {
      trace: 'on-first-retry', // Capture trace on first retry
      screenshot: 'only-on-failure',
      video: 'on-first-retry',
    },
  });
  ```

  ```typescript
  // Step 1: Reproduce locally with repeat-each
  // npx playwright test checkout.spec.ts --repeat-each=20

  // Step 2: If reproduced, open the trace
  // npx playwright show-trace test-results/checkout-retry1/trace.zip

  // Step 3: If not reproduced locally, download CI artifact
  // and open trace from there
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  // The flaky test BEFORE fixing
  test('checkout flow -- flaky version', async ({ page }) => {
    await page.goto('https://example.com/products');

    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'Cart' }).click();

    // BUG: "Checkout" button appears after cart animation
    // On slow CI, animation is not finished yet
    await page.getByRole('button', { name: 'Checkout' }).click(); // FLAKY!

    await page.getByLabel('Address').fill('123 Main St');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByText('Order confirmed')).toBeVisible();
  });
  ```

  ```typescript
  // Trace Viewer analysis reveals:
  // 1. Action: click "Add to cart" -- OK (200ms)
  // 2. Action: click "Cart" -- OK (100ms)
  // 3. Action: click "Checkout" -- FAILED
  //    Screenshot shows: cart drawer is still animating
  //    The "Checkout" button is present but covered by animation overlay
  //    Actionability check: "element does not receive pointer events"

  // The fix: wait for cart to finish loading
  test('checkout flow -- fixed version', async ({ page }) => {
    await page.goto('https://example.com/products');

    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'Cart' }).click();

    // Fix: wait for cart items to be visible (animation complete)
    await expect(page.getByTestId('cart-items')).toBeVisible();

    // Now the checkout button is not covered by animation overlay
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByLabel('Address').fill('123 Main St');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByText('Order confirmed')).toBeVisible();
  });

  // Step 4: Verify fix with repeat-each
  // npx playwright test checkout.spec.ts --repeat-each=50
  ```

  **Методологія дебагу:** 1) Отримати trace з retry, 2) Знайти крок, що впав, 3) Подивитися скріншот і DOM-снапшот цього кроку, 4) Перевірити network timeline (чи завершились API-виклики), 5) Виправити root cause, 6) Верифікувати fix через `--repeat-each`.
en_answer: |
  **Scenario:** Checkout flow test fails in CI with "element is not visible" error approximately 20% of runs. Locally the test always passes.

  **Approach:** Enable trace on retry, reproduce the issue, analyze trace step by step.

  ```typescript
  // playwright.config.ts -- ensure trace is captured
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    retries: 2,
    use: {
      trace: 'on-first-retry', // Capture trace on first retry
      screenshot: 'only-on-failure',
      video: 'on-first-retry',
    },
  });
  ```

  ```typescript
  // Step 1: Reproduce locally with repeat-each
  // npx playwright test checkout.spec.ts --repeat-each=20

  // Step 2: If reproduced, open the trace
  // npx playwright show-trace test-results/checkout-retry1/trace.zip

  // Step 3: If not reproduced locally, download CI artifact
  // and open trace from there
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  // The flaky test BEFORE fixing
  test('checkout flow -- flaky version', async ({ page }) => {
    await page.goto('https://example.com/products');

    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'Cart' }).click();

    // BUG: "Checkout" button appears after cart animation
    // On slow CI, animation is not finished yet
    await page.getByRole('button', { name: 'Checkout' }).click(); // FLAKY!

    await page.getByLabel('Address').fill('123 Main St');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByText('Order confirmed')).toBeVisible();
  });
  ```

  ```typescript
  // Trace Viewer analysis reveals:
  // 1. Action: click "Add to cart" -- OK (200ms)
  // 2. Action: click "Cart" -- OK (100ms)
  // 3. Action: click "Checkout" -- FAILED
  //    Screenshot shows: cart drawer is still animating
  //    The "Checkout" button is present but covered by animation overlay
  //    Actionability check: "element does not receive pointer events"

  // The fix: wait for cart to finish loading
  test('checkout flow -- fixed version', async ({ page }) => {
    await page.goto('https://example.com/products');

    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'Cart' }).click();

    // Fix: wait for cart items to be visible (animation complete)
    await expect(page.getByTestId('cart-items')).toBeVisible();

    // Now the checkout button is not covered by animation overlay
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByLabel('Address').fill('123 Main St');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByText('Order confirmed')).toBeVisible();
  });

  // Step 4: Verify fix with repeat-each
  // npx playwright test checkout.spec.ts --repeat-each=50
  ```

  **Debugging methodology:** 1) Get trace from retry, 2) Find the failing step, 3) Examine screenshot and DOM snapshot at that step, 4) Check network timeline (whether API calls completed), 5) Fix root cause, 6) Verify fix with `--repeat-each`.
section: "playwright"
order: 38
tags:
  - debugging
  - flaky-tests
type: "practical"
---
