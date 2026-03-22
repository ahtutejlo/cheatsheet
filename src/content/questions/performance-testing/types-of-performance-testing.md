---
ua_question: "Які існують типи тестування продуктивності?"
en_question: "What are the types of performance testing?"
ua_answer: |
  Тестування продуктивності -- це загальний термін, що охоплює кілька спеціалізованих видів тестування, кожен з яких має свою мету та сценарії використання.

  **Load Testing** (навантажувальне) -- перевірка поведінки системи під очікуваним навантаженням. Мета -- підтвердити, що система витримує прогнозовану кількість користувачів. **Stress Testing** (стресове) -- пошук межі відмови системи шляхом поступового збільшення навантаження понад норму. **Spike Testing** (пікове) -- різке збільшення навантаження для перевірки реакції системи на раптовий сплеск трафіку.

  **Soak/Endurance Testing** (тестування витривалості) -- тривале навантаження протягом годин або днів для виявлення витоків пам'яті, деградації з'єднань до бази даних та інших проблем, які проявляються з часом. **Scalability Testing** (тестування масштабованості) -- перевірка, як система масштабується при додаванні ресурсів (вертикально або горизонтально). **Volume Testing** (об'ємне) -- тестування з великим обсягом даних у базі.

  ```python
  from locust import HttpUser, task, between

  class LoadTestUser(HttpUser):
      wait_time = between(1, 3)

      @task(3)
      def browse_catalog(self):
          self.client.get("/api/products")

      @task(1)
      def place_order(self):
          self.client.post("/api/orders", json={"product_id": 1, "qty": 2})
  ```

  Вибір типу тестування залежить від бізнес-вимог: для e-commerce перед Black Friday критичні spike та stress тести, для банківської системи -- soak тестування для гарантії стабільності 24/7.
en_answer: |
  Performance testing is an umbrella term covering several specialized testing types, each with its own goals and use cases.

  **Load Testing** -- verifying system behavior under expected load. The goal is to confirm the system handles the projected number of users. **Stress Testing** -- finding the system's breaking point by gradually increasing load beyond normal levels. **Spike Testing** -- a sudden burst of load to check how the system reacts to abrupt traffic spikes.

  **Soak/Endurance Testing** -- sustained load over hours or days to detect memory leaks, database connection degradation, and other issues that manifest over time. **Scalability Testing** -- verifying how the system scales when resources are added (vertically or horizontally). **Volume Testing** -- testing with a large data volume in the database.

  ```python
  from locust import HttpUser, task, between

  class LoadTestUser(HttpUser):
      wait_time = between(1, 3)

      @task(3)
      def browse_catalog(self):
          self.client.get("/api/products")

      @task(1)
      def place_order(self):
          self.client.post("/api/orders", json={"product_id": 1, "qty": 2})
  ```

  The choice of testing type depends on business requirements: for e-commerce before Black Friday, spike and stress tests are critical; for banking systems, soak testing ensures 24/7 stability.
section: "performance-testing"
order: 1
tags:
  - fundamentals
  - types
type: "basic"
---
