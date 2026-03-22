---
ua_question: "Як реалізувати Page Object Model у Playwright?"
en_question: "How to implement Page Object Model in Playwright?"
ua_answer: |
  **Page Object Model (POM)** -- це паттерн, де кожна сторінка або компонент UI представлений класом, який інкапсулює локатори та дії. Це зменшує дублювання коду та спрощує підтримку тестів при змінах UI.

  У Playwright POM реалізується як TypeScript-клас, що приймає `Page` об'єкт у конструкторі. Локатори визначаються як властивості, а дії -- як методи. Playwright рекомендує використовувати локатори, а не збережені ElementHandle, оскільки локатори мають auto-waiting.

  ```typescript
  // pages/login.page.ts
  import { type Page, type Locator } from '@playwright/test';

  export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
      this.page = page;
      this.emailInput = page.getByLabel('Email');
      this.passwordInput = page.getByLabel('Password');
      this.submitButton = page.getByRole('button', { name: 'Sign in' });
      this.errorMessage = page.getByRole('alert');
    }

    async goto() {
      await this.page.goto('/login');
    }

    async login(email: string, password: string) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click();
    }
  }

  // tests/login.spec.ts
  import { test, expect } from '@playwright/test';
  import { LoginPage } from '../pages/login.page';

  test('successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrong');
    await expect(loginPage.errorMessage).toBeVisible();
  });
  ```

  POM можна комбінувати з fixtures для автоматичного створення page objects. Це усуває необхідність ручного створення об'єктів у кожному тесті та забезпечує типобезпечний доступ.
en_answer: |
  **Page Object Model (POM)** is a pattern where each page or UI component is represented by a class that encapsulates locators and actions. This reduces code duplication and simplifies test maintenance when UI changes.

  In Playwright, POM is implemented as a TypeScript class that accepts a `Page` object in its constructor. Locators are defined as properties and actions as methods. Playwright recommends using locators rather than stored ElementHandles, since locators have auto-waiting.

  ```typescript
  // pages/login.page.ts
  import { type Page, type Locator } from '@playwright/test';

  export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
      this.page = page;
      this.emailInput = page.getByLabel('Email');
      this.passwordInput = page.getByLabel('Password');
      this.submitButton = page.getByRole('button', { name: 'Sign in' });
      this.errorMessage = page.getByRole('alert');
    }

    async goto() {
      await this.page.goto('/login');
    }

    async login(email: string, password: string) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click();
    }
  }

  // tests/login.spec.ts
  import { test, expect } from '@playwright/test';
  import { LoginPage } from '../pages/login.page';

  test('successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrong');
    await expect(loginPage.errorMessage).toBeVisible();
  });
  ```

  POM can be combined with fixtures for automatic page object creation. This eliminates the need for manual object instantiation in each test and provides type-safe access.
section: "playwright"
order: 5
tags:
  - pom
  - architecture
type: "basic"
---
