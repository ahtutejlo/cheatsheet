---
ua_question: "Які стратегії рампу (ramp-up) існують у навантажувальному тестуванні?"
en_question: "What ramp-up strategies exist in load testing?"
ua_answer: |
  **Ramp-up** -- це фаза поступового збільшення кількості віртуальних користувачів від нуля до цільового значення. Правильна стратегія рампу критична для отримання достовірних результатів та виявлення проблем масштабування.

  **Лінійний ramp-up** -- найпростіший: користувачі додаються з постійною швидкістю. Наприклад, 100 користувачів за 60 секунд -- приблизно 1.67 нових користувачів на секунду. **Ступінчастий (stepped)** -- навантаження зростає сходинками: 50 користувачів на 2 хвилини, потім 100, потім 150. Це дозволяє спостерігати стабілізацію системи на кожному рівні.

  Locust надає клас `LoadTestShape` для створення будь-якого профілю навантаження. Це дозволяє реалізувати хвилеподібні патерни, імітацію робочого дня або комбінацію різних фаз в одному тесті.

  ```python
  from locust import HttpUser, task, between, LoadTestShape

  class ApiUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  class SteppedShape(LoadTestShape):
      """Step load: increase by 50 users every 2 minutes, up to 200."""
      stages = [
          {"duration": 120, "users": 50, "spawn_rate": 10},
          {"duration": 240, "users": 100, "spawn_rate": 10},
          {"duration": 360, "users": 150, "spawn_rate": 10},
          {"duration": 480, "users": 200, "spawn_rate": 10},
          {"duration": 600, "users": 200, "spawn_rate": 10},  # hold
      ]

      def tick(self):
          run_time = self.get_run_time()
          for stage in self.stages:
              if run_time < stage["duration"]:
                  return (stage["users"], stage["spawn_rate"])
          return None  # stop test
  ```

  Загальне правило: ramp-up повинен бути достатньо повільним, щоб система встигала створювати з'єднання, прогрівати кеші та стабілізуватися. Типовий рампу -- 5-15% від загальної тривалості тесту.
en_answer: |
  **Ramp-up** is the phase of gradually increasing the number of virtual users from zero to the target value. A proper ramp-up strategy is critical for obtaining reliable results and detecting scaling issues.

  **Linear ramp-up** -- the simplest: users are added at a constant rate. For example, 100 users over 60 seconds means roughly 1.67 new users per second. **Stepped** -- load increases in steps: 50 users for 2 minutes, then 100, then 150. This allows observing system stabilization at each level.

  Locust provides the `LoadTestShape` class for creating any load profile. This enables wave-like patterns, workday simulation, or a combination of different phases in a single test.

  ```python
  from locust import HttpUser, task, between, LoadTestShape

  class ApiUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  class SteppedShape(LoadTestShape):
      """Step load: increase by 50 users every 2 minutes, up to 200."""
      stages = [
          {"duration": 120, "users": 50, "spawn_rate": 10},
          {"duration": 240, "users": 100, "spawn_rate": 10},
          {"duration": 360, "users": 150, "spawn_rate": 10},
          {"duration": 480, "users": 200, "spawn_rate": 10},
          {"duration": 600, "users": 200, "spawn_rate": 10},  # hold
      ]

      def tick(self):
          run_time = self.get_run_time()
          for stage in self.stages:
              if run_time < stage["duration"]:
                  return (stage["users"], stage["spawn_rate"])
          return None  # stop test
  ```

  A general rule: ramp-up should be slow enough for the system to create connections, warm caches, and stabilize. A typical ramp-up is 5-15% of the total test duration.
section: "performance-testing"
order: 6
tags:
  - locust
  - scenarios
type: "basic"
---
