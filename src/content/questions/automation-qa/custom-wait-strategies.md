---
ua_question: "Як створити власні стратегії очікування поза стандартними ExpectedConditions?"
en_question: "How do you build custom wait strategies beyond built-in ExpectedConditions?"
ua_answer: |
  Стандартні ExpectedConditions покривають базові сценарії -- видимість елемента, клікабельність, наявність тексту. Але реальні додатки часто потребують складніших умов: завершення AJAX-запитів, стабілізація DOM після рендерингу, або специфічні бізнес-стани UI.

  **Підходи до створення кастомних очікувань:**
  - **Функціональний інтерфейс:** `ExpectedCondition<T>` приймає `WebDriver` і повертає результат або `null`/`false`
  - **Polling interval:** FluentWait дозволяє налаштувати інтервал опитування для зменшення навантаження
  - **Комбінування умов:** можна створювати складені умови з логічними операторами

  ```java
  // Custom ExpectedCondition: wait for network idle
  public class CustomConditions {

      public static ExpectedCondition<Boolean> networkIdle(int quietPeriodMs) {
          return driver -> {
              JavascriptExecutor js = (JavascriptExecutor) driver;
              Long activeRequests = (Long) js.executeScript(
                  "return window.performance.getEntriesByType('resource')" +
                  ".filter(r => r.responseEnd === 0).length;"
              );
              return activeRequests == 0;
          };
      }

      public static ExpectedCondition<Boolean> domStable(Duration period) {
          final String[] lastHtml = {""};
          final long[] stableSince = {0};
          return driver -> {
              String currentHtml = driver.getPageSource();
              long now = System.currentTimeMillis();
              if (!currentHtml.equals(lastHtml[0])) {
                  lastHtml[0] = currentHtml;
                  stableSince[0] = now;
                  return false;
              }
              return (now - stableSince[0]) >= period.toMillis();
          };
      }

      public static ExpectedCondition<WebElement> elementHasStablePosition(
              By locator, Duration period) {
          final Point[] lastPosition = {null};
          final long[] stableSince = {0};
          return driver -> {
              WebElement el = driver.findElement(locator);
              Point current = el.getLocation();
              long now = System.currentTimeMillis();
              if (!current.equals(lastPosition[0])) {
                  lastPosition[0] = current;
                  stableSince[0] = now;
                  return null;
              }
              return (now - stableSince[0]) >= period.toMillis() ? el : null;
          };
      }
  }

  // Usage with FluentWait
  Wait<WebDriver> wait = new FluentWait<>(driver)
      .withTimeout(Duration.ofSeconds(30))
      .pollingEvery(Duration.ofMillis(500))
      .ignoring(StaleElementReferenceException.class);

  wait.until(CustomConditions.networkIdle(1000));
  wait.until(CustomConditions.domStable(Duration.ofSeconds(2)));
  ```

  Кастомні очікування -- це найефективніший спосіб боротьби з flaky-тестами у складних SPA-додатках, де стандартні умови не враховують специфіку фреймворку.
en_answer: |
  Standard ExpectedConditions cover basic scenarios -- element visibility, clickability, text presence. But real applications often require more complex conditions: AJAX request completion, DOM stabilization after rendering, or specific business states of the UI.

  **Approaches to building custom waits:**
  - **Functional interface:** `ExpectedCondition<T>` takes a `WebDriver` and returns a result or `null`/`false`
  - **Polling interval:** FluentWait allows configuring the polling interval to reduce load
  - **Combining conditions:** you can create compound conditions with logical operators

  ```java
  // Custom ExpectedCondition: wait for network idle
  public class CustomConditions {

      public static ExpectedCondition<Boolean> networkIdle(int quietPeriodMs) {
          return driver -> {
              JavascriptExecutor js = (JavascriptExecutor) driver;
              Long activeRequests = (Long) js.executeScript(
                  "return window.performance.getEntriesByType('resource')" +
                  ".filter(r => r.responseEnd === 0).length;"
              );
              return activeRequests == 0;
          };
      }

      public static ExpectedCondition<Boolean> domStable(Duration period) {
          final String[] lastHtml = {""};
          final long[] stableSince = {0};
          return driver -> {
              String currentHtml = driver.getPageSource();
              long now = System.currentTimeMillis();
              if (!currentHtml.equals(lastHtml[0])) {
                  lastHtml[0] = currentHtml;
                  stableSince[0] = now;
                  return false;
              }
              return (now - stableSince[0]) >= period.toMillis();
          };
      }

      public static ExpectedCondition<WebElement> elementHasStablePosition(
              By locator, Duration period) {
          final Point[] lastPosition = {null};
          final long[] stableSince = {0};
          return driver -> {
              WebElement el = driver.findElement(locator);
              Point current = el.getLocation();
              long now = System.currentTimeMillis();
              if (!current.equals(lastPosition[0])) {
                  lastPosition[0] = current;
                  stableSince[0] = now;
                  return null;
              }
              return (now - stableSince[0]) >= period.toMillis() ? el : null;
          };
      }
  }

  // Usage with FluentWait
  Wait<WebDriver> wait = new FluentWait<>(driver)
      .withTimeout(Duration.ofSeconds(30))
      .pollingEvery(Duration.ofMillis(500))
      .ignoring(StaleElementReferenceException.class);

  wait.until(CustomConditions.networkIdle(1000));
  wait.until(CustomConditions.domStable(Duration.ofSeconds(2)));
  ```

  Custom waits are the most effective way to fight flaky tests in complex SPA applications where standard conditions do not account for framework-specific behavior.
section: "automation-qa"
order: 19
tags:
  - waits
  - selenium
  - custom-conditions
type: "deep"
---
