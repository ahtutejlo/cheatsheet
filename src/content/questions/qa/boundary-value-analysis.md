---
ua_question: "Що таке аналіз граничних значень?"
en_question: "What is boundary value analysis?"
ua_answer: |
  Аналіз граничних значень (Boundary Value Analysis, BVA) -- це техніка тест-дизайну, яка фокусується на тестуванні значень на межах діапазонів. Практика показує, що більшість дефектів виникає саме на границях.

  **Правило:** для кожної границі тестуємо три значення -- на межі, одне значення до та одне після.

  **Приклад:** поле приймає значення від 1 до 100:
  - **Нижня границя:** 0, 1, 2
  - **Верхня границя:** 99, 100, 101

  Це дає нам 6 тестів замість потенційних сотень. Значення 0 та 101 -- невалідні, 1, 2, 99, 100 -- валідні.

  **BVA часто використовується разом з еквівалентним розбиттям.** Еквівалентне розбиття визначає класи, а BVA додає тести на їхніх межах. Разом ці техніки забезпечують ефективне покриття вхідних даних.
en_answer: |
  Boundary Value Analysis (BVA) is a test design technique that focuses on testing values at the boundaries of ranges. Practice shows that most defects occur precisely at boundaries.

  **Rule:** for each boundary, test three values -- at the boundary, one value before, and one after.

  **Example:** a field accepts values from 1 to 100:
  - **Lower boundary:** 0, 1, 2
  - **Upper boundary:** 99, 100, 101

  This gives us 6 tests instead of potentially hundreds. Values 0 and 101 are invalid, 1, 2, 99, 100 are valid.

  **BVA is often used together with equivalence partitioning.** Equivalence partitioning defines the classes, and BVA adds tests at their boundaries. Together, these techniques provide effective coverage of input data.
section: "qa"
order: 7
tags:
  - test-design
  - boundary-value-analysis
---
