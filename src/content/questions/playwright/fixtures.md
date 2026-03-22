---
ua_question: "Що таке fixtures у Playwright? Як створити кастомні fixtures?"
en_question: "What are fixtures in Playwright? How to create custom fixtures?"
ua_answer: |
  **Fixtures** -- це механізм Playwright Test для налаштування середовища тестів. Вбудовані fixtures (`page`, `context`, `browser`, `request`) надаються автоматично кожному тесту. Кожен тест отримує свіжий `page` і `context`, що забезпечує ізоляцію.

  Кастомні fixtures дозволяють розширювати тестове середовище -- наприклад, створювати page objects, налаштовувати авторизацію або ініціалізувати тестові дані. Fixtures підтримують композицію -- одні fixtures можуть залежати від інших.

  ```typescript
  // fixtures.ts
  import { test as base } from '@playwright/test';
  import { LoginPage } from './pages/login.page';
  import { DashboardPage } from './pages/dashboard.page';

  type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    authenticatedPage: DashboardPage;
  };

  export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
      const loginPage = new LoginPage(page);
      await use(loginPage);
    },

    dashboardPage: async ({ page }, use) => {
      const dashboardPage = new DashboardPage(page);
      await use(dashboardPage);
    },

    // Fixture that depends on other fixtures
    authenticatedPage: async ({ page, loginPage }, use) => {
      await loginPage.goto();
      await loginPage.login('admin@example.com', 'password');
      const dashboard = new DashboardPage(page);
      await use(dashboard);
    },
  });

  export { expect } from '@playwright/test';

  // tests/dashboard.spec.ts
  import { test, expect } from '../fixtures';

  test('view dashboard after login', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.welcomeMessage).toBeVisible();
  });
  ```

  Fixtures виконують setup-код до `use()` та teardown-код після. Це гарантує коректне очищення ресурсів. Worker-scoped fixtures (`{ scope: 'worker' }`) створюються один раз на worker і шаряться між тестами -- корисно для дорогих операцій типу створення бази даних.
en_answer: |
  **Fixtures** are Playwright Test's mechanism for setting up the test environment. Built-in fixtures (`page`, `context`, `browser`, `request`) are provided automatically to each test. Each test gets a fresh `page` and `context`, ensuring isolation.

  Custom fixtures allow extending the test environment -- for example, creating page objects, setting up authentication, or initializing test data. Fixtures support composition -- some fixtures can depend on others.

  ```typescript
  // fixtures.ts
  import { test as base } from '@playwright/test';
  import { LoginPage } from './pages/login.page';
  import { DashboardPage } from './pages/dashboard.page';

  type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    authenticatedPage: DashboardPage;
  };

  export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
      const loginPage = new LoginPage(page);
      await use(loginPage);
    },

    dashboardPage: async ({ page }, use) => {
      const dashboardPage = new DashboardPage(page);
      await use(dashboardPage);
    },

    // Fixture that depends on other fixtures
    authenticatedPage: async ({ page, loginPage }, use) => {
      await loginPage.goto();
      await loginPage.login('admin@example.com', 'password');
      const dashboard = new DashboardPage(page);
      await use(dashboard);
    },
  });

  export { expect } from '@playwright/test';

  // tests/dashboard.spec.ts
  import { test, expect } from '../fixtures';

  test('view dashboard after login', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.welcomeMessage).toBeVisible();
  });
  ```

  Fixtures execute setup code before `use()` and teardown code after. This guarantees proper resource cleanup. Worker-scoped fixtures (`{ scope: 'worker' }`) are created once per worker and shared between tests -- useful for expensive operations like database creation.
section: "playwright"
order: 6
tags:
  - fixtures
  - architecture
type: "basic"
---
