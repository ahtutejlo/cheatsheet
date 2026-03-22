---
ua_question: "Чому ramp-up = 0 спотворює результати навантажувального тесту?"
en_question: "Why does ramp-up = 0 corrupt load test results?"
ua_answer: |
  > **Trap:** "Давайте запустимо одразу 1000 користувачів для швидкого тесту." Миттєвий старт усіх користувачів створює нереалістичне навантаження та спотворює результати.

  Коли всі 1000 користувачів стартують одночасно, система отримує thundering herd: тисячу TCP handshakes, тисячу login-запитів, тисячу перших сторінок -- все за секунду. У реальності такого не буває навіть при піковому навантаженні. Результат: connection pool overflow, timeout-и, помилки автентифікації -- все це артефакти тесту, а не реальні проблеми системи.

  Додатково, ramp-up = 0 не дає системі часу на прогрів: JIT-компіляція, прогрів кешів, створення потоків у thread pool. Перші секунди тесту будуть аномально повільними, що спотворює середні та перцентилі.

  ```python
  from locust import HttpUser, task, between, LoadTestShape

  class ApiUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  # BAD: instant ramp-up
  # locust -f locustfile.py --users 1000 --spawn-rate 1000

  # GOOD: gradual ramp-up (10 users/sec = 100 seconds to reach 1000)
  # locust -f locustfile.py --users 1000 --spawn-rate 10

  class RealisticRampShape(LoadTestShape):
      """Proper test shape: ramp up, hold steady, ramp down."""
      def tick(self):
          run_time = self.get_run_time()

          if run_time < 120:
              # Ramp up: 0 -> 500 users over 2 minutes
              users = int(run_time * 500 / 120)
              return (users, 10)
          elif run_time < 420:
              # Hold steady for 5 minutes
              return (500, 10)
          elif run_time < 540:
              # Ramp down: 500 -> 0 over 2 minutes
              remaining = 540 - run_time
              users = int(remaining * 500 / 120)
              return (max(users, 0), 10)
          else:
              return None  # stop

  # Rule of thumb for spawn_rate:
  # - API tests: 5-20 users/second
  # - Web app tests: 2-10 users/second
  # - Ramp-up phase: 10-20% of total test duration
  ```

  Правильна структура тесту: **ramp-up** (10-20% тривалості) -> **steady state** (60-80%) -> **ramp-down** (10-20%). Метрики збираються тільки під час steady state фази, коли система стабілізувалася.
en_answer: |
  > **Trap:** "Let's start all 1000 users at once for a quick test." Instantly starting all users creates unrealistic load and corrupts results.

  When all 1000 users start simultaneously, the system faces a thundering herd: a thousand TCP handshakes, a thousand login requests, a thousand first pages -- all within a second. In reality, this never happens even during peak load. Result: connection pool overflow, timeouts, authentication errors -- these are all test artifacts, not real system problems.

  Additionally, ramp-up = 0 does not give the system time to warm up: JIT compilation, cache warming, thread pool creation. The first seconds of the test will be anomalously slow, distorting averages and percentiles.

  ```python
  from locust import HttpUser, task, between, LoadTestShape

  class ApiUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  # BAD: instant ramp-up
  # locust -f locustfile.py --users 1000 --spawn-rate 1000

  # GOOD: gradual ramp-up (10 users/sec = 100 seconds to reach 1000)
  # locust -f locustfile.py --users 1000 --spawn-rate 10

  class RealisticRampShape(LoadTestShape):
      """Proper test shape: ramp up, hold steady, ramp down."""
      def tick(self):
          run_time = self.get_run_time()

          if run_time < 120:
              # Ramp up: 0 -> 500 users over 2 minutes
              users = int(run_time * 500 / 120)
              return (users, 10)
          elif run_time < 420:
              # Hold steady for 5 minutes
              return (500, 10)
          elif run_time < 540:
              # Ramp down: 500 -> 0 over 2 minutes
              remaining = 540 - run_time
              users = int(remaining * 500 / 120)
              return (max(users, 0), 10)
          else:
              return None  # stop

  # Rule of thumb for spawn_rate:
  # - API tests: 5-20 users/second
  # - Web app tests: 2-10 users/second
  # - Ramp-up phase: 10-20% of total test duration
  ```

  Proper test structure: **ramp-up** (10-20% of duration) -> **steady state** (60-80%) -> **ramp-down** (10-20%). Metrics are collected only during the steady state phase when the system has stabilized.
section: "performance-testing"
order: 21
tags:
  - scenarios
  - gotchas
type: "trick"
---
