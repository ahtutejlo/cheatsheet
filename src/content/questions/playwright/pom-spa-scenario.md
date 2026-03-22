---
ua_question: "Побудуйте Page Object Model для SPA з динамічним завантаженням"
en_question: "Build a Page Object Model for an SPA with dynamic loading"
ua_answer: |
  **Сценарій:** E-commerce SPA з динамічним завантаженням продуктів, кошиком та checkout. Сторінки не перезавантажуються -- контент оновлюється через API.

  **Підхід:** Створити POM з lazy-локаторами, методами навігації через UI (а не URL) та інтеграцією з fixtures для автоматичного створення.

  ```typescript
  // pages/base.page.ts
  import { type Page, type Locator } from '@playwright/test';

  export abstract class BasePage {
    readonly page: Page;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
      this.page = page;
      this.loadingSpinner = page.locator('[data-testid="spinner"]');
    }

    async waitForLoad() {
      await this.loadingSpinner.waitFor({ state: 'hidden' });
    }
  }

  // pages/products.page.ts
  import { type Page, type Locator, expect } from '@playwright/test';
  import { BasePage } from './base.page';

  export class ProductsPage extends BasePage {
    readonly searchInput: Locator;
    readonly productCards: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
      super(page);
      this.searchInput = page.getByPlaceholder('Search products...');
      this.productCards = page.getByTestId('product-card');
      this.cartBadge = page.getByTestId('cart-badge');
    }

    async goto() {
      await this.page.goto('/products');
      await this.waitForLoad();
    }

    async search(query: string) {
      await this.searchInput.fill(query);
      await this.waitForLoad(); // SPA re-fetches on search
    }

    async addToCart(productName: string) {
      const card = this.productCards.filter({ hasText: productName });
      await card.getByRole('button', { name: 'Add to cart' }).click();
      // Wait for cart badge to update
      await expect(this.cartBadge).not.toHaveText('0');
    }

    async getProductCount(): Promise<number> {
      return await this.productCards.count();
    }
  }

  // pages/checkout.page.ts
  import { type Page, type Locator } from '@playwright/test';
  import { BasePage } from './base.page';

  export class CheckoutPage extends BasePage {
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly placeOrderButton: Locator;
    readonly orderConfirmation: Locator;

    constructor(page: Page) {
      super(page);
      this.addressInput = page.getByLabel('Address');
      this.cityInput = page.getByLabel('City');
      this.placeOrderButton = page.getByRole('button', { name: 'Place order' });
      this.orderConfirmation = page.getByTestId('order-confirmation');
    }

    async fillShipping(address: string, city: string) {
      await this.addressInput.fill(address);
      await this.cityInput.fill(city);
    }

    async placeOrder() {
      await this.placeOrderButton.click();
      await this.waitForLoad();
    }
  }

  // fixtures.ts
  import { test as base } from '@playwright/test';
  import { ProductsPage } from './pages/products.page';
  import { CheckoutPage } from './pages/checkout.page';

  export const test = base.extend<{
    productsPage: ProductsPage;
    checkoutPage: CheckoutPage;
  }>({
    productsPage: async ({ page }, use) => {
      await use(new ProductsPage(page));
    },
    checkoutPage: async ({ page }, use) => {
      await use(new CheckoutPage(page));
    },
  });
  export { expect } from '@playwright/test';

  // tests/checkout.spec.ts
  import { test, expect } from '../fixtures';

  test('full checkout flow', async ({ productsPage, checkoutPage }) => {
    await productsPage.goto();
    await productsPage.search('Laptop');
    await productsPage.addToCart('Gaming Laptop');

    await productsPage.page.getByRole('link', { name: 'Cart' }).click();
    await checkoutPage.fillShipping('123 Main St', 'Kyiv');
    await checkoutPage.placeOrder();

    await expect(checkoutPage.orderConfirmation).toBeVisible();
  });
  ```

  Ключові принципи: BasePage для спільної логіки, fixtures для DI, lazy-локатори для SPA-сумісності, `waitForLoad()` замість `networkidle`.
en_answer: |
  **Scenario:** E-commerce SPA with dynamic product loading, cart, and checkout. Pages do not reload -- content updates via API.

  **Approach:** Create POM with lazy locators, navigation methods through UI (not URLs), and fixture integration for automatic creation.

  ```typescript
  // pages/base.page.ts
  import { type Page, type Locator } from '@playwright/test';

  export abstract class BasePage {
    readonly page: Page;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
      this.page = page;
      this.loadingSpinner = page.locator('[data-testid="spinner"]');
    }

    async waitForLoad() {
      await this.loadingSpinner.waitFor({ state: 'hidden' });
    }
  }

  // pages/products.page.ts
  import { type Page, type Locator, expect } from '@playwright/test';
  import { BasePage } from './base.page';

  export class ProductsPage extends BasePage {
    readonly searchInput: Locator;
    readonly productCards: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
      super(page);
      this.searchInput = page.getByPlaceholder('Search products...');
      this.productCards = page.getByTestId('product-card');
      this.cartBadge = page.getByTestId('cart-badge');
    }

    async goto() {
      await this.page.goto('/products');
      await this.waitForLoad();
    }

    async search(query: string) {
      await this.searchInput.fill(query);
      await this.waitForLoad(); // SPA re-fetches on search
    }

    async addToCart(productName: string) {
      const card = this.productCards.filter({ hasText: productName });
      await card.getByRole('button', { name: 'Add to cart' }).click();
      // Wait for cart badge to update
      await expect(this.cartBadge).not.toHaveText('0');
    }

    async getProductCount(): Promise<number> {
      return await this.productCards.count();
    }
  }

  // pages/checkout.page.ts
  import { type Page, type Locator } from '@playwright/test';
  import { BasePage } from './base.page';

  export class CheckoutPage extends BasePage {
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly placeOrderButton: Locator;
    readonly orderConfirmation: Locator;

    constructor(page: Page) {
      super(page);
      this.addressInput = page.getByLabel('Address');
      this.cityInput = page.getByLabel('City');
      this.placeOrderButton = page.getByRole('button', { name: 'Place order' });
      this.orderConfirmation = page.getByTestId('order-confirmation');
    }

    async fillShipping(address: string, city: string) {
      await this.addressInput.fill(address);
      await this.cityInput.fill(city);
    }

    async placeOrder() {
      await this.placeOrderButton.click();
      await this.waitForLoad();
    }
  }

  // fixtures.ts
  import { test as base } from '@playwright/test';
  import { ProductsPage } from './pages/products.page';
  import { CheckoutPage } from './pages/checkout.page';

  export const test = base.extend<{
    productsPage: ProductsPage;
    checkoutPage: CheckoutPage;
  }>({
    productsPage: async ({ page }, use) => {
      await use(new ProductsPage(page));
    },
    checkoutPage: async ({ page }, use) => {
      await use(new CheckoutPage(page));
    },
  });
  export { expect } from '@playwright/test';

  // tests/checkout.spec.ts
  import { test, expect } from '../fixtures';

  test('full checkout flow', async ({ productsPage, checkoutPage }) => {
    await productsPage.goto();
    await productsPage.search('Laptop');
    await productsPage.addToCart('Gaming Laptop');

    await productsPage.page.getByRole('link', { name: 'Cart' }).click();
    await checkoutPage.fillShipping('123 Main St', 'Kyiv');
    await checkoutPage.placeOrder();

    await expect(checkoutPage.orderConfirmation).toBeVisible();
  });
  ```

  Key principles: BasePage for shared logic, fixtures for DI, lazy locators for SPA compatibility, `waitForLoad()` instead of `networkidle`.
section: "playwright"
order: 36
tags:
  - pom
  - architecture
type: "practical"
---
