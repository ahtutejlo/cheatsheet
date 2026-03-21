---
ua_question: "Що таке Page Object Model?"
en_question: "What is the Page Object Model?"
ua_answer: |
  Page Object Model (POM) -- це патерн проектування в автоматизації тестування, де кожна веб-сторінка представлена окремим класом. Клас інкапсулює елементи сторінки та дії, які можна з ними виконати.

  **Переваги POM:**
  - **Зменшення дублювання** -- локатори визначені в одному місці
  - **Простота підтримки** -- при зміні UI змінюється лише Page Object
  - **Читабельність тестів** -- тести описують бізнес-логіку, а не деталі UI
  - **Повторне використання** -- один Page Object використовується в багатьох тестах

  ```java
  // Page Object
  public class LoginPage {
      private WebDriver driver;

      private By usernameField = By.id("username");
      private By passwordField = By.id("password");
      private By loginButton = By.id("login-btn");

      public LoginPage(WebDriver driver) {
          this.driver = driver;
      }

      public DashboardPage login(String user, String pass) {
          driver.findElement(usernameField).sendKeys(user);
          driver.findElement(passwordField).sendKeys(pass);
          driver.findElement(loginButton).click();
          return new DashboardPage(driver);
      }
  }

  // Test
  @Test
  void successfulLogin() {
      LoginPage loginPage = new LoginPage(driver);
      DashboardPage dashboard = loginPage.login("admin", "password");
      assertTrue(dashboard.isDisplayed());
  }
  ```
en_answer: |
  Page Object Model (POM) is a design pattern in test automation where each web page is represented by a separate class. The class encapsulates page elements and actions that can be performed on them.

  **Advantages of POM:**
  - **Reduced duplication** -- locators defined in one place
  - **Easy maintenance** -- when UI changes, only the Page Object changes
  - **Test readability** -- tests describe business logic, not UI details
  - **Reusability** -- one Page Object used across many tests

  ```java
  // Page Object
  public class LoginPage {
      private WebDriver driver;

      private By usernameField = By.id("username");
      private By passwordField = By.id("password");
      private By loginButton = By.id("login-btn");

      public LoginPage(WebDriver driver) {
          this.driver = driver;
      }

      public DashboardPage login(String user, String pass) {
          driver.findElement(usernameField).sendKeys(user);
          driver.findElement(passwordField).sendKeys(pass);
          driver.findElement(loginButton).click();
          return new DashboardPage(driver);
      }
  }

  // Test
  @Test
  void successfulLogin() {
      LoginPage loginPage = new LoginPage(driver);
      DashboardPage dashboard = loginPage.login("admin", "password");
      assertTrue(dashboard.isDisplayed());
  }
  ```
section: "automation-qa"
order: 6
tags:
  - design-patterns
  - page-object
---
