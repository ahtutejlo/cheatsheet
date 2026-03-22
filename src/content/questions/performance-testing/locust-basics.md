---
ua_question: "Як працює Locust: архітектура, User-класи та event hooks?"
en_question: "How does Locust work: architecture, User classes, and event hooks?"
ua_answer: |
  **Locust** -- це фреймворк для навантажувального тестування на Python. Його архітектура побудована на **gevent** -- бібліотеці для кооперативної багатозадачності через greenlets, що дозволяє симулювати тисячі користувачів в одному процесі.

  Основа Locust -- це **User-класи**. Кожен клас описує поведінку віртуального користувача. `HttpUser` -- найпоширеніший, він надає вбудований HTTP-клієнт з автоматичним збором метрик. Декоратор `@task` позначає методи як завдання, а числовий аргумент задає відносну вагу (частоту виклику). `wait_time` визначає паузу між завданнями.

  **Event hooks** дозволяють додавати кастомну логіку на різних етапах: `test_start`, `test_stop`, `request`, `quitting`. Це корисно для підготовки тестових даних, кастомних метрик або валідації результатів після завершення тесту.

  ```python
  from locust import HttpUser, task, between, events, tag
  import logging

  class EcommerceUser(HttpUser):
      wait_time = between(1, 5)
      host = "http://localhost:8080"

      def on_start(self):
          """Called when a User starts - login once."""
          self.client.post("/api/login", json={
              "username": "testuser",
              "password": "pass123"
          })

      @tag("browse")
      @task(5)
      def view_products(self):
          self.client.get("/api/products")

      @tag("browse")
      @task(3)
      def view_product_detail(self):
          self.client.get("/api/products/1")

      @tag("purchase")
      @task(1)
      def checkout(self):
          self.client.post("/api/cart", json={"product_id": 1})
          self.client.post("/api/checkout")

  @events.test_start.add_listener
  def on_test_start(environment, **kwargs):
      logging.info("Load test is starting")

  @events.request.add_listener
  def on_request(request_type, name, response_time, response_length, **kwargs):
      if response_time > 3000:
          logging.warning(f"Slow request: {name} took {response_time}ms")
  ```

  Запуск тесту: `locust -f locustfile.py --users 100 --spawn-rate 10 --run-time 5m`. Locust також надає веб-інтерфейс на порту 8089 для управління тестом у реальному часі.
en_answer: |
  **Locust** is a Python-based load testing framework. Its architecture is built on **gevent** -- a library for cooperative multitasking through greenlets, allowing simulation of thousands of users in a single process.

  The foundation of Locust is **User classes**. Each class describes virtual user behavior. `HttpUser` is the most common -- it provides a built-in HTTP client with automatic metric collection. The `@task` decorator marks methods as tasks, and the numeric argument sets the relative weight (call frequency). `wait_time` defines the pause between tasks.

  **Event hooks** allow adding custom logic at various stages: `test_start`, `test_stop`, `request`, `quitting`. This is useful for preparing test data, custom metrics, or validating results after the test completes.

  ```python
  from locust import HttpUser, task, between, events, tag
  import logging

  class EcommerceUser(HttpUser):
      wait_time = between(1, 5)
      host = "http://localhost:8080"

      def on_start(self):
          """Called when a User starts - login once."""
          self.client.post("/api/login", json={
              "username": "testuser",
              "password": "pass123"
          })

      @tag("browse")
      @task(5)
      def view_products(self):
          self.client.get("/api/products")

      @tag("browse")
      @task(3)
      def view_product_detail(self):
          self.client.get("/api/products/1")

      @tag("purchase")
      @task(1)
      def checkout(self):
          self.client.post("/api/cart", json={"product_id": 1})
          self.client.post("/api/checkout")

  @events.test_start.add_listener
  def on_test_start(environment, **kwargs):
      logging.info("Load test is starting")

  @events.request.add_listener
  def on_request(request_type, name, response_time, response_length, **kwargs):
      if response_time > 3000:
          logging.warning(f"Slow request: {name} took {response_time}ms")
  ```

  Running the test: `locust -f locustfile.py --users 100 --spawn-rate 10 --run-time 5m`. Locust also provides a web interface on port 8089 for real-time test management.
section: "performance-testing"
order: 4
tags:
  - locust
  - fundamentals
type: "basic"
---
