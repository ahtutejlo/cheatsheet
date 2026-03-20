---
ua_question: "Що таке регресійне тестування?"
en_question: "What is regression testing?"
ua_answer: |
  Регресійне тестування -- це повторне виконання раніше пройдених тестів після внесення змін у код, щоб переконатися, що існуюча функціональність працює коректно.

  Регресійні тести зазвичай автоматизують, щоб запускати їх при кожній зміні коду.

  ```java
  @Test
  void regressionTest() {
      // Перевіряємо, що стара функціональність працює після змін
      UserService service = new UserService();
      User user = service.createUser("test@example.com");
      assertEquals("test@example.com", user.getEmail());
      assertTrue(user.isActive());
  }
  ```
en_answer: |
  Regression testing is re-running previously passed tests after code changes to ensure existing functionality still works correctly.

  Regression tests are usually automated to run with every code change.

  ```java
  @Test
  void regressionTest() {
      // Verify old functionality works after changes
      UserService service = new UserService();
      User user = service.createUser("test@example.com");
      assertEquals("test@example.com", user.getEmail());
      assertTrue(user.isActive());
  }
  ```
section: "qa"
order: 3
tags:
  - testing-types
---
