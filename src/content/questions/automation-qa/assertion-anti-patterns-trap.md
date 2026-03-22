---
ua_question: "Чи більше assertions у тесті означає кращу якість покриття?"
en_question: "Do more assertions per test mean better test coverage?"
ua_answer: |
  > **Trap:** Чим більше перевірок у тесті, тим більше він покриває і тим він кориснішим. Насправді надмірна кількість assertions в одному тесті -- це антипатерн "Assertion Roulette".

  Коли тест має 10-15 assertions і один з них падає, розробник бачить лише перший провалений assert, а решта не виконуються. Це створює кілька проблем:
  - **Маскування помилок:** тест зупиняється на першому збої, решта проблем невидимі
  - **Складна діагностика:** незрозуміло, яку саме поведінку перевіряє тест
  - **Крихкість:** зміна в одній частині функціональності ламає "мега-тест", хоча решта працює коректно

  Принцип Single Responsibility для тестів: один тест перевіряє одну поведінку. Якщо потрібно перевірити кілька аспектів одного результату, це допустимо, але перевірка різних дій -- ні.

  ```java
  // ANTI-PATTERN: Assertion Roulette
  @Test
  void testUserRegistration() {
      registerUser("john@example.com", "password123");
      assertEquals("john@example.com", getEmail());      // if this fails...
      assertTrue(isEmailVerificationSent());              // ...we never know about these
      assertEquals("pending", getAccountStatus());
      assertNotNull(getCreatedTimestamp());
      assertTrue(getWelcomeEmailSent());
      assertEquals(0, getLoginCount());
  }

  // CORRECT: Focused assertions, one behavior per test
  @Test
  void shouldCreateAccountWithPendingStatus() {
      registerUser("john@example.com", "password123");
      assertEquals("pending", getAccountStatus());
  }

  @Test
  void shouldSendVerificationEmailOnRegistration() {
      registerUser("john@example.com", "password123");
      assertTrue(isEmailVerificationSent());
  }

  @Test
  void shouldInitializeLoginCountToZero() {
      registerUser("john@example.com", "password123");
      assertEquals(0, getLoginCount());
  }
  ```

  Помилка поширена через хибну аналогію з unit-тестами, де множинні assertions перевіряють один об'єкт. У E2E-тестах кожен assertion може залежати від різних підсистем.
en_answer: |
  > **Trap:** The more assertions in a test, the more it covers and the more useful it is. In reality, excessive assertions in a single test is an anti-pattern called "Assertion Roulette."

  When a test has 10-15 assertions and one fails, the developer only sees the first failed assert while the rest do not execute. This creates several problems:
  - **Error masking:** the test stops at the first failure, remaining problems are invisible
  - **Difficult diagnosis:** it is unclear what specific behavior the test verifies
  - **Brittleness:** a change in one part of functionality breaks the "mega-test" even though the rest works correctly

  The Single Responsibility principle for tests: one test verifies one behavior. If you need to verify multiple aspects of one result, that is acceptable, but verifying different actions is not.

  ```java
  // ANTI-PATTERN: Assertion Roulette
  @Test
  void testUserRegistration() {
      registerUser("john@example.com", "password123");
      assertEquals("john@example.com", getEmail());      // if this fails...
      assertTrue(isEmailVerificationSent());              // ...we never know about these
      assertEquals("pending", getAccountStatus());
      assertNotNull(getCreatedTimestamp());
      assertTrue(getWelcomeEmailSent());
      assertEquals(0, getLoginCount());
  }

  // CORRECT: Focused assertions, one behavior per test
  @Test
  void shouldCreateAccountWithPendingStatus() {
      registerUser("john@example.com", "password123");
      assertEquals("pending", getAccountStatus());
  }

  @Test
  void shouldSendVerificationEmailOnRegistration() {
      registerUser("john@example.com", "password123");
      assertTrue(isEmailVerificationSent());
  }

  @Test
  void shouldInitializeLoginCountToZero() {
      registerUser("john@example.com", "password123");
      assertEquals(0, getLoginCount());
  }
  ```

  The mistake is common due to a false analogy with unit tests where multiple assertions verify a single object. In E2E tests, each assertion may depend on different subsystems.
section: "automation-qa"
order: 13
tags:
  - assertions
  - test-design
  - anti-patterns
type: "trick"
---
