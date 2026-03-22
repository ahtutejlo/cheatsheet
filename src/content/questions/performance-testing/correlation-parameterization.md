---
ua_question: "Що таке кореляція та параметризація у навантажувальному тестуванні?"
en_question: "What are correlation and parameterization in load testing?"
ua_answer: |
  **Параметризація** -- це підстановка різних даних у кожну ітерацію тесту замість хардкодних значень. Наприклад, замість одного й того ж `user_id=1` кожен віртуальний користувач використовує унікальний ID з набору тестових даних. Це запобігає кешуванню та імітує реалістичну поведінку.

  **Кореляція** -- це витягування динамічних значень з відповіді сервера та використання їх у наступних запитах. Типовий приклад -- CSRF-токен: сервер повертає токен у першій відповіді, і його потрібно передати у наступному POST-запиті. Без кореляції тест отримає помилки 403.

  У Locust параметризація та кореляція реалізуються засобами Python, що робить код зрозумілим та гнучким порівняно з XML-конфігураціями JMeter.

  ```python
  from locust import HttpUser, task, between
  import csv
  import random

  # Parameterization: load test data from CSV
  def load_users():
      with open("test_users.csv") as f:
          return list(csv.DictReader(f))

  TEST_USERS = load_users()

  class CorrelationUser(HttpUser):
      wait_time = between(1, 3)

      def on_start(self):
          # Parameterization: pick a random user
          user_data = random.choice(TEST_USERS)

          # Correlation: extract token from login response
          resp = self.client.post("/api/login", json={
              "username": user_data["username"],
              "password": user_data["password"]
          })
          self.token = resp.json().get("access_token")
          self.headers = {"Authorization": f"Bearer {self.token}"}

      @task
      def create_order(self):
          # Correlation: extract order_id from response, use in next request
          resp = self.client.post(
              "/api/orders",
              json={"product_id": random.randint(1, 100)},
              headers=self.headers
          )
          order_id = resp.json().get("id")

          if order_id:
              self.client.get(
                  f"/api/orders/{order_id}",
                  headers=self.headers,
                  name="/api/orders/[id]"  # group in stats
              )
  ```

  Зверніть увагу на параметр `name="/api/orders/[id]"` -- це групує статистику для URL з динамічними параметрами. Без цього Locust створить окремий запис для кожного унікального URL, що засмітить звіт.
en_answer: |
  **Parameterization** is substituting different data in each test iteration instead of hardcoded values. For example, instead of the same `user_id=1`, each virtual user uses a unique ID from a test data set. This prevents caching and simulates realistic behavior.

  **Correlation** is extracting dynamic values from server responses and using them in subsequent requests. A typical example is a CSRF token: the server returns a token in the first response, and it must be passed in the next POST request. Without correlation, the test will receive 403 errors.

  In Locust, parameterization and correlation are implemented using Python features, making the code clear and flexible compared to JMeter's XML configurations.

  ```python
  from locust import HttpUser, task, between
  import csv
  import random

  # Parameterization: load test data from CSV
  def load_users():
      with open("test_users.csv") as f:
          return list(csv.DictReader(f))

  TEST_USERS = load_users()

  class CorrelationUser(HttpUser):
      wait_time = between(1, 3)

      def on_start(self):
          # Parameterization: pick a random user
          user_data = random.choice(TEST_USERS)

          # Correlation: extract token from login response
          resp = self.client.post("/api/login", json={
              "username": user_data["username"],
              "password": user_data["password"]
          })
          self.token = resp.json().get("access_token")
          self.headers = {"Authorization": f"Bearer {self.token}"}

      @task
      def create_order(self):
          # Correlation: extract order_id from response, use in next request
          resp = self.client.post(
              "/api/orders",
              json={"product_id": random.randint(1, 100)},
              headers=self.headers
          )
          order_id = resp.json().get("id")

          if order_id:
              self.client.get(
                  f"/api/orders/{order_id}",
                  headers=self.headers,
                  name="/api/orders/[id]"  # group in stats
              )
  ```

  Note the `name="/api/orders/[id]"` parameter -- this groups statistics for URLs with dynamic parameters. Without it, Locust creates a separate entry for each unique URL, cluttering the report.
section: "performance-testing"
order: 7
tags:
  - fundamentals
  - data
type: "basic"
---
