---
ua_question: "Що таке Trace Viewer у Playwright і як працює tracing?"
en_question: "What is Trace Viewer in Playwright and how does tracing work?"
ua_answer: |
  **Tracing** -- це механізм Playwright для запису детального журналу виконання тесту у файл `trace.zip`. Trace містить скріншоти кожного кроку, DOM-снапшоти, мережеві запити, console-логи та вихідний код тесту.

  **Trace Viewer** -- це вбудований GUI-інструмент для перегляду trace-файлів. Він дозволяє покроково переглядати виконання тесту, інспектувати DOM на кожному кроці, бачити мережеві запити та аналізувати таймінги.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    use: {
      // Record trace only on first retry of failed test
      trace: 'on-first-retry',
    },
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('manual trace recording', async ({ page, context }) => {
    // Start tracing manually
    await context.tracing.start({ screenshots: true, snapshots: true });

    await page.goto('https://example.com');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Stop and save trace
    await context.tracing.stop({ path: 'trace.zip' });
  });
  ```

  Для перегляду trace використовується команда:
  ```typescript
  // Open trace viewer (run in terminal)
  // npx playwright show-trace trace.zip

  // Or view online at trace.playwright.dev
  ```

  Найпоширеніша стратегія -- `trace: 'on-first-retry'`. Trace записується тільки при першому повторі падіння, що зберігає ресурси CI. Для локального дебагу можна використовувати `trace: 'on'` або записувати trace програмно.
en_answer: |
  **Tracing** is Playwright's mechanism for recording a detailed execution log of a test into a `trace.zip` file. The trace contains screenshots of each step, DOM snapshots, network requests, console logs, and test source code.

  **Trace Viewer** is a built-in GUI tool for viewing trace files. It allows step-by-step review of test execution, DOM inspection at each step, viewing network requests, and analyzing timings.

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    use: {
      // Record trace only on first retry of failed test
      trace: 'on-first-retry',
    },
  });
  ```

  ```typescript
  import { test, expect } from '@playwright/test';

  test('manual trace recording', async ({ page, context }) => {
    // Start tracing manually
    await context.tracing.start({ screenshots: true, snapshots: true });

    await page.goto('https://example.com');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Stop and save trace
    await context.tracing.stop({ path: 'trace.zip' });
  });
  ```

  To view the trace, use the command:
  ```typescript
  // Open trace viewer (run in terminal)
  // npx playwright show-trace trace.zip

  // Or view online at trace.playwright.dev
  ```

  The most common strategy is `trace: 'on-first-retry'`. Trace is recorded only on the first retry of a failure, which saves CI resources. For local debugging, you can use `trace: 'on'` or record traces programmatically.
section: "playwright"
order: 9
tags:
  - debugging
  - tracing
type: "basic"
---
