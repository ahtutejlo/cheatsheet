---
ua_question: "Як працює перехоплення мережевих запитів у Playwright?"
en_question: "How does network interception work in Playwright?"
ua_answer: |
  Playwright дозволяє перехоплювати, модифікувати та мокати HTTP-запити через метод `page.route()`. Це корисно для тестування UI без залежності від реального API, для симуляції помилок або для прискорення тестів.

  `route()` приймає URL-паттерн (string, regex або predicate) та callback-функцію, яка вирішує долю запиту: `fulfill` (повернути мок-відповідь), `abort` (скасувати запит) або `continue` (пропустити з модифікаціями).

  ```typescript
  import { test, expect } from '@playwright/test';

  test('mock API response', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ]),
      });
    });

    await page.goto('https://example.com/users');
    await expect(page.getByRole('listitem')).toHaveCount(2);
  });

  test('simulate server error', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.goto('https://example.com/users');
    await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('abort image loading for speed', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,svg}', (route) => route.abort());
    await page.goto('https://example.com');
  });

  test('modify request headers', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await route.continue({
        headers: { ...route.request().headers(), 'X-Custom': 'test' },
      });
    });

    await page.goto('https://example.com');
  });
  ```

  Network interception працює на рівні BrowserContext, тому можна встановлювати route для всіх сторінок контексту через `context.route()`. Це особливо корисно для глобального мокання авторизації або блокування аналітики.
en_answer: |
  Playwright allows intercepting, modifying, and mocking HTTP requests via the `page.route()` method. This is useful for testing UI without depending on a real API, simulating errors, or speeding up tests.

  `route()` accepts a URL pattern (string, regex, or predicate) and a callback function that decides the request's fate: `fulfill` (return a mock response), `abort` (cancel the request), or `continue` (pass through with modifications).

  ```typescript
  import { test, expect } from '@playwright/test';

  test('mock API response', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ]),
      });
    });

    await page.goto('https://example.com/users');
    await expect(page.getByRole('listitem')).toHaveCount(2);
  });

  test('simulate server error', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.goto('https://example.com/users');
    await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('abort image loading for speed', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,svg}', (route) => route.abort());
    await page.goto('https://example.com');
  });

  test('modify request headers', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await route.continue({
        headers: { ...route.request().headers(), 'X-Custom': 'test' },
      });
    });

    await page.goto('https://example.com');
  });
  ```

  Network interception works at the BrowserContext level, so you can set routes for all pages in a context via `context.route()`. This is especially useful for global auth mocking or blocking analytics.
section: "playwright"
order: 7
tags:
  - network
  - mocking
type: "basic"
---
