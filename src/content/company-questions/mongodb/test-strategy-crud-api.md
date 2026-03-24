---
company: "mongodb"
stage: "sdet-technical-screening"
ua_question: "Як би ти побудував тест-стратегію для CRUD API? Які категорії тестів потрібні?"
en_question: "How would you build a test strategy for a CRUD API? What test categories are needed?"
ua_answer: |
  Тест-стратегія для CRUD API має покривати кілька рівнів:

  **1. Функціональні тести (Happy Path)**
  - CREATE: створення з валідними даними, перевірка response та збереження
  - READ: отримання існуючого ресурсу, пагінація, фільтрація
  - UPDATE: повне та часткове оновлення (PUT vs PATCH)
  - DELETE: видалення існуючого ресурсу, перевірка 404 після видалення

  **2. Негативні тести**
  - Невалідні дані: порожні поля, неправильні типи, занадто довгі рядки
  - Неіснуючі ресурси: GET/PUT/DELETE на неіснуючий ID → 404
  - Дублікати: повторне створення з унікальними полями → 409
  - Невалідний формат: malformed JSON, неправильний Content-Type

  **3. Граничні випадки (Edge Cases)**
  - Спецсимволи в даних: Unicode, emoji, SQL/NoSQL injection спроби
  - Великі payload: максимальний розмір документу
  - Конкурентність: одночасне оновлення одного ресурсу
  - Пагінація: порожня сторінка, остання сторінка, від'ємний offset

  **4. Безпека**
  - Автентифікація: запити без/з невалідним токеном
  - Авторизація: доступ до чужих ресурсів
  - Rate limiting

  **5. Перформанс**
  - Час відповіді під навантаженням
  - Поведінка при великій кількості записів

  ```python
  import pytest
  import requests

  class TestOrdersCRUD:
      BASE_URL = "http://api.example.com/orders"

      def test_create_order(self):
          payload = {"customerId": "123", "amount": 99.99}
          resp = requests.post(self.BASE_URL, json=payload)
          assert resp.status_code == 201
          assert resp.json()["customerId"] == "123"

      def test_create_order_missing_field(self):
          resp = requests.post(self.BASE_URL, json={})
          assert resp.status_code == 400

      def test_get_nonexistent(self):
          resp = requests.get(f"{self.BASE_URL}/nonexistent-id")
          assert resp.status_code == 404

      def test_concurrent_update(self):
          # Create, then update concurrently
          from concurrent.futures import ThreadPoolExecutor
          order = requests.post(self.BASE_URL, json={"amount": 10}).json()
          def update(amount):
              return requests.put(f"{self.BASE_URL}/{order['id']}", json={"amount": amount})
          with ThreadPoolExecutor(max_workers=5) as pool:
              results = list(pool.map(update, range(5)))
          success = [r for r in results if r.status_code == 200]
          assert len(success) >= 1  # At least one succeeds
  ```
en_answer: |
  A CRUD API test strategy should cover several levels:

  **1. Functional Tests (Happy Path)**
  - CREATE: creation with valid data, verify response and persistence
  - READ: get existing resource, pagination, filtering
  - UPDATE: full and partial update (PUT vs PATCH)
  - DELETE: delete existing resource, verify 404 after deletion

  **2. Negative Tests**
  - Invalid data: empty fields, wrong types, overly long strings
  - Non-existent resources: GET/PUT/DELETE on non-existent ID → 404
  - Duplicates: repeated creation with unique fields → 409
  - Invalid format: malformed JSON, wrong Content-Type

  **3. Edge Cases**
  - Special characters: Unicode, emoji, SQL/NoSQL injection attempts
  - Large payloads: maximum document size
  - Concurrency: simultaneous updates to the same resource
  - Pagination: empty page, last page, negative offset

  **4. Security**
  - Authentication: requests without/with invalid token
  - Authorization: access to other users' resources
  - Rate limiting

  **5. Performance**
  - Response time under load
  - Behavior with large number of records

  ```python
  import pytest
  import requests

  class TestOrdersCRUD:
      BASE_URL = "http://api.example.com/orders"

      def test_create_order(self):
          payload = {"customerId": "123", "amount": 99.99}
          resp = requests.post(self.BASE_URL, json=payload)
          assert resp.status_code == 201
          assert resp.json()["customerId"] == "123"

      def test_create_order_missing_field(self):
          resp = requests.post(self.BASE_URL, json={})
          assert resp.status_code == 400

      def test_get_nonexistent(self):
          resp = requests.get(f"{self.BASE_URL}/nonexistent-id")
          assert resp.status_code == 404

      def test_concurrent_update(self):
          # Create, then update concurrently
          from concurrent.futures import ThreadPoolExecutor
          order = requests.post(self.BASE_URL, json={"amount": 10}).json()
          def update(amount):
              return requests.put(f"{self.BASE_URL}/{order['id']}", json={"amount": amount})
          with ThreadPoolExecutor(max_workers=5) as pool:
              results = list(pool.map(update, range(5)))
          success = [r for r in results if r.status_code == 200]
          assert len(success) >= 1  # At least one succeeds
  ```
tags: [testing, api, test-strategy]
order: 2
---
