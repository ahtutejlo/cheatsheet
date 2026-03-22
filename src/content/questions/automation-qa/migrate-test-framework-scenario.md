---
ua_question: "Як мігрувати 500 Selenium-тестів з TestNG на JUnit 5?"
en_question: "How do you migrate 500 Selenium tests from TestNG to JUnit 5?"
ua_answer: |
  **Scenario:** Команда вирішила мігрувати з TestNG на JUnit 5 для уніфікації з іншими проєктами компанії. Є 500 тестів із використанням TestNG annotations, data providers, listeners та XML suite files. Потрібно мігрувати без зупинки CI.

  **Approach:**
  1. Створити adapter-шар, що дозволяє запускати обидва фреймворки паралельно, та сконфігурувати CI для запуску TestNG і JUnit 5 тестів одночасно
  2. Мігрувати тести пакетами по 50-100, починаючи з найпростіших (без data providers та listeners), замінюючи анотації та адаптуючи lifecycle hooks
  3. Після кожного пакету запускати повний набір тестів, переписати data providers на @ParameterizedTest, та видалити TestNG залежності після завершення

  **Solution:**
  ```java
  // Annotation mapping reference:
  // @org.testng.annotations.Test     -> @org.junit.jupiter.api.Test
  // @BeforeMethod                     -> @BeforeEach
  // @AfterMethod                      -> @AfterEach
  // @BeforeClass                      -> @BeforeAll
  // @AfterClass                       -> @AfterAll
  // @DataProvider                     -> @ParameterizedTest + @MethodSource

  // BEFORE (TestNG)
  public class LoginTest extends BaseTestNG {

      @DataProvider(name = "credentials")
      public Object[][] credentials() {
          return new Object[][] {
              {"admin@test.com", "admin123", true},
              {"user@test.com", "wrong", false},
          };
      }

      @Test(dataProvider = "credentials")
      public void testLogin(String email, String password, boolean expected) {
          LoginPage page = new LoginPage(driver);
          page.login(email, password);
          assertEquals(page.isLoggedIn(), expected);
      }
  }

  // AFTER (JUnit 5)
  class LoginTest extends BaseJUnit5 {

      static Stream<Arguments> credentials() {
          return Stream.of(
              Arguments.of("admin@test.com", "admin123", true),
              Arguments.of("user@test.com", "wrong", false)
          );
      }

      @ParameterizedTest
      @MethodSource("credentials")
      void testLogin(String email, String password, boolean expected) {
          LoginPage page = new LoginPage(driver);
          page.login(email, password);
          assertEquals(expected, page.isLoggedIn());
      }
  }

  // build.gradle -- dual runner support during migration
  // dependencies {
  //     testImplementation 'org.testng:testng:7.9.0'
  //     testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
  //     testRuntimeOnly 'org.junit.vintage:junit-vintage-engine'
  // }
  ```
en_answer: |
  **Scenario:** The team decided to migrate from TestNG to JUnit 5 to unify with other company projects. There are 500 tests using TestNG annotations, data providers, listeners, and XML suite files. The migration must happen without stopping CI.

  **Approach:**
  1. Create an adapter layer that allows running both frameworks in parallel, and configure CI to execute TestNG and JUnit 5 tests simultaneously
  2. Migrate tests in batches of 50-100, starting with the simplest ones (no data providers or listeners), replacing annotations and adapting lifecycle hooks
  3. After each batch run the full test suite, rewrite data providers as @ParameterizedTest, and remove TestNG dependencies after completion

  **Solution:**
  ```java
  // Annotation mapping reference:
  // @org.testng.annotations.Test     -> @org.junit.jupiter.api.Test
  // @BeforeMethod                     -> @BeforeEach
  // @AfterMethod                      -> @AfterEach
  // @BeforeClass                      -> @BeforeAll
  // @AfterClass                       -> @AfterAll
  // @DataProvider                     -> @ParameterizedTest + @MethodSource

  // BEFORE (TestNG)
  public class LoginTest extends BaseTestNG {

      @DataProvider(name = "credentials")
      public Object[][] credentials() {
          return new Object[][] {
              {"admin@test.com", "admin123", true},
              {"user@test.com", "wrong", false},
          };
      }

      @Test(dataProvider = "credentials")
      public void testLogin(String email, String password, boolean expected) {
          LoginPage page = new LoginPage(driver);
          page.login(email, password);
          assertEquals(page.isLoggedIn(), expected);
      }
  }

  // AFTER (JUnit 5)
  class LoginTest extends BaseJUnit5 {

      static Stream<Arguments> credentials() {
          return Stream.of(
              Arguments.of("admin@test.com", "admin123", true),
              Arguments.of("user@test.com", "wrong", false)
          );
      }

      @ParameterizedTest
      @MethodSource("credentials")
      void testLogin(String email, String password, boolean expected) {
          LoginPage page = new LoginPage(driver);
          page.login(email, password);
          assertEquals(expected, page.isLoggedIn());
      }
  }

  // build.gradle -- dual runner support during migration
  // dependencies {
  //     testImplementation 'org.testng:testng:7.9.0'
  //     testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
  //     testRuntimeOnly 'org.junit.vintage:junit-vintage-engine'
  // }
  ```
section: "automation-qa"
order: 27
tags:
  - migration
  - test-frameworks
  - selenium
type: "practical"
---
