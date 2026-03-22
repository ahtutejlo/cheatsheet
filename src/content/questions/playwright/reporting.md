---
ua_question: "Які типи репортів підтримує Playwright і як їх налаштувати?"
en_question: "What types of reports does Playwright support and how to configure them?"
ua_answer: |
  Playwright має кілька вбудованих reporters та підтримує кастомні та сторонні рішення. Reporter визначає, як результати тестів представляються розробникам.

  **Вбудовані reporters:**
  - `html` -- інтерактивний HTML-звіт з фільтрацією, пошуком, скріншотами та trace
  - `list` -- текстовий список тестів у консолі (за замовчуванням)
  - `dot` -- мінімальний -- одна точка на тест
  - `line` -- один рядок на тест з оновленням
  - `json` -- машинозчитуваний JSON
  - `junit` -- XML для CI-систем (Jenkins, GitLab)
  - `github` -- анотації у GitHub Actions
  - `blob` -- бінарний формат для merge sharded results

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    reporter: process.env.CI
      ? [
          ['github'],
          ['html', { outputFolder: 'playwright-report', open: 'never' }],
          ['junit', { outputFile: 'results.xml' }],
          ['blob', { outputDir: 'blob-report' }],
        ]
      : [
          ['html', { open: 'on-failure' }],
        ],
  });
  ```

  ```typescript
  // Custom reporter
  // my-reporter.ts
  import type {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
  } from '@playwright/test/reporter';

  class MyReporter implements Reporter {
    onBegin(config: FullConfig, suite: Suite) {
      console.log(`Starting ${suite.allTests().length} tests`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
      console.log(`${test.title}: ${result.status} (${result.duration}ms)`);
    }

    onEnd(result: FullResult) {
      console.log(`Finished: ${result.status}`);
    }
  }

  export default MyReporter;
  ```

  ```typescript
  // Merge reports from sharded runs:
  // Each shard saves blob: --reporter=blob
  // Then merge:
  // npx playwright merge-reports --reporter=html ./all-blob-reports
  ```

  Для CI рекомендується комбінація: `github` (анотації в PR), `html` (детальний звіт як артефакт), `blob` (для merge при sharding). Для інтеграції з Allure використовується пакет `allure-playwright`.
en_answer: |
  Playwright has several built-in reporters and supports custom and third-party solutions. The reporter determines how test results are presented to developers.

  **Built-in reporters:**
  - `html` -- interactive HTML report with filtering, search, screenshots, and trace
  - `list` -- text list of tests in console (default)
  - `dot` -- minimal -- one dot per test
  - `line` -- one line per test with updates
  - `json` -- machine-readable JSON
  - `junit` -- XML for CI systems (Jenkins, GitLab)
  - `github` -- annotations in GitHub Actions
  - `blob` -- binary format for merging sharded results

  ```typescript
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    reporter: process.env.CI
      ? [
          ['github'],
          ['html', { outputFolder: 'playwright-report', open: 'never' }],
          ['junit', { outputFile: 'results.xml' }],
          ['blob', { outputDir: 'blob-report' }],
        ]
      : [
          ['html', { open: 'on-failure' }],
        ],
  });
  ```

  ```typescript
  // Custom reporter
  // my-reporter.ts
  import type {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
  } from '@playwright/test/reporter';

  class MyReporter implements Reporter {
    onBegin(config: FullConfig, suite: Suite) {
      console.log(`Starting ${suite.allTests().length} tests`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
      console.log(`${test.title}: ${result.status} (${result.duration}ms)`);
    }

    onEnd(result: FullResult) {
      console.log(`Finished: ${result.status}`);
    }
  }

  export default MyReporter;
  ```

  ```typescript
  // Merge reports from sharded runs:
  // Each shard saves blob: --reporter=blob
  // Then merge:
  // npx playwright merge-reports --reporter=html ./all-blob-reports
  ```

  For CI, the recommended combination is: `github` (annotations in PRs), `html` (detailed report as artifact), `blob` (for merging with sharding). For Allure integration, the `allure-playwright` package is used.
section: "playwright"
order: 33
tags:
  - ci-cd
  - reporting
type: "basic"
---
