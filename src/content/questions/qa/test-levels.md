---
ua_question: "Які є рівні тестування?"
en_question: "What are the levels of testing?"
ua_answer: |
  Існує чотири основних рівні тестування:

  1. **Модульне (Unit)** -- тестування окремих компонентів
  2. **Інтеграційне (Integration)** -- тестування взаємодії між компонентами
  3. **Системне (System)** -- тестування всієї системи в цілому
  4. **Приймальне (Acceptance)** -- перевірка відповідності бізнес-вимогам

  ```java
  // Unit test -- тестуємо один метод
  @Test
  void unitTest() {
      assertEquals("HELLO", StringUtils.toUpperCase("hello"));
  }

  // Integration test -- тестуємо взаємодію з БД
  @Test
  void integrationTest() {
      User saved = repository.save(new User("John"));
      assertNotNull(saved.getId());
  }
  ```
en_answer: |
  There are four main levels of testing:

  1. **Unit** -- testing individual components
  2. **Integration** -- testing interaction between components
  3. **System** -- testing the entire system as a whole
  4. **Acceptance** -- verifying compliance with business requirements

  ```java
  // Unit test -- testing a single method
  @Test
  void unitTest() {
      assertEquals("HELLO", StringUtils.toUpperCase("hello"));
  }

  // Integration test -- testing interaction with DB
  @Test
  void integrationTest() {
      User saved = repository.save(new User("John"));
      assertNotNull(saved.getId());
  }
  ```
section: "qa"
order: 2
tags:
  - fundamentals
  - test-levels
---
