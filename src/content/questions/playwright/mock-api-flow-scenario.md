---
ua_question: "Замокайте складний API flow для UI тестування"
en_question: "Mock a complex API flow for UI testing"
ua_answer: |
  **Сценарій:** Тестувати UI фільтрації та пагінації таблиці, яка залежить від REST API з кількома ендпоінтами: список продуктів, деталі продукту, фільтри, пагінація. Реальний API нестабільний і повільний.

  **Підхід:** Замокати всі API-ендпоінти, імітувати різні стани (порожній список, помилка, велика кількість даних), протестувати UI-поведінку ізольовано.

  ```typescript
  import { test, expect, type Page } from '@playwright/test';

  // Helper to set up all API mocks
  async function mockProductsAPI(page: Page, options?: {
    products?: Array<{ id: number; name: string; price: number; category: string }>;
    totalPages?: number;
    currentPage?: number;
    error?: boolean;
  }) {
    const {
      products = [
        { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
        { id: 2, name: 'Shirt', price: 29, category: 'Clothing' },
        { id: 3, name: 'Book', price: 15, category: 'Books' },
      ],
      totalPages = 1,
      currentPage = 1,
      error = false,
    } = options || {};

    // Mock product list endpoint
    await page.route('**/api/products*', async (route) => {
      if (error) {
        await route.fulfill({ status: 500, body: 'Server Error' });
        return;
      }

      const url = new URL(route.request().url());
      const category = url.searchParams.get('category');
      const page = Number(url.searchParams.get('page')) || 1;

      let filtered = products;
      if (category) {
        filtered = products.filter((p) => p.category === category);
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: filtered,
          pagination: { page, totalPages, total: filtered.length },
        }),
      });
    });

    // Mock product detail endpoint
    await page.route('**/api/products/*', async (route) => {
      const id = Number(route.request().url().split('/').pop());
      const product = products.find((p) => p.id === id);

      if (product) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(product),
        });
      } else {
        await route.fulfill({ status: 404, body: 'Not Found' });
      }
    });

    // Mock categories endpoint
    await page.route('**/api/categories', async (route) => {
      const categories = [...new Set(products.map((p) => p.category))];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(categories),
      });
    });
  }

  test('filter products by category', async ({ page }) => {
    await mockProductsAPI(page);
    await page.goto('/products');

    await page.getByRole('combobox', { name: 'Category' }).selectOption('Electronics');
    await expect(page.getByRole('row')).toHaveCount(2); // header + 1 product
    await expect(page.getByText('Laptop')).toBeVisible();
  });

  test('empty state when no products', async ({ page }) => {
    await mockProductsAPI(page, { products: [] });
    await page.goto('/products');

    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('error state', async ({ page }) => {
    await mockProductsAPI(page, { error: true });
    await page.goto('/products');

    await expect(page.getByText('Failed to load products')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('pagination', async ({ page }) => {
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: (i + 1) * 10,
      category: 'All',
    }));

    await mockProductsAPI(page, { products: manyProducts, totalPages: 4 });
    await page.goto('/products');

    await expect(page.getByRole('row')).toHaveCount(21);
    await page.getByRole('button', { name: 'Next page' }).click();
  });
  ```

  Централізований мок-хелпер з параметрами дозволяє тестувати різні стани UI без дублювання setup-коду. Кожен тест контролює, які дані повертає API.
en_answer: |
  **Scenario:** Test UI filtering and pagination of a table that depends on a REST API with multiple endpoints: product list, product details, filters, pagination. The real API is unstable and slow.

  **Approach:** Mock all API endpoints, simulate different states (empty list, error, large dataset), test UI behavior in isolation.

  ```typescript
  import { test, expect, type Page } from '@playwright/test';

  // Helper to set up all API mocks
  async function mockProductsAPI(page: Page, options?: {
    products?: Array<{ id: number; name: string; price: number; category: string }>;
    totalPages?: number;
    currentPage?: number;
    error?: boolean;
  }) {
    const {
      products = [
        { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
        { id: 2, name: 'Shirt', price: 29, category: 'Clothing' },
        { id: 3, name: 'Book', price: 15, category: 'Books' },
      ],
      totalPages = 1,
      currentPage = 1,
      error = false,
    } = options || {};

    // Mock product list endpoint
    await page.route('**/api/products*', async (route) => {
      if (error) {
        await route.fulfill({ status: 500, body: 'Server Error' });
        return;
      }

      const url = new URL(route.request().url());
      const category = url.searchParams.get('category');
      const page = Number(url.searchParams.get('page')) || 1;

      let filtered = products;
      if (category) {
        filtered = products.filter((p) => p.category === category);
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: filtered,
          pagination: { page, totalPages, total: filtered.length },
        }),
      });
    });

    // Mock product detail endpoint
    await page.route('**/api/products/*', async (route) => {
      const id = Number(route.request().url().split('/').pop());
      const product = products.find((p) => p.id === id);

      if (product) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(product),
        });
      } else {
        await route.fulfill({ status: 404, body: 'Not Found' });
      }
    });

    // Mock categories endpoint
    await page.route('**/api/categories', async (route) => {
      const categories = [...new Set(products.map((p) => p.category))];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(categories),
      });
    });
  }

  test('filter products by category', async ({ page }) => {
    await mockProductsAPI(page);
    await page.goto('/products');

    await page.getByRole('combobox', { name: 'Category' }).selectOption('Electronics');
    await expect(page.getByRole('row')).toHaveCount(2); // header + 1 product
    await expect(page.getByText('Laptop')).toBeVisible();
  });

  test('empty state when no products', async ({ page }) => {
    await mockProductsAPI(page, { products: [] });
    await page.goto('/products');

    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('error state', async ({ page }) => {
    await mockProductsAPI(page, { error: true });
    await page.goto('/products');

    await expect(page.getByText('Failed to load products')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('pagination', async ({ page }) => {
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: (i + 1) * 10,
      category: 'All',
    }));

    await mockProductsAPI(page, { products: manyProducts, totalPages: 4 });
    await page.goto('/products');

    await expect(page.getByRole('row')).toHaveCount(21);
    await page.getByRole('button', { name: 'Next page' }).click();
  });
  ```

  A centralized mock helper with parameters allows testing different UI states without duplicating setup code. Each test controls what data the API returns.
section: "playwright"
order: 39
tags:
  - network
  - mocking
type: "practical"
---
