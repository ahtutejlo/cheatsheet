---
ua_question: "Як спроєктувати управління тестовими даними для 1000+ тестів у 3 середовищах?"
en_question: "How do you design test data management for 1000+ tests across 3 environments?"
ua_answer: |
  **Scenario:** Тестовий набір із 1000+ E2E-тестів запускається на dev, staging та production-like середовищах. Кожне середовище має різну базу даних, різних користувачів та різні обмеження. Потрібна стратегія управління даними, яка забезпечить ізоляцію, повторюваність та швидке очищення.

  **Approach:**
  1. Реалізувати factory-патерн для створення тестових даних з environment-aware конфігурацією, де кожен factory знає, як створити об'єкт у конкретному середовищі
  2. Використати builder-патерн з розумними дефолтами для мінімізації boilerplate -- тест вказує лише те, що відрізняється від стандарту
  3. Впровадити стратегію cleanup: tagged data з автоматичним видаленням після тесту через try-finally або @AfterEach хук

  **Solution:**
  ```java
  // Environment-aware test data factory
  public class TestDataFactory {

      private final Environment env;
      private final List<Cleanable> createdEntities = new ArrayList<>();

      public TestDataFactory(Environment env) {
          this.env = env;
      }

      public UserBuilder user() {
          return new UserBuilder(this);
      }

      public OrderBuilder order() {
          return new OrderBuilder(this);
      }

      <T extends Cleanable> T register(T entity) {
          createdEntities.add(entity);
          return entity;
      }

      public void cleanupAll() {
          // Reverse order to handle dependencies
          Lists.reverse(createdEntities).forEach(entity -> {
              try {
                  entity.cleanup(env);
              } catch (Exception e) {
                  log.warn("Cleanup failed for {}: {}", entity.getId(), e);
              }
          });
          createdEntities.clear();
      }
  }

  // Builder with smart defaults
  public class UserBuilder {
      private String email = "test-" + UUID.randomUUID() + "@test.com";
      private String role = "user";
      private boolean verified = true;

      public UserBuilder email(String email) { this.email = email; return this; }
      public UserBuilder admin() { this.role = "admin"; return this; }
      public UserBuilder unverified() { this.verified = false; return this; }

      public TestUser build() {
          TestUser user = env.getApi().createUser(email, role, verified);
          return factory.register(user);
      }
  }

  // Usage in tests
  class OrderFlowTest {

      @Inject TestDataFactory data;

      @Test
      void shouldApplyDiscountForPremiumUser() {
          TestUser user = data.user().role("premium").build();
          TestProduct product = data.product().price(100.0).build();
          // Test uses isolated, environment-appropriate data
      }

      @AfterEach
      void cleanup() {
          data.cleanupAll(); // automatic reverse-order cleanup
      }
  }
  ```
en_answer: |
  **Scenario:** A test suite with 1000+ E2E tests runs on dev, staging, and production-like environments. Each environment has a different database, different users, and different constraints. You need a data management strategy that ensures isolation, repeatability, and fast cleanup.

  **Approach:**
  1. Implement a factory pattern for test data creation with environment-aware configuration, where each factory knows how to create objects in a specific environment
  2. Use a builder pattern with smart defaults to minimize boilerplate -- a test specifies only what differs from the standard
  3. Introduce a cleanup strategy: tagged data with automatic deletion after the test via try-finally or @AfterEach hook

  **Solution:**
  ```java
  // Environment-aware test data factory
  public class TestDataFactory {

      private final Environment env;
      private final List<Cleanable> createdEntities = new ArrayList<>();

      public TestDataFactory(Environment env) {
          this.env = env;
      }

      public UserBuilder user() {
          return new UserBuilder(this);
      }

      public OrderBuilder order() {
          return new OrderBuilder(this);
      }

      <T extends Cleanable> T register(T entity) {
          createdEntities.add(entity);
          return entity;
      }

      public void cleanupAll() {
          // Reverse order to handle dependencies
          Lists.reverse(createdEntities).forEach(entity -> {
              try {
                  entity.cleanup(env);
              } catch (Exception e) {
                  log.warn("Cleanup failed for {}: {}", entity.getId(), e);
              }
          });
          createdEntities.clear();
      }
  }

  // Builder with smart defaults
  public class UserBuilder {
      private String email = "test-" + UUID.randomUUID() + "@test.com";
      private String role = "user";
      private boolean verified = true;

      public UserBuilder email(String email) { this.email = email; return this; }
      public UserBuilder admin() { this.role = "admin"; return this; }
      public UserBuilder unverified() { this.verified = false; return this; }

      public TestUser build() {
          TestUser user = env.getApi().createUser(email, role, verified);
          return factory.register(user);
      }
  }

  // Usage in tests
  class OrderFlowTest {

      @Inject TestDataFactory data;

      @Test
      void shouldApplyDiscountForPremiumUser() {
          TestUser user = data.user().role("premium").build();
          TestProduct product = data.product().price(100.0).build();
          // Test uses isolated, environment-appropriate data
      }

      @AfterEach
      void cleanup() {
          data.cleanupAll(); // automatic reverse-order cleanup
      }
  }
  ```
section: "automation-qa"
order: 18
tags:
  - test-data
  - architecture
  - fixtures
type: "practical"
---
