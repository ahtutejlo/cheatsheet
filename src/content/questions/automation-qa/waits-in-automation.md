---
ua_question: "Які типи очікувань є в автоматизації?"
en_question: "What types of waits exist in test automation?"
ua_answer: |
  Очікування (waits) в автоматизації тестування використовуються для синхронізації тестового скрипта з поведінкою веб-сторінки, яка може завантажуватися або змінюватися динамічно.

  **Три типи очікувань:**

  **1. Implicit Wait (неявне очікування)**
  - Встановлюється глобально для всього драйвера
  - WebDriver чекає вказаний час при пошуку кожного елемента
  ```java
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
  ```

  **2. Explicit Wait (явне очікування)**
  - Очікування конкретної умови для конкретного елемента
  - Більш гнучке та рекомендоване
  ```java
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement element = wait.until(
      ExpectedConditions.visibilityOfElementLocated(By.id("result"))
  );
  ```

  **3. Fluent Wait (плавне очікування)**
  - Як Explicit Wait, але з налаштуванням інтервалу та ігноруванням винятків
  ```java
  Wait<WebDriver> wait = new FluentWait<>(driver)
      .withTimeout(Duration.ofSeconds(30))
      .pollingEvery(Duration.ofSeconds(2))
      .ignoring(NoSuchElementException.class);
  ```

  **Антипатерн:** `Thread.sleep()` -- жорстка пауза, яка уповільнює тести та не гарантує результат. Завжди використовуйте явні очікування замість `Thread.sleep()`.
en_answer: |
  Waits in test automation are used to synchronize the test script with web page behavior that may load or change dynamically.

  **Three types of waits:**

  **1. Implicit Wait**
  - Set globally for the entire driver
  - WebDriver waits the specified time when searching for each element
  ```java
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
  ```

  **2. Explicit Wait**
  - Waits for a specific condition on a specific element
  - More flexible and recommended
  ```java
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement element = wait.until(
      ExpectedConditions.visibilityOfElementLocated(By.id("result"))
  );
  ```

  **3. Fluent Wait**
  - Like Explicit Wait, but with configurable polling interval and exception ignoring
  ```java
  Wait<WebDriver> wait = new FluentWait<>(driver)
      .withTimeout(Duration.ofSeconds(30))
      .pollingEvery(Duration.ofSeconds(2))
      .ignoring(NoSuchElementException.class);
  ```

  **Anti-pattern:** `Thread.sleep()` -- a hard pause that slows tests and does not guarantee results. Always use explicit waits instead of `Thread.sleep()`.
section: "automation-qa"
order: 7
tags:
  - selenium
  - waits
  - synchronization
---
