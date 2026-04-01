---
company: "lyft"
stage: "build-framework-from-scratch"
ua_question: "Побудуй тестовий фреймворк для REST API з нуля. Напиши 10 тестів різної складності для заданого API."
en_question: "Build a test framework for a REST API from scratch. Write 10 tests of varying complexity for a given API."
ua_answer: |
  **Структура фреймворку:**
  ```
  tests/
  ├── conftest.py          # фікстури, конфігурація
  ├── api/
  │   ├── client.py        # HTTP-клієнт обгортка
  │   └── endpoints.py     # ендпоінти як методи
  ├── models/
  │   └── schemas.py       # Pydantic моделі для валідації
  ├── utils/
  │   ├── assertions.py    # кастомні ассерти
  │   └── data_gen.py      # генерація тестових даних
  └── tests/
      ├── test_crud.py     # CRUD операції
      ├── test_auth.py     # авторизація
      └── test_edge.py     # граничні випадки
  ```

  **API клієнт:**
  ```python
  import requests
  from dataclasses import dataclass

  @dataclass
  class APIResponse:
      status: int
      json: dict
      elapsed_ms: float

  class APIClient:
      def __init__(self, base_url: str, token: str = None):
          self.base = base_url.rstrip("/")
          self.session = requests.Session()
          if token:
              self.session.headers["Authorization"] = f"Bearer {token}"

      def get(self, path: str, **kwargs) -> APIResponse:
          r = self.session.get(f"{self.base}{path}", **kwargs)
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)

      def post(self, path: str, json: dict = None, **kwargs) -> APIResponse:
          r = self.session.post(f"{self.base}{path}", json=json, **kwargs)
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)

      def put(self, path: str, json: dict = None, **kwargs) -> APIResponse:
          r = self.session.put(f"{self.base}{path}", json=json, **kwargs)
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)

      def delete(self, path: str, **kwargs) -> APIResponse:
          r = self.session.delete(f"{self.base}{path}")
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)
  ```

  **10 тестів різної складності:**
  ```python
  import pytest
  from api.client import APIClient

  @pytest.fixture
  def api():
      return APIClient("https://api.example.com/v1", token="test-token")

  @pytest.fixture
  def created_user(api):
      resp = api.post("/users", json={"name": "Test", "email": "test@test.com"})
      yield resp.json["id"]
      api.delete(f"/users/{resp.json['id']}")

  # 1. Smoke — API доступний
  def test_health_check(api):
      resp = api.get("/health")
      assert resp.status == 200

  # 2. CRUD — створення ресурсу
  def test_create_user(api):
      resp = api.post("/users", json={"name": "John", "email": "john@test.com"})
      assert resp.status == 201
      assert resp.json["name"] == "John"

  # 3. CRUD — читання
  def test_get_user(api, created_user):
      resp = api.get(f"/users/{created_user}")
      assert resp.status == 200
      assert resp.json["id"] == created_user

  # 4. Валідація — невалідні дані
  def test_create_user_invalid_email(api):
      resp = api.post("/users", json={"name": "John", "email": "not-an-email"})
      assert resp.status == 422

  # 5. Авторизація — без токена
  def test_unauthorized_access():
      client = APIClient("https://api.example.com/v1")  # без токена
      resp = client.get("/users")
      assert resp.status == 401

  # 6. Ідемпотентність — повторне створення
  def test_duplicate_email(api, created_user):
      resp = api.post("/users", json={"name": "Dup", "email": "test@test.com"})
      assert resp.status == 409

  # 7. Пагінація
  def test_pagination(api):
      resp = api.get("/users?page=1&limit=5")
      assert resp.status == 200
      assert len(resp.json["items"]) <= 5
      assert "total" in resp.json

  # 8. Оновлення — часткове
  def test_partial_update(api, created_user):
      resp = api.put(f"/users/{created_user}", json={"name": "Updated"})
      assert resp.status == 200
      assert resp.json["name"] == "Updated"

  # 9. Видалення + перевірка
  def test_delete_and_verify(api):
      create = api.post("/users", json={"name": "Del", "email": "del@test.com"})
      user_id = create.json["id"]
      api.delete(f"/users/{user_id}")
      resp = api.get(f"/users/{user_id}")
      assert resp.status == 404

  # 10. Перформанс — час відповіді
  def test_response_time(api):
      resp = api.get("/users")
      assert resp.elapsed_ms < 500, f"Too slow: {resp.elapsed_ms}ms"
  ```

  **На що звернути увагу:**
  - Шарова архітектура: client → endpoints → tests
  - Фікстури з cleanup (yield)
  - Різні рівні: smoke, CRUD, validation, auth, edge cases, performance
en_answer: |
  **Framework structure:**
  ```
  tests/
  ├── conftest.py          # fixtures, configuration
  ├── api/
  │   ├── client.py        # HTTP client wrapper
  │   └── endpoints.py     # endpoints as methods
  ├── models/
  │   └── schemas.py       # Pydantic models for validation
  ├── utils/
  │   ├── assertions.py    # custom assertions
  │   └── data_gen.py      # test data generation
  └── tests/
      ├── test_crud.py     # CRUD operations
      ├── test_auth.py     # authorization
      └── test_edge.py     # edge cases
  ```

  **API Client:**
  ```python
  import requests
  from dataclasses import dataclass

  @dataclass
  class APIResponse:
      status: int
      json: dict
      elapsed_ms: float

  class APIClient:
      def __init__(self, base_url: str, token: str = None):
          self.base = base_url.rstrip("/")
          self.session = requests.Session()
          if token:
              self.session.headers["Authorization"] = f"Bearer {token}"

      def get(self, path: str, **kwargs) -> APIResponse:
          r = self.session.get(f"{self.base}{path}", **kwargs)
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)

      def post(self, path: str, json: dict = None, **kwargs) -> APIResponse:
          r = self.session.post(f"{self.base}{path}", json=json, **kwargs)
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)

      def put(self, path: str, json: dict = None, **kwargs) -> APIResponse:
          r = self.session.put(f"{self.base}{path}", json=json, **kwargs)
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)

      def delete(self, path: str, **kwargs) -> APIResponse:
          r = self.session.delete(f"{self.base}{path}")
          return APIResponse(r.status_code, r.json(), r.elapsed.total_seconds() * 1000)
  ```

  **10 tests of varying complexity:**
  ```python
  import pytest
  from api.client import APIClient

  @pytest.fixture
  def api():
      return APIClient("https://api.example.com/v1", token="test-token")

  @pytest.fixture
  def created_user(api):
      resp = api.post("/users", json={"name": "Test", "email": "test@test.com"})
      yield resp.json["id"]
      api.delete(f"/users/{resp.json['id']}")

  # 1. Smoke — API is available
  def test_health_check(api):
      resp = api.get("/health")
      assert resp.status == 200

  # 2. CRUD — create resource
  def test_create_user(api):
      resp = api.post("/users", json={"name": "John", "email": "john@test.com"})
      assert resp.status == 201
      assert resp.json["name"] == "John"

  # 3. CRUD — read
  def test_get_user(api, created_user):
      resp = api.get(f"/users/{created_user}")
      assert resp.status == 200
      assert resp.json["id"] == created_user

  # 4. Validation — invalid data
  def test_create_user_invalid_email(api):
      resp = api.post("/users", json={"name": "John", "email": "not-an-email"})
      assert resp.status == 422

  # 5. Authorization — no token
  def test_unauthorized_access():
      client = APIClient("https://api.example.com/v1")  # no token
      resp = client.get("/users")
      assert resp.status == 401

  # 6. Idempotency — duplicate creation
  def test_duplicate_email(api, created_user):
      resp = api.post("/users", json={"name": "Dup", "email": "test@test.com"})
      assert resp.status == 409

  # 7. Pagination
  def test_pagination(api):
      resp = api.get("/users?page=1&limit=5")
      assert resp.status == 200
      assert len(resp.json["items"]) <= 5
      assert "total" in resp.json

  # 8. Partial update
  def test_partial_update(api, created_user):
      resp = api.put(f"/users/{created_user}", json={"name": "Updated"})
      assert resp.status == 200
      assert resp.json["name"] == "Updated"

  # 9. Delete + verify
  def test_delete_and_verify(api):
      create = api.post("/users", json={"name": "Del", "email": "del@test.com"})
      user_id = create.json["id"]
      api.delete(f"/users/{user_id}")
      resp = api.get(f"/users/{user_id}")
      assert resp.status == 404

  # 10. Performance — response time
  def test_response_time(api):
      resp = api.get("/users")
      assert resp.elapsed_ms < 500, f"Too slow: {resp.elapsed_ms}ms"
  ```

  **Key points:**
  - Layered architecture: client → endpoints → tests
  - Fixtures with cleanup (yield)
  - Different levels: smoke, CRUD, validation, auth, edge cases, performance
tags: [framework, api-testing, pytest, python, architecture]
order: 3
---
