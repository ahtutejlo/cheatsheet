---
ua_question: "StaleElementReferenceException означає, що елемент видалено зі сторінки?"
en_question: "Does StaleElementReferenceException mean the element was deleted from the page?"
ua_answer: |
  > **Trap:** StaleElementReferenceException виникає, коли елемент видалено з DOM. Насправді елемент часто залишається на сторінці, але його DOM-вузол було пересторено фреймворком.

  Коли React, Angular або Vue перемальовують компонент, вони створюють нові DOM-вузли, навіть якщо візуально елемент виглядає ідентично. WebDriver зберігає посилання на оригінальний DOM-вузол, який більше не існує в дереві документа, хоча "такий самий" елемент присутній на сторінці.

  Це особливо часто трапляється після: AJAX-запитів, що оновлюють частину сторінки; зміни стану компонента; переходу між роутами у SPA.

  ```java
  // TRAP: Element looks the same but DOM node is new
  WebElement button = driver.findElement(By.id("submit-btn"));
  // ... AJAX request triggers React re-render ...
  button.click(); // StaleElementReferenceException!
  // The button is still visible, but it's a NEW DOM node

  // FIX 1: Re-locate element before interaction
  driver.findElement(By.id("submit-btn")).click();

  // FIX 2: Use retry pattern for unstable DOM
  public WebElement findWithRetry(By locator, int maxRetries) {
      for (int i = 0; i < maxRetries; i++) {
          try {
              WebElement element = driver.findElement(locator);
              element.isDisplayed(); // trigger staleness check
              return element;
          } catch (StaleElementReferenceException e) {
              if (i == maxRetries - 1) throw e;
          }
      }
      throw new NoSuchElementException("Element not found: " + locator);
  }

  // FIX 3: Wait for DOM stability before interacting
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement button = wait.until(
      ExpectedConditions.elementToBeClickable(By.id("submit-btn"))
  );
  button.click();
  ```

  Ця хибна думка поширена серед тих, хто працює зі статичними сайтами і переходить до тестування SPA -- в статичному DOM елементи справді зникають лише при видаленні.
en_answer: |
  > **Trap:** StaleElementReferenceException occurs when an element is deleted from the DOM. In reality, the element often remains on the page, but its DOM node was recreated by the framework.

  When React, Angular, or Vue re-render a component, they create new DOM nodes even if the element looks visually identical. WebDriver holds a reference to the original DOM node that no longer exists in the document tree, even though "the same" element is present on the page.

  This happens especially often after: AJAX requests that update part of the page; component state changes; route transitions in SPAs.

  ```java
  // TRAP: Element looks the same but DOM node is new
  WebElement button = driver.findElement(By.id("submit-btn"));
  // ... AJAX request triggers React re-render ...
  button.click(); // StaleElementReferenceException!
  // The button is still visible, but it's a NEW DOM node

  // FIX 1: Re-locate element before interaction
  driver.findElement(By.id("submit-btn")).click();

  // FIX 2: Use retry pattern for unstable DOM
  public WebElement findWithRetry(By locator, int maxRetries) {
      for (int i = 0; i < maxRetries; i++) {
          try {
              WebElement element = driver.findElement(locator);
              element.isDisplayed(); // trigger staleness check
              return element;
          } catch (StaleElementReferenceException e) {
              if (i == maxRetries - 1) throw e;
          }
      }
      throw new NoSuchElementException("Element not found: " + locator);
  }

  // FIX 3: Wait for DOM stability before interacting
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement button = wait.until(
      ExpectedConditions.elementToBeClickable(By.id("submit-btn"))
  );
  button.click();
  ```

  This misconception is common among those who work with static sites and transition to testing SPAs -- in a static DOM, elements truly disappear only when deleted.
section: "automation-qa"
order: 22
tags:
  - selenium
  - dom
  - exceptions
type: "trick"
---
