---
company: "epam"
stage: "technical-interview"
ua_question: "Різниця між implicit та explicit waits у Selenium"
en_question: "Difference between implicit and explicit waits in Selenium"
ua_answer: |
  **Implicit Wait** — глобальне очікування, яке застосовується до всіх пошуків елементів:
  ```java
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
  ```

  **Explicit Wait** — очікування конкретної умови для конкретного елемента:
  ```java
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement element = wait.until(
      ExpectedConditions.visibilityOfElementLocated(By.id("result"))
  );
  ```

  **Ключові відмінності:**
  - Implicit — застосовується глобально, Explicit — точково
  - Explicit дозволяє чекати на конкретні умови (visibility, clickable, text presence)
  - Не рекомендується змішувати обидва типи — це може призвести до непередбачуваних таймаутів
en_answer: |
  **Implicit Wait** — global wait applied to all element lookups:
  ```java
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
  ```

  **Explicit Wait** — waits for a specific condition on a specific element:
  ```java
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  WebElement element = wait.until(
      ExpectedConditions.visibilityOfElementLocated(By.id("result"))
  );
  ```

  **Key differences:**
  - Implicit applies globally, Explicit targets specific elements
  - Explicit allows waiting for specific conditions (visibility, clickable, text presence)
  - Mixing both types is not recommended — can lead to unpredictable timeouts
tags: [selenium, waits, automation]
order: 2
---
