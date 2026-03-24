---
company: "mongodb"
stage: "system-testing"
ua_question: "Тобі дали систему без документації. Як ти побудуєш тест-план з нуля?"
en_question: "You're given a system with no documentation. How do you build a test plan from scratch?"
ua_answer: |
  Тестування невідомої системи ("ambiguous system") — це структурований процес дослідження та планування:

  **Фаза 1: Дослідження (Discovery)**
  1. Визнач межі системи: вхідні/вихідні точки, API endpoints, UI
  2. Склади список функцій через exploratory testing
  3. Визнач залежності: бази даних, зовнішні сервіси, черги
  4. Запитай стейкхолдерів: хто користувачі? Які critical paths?

  **Фаза 2: Класифікація ризиків**
  | Область | Ризик | Пріоритет |
  |---------|-------|-----------|
  | Data integrity | Втрата/пошкодження даних | Critical |
  | Authentication | Несанкціонований доступ | Critical |
  | Core workflows | Основний функціонал зламаний | High |
  | Edge cases | Некоректна обробка граничних значень | Medium |
  | Performance | Деградація під навантаженням | Medium |
  | UI/UX | Некоректне відображення | Low |

  **Фаза 3: Тест-план**
  ```
  1. Smoke тести (30 хв)
     - Система запускається і відповідає
     - Основний happy path працює
     - БД доступна

  2. Функціональні тести (по пріоритету)
     - Critical paths перші
     - CRUD операції
     - Автентифікація/авторизація

  3. Негативне тестування
     - Невалідні вхідні дані
     - Конкурентний доступ
     - Відмова залежностей (kill DB, network partition)

  4. Нефункціональне тестування
     - Навантаження: скільки RPS витримує?
     - Ресурси: пам'ять, CPU, диск при тривалій роботі
     - Recovery: що відбувається після краша?
  ```

  **Фаза 4: Уточнюючі питання (обов'язково на інтерв'ю)**
  - Яка очікувана кількість користувачів?
  - Які SLA/SLO?
  - Чи є existing bugs або known issues?
  - Які зміни плануються найближчим часом?
  - Яка інфраструктура (cloud, on-prem, hybrid)?

  Головне правило: **починай з питань, не з тестів**. Показати структуроване мислення важливіше ніж написати 50 тест-кейсів.
en_answer: |
  Testing an unknown system ("ambiguous system") is a structured process of exploration and planning:

  **Phase 1: Discovery**
  1. Define system boundaries: entry/exit points, API endpoints, UI
  2. Build a feature list through exploratory testing
  3. Identify dependencies: databases, external services, queues
  4. Ask stakeholders: who are the users? What are critical paths?

  **Phase 2: Risk Classification**
  | Area | Risk | Priority |
  |------|------|----------|
  | Data integrity | Data loss/corruption | Critical |
  | Authentication | Unauthorized access | Critical |
  | Core workflows | Main functionality broken | High |
  | Edge cases | Incorrect boundary handling | Medium |
  | Performance | Degradation under load | Medium |
  | UI/UX | Display issues | Low |

  **Phase 3: Test Plan**
  ```
  1. Smoke tests (30 min)
     - System starts and responds
     - Main happy path works
     - DB is accessible

  2. Functional tests (by priority)
     - Critical paths first
     - CRUD operations
     - Authentication/authorization

  3. Negative testing
     - Invalid input data
     - Concurrent access
     - Dependency failures (kill DB, network partition)

  4. Non-functional testing
     - Load: how many RPS can it handle?
     - Resources: memory, CPU, disk during extended operation
     - Recovery: what happens after a crash?
  ```

  **Phase 4: Clarifying Questions (mandatory in interviews)**
  - What's the expected number of users?
  - What are the SLAs/SLOs?
  - Are there existing bugs or known issues?
  - What changes are planned in the near future?
  - What's the infrastructure (cloud, on-prem, hybrid)?

  Key rule: **start with questions, not tests**. Showing structured thinking matters more than writing 50 test cases.
tags: [testing, test-strategy, system-testing]
order: 1
---
