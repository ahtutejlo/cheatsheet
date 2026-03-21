---
ua_question: "Як інтегрувати тести в CI/CD?"
en_question: "How to integrate tests into CI/CD?"
ua_answer: |
  Інтеграція тестів у CI/CD (Continuous Integration / Continuous Delivery) забезпечує автоматичну перевірку якості коду при кожній зміні.

  **Типова CI/CD пайплайн з тестами:**
  1. **Commit** -- розробник пушить код
  2. **Build** -- збірка проекту
  3. **Unit тести** -- запуск юніт-тестів (швидкі, хвилини)
  4. **Integration тести** -- тести API та сервісів (хвилини)
  5. **E2E тести** -- UI тести (повільніші, можуть бути паралельні)
  6. **Deploy** -- розгортання на staging/production

  **Інструменти:**
  - **Jenkins** -- найпопулярніший CI/CD сервер
  - **GitHub Actions** -- CI/CD вбудований у GitHub
  - **GitLab CI** -- CI/CD вбудований у GitLab
  - **Docker** -- ізоляція тестового середовища

  ```yaml
  # GitHub Actions приклад
  name: Tests
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Run unit tests
          run: mvn test
        - name: Run integration tests
          run: mvn verify -P integration
  ```

  **Рекомендації:** запускайте швидкі тести першими, використовуйте паралелізацію, зберігайте звіти та скріншоти при падінні тестів.
en_answer: |
  Integrating tests into CI/CD (Continuous Integration / Continuous Delivery) ensures automatic code quality verification with every change.

  **Typical CI/CD pipeline with tests:**
  1. **Commit** -- developer pushes code
  2. **Build** -- project build
  3. **Unit tests** -- run unit tests (fast, minutes)
  4. **Integration tests** -- API and service tests (minutes)
  5. **E2E tests** -- UI tests (slower, can be parallelized)
  6. **Deploy** -- deployment to staging/production

  **Tools:**
  - **Jenkins** -- most popular CI/CD server
  - **GitHub Actions** -- CI/CD built into GitHub
  - **GitLab CI** -- CI/CD built into GitLab
  - **Docker** -- test environment isolation

  ```yaml
  # GitHub Actions example
  name: Tests
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Run unit tests
          run: mvn test
        - name: Run integration tests
          run: mvn verify -P integration
  ```

  **Recommendations:** run fast tests first, use parallelization, save reports and screenshots on test failures.
section: "automation-qa"
order: 8
tags:
  - ci-cd
  - devops
---
