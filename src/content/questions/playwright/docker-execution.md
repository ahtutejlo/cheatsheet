---
ua_question: "Як запускати Playwright тести в Docker та headless CI?"
en_question: "How to run Playwright tests in Docker and headless CI?"
ua_answer: |
  Playwright надає офіційні Docker-образи з усіма встановленими браузерами та системними залежностями. Це спрощує налаштування CI і гарантує консистентне середовище для тестів.

  У headless-режимі (за замовчуванням у CI) браузер запускається без графічного інтерфейсу. Playwright автоматично визначає CI-середовище і використовує headless-режим.

  ```typescript
  // Dockerfile for Playwright tests
  // FROM mcr.microsoft.com/playwright:v1.49.0-noble
  //
  // WORKDIR /app
  // COPY package*.json ./
  // RUN npm ci
  // COPY . .
  //
  // # Run tests
  // CMD ["npx", "playwright", "test"]
  ```

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // CI-specific settings
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,

    use: {
      // Headless by default in CI (auto-detected)
      headless: true,
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },
  });
  ```

  ```typescript
  // docker-compose.yml for local CI simulation
  // version: '3.8'
  // services:
  //   playwright:
  //     image: mcr.microsoft.com/playwright:v1.49.0-noble
  //     working_dir: /app
  //     volumes:
  //       - .:/app
  //     command: npx playwright test
  //     environment:
  //       - CI=true
  //     shm_size: '2gb'  # Important for browser stability
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('CI-friendly test', async ({ page }) => {
    await page.goto('https://example.com');

    // Use baseURL from config instead of hardcoded URLs
    // In CI, baseURL points to staging/preview environment
    await expect(page.getByRole('heading')).toBeVisible();
  });
  ```

  **Важливі нюанси Docker:**
  - `shm_size: '2gb'` -- збільшити shared memory (браузери використовують `/dev/shm`, за замовчуванням 64MB у Docker)
  - Версія Docker-образу повинна відповідати версії `@playwright/test` у `package.json`
  - Для visual regression використовуйте Docker і у локальній розробці, щоб baseline-и співпадали з CI
en_answer: |
  Playwright provides official Docker images with all browsers and system dependencies pre-installed. This simplifies CI setup and guarantees a consistent environment for tests.

  In headless mode (default in CI), the browser runs without a graphical interface. Playwright automatically detects the CI environment and uses headless mode.

  ```typescript
  // Dockerfile for Playwright tests
  // FROM mcr.microsoft.com/playwright:v1.49.0-noble
  //
  // WORKDIR /app
  // COPY package*.json ./
  // RUN npm ci
  // COPY . .
  //
  // # Run tests
  // CMD ["npx", "playwright", "test"]
  ```

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    // CI-specific settings
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,

    use: {
      // Headless by default in CI (auto-detected)
      headless: true,
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },
  });
  ```

  ```typescript
  // docker-compose.yml for local CI simulation
  // version: '3.8'
  // services:
  //   playwright:
  //     image: mcr.microsoft.com/playwright:v1.49.0-noble
  //     working_dir: /app
  //     volumes:
  //       - .:/app
  //     command: npx playwright test
  //     environment:
  //       - CI=true
  //     shm_size: '2gb'  # Important for browser stability
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('CI-friendly test', async ({ page }) => {
    await page.goto('https://example.com');

    // Use baseURL from config instead of hardcoded URLs
    // In CI, baseURL points to staging/preview environment
    await expect(page.getByRole('heading')).toBeVisible();
  });
  ```

  **Important Docker considerations:**
  - `shm_size: '2gb'` -- increase shared memory (browsers use `/dev/shm`, default 64MB in Docker)
  - Docker image version must match the `@playwright/test` version in `package.json`
  - For visual regression, use Docker in local development too so baselines match CI
section: "playwright"
order: 31
tags:
  - ci-cd
  - docker
type: "basic"
---
