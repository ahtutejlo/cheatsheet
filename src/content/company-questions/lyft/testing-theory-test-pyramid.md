---
company: "lyft"
stage: "testing-theory-system-design"
ua_question: "Розкажи про піраміду тестування. Як би ти організував тестову стратегію для REST API сервісу з мікросервісною архітектурою?"
en_question: "Explain the test pyramid. How would you organize a testing strategy for a REST API service with microservice architecture?"
ua_answer: |
  **Піраміда тестування (Test Pyramid):**

  ```
        /  E2E  \         — 5-10% тестів
       / Integration\      — 20-30% тестів
      /    Unit Tests  \   — 60-70% тестів
  ```

  **Unit тести (основа):**
  - Тестують окремі функції/методи ізольовано
  - Швидкі (мс), дешеві, стабільні
  - Мокають зовнішні залежності
  - Приклад: валідація вхідних даних, бізнес-логіка

  **Integration тести (середина):**
  - Тестують взаємодію між компонентами
  - Реальна БД (testcontainers), реальні HTTP-виклики
  - Приклад: API endpoint → service → repository → DB

  **E2E тести (вершина):**
  - Повний flow від запиту до відповіді
  - Найдорожчі, найповільніші, найкрихкіші
  - Приклад: створення користувача → авторизація → виконання дії

  **Для мікросервісної архітектури додатково:**
  - **Contract тести** (Pact) — перевіряють контракти між сервісами
  - **Consumer-Driven Contracts** — споживач визначає очікування
  - **Chaos testing** — перевірка відмовостійкості

  **Стратегія для REST API:**
  ```
  Unit:        валідація DTO, бізнес-логіка, маппери
  Integration: controller → service → repo (TestContainers)
  Contract:    Pact/Spring Cloud Contract між сервісами
  E2E:         smoke tests критичних user flows
  Performance: навантажувальні тести ключових ендпоінтів
  ```
en_answer: |
  **Test Pyramid:**

  ```
        /  E2E  \         — 5-10% of tests
       / Integration\      — 20-30% of tests
      /    Unit Tests  \   — 60-70% of tests
  ```

  **Unit tests (base):**
  - Test individual functions/methods in isolation
  - Fast (ms), cheap, stable
  - Mock external dependencies
  - Example: input validation, business logic

  **Integration tests (middle):**
  - Test interaction between components
  - Real DB (testcontainers), real HTTP calls
  - Example: API endpoint → service → repository → DB

  **E2E tests (top):**
  - Full flow from request to response
  - Most expensive, slowest, most fragile
  - Example: create user → authenticate → perform action

  **For microservice architecture additionally:**
  - **Contract tests** (Pact) — verify contracts between services
  - **Consumer-Driven Contracts** — consumer defines expectations
  - **Chaos testing** — verify fault tolerance

  **Strategy for REST API:**
  ```
  Unit:        DTO validation, business logic, mappers
  Integration: controller → service → repo (TestContainers)
  Contract:    Pact/Spring Cloud Contract between services
  E2E:         smoke tests for critical user flows
  Performance: load tests for key endpoints
  ```
tags: [testing-theory, test-pyramid, microservices, strategy]
order: 2
---
