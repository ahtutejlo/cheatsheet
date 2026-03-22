---
ua_question: "Як реалізувати spike-тест у Locust з кастомним LoadTestShape?"
en_question: "How to implement a spike test in Locust with a custom LoadTestShape?"
ua_answer: |
  **Сценарій:** Потрібно перевірити, як система реагує на раптовий сплеск трафіку (наприклад, після маркетингової кампанії або вірусного посту). Spike-тест імітує різке збільшення навантаження у 5-10 разів протягом секунд.

  **Підхід:** Використовуємо `LoadTestShape` для створення профілю: нормальне навантаження -> різкий пік -> повернення до норми. Ключове -- перевірити не тільки виживання під піком, а й **recovery** -- як швидко система повертається до нормальної роботи після піку.

  Spike-тест виявляє проблеми, які не видно при плавному рампі: auto-scaling delays, circuit breaker поведінку, connection pool exhaustion, queue overflow. Якщо система використовує auto-scaling (Kubernetes HPA), спайк повинен тривати довше за час scale-up (зазвичай 2-5 хвилин).

  ```python
  from locust import HttpUser, task, between, LoadTestShape
  import math

  class ApiUser(HttpUser):
      wait_time = between(1, 3)

      @task(5)
      def browse(self):
          self.client.get("/api/products")

      @task(1)
      def search(self):
          self.client.get("/api/search?q=laptop")

  class SpikeTestShape(LoadTestShape):
      """
      Spike test profile:
      0-2min:   Normal load (50 users)     - baseline
      2-2.5min: Spike to 500 users          - 10x spike
      2.5-5min: Hold spike                  - stress under spike
      5-5.5min: Drop back to 50             - recovery
      5.5-8min: Normal load                 - verify recovery
      8-10min:  Second spike to 300         - repeat resilience
      10-12min: Hold second spike
      12-14min: Back to normal + cooldown
      """
      stages = [
          {"duration": 120,  "users": 50,  "spawn_rate": 10},   # baseline
          {"duration": 150,  "users": 500, "spawn_rate": 200},  # spike UP
          {"duration": 300,  "users": 500, "spawn_rate": 200},  # hold spike
          {"duration": 330,  "users": 50,  "spawn_rate": 200},  # spike DOWN
          {"duration": 480,  "users": 50,  "spawn_rate": 10},   # recovery
          {"duration": 600,  "users": 300, "spawn_rate": 150},  # 2nd spike
          {"duration": 720,  "users": 300, "spawn_rate": 150},  # hold
          {"duration": 840,  "users": 50,  "spawn_rate": 100},  # cooldown
      ]

      def tick(self):
          run_time = self.get_run_time()
          for stage in self.stages:
              if run_time < stage["duration"]:
                  return (stage["users"], stage["spawn_rate"])
          return None

  class DoubleSpikeShape(LoadTestShape):
      """Alternative: mathematical spike with sine wave."""
      def tick(self):
          run_time = self.get_run_time()
          if run_time > 600:
              return None

          base_users = 50
          spike_amplitude = 450
          # Create spike at t=150s and t=450s
          spike1 = spike_amplitude * max(0, math.exp(-((run_time-150)/30)**2))
          spike2 = spike_amplitude * max(0, math.exp(-((run_time-450)/30)**2))
          users = int(base_users + spike1 + spike2)

          return (users, max(users // 5, 10))
  ```

  **Критерії успіху spike-тесту:** 1) error rate під час піку < 5%, 2) система не "падає" повністю, 3) після піку p95 повертається до baseline за < 60 секунд, 4) немає втрачених даних (замовлення, транзакції).
en_answer: |
  **Scenario:** You need to verify how the system reacts to a sudden traffic spike (e.g., after a marketing campaign or viral post). A spike test simulates a 5-10x load increase within seconds.

  **Approach:** Use `LoadTestShape` to create a profile: normal load -> sharp spike -> return to normal. The key is to verify not just survival under the spike, but also **recovery** -- how quickly the system returns to normal operation after the spike.

  Spike tests reveal problems invisible during gradual ramp-up: auto-scaling delays, circuit breaker behavior, connection pool exhaustion, queue overflow. If the system uses auto-scaling (Kubernetes HPA), the spike should last longer than the scale-up time (typically 2-5 minutes).

  ```python
  from locust import HttpUser, task, between, LoadTestShape
  import math

  class ApiUser(HttpUser):
      wait_time = between(1, 3)

      @task(5)
      def browse(self):
          self.client.get("/api/products")

      @task(1)
      def search(self):
          self.client.get("/api/search?q=laptop")

  class SpikeTestShape(LoadTestShape):
      """
      Spike test profile:
      0-2min:   Normal load (50 users)     - baseline
      2-2.5min: Spike to 500 users          - 10x spike
      2.5-5min: Hold spike                  - stress under spike
      5-5.5min: Drop back to 50             - recovery
      5.5-8min: Normal load                 - verify recovery
      8-10min:  Second spike to 300         - repeat resilience
      10-12min: Hold second spike
      12-14min: Back to normal + cooldown
      """
      stages = [
          {"duration": 120,  "users": 50,  "spawn_rate": 10},   # baseline
          {"duration": 150,  "users": 500, "spawn_rate": 200},  # spike UP
          {"duration": 300,  "users": 500, "spawn_rate": 200},  # hold spike
          {"duration": 330,  "users": 50,  "spawn_rate": 200},  # spike DOWN
          {"duration": 480,  "users": 50,  "spawn_rate": 10},   # recovery
          {"duration": 600,  "users": 300, "spawn_rate": 150},  # 2nd spike
          {"duration": 720,  "users": 300, "spawn_rate": 150},  # hold
          {"duration": 840,  "users": 50,  "spawn_rate": 100},  # cooldown
      ]

      def tick(self):
          run_time = self.get_run_time()
          for stage in self.stages:
              if run_time < stage["duration"]:
                  return (stage["users"], stage["spawn_rate"])
          return None

  class DoubleSpikeShape(LoadTestShape):
      """Alternative: mathematical spike with sine wave."""
      def tick(self):
          run_time = self.get_run_time()
          if run_time > 600:
              return None

          base_users = 50
          spike_amplitude = 450
          # Create spike at t=150s and t=450s
          spike1 = spike_amplitude * max(0, math.exp(-((run_time-150)/30)**2))
          spike2 = spike_amplitude * max(0, math.exp(-((run_time-450)/30)**2))
          users = int(base_users + spike1 + spike2)

          return (users, max(users // 5, 10))
  ```

  **Success criteria for spike tests:** 1) error rate during spike < 5%, 2) the system does not crash entirely, 3) after the spike, p95 returns to baseline within < 60 seconds, 4) no lost data (orders, transactions).
section: "performance-testing"
order: 25
tags:
  - locust
  - scenarios
type: "practical"
---
