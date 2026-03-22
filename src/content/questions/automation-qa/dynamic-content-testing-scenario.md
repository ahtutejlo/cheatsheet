---
ua_question: "Як тестувати сторінку з нескінченним скролом та lazy-loaded контентом?"
en_question: "How do you test a page with infinite scroll and lazy-loaded content?"
ua_answer: |
  **Scenario:** Сторінка каталогу товарів завантажує по 20 елементів при скролі вниз (infinite scroll). Потрібно перевірити, що товари завантажуються коректно, зображення рендеряться після lazy load, а фільтри працюють з динамічним контентом.

  **Approach:**
  1. Реалізувати програмний скрол через JavaScript з очікуванням появи нових елементів після кожного скролу
  2. Використати Intersection Observer або перевірку атрибутів для валідації lazy-loaded зображень (src замість data-src після видимості)
  3. Комбінувати скрол-автоматизацію з explicit waits для стабільної перевірки кількості та вмісту завантажених елементів

  **Solution:**
  ```java
  class InfiniteScrollTest {

      @Test
      void shouldLoadMoreItemsOnScroll() {
          driver.get("https://app.example.com/catalog");
          WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

          // Wait for initial load
          wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
              By.cssSelector(".product-card"), 0
          ));
          int initialCount = driver.findElements(
              By.cssSelector(".product-card")
          ).size();
          assertEquals(20, initialCount);

          // Scroll to trigger next page
          scrollToBottom();
          wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
              By.cssSelector(".product-card"), initialCount
          ));

          int afterScrollCount = driver.findElements(
              By.cssSelector(".product-card")
          ).size();
          assertEquals(40, afterScrollCount);
      }

      @Test
      void shouldLazyLoadImages() {
          driver.get("https://app.example.com/catalog");
          WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

          // Images below fold should have placeholder
          List<WebElement> images = driver.findElements(
              By.cssSelector(".product-card img")
          );
          WebElement belowFoldImage = images.get(images.size() - 1);
          String initialSrc = belowFoldImage.getAttribute("src");
          assertTrue(initialSrc.contains("placeholder"));

          // Scroll to image
          ((JavascriptExecutor) driver).executeScript(
              "arguments[0].scrollIntoView({behavior: 'instant'});",
              belowFoldImage
          );

          // Wait for real image to load
          wait.until(driver1 -> {
              String src = belowFoldImage.getAttribute("src");
              return src != null && !src.contains("placeholder");
          });
      }

      private void scrollToBottom() {
          ((JavascriptExecutor) driver).executeScript(
              "window.scrollTo(0, document.body.scrollHeight);"
          );
      }
  }
  ```
en_answer: |
  **Scenario:** A product catalog page loads 20 items on each scroll down (infinite scroll). You need to verify that products load correctly, images render after lazy load, and filters work with dynamic content.

  **Approach:**
  1. Implement programmatic scrolling via JavaScript with waits for new elements to appear after each scroll
  2. Use Intersection Observer or attribute checking to validate lazy-loaded images (src instead of data-src after visibility)
  3. Combine scroll automation with explicit waits for stable verification of count and content of loaded elements

  **Solution:**
  ```java
  class InfiniteScrollTest {

      @Test
      void shouldLoadMoreItemsOnScroll() {
          driver.get("https://app.example.com/catalog");
          WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

          // Wait for initial load
          wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
              By.cssSelector(".product-card"), 0
          ));
          int initialCount = driver.findElements(
              By.cssSelector(".product-card")
          ).size();
          assertEquals(20, initialCount);

          // Scroll to trigger next page
          scrollToBottom();
          wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
              By.cssSelector(".product-card"), initialCount
          ));

          int afterScrollCount = driver.findElements(
              By.cssSelector(".product-card")
          ).size();
          assertEquals(40, afterScrollCount);
      }

      @Test
      void shouldLazyLoadImages() {
          driver.get("https://app.example.com/catalog");
          WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

          // Images below fold should have placeholder
          List<WebElement> images = driver.findElements(
              By.cssSelector(".product-card img")
          );
          WebElement belowFoldImage = images.get(images.size() - 1);
          String initialSrc = belowFoldImage.getAttribute("src");
          assertTrue(initialSrc.contains("placeholder"));

          // Scroll to image
          ((JavascriptExecutor) driver).executeScript(
              "arguments[0].scrollIntoView({behavior: 'instant'});",
              belowFoldImage
          );

          // Wait for real image to load
          wait.until(driver1 -> {
              String src = belowFoldImage.getAttribute("src");
              return src != null && !src.contains("placeholder");
          });
      }

      private void scrollToBottom() {
          ((JavascriptExecutor) driver).executeScript(
              "window.scrollTo(0, document.body.scrollHeight);"
          );
      }
  }
  ```
section: "automation-qa"
order: 29
tags:
  - dynamic-content
  - scrolling
  - waits
type: "practical"
---
