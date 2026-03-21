---
ua_question: "Що таке автоматизація тестування?"
en_question: "What is test automation?"
ua_answer: |
  Автоматизація тестування -- це використання спеціальних програмних інструментів для виконання тестів, порівняння фактичних результатів з очікуваними та генерації звітів без ручного втручання.

  **Переваги автоматизації:**
  - **Швидкість** -- автоматизовані тести виконуються значно швидше за ручні
  - **Повторюваність** -- тести виконуються однаково кожного разу
  - **Покриття** -- можна запускати тисячі тестів за хвилини
  - **Регресія** -- ідеально підходить для регресійного тестування
  - **CI/CD інтеграція** -- тести запускаються автоматично при кожному коміті

  **Коли автоматизація НЕ підходить:**
  - Exploratory testing (дослідницьке тестування)
  - Тестування зручності використання (usability)
  - Одноразові тести
  - Функціональність, яка часто змінюється

  ```java
  @Test
  void loginTest() {
      driver.get("https://example.com/login");
      driver.findElement(By.id("username")).sendKeys("user");
      driver.findElement(By.id("password")).sendKeys("pass");
      driver.findElement(By.id("login-btn")).click();
      assertEquals("Dashboard", driver.getTitle());
  }
  ```
en_answer: |
  Test automation is the use of specialized software tools to execute tests, compare actual results with expected ones, and generate reports without manual intervention.

  **Advantages of automation:**
  - **Speed** -- automated tests run significantly faster than manual ones
  - **Repeatability** -- tests execute the same way every time
  - **Coverage** -- can run thousands of tests in minutes
  - **Regression** -- ideal for regression testing
  - **CI/CD integration** -- tests run automatically on every commit

  **When automation is NOT suitable:**
  - Exploratory testing
  - Usability testing
  - One-time tests
  - Frequently changing functionality

  ```java
  @Test
  void loginTest() {
      driver.get("https://example.com/login");
      driver.findElement(By.id("username")).sendKeys("user");
      driver.findElement(By.id("password")).sendKeys("pass");
      driver.findElement(By.id("login-btn")).click();
      assertEquals("Dashboard", driver.getTitle());
  }
  ```
section: "automation-qa"
order: 1
tags:
  - fundamentals
  - automation
---
