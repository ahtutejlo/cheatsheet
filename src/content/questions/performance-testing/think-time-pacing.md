---
ua_question: "Що таке think time і pacing у навантажувальному тестуванні?"
en_question: "What are think time and pacing in load testing?"
ua_answer: |
  **Think time** -- це пауза між діями віртуального користувача, яка імітує час на роздуми реального користувача (читання сторінки, заповнення форми). Без think time кожен віртуальний користувач генерує нереалістично високе навантаження, що спотворює результати.

  **Pacing** -- це інтервал між початком одної ітерації та початком наступної. На відміну від think time, pacing гарантує фіксовану частоту ітерацій незалежно від часу відповіді сервера. Якщо ітерація зайняла 2 секунди, а pacing = 5 секунд, система чекає ще 3 секунди перед наступною ітерацією.

  Неправильний think time -- одна з найпоширеніших помилок у навантажувальному тестуванні. Якщо think time = 0, 100 віртуальних користувачів можуть генерувати навантаження еквівалентне тисячам реальних. Це призводить до хибно песимістичних результатів.

  ```python
  from locust import HttpUser, task, between, constant, constant_pacing

  class RealisticUser(HttpUser):
      # Random think time between 1-5 seconds (most common)
      wait_time = between(1, 5)

      @task
      def browse(self):
          self.client.get("/api/products")

  class FixedRateUser(HttpUser):
      # Constant think time of 2 seconds
      wait_time = constant(2)

      @task
      def browse(self):
          self.client.get("/api/products")

  class PacedUser(HttpUser):
      # Pacing: one iteration every 10 seconds regardless of response time
      wait_time = constant_pacing(10)

      @task
      def full_flow(self):
          self.client.get("/api/products")
          self.client.get("/api/products/1")
          self.client.post("/api/cart", json={"product_id": 1})
  ```

  Найкращий підхід -- аналізувати реальні логи сервера для визначення розподілу think time та використовувати `between(min, max)` з відповідними значеннями. Для API-тестів з фіксованим SLA часто використовують `constant_pacing` для стабільної швидкості запитів.
en_answer: |
  **Think time** is the pause between virtual user actions that simulates real user thinking time (reading a page, filling out a form). Without think time, each virtual user generates unrealistically high load, distorting results.

  **Pacing** is the interval between the start of one iteration and the start of the next. Unlike think time, pacing guarantees a fixed iteration frequency regardless of server response time. If an iteration took 2 seconds and pacing = 5 seconds, the system waits 3 more seconds before the next iteration.

  Incorrect think time is one of the most common mistakes in load testing. If think time = 0, 100 virtual users can generate load equivalent to thousands of real users. This leads to falsely pessimistic results.

  ```python
  from locust import HttpUser, task, between, constant, constant_pacing

  class RealisticUser(HttpUser):
      # Random think time between 1-5 seconds (most common)
      wait_time = between(1, 5)

      @task
      def browse(self):
          self.client.get("/api/products")

  class FixedRateUser(HttpUser):
      # Constant think time of 2 seconds
      wait_time = constant(2)

      @task
      def browse(self):
          self.client.get("/api/products")

  class PacedUser(HttpUser):
      # Pacing: one iteration every 10 seconds regardless of response time
      wait_time = constant_pacing(10)

      @task
      def full_flow(self):
          self.client.get("/api/products")
          self.client.get("/api/products/1")
          self.client.post("/api/cart", json={"product_id": 1})
  ```

  The best approach is to analyze real server logs to determine think time distribution and use `between(min, max)` with corresponding values. For API tests with fixed SLAs, `constant_pacing` is often used for a stable request rate.
section: "performance-testing"
order: 5
tags:
  - fundamentals
  - scenarios
type: "basic"
---
