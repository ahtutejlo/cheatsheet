---
ua_question: "Чи допустимо запускати тести у фіксованому порядку, якщо вони проходять?"
en_question: "Is it acceptable to run tests in a fixed order if they pass?"
ua_answer: |
  > **Trap:** Якщо тести проходять у фіксованому порядку, значить вони працюють правильно і порядок можна зафіксувати. Насправді порядково-залежні тести маскують зв'язаність і неминуче ламаються при паралелізації.

  Коли тест B залежить від даних, створених тестом A, це створює невидиму залежність. Такі тести працюють лише у певній послідовності і миттєво ламаються при:
  - **Паралельному запуску:** тести виконуються в довільному порядку
  - **Вибірковому запуску:** розробник запускає лише тест B для дебагу
  - **Рефакторингу набору:** тести переміщують між класами або модулями
  - **CI retry:** при повторному запуску одного тесту його залежність не виконується

  ```java
  // TRAP: Order-dependent tests (hidden coupling)
  @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
  class UserWorkflowTest {

      static String userId; // shared state!

      @Test @Order(1)
      void createUser() {
          userId = api.createUser("test@example.com");
          assertNotNull(userId);
      }

      @Test @Order(2)
      void updateUser() {
          api.updateUser(userId, "new-name"); // fails if test 1 didn't run!
          assertEquals("new-name", api.getUser(userId).getName());
      }

      @Test @Order(3)
      void deleteUser() {
          api.deleteUser(userId); // fails if test 1 didn't run!
          assertThrows(NotFoundException.class, () -> api.getUser(userId));
      }
  }

  // CORRECT: Each test creates its own data
  class UserApiTest {

      @Test
      void shouldUpdateUserName() {
          String userId = api.createUser("test@example.com"); // own setup
          api.updateUser(userId, "new-name");
          assertEquals("new-name", api.getUser(userId).getName());
          api.deleteUser(userId); // own cleanup
      }

      @Test
      void shouldDeleteUser() {
          String userId = api.createUser("delete-me@example.com"); // own setup
          api.deleteUser(userId);
          assertThrows(NotFoundException.class, () -> api.getUser(userId));
      }
  }
  ```

  Ця хибна думка живе довго, бо порядково-залежні тести "працюють" місяцями, поки хтось не спробує додати паралелізацію або запустити один тест окремо.
en_answer: |
  > **Trap:** If tests pass in a fixed order, they work correctly and the order can be locked in. In reality, order-dependent tests mask coupling and inevitably break under parallelization.

  When test B depends on data created by test A, it creates an invisible dependency. Such tests work only in a specific sequence and instantly break when:
  - **Parallel execution:** tests run in arbitrary order
  - **Selective execution:** a developer runs only test B for debugging
  - **Suite refactoring:** tests are moved between classes or modules
  - **CI retry:** when re-running a single test, its dependency does not execute

  ```java
  // TRAP: Order-dependent tests (hidden coupling)
  @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
  class UserWorkflowTest {

      static String userId; // shared state!

      @Test @Order(1)
      void createUser() {
          userId = api.createUser("test@example.com");
          assertNotNull(userId);
      }

      @Test @Order(2)
      void updateUser() {
          api.updateUser(userId, "new-name"); // fails if test 1 didn't run!
          assertEquals("new-name", api.getUser(userId).getName());
      }

      @Test @Order(3)
      void deleteUser() {
          api.deleteUser(userId); // fails if test 1 didn't run!
          assertThrows(NotFoundException.class, () -> api.getUser(userId));
      }
  }

  // CORRECT: Each test creates its own data
  class UserApiTest {

      @Test
      void shouldUpdateUserName() {
          String userId = api.createUser("test@example.com"); // own setup
          api.updateUser(userId, "new-name");
          assertEquals("new-name", api.getUser(userId).getName());
          api.deleteUser(userId); // own cleanup
      }

      @Test
      void shouldDeleteUser() {
          String userId = api.createUser("delete-me@example.com"); // own setup
          api.deleteUser(userId);
          assertThrows(NotFoundException.class, () -> api.getUser(userId));
      }
  }
  ```

  This misconception persists because order-dependent tests "work" for months until someone tries to add parallelization or run a single test in isolation.
section: "automation-qa"
order: 14
tags:
  - test-isolation
  - test-design
type: "trick"
---
