---
ua_question: "Як спроектувати навантажувальний тест для e-commerce потоку?"
en_question: "How to design a load test for an e-commerce flow?"
ua_answer: |
  **Сценарій:** Інтернет-магазин очікує 10,000 одночасних користувачів під час розпродажу. Потрібно спроектувати реалістичний навантажувальний тест, що покриває повний purchase flow.

  **Підхід:** Аналіз реального трафіку показує розподіл дій: 60% -- перегляд каталогу, 25% -- перегляд товару, 10% -- додавання до кошика, 5% -- оформлення замовлення. Це ваговий коефіцієнт для `@task`. Think time між діями -- 2-5 секунд (реальний користувач читає опис товару).

  **Capacity planning:** за законом Літтла, при 10,000 користувачів з think time 3с та response time 0.2с, активних запитів одночасно буде ~667. Це визначає розмір connection pool та кількість серверних потоків.

  ```python
  from locust import HttpUser, task, between, SequentialTaskSet, events
  import random
  import csv

  # Load test data
  with open("test_users.csv") as f:
      USERS = list(csv.DictReader(f))

  PRODUCT_IDS = list(range(1, 10001))

  class BrowseAndBuy(SequentialTaskSet):
      """Realistic e-commerce user journey."""

      def on_start(self):
          # Login
          user = random.choice(USERS)
          resp = self.client.post("/api/login", json={
              "username": user["username"],
              "password": user["password"]
          })
          self.token = resp.json().get("access_token", "")
          self.headers = {"Authorization": f"Bearer {self.token}"}

      @task
      def browse_catalog(self):
          """Step 1: Browse product catalog (pagination)."""
          page = random.randint(1, 100)
          self.client.get(
              f"/api/products?page={page}&limit=20",
              headers=self.headers,
              name="/api/products?page=[N]"
          )

      @task
      def view_product(self):
          """Step 2: View product details."""
          pid = random.choice(PRODUCT_IDS)
          self.client.get(
              f"/api/products/{pid}",
              headers=self.headers,
              name="/api/products/[id]"
          )

      @task
      def add_to_cart(self):
          """Step 3: Add product to cart."""
          pid = random.choice(PRODUCT_IDS)
          self.client.post("/api/cart/items", json={
              "product_id": pid,
              "quantity": random.randint(1, 3)
          }, headers=self.headers)

      @task
      def checkout(self):
          """Step 4: Complete purchase."""
          self.client.post("/api/checkout", json={
              "payment_method": "credit_card",
              "shipping_address_id": 1
          }, headers=self.headers)
          self.interrupt()  # End this task set, start over

  class EcommerceUser(HttpUser):
      wait_time = between(2, 5)
      tasks = [BrowseAndBuy]

  class BrowseOnlyUser(HttpUser):
      """70% of users only browse, never buy."""
      wait_time = between(2, 5)
      weight = 7  # 70% of traffic

      @task
      def browse(self):
          self.client.get("/api/products?page=1&limit=20")

  # Override weight for buying users
  EcommerceUser.weight = 3  # 30% of traffic

  @events.quitting.add_listener
  def final_report(environment, **kwargs):
      stats = environment.runner.stats
      print("\n=== E-COMMERCE LOAD TEST RESULTS ===")
      for entry in stats.entries.values():
          print(f"{entry.name}: avg={entry.avg_response_time:.0f}ms "
                f"p95={entry.get_response_time_percentile(0.95):.0f}ms "
                f"errors={entry.num_failures}")
  ```

  **Запуск:** `locust -f ecommerce_test.py --users 10000 --spawn-rate 50 --run-time 30m`. Spawn rate 50 означає рамп за 200 секунд. Моніторьте серверні метрики паралельно через APM.
en_answer: |
  **Scenario:** An online store expects 10,000 concurrent users during a sale. You need to design a realistic load test covering the full purchase flow.

  **Approach:** Real traffic analysis shows action distribution: 60% -- catalog browsing, 25% -- product viewing, 10% -- adding to cart, 5% -- checkout. These become weight coefficients for `@task`. Think time between actions -- 2-5 seconds (real users read product descriptions).

  **Capacity planning:** by Little's Law, with 10,000 users, 3s think time, and 0.2s response time, concurrent active requests will be ~667. This determines the connection pool size and server thread count.

  ```python
  from locust import HttpUser, task, between, SequentialTaskSet, events
  import random
  import csv

  # Load test data
  with open("test_users.csv") as f:
      USERS = list(csv.DictReader(f))

  PRODUCT_IDS = list(range(1, 10001))

  class BrowseAndBuy(SequentialTaskSet):
      """Realistic e-commerce user journey."""

      def on_start(self):
          # Login
          user = random.choice(USERS)
          resp = self.client.post("/api/login", json={
              "username": user["username"],
              "password": user["password"]
          })
          self.token = resp.json().get("access_token", "")
          self.headers = {"Authorization": f"Bearer {self.token}"}

      @task
      def browse_catalog(self):
          """Step 1: Browse product catalog (pagination)."""
          page = random.randint(1, 100)
          self.client.get(
              f"/api/products?page={page}&limit=20",
              headers=self.headers,
              name="/api/products?page=[N]"
          )

      @task
      def view_product(self):
          """Step 2: View product details."""
          pid = random.choice(PRODUCT_IDS)
          self.client.get(
              f"/api/products/{pid}",
              headers=self.headers,
              name="/api/products/[id]"
          )

      @task
      def add_to_cart(self):
          """Step 3: Add product to cart."""
          pid = random.choice(PRODUCT_IDS)
          self.client.post("/api/cart/items", json={
              "product_id": pid,
              "quantity": random.randint(1, 3)
          }, headers=self.headers)

      @task
      def checkout(self):
          """Step 4: Complete purchase."""
          self.client.post("/api/checkout", json={
              "payment_method": "credit_card",
              "shipping_address_id": 1
          }, headers=self.headers)
          self.interrupt()  # End this task set, start over

  class EcommerceUser(HttpUser):
      wait_time = between(2, 5)
      tasks = [BrowseAndBuy]

  class BrowseOnlyUser(HttpUser):
      """70% of users only browse, never buy."""
      wait_time = between(2, 5)
      weight = 7  # 70% of traffic

      @task
      def browse(self):
          self.client.get("/api/products?page=1&limit=20")

  # Override weight for buying users
  EcommerceUser.weight = 3  # 30% of traffic

  @events.quitting.add_listener
  def final_report(environment, **kwargs):
      stats = environment.runner.stats
      print("\n=== E-COMMERCE LOAD TEST RESULTS ===")
      for entry in stats.entries.values():
          print(f"{entry.name}: avg={entry.avg_response_time:.0f}ms "
                f"p95={entry.get_response_time_percentile(0.95):.0f}ms "
                f"errors={entry.num_failures}")
  ```

  **Execution:** `locust -f ecommerce_test.py --users 10000 --spawn-rate 50 --run-time 30m`. Spawn rate 50 means ramp-up takes 200 seconds. Monitor server metrics in parallel via APM.
section: "performance-testing"
order: 24
tags:
  - scenarios
  - planning
type: "practical"
---
