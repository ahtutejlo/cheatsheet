---
ua_question: "Що таке BDD та Cucumber?"
en_question: "What is BDD and Cucumber?"
ua_answer: |
  **BDD (Behavior-Driven Development)** -- це методологія розробки, де поведінка системи описується зрозумілою для бізнесу мовою (Gherkin) ще до написання коду.

  **Cucumber** -- це інструмент, який дозволяє писати тести у форматі Gherkin та зв'язувати їх з автоматизованим кодом.

  **Gherkin синтаксис:**
  ```gherkin
  Feature: User Login
    As a registered user
    I want to log in to my account
    So that I can access my dashboard

    Scenario: Successful login
      Given I am on the login page
      When I enter username "admin" and password "admin123"
      And I click the login button
      Then I should see the dashboard page
      And the welcome message should contain "admin"

    Scenario: Failed login with wrong password
      Given I am on the login page
      When I enter username "admin" and password "wrong"
      And I click the login button
      Then I should see an error message "Invalid credentials"
  ```

  **Step Definitions (Java):**
  ```java
  @Given("I am on the login page")
  public void navigateToLogin() {
      driver.get("https://example.com/login");
  }

  @When("I enter username {string} and password {string}")
  public void enterCredentials(String user, String pass) {
      driver.findElement(By.id("username")).sendKeys(user);
      driver.findElement(By.id("password")).sendKeys(pass);
  }
  ```

  BDD покращує комунікацію між бізнесом, розробниками та тестувальниками, створюючи "живу документацію".
en_answer: |
  **BDD (Behavior-Driven Development)** is a development methodology where system behavior is described in business-readable language (Gherkin) before code is written.

  **Cucumber** is a tool that allows writing tests in Gherkin format and linking them with automated code.

  **Gherkin syntax:**
  ```gherkin
  Feature: User Login
    As a registered user
    I want to log in to my account
    So that I can access my dashboard

    Scenario: Successful login
      Given I am on the login page
      When I enter username "admin" and password "admin123"
      And I click the login button
      Then I should see the dashboard page
      And the welcome message should contain "admin"

    Scenario: Failed login with wrong password
      Given I am on the login page
      When I enter username "admin" and password "wrong"
      And I click the login button
      Then I should see an error message "Invalid credentials"
  ```

  **Step Definitions (Java):**
  ```java
  @Given("I am on the login page")
  public void navigateToLogin() {
      driver.get("https://example.com/login");
  }

  @When("I enter username {string} and password {string}")
  public void enterCredentials(String user, String pass) {
      driver.findElement(By.id("username")).sendKeys(user);
      driver.findElement(By.id("password")).sendKeys(pass);
  }
  ```

  BDD improves communication between business, developers, and testers, creating "living documentation".
section: "automation-qa"
order: 8
tags:
  - bdd
  - cucumber
  - gherkin
---
