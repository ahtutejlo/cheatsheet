---
ua_question: "Як діагностувати тест, який проходить локально, але падає у 30% запусків у CI?"
en_question: "How do you debug a test that passes locally but fails 30% of the time in CI?"
ua_answer: |
  **Scenario:** E2E-тест для checkout-потоку стабільно проходить на машині розробника, але у CI-пайплайні провалюється приблизно в кожному третьому запуску з різними помилками -- TimeoutException або AssertionError на фінальній перевірці.

  **Approach:**
  1. Увімкнути детальне логування та скріншоти на кожному кроці тесту в CI, порівняти стан сторінки у момент збою з локальним запуском
  2. Проаналізувати паттерн збоїв: чи завжди однаковий крок, чи збігається з навантаженням на CI-runner, чи є залежність від часу доби (зовнішні API)
  3. Перевірити ізоляцію тестових даних та замінити Thread.sleep() на explicit waits з конкретними умовами

  **Solution:**
  ```java
  // Before: fragile test with timing issues
  @Test
  void testCheckout() {
      driver.findElement(By.id("checkout-btn")).click();
      Thread.sleep(3000);
      String status = driver.findElement(By.id("order-status")).getText();
      assertEquals("confirmed", status);
  }

  // After: robust test with proper waits and isolation
  @Test
  void testCheckout() {
      // Isolated test data -- no dependency on other tests
      String orderId = testDataFactory.createPendingOrder(testUser);

      driver.findElement(By.id("checkout-btn")).click();

      // Explicit wait for specific condition instead of sleep
      WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
      wait.until(ExpectedConditions.textToBe(
          By.id("order-status"), "confirmed"
      ));

      // Screenshot on every step for CI debugging
      screenshotHelper.capture("after-checkout-" + orderId);

      String status = driver.findElement(By.id("order-status")).getText();
      assertEquals("confirmed", status);
  }

  // CI-specific configuration in BaseTest
  @BeforeEach
  void setupCI() {
      if (System.getenv("CI") != null) {
          // CI runners are slower -- increase timeouts
          defaultTimeout = Duration.ofSeconds(20);
          // Enable screenshot on failure
          screenshotHelper.enableAutoCapture();
          // Log browser console errors
          LogEntries logs = driver.manage().logs().get(LogType.BROWSER);
          logs.forEach(entry -> logger.info("Browser: " + entry));
      }
  }
  ```
en_answer: |
  **Scenario:** An E2E test for the checkout flow passes consistently on the developer's machine but fails approximately every third run in the CI pipeline with varying errors -- TimeoutException or AssertionError on the final check.

  **Approach:**
  1. Enable detailed logging and screenshots at every test step in CI, compare page state at failure time with local runs
  2. Analyze the failure pattern: is it always the same step, does it correlate with CI runner load, is there a time-of-day dependency (external APIs)
  3. Verify test data isolation and replace Thread.sleep() with explicit waits using specific conditions

  **Solution:**
  ```java
  // Before: fragile test with timing issues
  @Test
  void testCheckout() {
      driver.findElement(By.id("checkout-btn")).click();
      Thread.sleep(3000);
      String status = driver.findElement(By.id("order-status")).getText();
      assertEquals("confirmed", status);
  }

  // After: robust test with proper waits and isolation
  @Test
  void testCheckout() {
      // Isolated test data -- no dependency on other tests
      String orderId = testDataFactory.createPendingOrder(testUser);

      driver.findElement(By.id("checkout-btn")).click();

      // Explicit wait for specific condition instead of sleep
      WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
      wait.until(ExpectedConditions.textToBe(
          By.id("order-status"), "confirmed"
      ));

      // Screenshot on every step for CI debugging
      screenshotHelper.capture("after-checkout-" + orderId);

      String status = driver.findElement(By.id("order-status")).getText();
      assertEquals("confirmed", status);
  }

  // CI-specific configuration in BaseTest
  @BeforeEach
  void setupCI() {
      if (System.getenv("CI") != null) {
          // CI runners are slower -- increase timeouts
          defaultTimeout = Duration.ofSeconds(20);
          // Enable screenshot on failure
          screenshotHelper.enableAutoCapture();
          // Log browser console errors
          LogEntries logs = driver.manage().logs().get(LogType.BROWSER);
          logs.forEach(entry -> logger.info("Browser: " + entry));
      }
  }
  ```
section: "automation-qa"
order: 26
tags:
  - debugging
  - ci-cd
  - flaky-tests
type: "practical"
---
