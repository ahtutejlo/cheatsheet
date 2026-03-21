---
ua_question: "Що таке Data-Driven тестування?"
en_question: "What is Data-Driven testing?"
ua_answer: |
  Data-Driven Testing (DDT) -- це підхід до автоматизації, де тестова логіка відокремлена від тестових даних. Один тестовий сценарій виконується багаторазово з різними наборами вхідних даних.

  **Переваги DDT:**
  - Зменшення кількості тестового коду (один тест замість багатьох)
  - Легко додавати нові тестові випадки (просто додати рядок даних)
  - Розділення відповідальності (розробник пише тест, QA готує дані)
  - Покращене покриття крайніх випадків

  **Джерела даних:**
  - CSV / Excel файли
  - JSON / XML файли
  - Бази даних
  - Анотації в коді (@DataProvider, @ParameterizedTest)

  ```java
  // JUnit 5 Parameterized Test
  @ParameterizedTest
  @CsvSource({
      "admin, admin123, true",
      "user, wrong_pass, false",
      "'', admin123, false",
      "admin, '', false"
  })
  void loginTest(String username, String password, boolean expected) {
      LoginPage loginPage = new LoginPage(driver);
      loginPage.login(username, password);
      assertEquals(expected, loginPage.isLoggedIn());
  }
  ```

  ```java
  // TestNG DataProvider
  @DataProvider(name = "loginData")
  public Object[][] getData() {
      return new Object[][] {
          {"admin", "admin123", true},
          {"user", "wrong_pass", false}
      };
  }

  @Test(dataProvider = "loginData")
  void loginTest(String user, String pass, boolean expected) {
      // test logic
  }
  ```
en_answer: |
  Data-Driven Testing (DDT) is an automation approach where test logic is separated from test data. One test scenario is executed multiple times with different sets of input data.

  **Advantages of DDT:**
  - Reduced amount of test code (one test instead of many)
  - Easy to add new test cases (just add a data row)
  - Separation of concerns (developer writes test, QA prepares data)
  - Improved edge case coverage

  **Data sources:**
  - CSV / Excel files
  - JSON / XML files
  - Databases
  - Code annotations (@DataProvider, @ParameterizedTest)

  ```java
  // JUnit 5 Parameterized Test
  @ParameterizedTest
  @CsvSource({
      "admin, admin123, true",
      "user, wrong_pass, false",
      "'', admin123, false",
      "admin, '', false"
  })
  void loginTest(String username, String password, boolean expected) {
      LoginPage loginPage = new LoginPage(driver);
      loginPage.login(username, password);
      assertEquals(expected, loginPage.isLoggedIn());
  }
  ```

  ```java
  // TestNG DataProvider
  @DataProvider(name = "loginData")
  public Object[][] getData() {
      return new Object[][] {
          {"admin", "admin123", true},
          {"user", "wrong_pass", false}
      };
  }

  @Test(dataProvider = "loginData")
  void loginTest(String user, String pass, boolean expected) {
      // test logic
  }
  ```
section: "automation-qa"
order: 12
tags:
  - data-driven
  - parameterized
---
