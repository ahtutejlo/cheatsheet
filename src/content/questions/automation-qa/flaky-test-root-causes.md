---
ua_question: "Які основні причини нестабільних (flaky) тестів і як їх усувати?"
en_question: "What are the root causes of flaky tests and how do you fix them?"
ua_answer: |
  Нестабільні (flaky) тести -- це тести, що дають різні результати при однакових умовах: проходять одного разу, провалюються іншого. Вони підривають довіру команди до тестового набору та уповільнюють CI/CD.

  **Основні причини flaky тестів:**
  - **Проблеми синхронізації (timing):** тест не чекає завершення асинхронних операцій -- AJAX-запитів, анімацій, рендерингу DOM
  - **Спільний стан (shared state):** тести залежать від даних, створених іншими тестами, або від глобального стану бази даних
  - **Залежність від середовища:** тест покладається на мережу, зовнішній API, конкретний часовий пояс або роздільну здатність екрана
  - **Недетермінованість даних:** використання випадкових значень, поточної дати або auto-increment ID у перевірках

  **Типовий flaky-патерн та його виправлення:**

  ```java
  // FLAKY: Hard-coded sleep + shared state
  @Test
  void testAddToCart() {
      driver.findElement(By.id("add-btn")).click();
      Thread.sleep(2000); // timing issue
      int count = Integer.parseInt(
          driver.findElement(By.id("cart-count")).getText()
      );
      assertEquals(1, count); // fails if previous test added items
  }

  // STABLE: Explicit wait + test data isolation
  @Test
  void testAddToCart() {
      clearCart(); // ensure clean state
      driver.findElement(By.id("add-btn")).click();
      WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
      wait.until(ExpectedConditions.textToBe(By.id("cart-count"), "1"));
      String count = driver.findElement(By.id("cart-count")).getText();
      assertEquals("1", count);
  }
  ```

  Розуміння кореневих причин flaky-тестів дозволяє системно усувати їх, а не просто додавати retry, що маскує проблему.
en_answer: |
  Flaky tests are tests that produce different results under the same conditions: passing one time, failing another. They erode team trust in the test suite and slow down CI/CD.

  **Root causes of flaky tests:**
  - **Timing issues:** test does not wait for asynchronous operations to complete -- AJAX requests, animations, DOM rendering
  - **Shared state:** tests depend on data created by other tests or on global database state
  - **Environment dependencies:** test relies on network, external API, specific timezone, or screen resolution
  - **Non-deterministic data:** using random values, current date, or auto-increment IDs in assertions

  **Typical flaky pattern and its fix:**

  ```java
  // FLAKY: Hard-coded sleep + shared state
  @Test
  void testAddToCart() {
      driver.findElement(By.id("add-btn")).click();
      Thread.sleep(2000); // timing issue
      int count = Integer.parseInt(
          driver.findElement(By.id("cart-count")).getText()
      );
      assertEquals(1, count); // fails if previous test added items
  }

  // STABLE: Explicit wait + test data isolation
  @Test
  void testAddToCart() {
      clearCart(); // ensure clean state
      driver.findElement(By.id("add-btn")).click();
      WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
      wait.until(ExpectedConditions.textToBe(By.id("cart-count"), "1"));
      String count = driver.findElement(By.id("cart-count")).getText();
      assertEquals("1", count);
  }
  ```

  Understanding the root causes of flaky tests allows you to systematically eliminate them rather than just adding retries that mask the problem.
section: "automation-qa"
order: 11
tags:
  - flaky-tests
  - test-stability
type: "deep"
---
