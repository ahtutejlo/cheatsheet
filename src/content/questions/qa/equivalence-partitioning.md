---
ua_question: "Що таке еквівалентне розбиття?"
en_question: "What is equivalence partitioning?"
ua_answer: |
  Еквівалентне розбиття (Equivalence Partitioning) -- це техніка тест-дизайну, яка розділяє вхідні дані на групи (класи еквівалентності), де всі значення в межах одного класу повинні оброблятися системою однаково.

  **Принцип:** якщо одне значення з класу працює правильно, то всі інші значення цього класу теж працюватимуть правильно. Це дозволяє значно скоротити кількість тестів.

  **Приклад:** поле вводу віку приймає значення від 18 до 65:
  - **Валідний клас:** 18-65 (обираємо, наприклад, 30)
  - **Невалідний клас 1:** менше 18 (обираємо, наприклад, 10)
  - **Невалідний клас 2:** більше 65 (обираємо, наприклад, 80)
  - **Невалідний клас 3:** нечислові символи (обираємо, наприклад, "abc")

  Замість тестування кожного можливого значення, ми обираємо по одному представнику з кожного класу. Це ефективний баланс між покриттям та кількістю тестів.
en_answer: |
  Equivalence Partitioning is a test design technique that divides input data into groups (equivalence classes) where all values within one class should be processed by the system in the same way.

  **Principle:** if one value from a class works correctly, then all other values in that class will also work correctly. This significantly reduces the number of tests.

  **Example:** an age input field accepts values from 18 to 65:
  - **Valid class:** 18-65 (we choose, for example, 30)
  - **Invalid class 1:** less than 18 (we choose, for example, 10)
  - **Invalid class 2:** greater than 65 (we choose, for example, 80)
  - **Invalid class 3:** non-numeric characters (we choose, for example, "abc")

  Instead of testing every possible value, we select one representative from each class. This is an effective balance between coverage and the number of tests.
section: "qa"
order: 6
tags:
  - test-design
  - equivalence-partitioning
---
