---
ua_question: "Як тестувати API за допомогою Playwright (APIRequestContext)?"
en_question: "How to test APIs with Playwright (APIRequestContext)?"
ua_answer: |
  Playwright дозволяє тестувати REST API без браузера через **APIRequestContext**. Це корисно для підготовки тестових даних, перевірки backend-ендпоінтів або комбінування API- та UI-тестів в одному сценарії.

  `request` fixture надає APIRequestContext, який підтримує всі HTTP-методи (GET, POST, PUT, DELETE, PATCH). Він автоматично зберігає cookies між запитами і може використовувати storage state для авторизації.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('API testing basics', async ({ request }) => {
    // GET request
    const response = await request.get('https://api.example.com/users');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const users = await response.json();
    expect(users).toHaveLength(3);
  });

  test('create and verify resource', async ({ request }) => {
    // POST request
    const createResponse = await request.post('https://api.example.com/users', {
      data: {
        name: 'Alice',
        email: 'alice@example.com',
      },
    });
    expect(createResponse.status()).toBe(201);

    const user = await createResponse.json();
    expect(user.name).toBe('Alice');

    // Verify with GET
    const getResponse = await request.get(
      `https://api.example.com/users/${user.id}`
    );
    expect(getResponse.ok()).toBeTruthy();
  });

  test('combine API and UI testing', async ({ page, request }) => {
    // Setup: create test data via API
    await request.post('https://api.example.com/products', {
      data: { name: 'Test Product', price: 99.99 },
    });

    // Test: verify product appears in UI
    await page.goto('https://example.com/products');
    await expect(page.getByText('Test Product')).toBeVisible();
    await expect(page.getByText('$99.99')).toBeVisible();

    // Cleanup: delete via API
    await request.delete('https://api.example.com/products/test-product');
  });
  ```

  Комбінування API та UI тестів -- потужний паттерн. API використовується для швидкого setup/teardown тестових даних, а UI-перевірки фокусуються на візуальному відображенні.
en_answer: |
  Playwright allows testing REST APIs without a browser through **APIRequestContext**. This is useful for preparing test data, verifying backend endpoints, or combining API and UI tests in a single scenario.

  The `request` fixture provides APIRequestContext, which supports all HTTP methods (GET, POST, PUT, DELETE, PATCH). It automatically maintains cookies between requests and can use storage state for authentication.

  ```typescript
  import { test, expect } from '@playwright/test';

  test('API testing basics', async ({ request }) => {
    // GET request
    const response = await request.get('https://api.example.com/users');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const users = await response.json();
    expect(users).toHaveLength(3);
  });

  test('create and verify resource', async ({ request }) => {
    // POST request
    const createResponse = await request.post('https://api.example.com/users', {
      data: {
        name: 'Alice',
        email: 'alice@example.com',
      },
    });
    expect(createResponse.status()).toBe(201);

    const user = await createResponse.json();
    expect(user.name).toBe('Alice');

    // Verify with GET
    const getResponse = await request.get(
      `https://api.example.com/users/${user.id}`
    );
    expect(getResponse.ok()).toBeTruthy();
  });

  test('combine API and UI testing', async ({ page, request }) => {
    // Setup: create test data via API
    await request.post('https://api.example.com/products', {
      data: { name: 'Test Product', price: 99.99 },
    });

    // Test: verify product appears in UI
    await page.goto('https://example.com/products');
    await expect(page.getByText('Test Product')).toBeVisible();
    await expect(page.getByText('$99.99')).toBeVisible();

    // Cleanup: delete via API
    await request.delete('https://api.example.com/products/test-product');
  });
  ```

  Combining API and UI tests is a powerful pattern. API is used for fast setup/teardown of test data, while UI checks focus on visual rendering.
section: "playwright"
order: 14
tags:
  - api-testing
  - network
type: "basic"
---
