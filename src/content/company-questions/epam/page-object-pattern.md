---
company: "epam"
stage: "technical-interview"
ua_question: "Що таке Page Object Pattern і навіщо він потрібен?"
en_question: "What is Page Object Pattern and why is it needed?"
ua_answer: |
  Page Object — це паттерн проєктування в автоматизації тестування, який створює об'єктну модель для кожної сторінки або компонента UI.

  **Основні переваги:**
  - Розділення логіки тестів від деталей реалізації UI
  - Повторне використання коду — один Page Object для багатьох тестів
  - Легке оновлення при зміні UI — змінюється лише Page Object

  ```java
  public class LoginPage {
      private WebDriver driver;

      @FindBy(id = "username")
      private WebElement usernameField;

      @FindBy(id = "password")
      private WebElement passwordField;

      @FindBy(css = "button[type='submit']")
      private WebElement loginButton;

      public LoginPage(WebDriver driver) {
          this.driver = driver;
          PageFactory.initElements(driver, this);
      }

      public DashboardPage login(String user, String pass) {
          usernameField.sendKeys(user);
          passwordField.sendKeys(pass);
          loginButton.click();
          return new DashboardPage(driver);
      }
  }
  ```
en_answer: |
  Page Object is a design pattern in test automation that creates an object model for each page or UI component.

  **Key benefits:**
  - Separates test logic from UI implementation details
  - Code reuse — one Page Object for many tests
  - Easy maintenance when UI changes — only the Page Object needs updating

  ```java
  public class LoginPage {
      private WebDriver driver;

      @FindBy(id = "username")
      private WebElement usernameField;

      @FindBy(id = "password")
      private WebElement passwordField;

      @FindBy(css = "button[type='submit']")
      private WebElement loginButton;

      public LoginPage(WebDriver driver) {
          this.driver = driver;
          PageFactory.initElements(driver, this);
      }

      public DashboardPage login(String user, String pass) {
          usernameField.sendKeys(user);
          passwordField.sendKeys(pass);
          loginButton.click();
          return new DashboardPage(driver);
      }
  }
  ```
tags: [automation, patterns, page-object]
order: 1
---
