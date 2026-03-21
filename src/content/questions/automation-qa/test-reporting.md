---
ua_question: "Як організувати звітність автоматизованих тестів?"
en_question: "How to organize automated test reporting?"
ua_answer: |
  Звітність автоматизованих тестів допомагає команді відстежувати якість продукту, аналізувати тренди та приймати рішення щодо релізу.

  **Популярні інструменти звітності:**
  - **Allure Report** -- інтерактивні звіти з графіками, історією та вкладеннями
  - **ExtentReports** -- HTML звіти з підтримкою скріншотів
  - **Surefire/Failsafe Reports** -- стандартні Maven звіти
  - **JUnit XML** -- базовий формат, який підтримується CI/CD інструментами

  **Що повинен містити хороший звіт:**
  - Загальна статистика (passed/failed/skipped)
  - Деталі кожного тесту з кроками
  - Скріншоти при падінні тесту
  - Час виконання
  - Історія запусків (тренди)
  - Середовище тестування

  ```java
  // Allure анотації
  @Epic("Authentication")
  @Feature("Login")
  @Story("Successful login")
  @Severity(SeverityLevel.CRITICAL)
  @Test
  void loginTest() {
      Allure.step("Open login page", () -> {
          driver.get("https://example.com/login");
      });
      Allure.step("Enter credentials", () -> {
          // ...
      });
  }
  ```

  **Рекомендації:** інтегруйте звіти в CI/CD пайплайн, зберігайте історію запусків, налаштуйте сповіщення при падінні тестів (Slack, email).
en_answer: |
  Automated test reporting helps the team track product quality, analyze trends, and make release decisions.

  **Popular reporting tools:**
  - **Allure Report** -- interactive reports with charts, history, and attachments
  - **ExtentReports** -- HTML reports with screenshot support
  - **Surefire/Failsafe Reports** -- standard Maven reports
  - **JUnit XML** -- basic format supported by CI/CD tools

  **What a good report should contain:**
  - Overall statistics (passed/failed/skipped)
  - Details of each test with steps
  - Screenshots on test failure
  - Execution time
  - Run history (trends)
  - Test environment

  ```java
  // Allure annotations
  @Epic("Authentication")
  @Feature("Login")
  @Story("Successful login")
  @Severity(SeverityLevel.CRITICAL)
  @Test
  void loginTest() {
      Allure.step("Open login page", () -> {
          driver.get("https://example.com/login");
      });
      Allure.step("Enter credentials", () -> {
          // ...
      });
  }
  ```

  **Recommendations:** integrate reports into CI/CD pipeline, keep run history, set up notifications on test failures (Slack, email).
section: "automation-qa"
order: 14
tags:
  - reporting
  - allure
---
