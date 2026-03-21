---
ua_question: "Що таке піраміда автоматизації тестів?"
en_question: "What is the test automation pyramid?"
ua_answer: |
  Піраміда автоматизації тестів -- це модель, яка показує оптимальне співвідношення різних типів автоматизованих тестів у проекті.

  **Три рівні піраміди (знизу вгору):**

  **1. Unit-тести (основа, ~70%)**
  - Тестують окремі функції та методи
  - Найшвидші та найдешевші
  - Легко підтримувати

  **2. Інтеграційні/API тести (середина, ~20%)**
  - Тестують взаємодію між компонентами
  - Перевіряють API контракти
  - Середня швидкість та вартість

  **3. UI/E2E тести (вершина, ~10%)**
  - Тестують повний користувацький сценарій
  - Найповільніші та найдорожчі
  - Найбільш крихкі (brittle)

  **Антипатерн -- "Перевернута піраміда" (Ice Cream Cone):**
  - Багато UI-тестів, мало unit-тестів
  - Повільний зворотний зв'язок
  - Висока вартість підтримки
  - Крихкий тестовий набір

  Правильна піраміда забезпечує швидкий зворотний зв'язок та низьку вартість підтримки тестів.
en_answer: |
  The test automation pyramid is a model that shows the optimal ratio of different types of automated tests in a project.

  **Three levels of the pyramid (bottom to top):**

  **1. Unit tests (base, ~70%)**
  - Test individual functions and methods
  - Fastest and cheapest
  - Easy to maintain

  **2. Integration/API tests (middle, ~20%)**
  - Test interaction between components
  - Verify API contracts
  - Medium speed and cost

  **3. UI/E2E tests (top, ~10%)**
  - Test full user scenarios
  - Slowest and most expensive
  - Most brittle

  **Anti-pattern -- "Inverted Pyramid" (Ice Cream Cone):**
  - Many UI tests, few unit tests
  - Slow feedback
  - High maintenance cost
  - Brittle test suite

  A proper pyramid ensures fast feedback and low test maintenance cost.
section: "automation-qa"
order: 3
tags:
  - strategy
  - test-pyramid
---
