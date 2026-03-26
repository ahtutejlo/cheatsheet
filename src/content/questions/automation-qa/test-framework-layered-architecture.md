---
ua_question: "Яка шарова архітектура тестового фреймворку?"
en_question: "What is the layered architecture of a test framework?"
ua_answer: |
  Шарова архітектура тестового фреймворку -- це підхід до організації автоматизованих тестів, де код розділений на незалежні шари з чіткою відповідальністю. Кожен шар залежить лише від шару нижче, що забезпечує підтримуваність, повторне використання та масштабованість.

  **Типові шари (знизу вгору):**

  **1. Driver / Infrastructure Layer** -- найнижчий рівень, взаємодія з системою:

  ```java
  // Конфігурація WebDriver
  public class DriverManager {
      private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

      public static WebDriver getDriver() {
          if (driver.get() == null) {
              driver.set(new ChromeDriver(getChromeOptions()));
          }
          return driver.get();
      }

      public static void quit() {
          if (driver.get() != null) {
              driver.get().quit();
              driver.remove();
          }
      }
  }

  // HTTP-клієнт для API-тестів
  public class ApiClient {
      private final RequestSpecification spec;

      public ApiClient(String baseUrl) {
          this.spec = RestAssured.given()
              .baseUri(baseUrl)
              .contentType(ContentType.JSON);
      }

      public Response get(String path) {
          return spec.get(path);
      }

      public Response post(String path, Object body) {
          return spec.body(body).post(path);
      }
  }
  ```

  **2. Page Objects / API Clients Layer** -- абстракція над UI-елементами та API-ендпоінтами:

  ```java
  // Page Object для UI
  public class LoginPage {
      private final WebDriver driver;

      private final By usernameField = By.id("username");
      private final By passwordField = By.id("password");
      private final By loginButton = By.id("login-btn");
      private final By errorMessage = By.css(".error-msg");

      public LoginPage(WebDriver driver) {
          this.driver = driver;
      }

      public void enterUsername(String username) {
          driver.findElement(usernameField).sendKeys(username);
      }

      public void enterPassword(String password) {
          driver.findElement(passwordField).sendKeys(password);
      }

      public DashboardPage clickLogin() {
          driver.findElement(loginButton).click();
          return new DashboardPage(driver);
      }

      public String getErrorMessage() {
          return driver.findElement(errorMessage).getText();
      }
  }

  // API Client для сервісу
  public class UserApiClient {
      private final ApiClient api;

      public UserApiClient(ApiClient api) {
          this.api = api;
      }

      public UserDto getUser(int id) {
          return api.get("/users/" + id).as(UserDto.class);
      }

      public Response createUser(UserDto user) {
          return api.post("/users", user);
      }
  }
  ```

  **3. Business Logic / Steps Layer** -- бізнес-операції, що комбінують дії з Page Objects:

  ```java
  public class AuthSteps {
      private final LoginPage loginPage;
      private final UserApiClient userApi;

      public AuthSteps() {
          this.loginPage = new LoginPage(DriverManager.getDriver());
          this.userApi = new UserApiClient(new ApiClient("https://api.example.com"));
      }

      public DashboardPage loginAsUser(String username, String password) {
          loginPage.enterUsername(username);
          loginPage.enterPassword(password);
          return loginPage.clickLogin();
      }

      public void verifyUserExists(int userId) {
          UserDto user = userApi.getUser(userId);
          assertThat(user).isNotNull();
          assertThat(user.isActive()).isTrue();
      }
  }
  ```

  **4. Test Data Management Layer** -- генерація та управління тестовими даними:

  ```java
  public class TestDataFactory {
      public static UserDto validUser() {
          return UserDto.builder()
              .name("John Doe")
              .email("john_" + UUID.randomUUID() + "@test.com")
              .password("SecurePass123!")
              .build();
      }

      public static UserDto invalidUser() {
          return UserDto.builder()
              .name("")
              .email("invalid-email")
              .build();
      }
  }
  ```

  **5. Test Cases Layer** -- самі тести, максимально читабельні:

  ```java
  @ExtendWith(DriverExtension.class)
  public class LoginTest {
      private AuthSteps authSteps;

      @BeforeEach
      void setUp() {
          authSteps = new AuthSteps();
      }

      @Test
      void shouldLoginWithValidCredentials() {
          UserDto user = TestDataFactory.validUser();
          DashboardPage dashboard = authSteps.loginAsUser(user.getEmail(), user.getPassword());
          assertThat(dashboard.isDisplayed()).isTrue();
      }

      @Test
      void shouldShowErrorForInvalidPassword() {
          authSteps.loginAsUser("user@test.com", "wrong");
          assertThat(authSteps.getErrorMessage()).contains("Invalid credentials");
      }
  }
  ```

  **6. Reporting / Logging Layer** -- наскрізний шар для звітності:

  ```java
  public class AllureSteps {
      @Step("Login as {username}")
      public static void logLogin(String username) {
          Allure.addAttachment("User", username);
      }

      @Step("Verify response status is {expectedStatus}")
      public static void logApiResponse(int expectedStatus, Response response) {
          Allure.addAttachment("Response Body", response.getBody().asString());
      }
  }
  ```

  **Типова структура проєкту:**
  ```
  src/test/java/
  ├── infrastructure/       # Layer 1: Drivers, configs
  │   ├── DriverManager.java
  │   ├── ApiClient.java
  │   └── config/
  ├── pages/                # Layer 2: Page Objects
  │   ├── LoginPage.java
  │   └── DashboardPage.java
  ├── api/                  # Layer 2: API Clients
  │   └── UserApiClient.java
  ├── steps/                # Layer 3: Business steps
  │   └── AuthSteps.java
  ├── testdata/             # Layer 4: Test data
  │   └── TestDataFactory.java
  ├── tests/                # Layer 5: Test cases
  │   └── LoginTest.java
  └── reporting/            # Layer 6: Reporting
      └── AllureSteps.java
  ```

  Шарова архітектура забезпечує принцип єдиної відповідальності (SRP): зміна UI-локаторів впливає лише на Page Objects, зміна API -- лише на API Clients, а бізнес-логіка та тести залишаються стабільними.
en_answer: |
  Layered architecture of a test framework is an approach to organizing automated tests where code is divided into independent layers with clear responsibilities. Each layer depends only on the layer below, ensuring maintainability, reusability, and scalability.

  **Typical layers (bottom to top):**

  **1. Driver / Infrastructure Layer** -- lowest level, system interaction:

  ```java
  // WebDriver configuration
  public class DriverManager {
      private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

      public static WebDriver getDriver() {
          if (driver.get() == null) {
              driver.set(new ChromeDriver(getChromeOptions()));
          }
          return driver.get();
      }

      public static void quit() {
          if (driver.get() != null) {
              driver.get().quit();
              driver.remove();
          }
      }
  }

  // HTTP client for API tests
  public class ApiClient {
      private final RequestSpecification spec;

      public ApiClient(String baseUrl) {
          this.spec = RestAssured.given()
              .baseUri(baseUrl)
              .contentType(ContentType.JSON);
      }

      public Response get(String path) {
          return spec.get(path);
      }

      public Response post(String path, Object body) {
          return spec.body(body).post(path);
      }
  }
  ```

  **2. Page Objects / API Clients Layer** -- abstraction over UI elements and API endpoints:

  ```java
  // Page Object for UI
  public class LoginPage {
      private final WebDriver driver;

      private final By usernameField = By.id("username");
      private final By passwordField = By.id("password");
      private final By loginButton = By.id("login-btn");
      private final By errorMessage = By.css(".error-msg");

      public LoginPage(WebDriver driver) {
          this.driver = driver;
      }

      public void enterUsername(String username) {
          driver.findElement(usernameField).sendKeys(username);
      }

      public void enterPassword(String password) {
          driver.findElement(passwordField).sendKeys(password);
      }

      public DashboardPage clickLogin() {
          driver.findElement(loginButton).click();
          return new DashboardPage(driver);
      }

      public String getErrorMessage() {
          return driver.findElement(errorMessage).getText();
      }
  }

  // API Client for a service
  public class UserApiClient {
      private final ApiClient api;

      public UserApiClient(ApiClient api) {
          this.api = api;
      }

      public UserDto getUser(int id) {
          return api.get("/users/" + id).as(UserDto.class);
      }

      public Response createUser(UserDto user) {
          return api.post("/users", user);
      }
  }
  ```

  **3. Business Logic / Steps Layer** -- business operations combining Page Object actions:

  ```java
  public class AuthSteps {
      private final LoginPage loginPage;
      private final UserApiClient userApi;

      public AuthSteps() {
          this.loginPage = new LoginPage(DriverManager.getDriver());
          this.userApi = new UserApiClient(new ApiClient("https://api.example.com"));
      }

      public DashboardPage loginAsUser(String username, String password) {
          loginPage.enterUsername(username);
          loginPage.enterPassword(password);
          return loginPage.clickLogin();
      }

      public void verifyUserExists(int userId) {
          UserDto user = userApi.getUser(userId);
          assertThat(user).isNotNull();
          assertThat(user.isActive()).isTrue();
      }
  }
  ```

  **4. Test Data Management Layer** -- test data generation and management:

  ```java
  public class TestDataFactory {
      public static UserDto validUser() {
          return UserDto.builder()
              .name("John Doe")
              .email("john_" + UUID.randomUUID() + "@test.com")
              .password("SecurePass123!")
              .build();
      }

      public static UserDto invalidUser() {
          return UserDto.builder()
              .name("")
              .email("invalid-email")
              .build();
      }
  }
  ```

  **5. Test Cases Layer** -- the tests themselves, maximally readable:

  ```java
  @ExtendWith(DriverExtension.class)
  public class LoginTest {
      private AuthSteps authSteps;

      @BeforeEach
      void setUp() {
          authSteps = new AuthSteps();
      }

      @Test
      void shouldLoginWithValidCredentials() {
          UserDto user = TestDataFactory.validUser();
          DashboardPage dashboard = authSteps.loginAsUser(user.getEmail(), user.getPassword());
          assertThat(dashboard.isDisplayed()).isTrue();
      }

      @Test
      void shouldShowErrorForInvalidPassword() {
          authSteps.loginAsUser("user@test.com", "wrong");
          assertThat(authSteps.getErrorMessage()).contains("Invalid credentials");
      }
  }
  ```

  **6. Reporting / Logging Layer** -- cross-cutting layer for reporting:

  ```java
  public class AllureSteps {
      @Step("Login as {username}")
      public static void logLogin(String username) {
          Allure.addAttachment("User", username);
      }

      @Step("Verify response status is {expectedStatus}")
      public static void logApiResponse(int expectedStatus, Response response) {
          Allure.addAttachment("Response Body", response.getBody().asString());
      }
  }
  ```

  **Typical project structure:**
  ```
  src/test/java/
  ├── infrastructure/       # Layer 1: Drivers, configs
  │   ├── DriverManager.java
  │   ├── ApiClient.java
  │   └── config/
  ├── pages/                # Layer 2: Page Objects
  │   ├── LoginPage.java
  │   └── DashboardPage.java
  ├── api/                  # Layer 2: API Clients
  │   └── UserApiClient.java
  ├── steps/                # Layer 3: Business steps
  │   └── AuthSteps.java
  ├── testdata/             # Layer 4: Test data
  │   └── TestDataFactory.java
  ├── tests/                # Layer 5: Test cases
  │   └── LoginTest.java
  └── reporting/            # Layer 6: Reporting
      └── AllureSteps.java
  ```

  Layered architecture enforces the Single Responsibility Principle (SRP): changing UI locators affects only Page Objects, changing API affects only API Clients, while business logic and tests remain stable.
section: "automation-qa"
order: 19
tags:
  - architecture
  - test-frameworks
  - design-patterns
type: "basic"
---
