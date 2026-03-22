---
ua_question: "Як зберегти стан авторизації між тестами за допомогою storage state?"
en_question: "How to save authentication state between tests using storage state?"
ua_answer: |
  **Storage state** -- це механізм Playwright для збереження та повторного використання стану авторизації (cookies, localStorage) між тестами. Замість логіну перед кожним тестом, авторизація виконується один раз, а стан зберігається у JSON-файл.

  Це значно прискорює тести, адже логін -- це зазвичай найповільніша частина тесту. Playwright підтримує кілька ролей користувачів через різні storage state файли.

  ```typescript
  // auth.setup.ts -- runs once before all tests
  import { test as setup, expect } from '@playwright/test';

  const authFile = 'playwright/.auth/user.json';

  setup('authenticate', async ({ page }) => {
    await page.goto('https://example.com/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Welcome')).toBeVisible();

    // Save authentication state
    await page.context().storageState({ path: authFile });
  });
  ```

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    projects: [
      { name: 'setup', testMatch: /.*\.setup\.ts/ },
      {
        name: 'chromium',
        dependencies: ['setup'],
        use: {
          storageState: 'playwright/.auth/user.json',
        },
      },
    ],
  });
  ```

  Файл storage state слід додати до `.gitignore`, оскільки він містить чутливі дані (tokens, session cookies). При CI/CD setup-проект виконується першим, а всі інші проекти використовують збережений стан.
en_answer: |
  **Storage state** is Playwright's mechanism for saving and reusing authentication state (cookies, localStorage) between tests. Instead of logging in before each test, authentication is performed once, and the state is saved to a JSON file.

  This significantly speeds up tests since login is usually the slowest part of a test. Playwright supports multiple user roles through different storage state files.

  ```typescript
  // auth.setup.ts -- runs once before all tests
  import { test as setup, expect } from '@playwright/test';

  const authFile = 'playwright/.auth/user.json';

  setup('authenticate', async ({ page }) => {
    await page.goto('https://example.com/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Welcome')).toBeVisible();

    // Save authentication state
    await page.context().storageState({ path: authFile });
  });
  ```

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    projects: [
      { name: 'setup', testMatch: /.*\.setup\.ts/ },
      {
        name: 'chromium',
        dependencies: ['setup'],
        use: {
          storageState: 'playwright/.auth/user.json',
        },
      },
    ],
  });
  ```

  The storage state file should be added to `.gitignore` since it contains sensitive data (tokens, session cookies). In CI/CD, the setup project runs first, and all other projects use the saved state.
section: "playwright"
order: 10
tags:
  - auth
  - optimization
type: "basic"
---
