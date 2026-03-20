---
ua_question: "Що таке тестування програмного забезпечення?"
en_question: "What is software testing?"
ua_answer: |
  Тестування програмного забезпечення -- це процес перевірки та валідації того, що програма працює відповідно до вимог та очікувань користувачів.

  Основна мета тестування -- виявлення дефектів до того, як продукт потрапить до кінцевого користувача.

  ```java
  @Test
  void shouldReturnCorrectSum() {
      Calculator calc = new Calculator();
      assertEquals(5, calc.add(2, 3));
  }
  ```
en_answer: |
  Software testing is the process of verifying and validating that a program works according to requirements and user expectations.

  The main goal of testing is to find defects before the product reaches the end user.

  ```java
  @Test
  void shouldReturnCorrectSum() {
      Calculator calc = new Calculator();
      assertEquals(5, calc.add(2, 3));
  }
  ```
section: "qa"
order: 1
tags:
  - fundamentals
---
