---
ua_question: "Як тестові раннери реалізують паралельне виконання тестів?"
en_question: "How do test runners implement parallel test execution?"
ua_answer: |
  Паралельне виконання тестів -- ключовий механізм скорочення часу CI-пайплайну. TestNG та JUnit 5 використовують різні підходи до паралелізації, але обидва базуються на управлінні пулом потоків.

  **JUnit 5** використовує `ForkJoinPool` для паралельного виконання. Конфігурація відбувається через `junit-platform.properties`:
  - `junit.jupiter.execution.parallel.enabled = true` -- вмикає паралелізм
  - `junit.jupiter.execution.parallel.mode.default = concurrent` -- режим за замовчуванням
  - `junit.jupiter.execution.parallel.config.strategy = fixed` -- стратегія пулу потоків

  **TestNG** пропонує паралелізацію на рівні методів, класів або тестових наборів через XML-конфігурацію. Кожен рівень має свої гарантії ізоляції.

  **Головна небезпека** -- спільний змінюваний стан між потоками: статичні змінні, сінглтони, спільний WebDriver.

  ```java
  // JUnit 5 parallel configuration
  // File: src/test/resources/junit-platform.properties
  // junit.jupiter.execution.parallel.enabled = true
  // junit.jupiter.execution.parallel.mode.default = concurrent
  // junit.jupiter.execution.parallel.config.fixed.parallelism = 4

  // Thread-safe test with isolated WebDriver
  @Execution(ExecutionMode.CONCURRENT)
  class ParallelLoginTest {

      // ThreadLocal ensures each thread gets its own driver
      private static final ThreadLocal<WebDriver> DRIVER =
          ThreadLocal.withInitial(() -> new ChromeDriver());

      @Test
      void loginAsAdmin() {
          WebDriver driver = DRIVER.get();
          driver.get("https://app.example.com/login");
          // each thread uses its own browser instance
      }

      @Test
      void loginAsUser() {
          WebDriver driver = DRIVER.get();
          driver.get("https://app.example.com/login");
      }

      @AfterEach
      void teardown() {
          DRIVER.get().manage().deleteAllCookies();
      }

      @AfterAll
      static void cleanup() {
          DRIVER.get().quit();
          DRIVER.remove();
      }
  }
  ```

  Розуміння того, як раннер розподіляє тести по потоках, критичне для діагностики "phantom failures" -- помилок, що з'являються лише при паралельному запуску.
en_answer: |
  Parallel test execution is a key mechanism for reducing CI pipeline time. TestNG and JUnit 5 use different approaches to parallelization, but both are based on thread pool management.

  **JUnit 5** uses `ForkJoinPool` for parallel execution. Configuration is done through `junit-platform.properties`:
  - `junit.jupiter.execution.parallel.enabled = true` -- enables parallelism
  - `junit.jupiter.execution.parallel.mode.default = concurrent` -- default mode
  - `junit.jupiter.execution.parallel.config.strategy = fixed` -- thread pool strategy

  **TestNG** offers parallelization at the method, class, or suite level through XML configuration. Each level has its own isolation guarantees.

  **The main danger** is shared mutable state between threads: static variables, singletons, shared WebDriver.

  ```java
  // JUnit 5 parallel configuration
  // File: src/test/resources/junit-platform.properties
  // junit.jupiter.execution.parallel.enabled = true
  // junit.jupiter.execution.parallel.mode.default = concurrent
  // junit.jupiter.execution.parallel.config.fixed.parallelism = 4

  // Thread-safe test with isolated WebDriver
  @Execution(ExecutionMode.CONCURRENT)
  class ParallelLoginTest {

      // ThreadLocal ensures each thread gets its own driver
      private static final ThreadLocal<WebDriver> DRIVER =
          ThreadLocal.withInitial(() -> new ChromeDriver());

      @Test
      void loginAsAdmin() {
          WebDriver driver = DRIVER.get();
          driver.get("https://app.example.com/login");
          // each thread uses its own browser instance
      }

      @Test
      void loginAsUser() {
          WebDriver driver = DRIVER.get();
          driver.get("https://app.example.com/login");
      }

      @AfterEach
      void teardown() {
          DRIVER.get().manage().deleteAllCookies();
      }

      @AfterAll
      static void cleanup() {
          DRIVER.get().quit();
          DRIVER.remove();
      }
  }
  ```

  Understanding how the runner distributes tests across threads is critical for diagnosing "phantom failures" -- errors that only appear during parallel execution.
section: "automation-qa"
order: 18
tags:
  - parallel-execution
  - test-runners
type: "deep"
---
