---
ua_question: "Як тестувати API з requests та httpx: сесії, auth, retries?"
en_question: "How to test APIs with requests and httpx: sessions, auth, retries?"
ua_answer: |
  **requests** -- синхронна бібліотека HTTP-запитів, де-факто стандарт для Python. **httpx** -- сучасна альтернатива з підтримкою async/await та HTTP/2. Обидві мають схожий API, але httpx краще підходить для async тестів.

  **Sessions** (requests) / **Client** (httpx) зберігають cookies, headers та connection pool між запитами, що швидше та зручніше для тестування API. **Auth** реалізується через вбудовані класи або кастомні обробники.

  **Retries** через `urllib3.Retry` (requests) або httpx transport забезпечують стійкість до тимчасових помилок мережі.

  ```python
  import requests
  import httpx
  from requests.adapters import HTTPAdapter
  from urllib3.util.retry import Retry

  # requests: Session for connection pooling and cookies
  session = requests.Session()
  session.headers.update({"Authorization": "Bearer token123"})
  session.verify = True  # SSL verification

  response = session.get("https://api.example.com/users")
  assert response.status_code == 200

  # requests: Retry strategy
  retry_strategy = Retry(
      total=3,
      backoff_factor=1,
      status_forcelist=[429, 500, 502, 503, 504],
      allowed_methods=["GET", "POST"],
  )
  adapter = HTTPAdapter(max_retries=retry_strategy)
  session.mount("https://", adapter)
  session.mount("http://", adapter)

  # requests: Custom auth
  from requests.auth import AuthBase

  class TokenAuth(AuthBase):
      def __init__(self, token):
          self.token = token

      def __call__(self, r):
          r.headers["Authorization"] = f"Bearer {self.token}"
          return r

  session.auth = TokenAuth("my-token")

  # httpx: Sync client
  with httpx.Client(
      base_url="https://api.example.com",
      headers={"X-API-Key": "key123"},
      timeout=30.0,
  ) as client:
      response = client.get("/users")
      assert response.status_code == 200

  # httpx: Async client
  async def test_async_api():
      async with httpx.AsyncClient(
          base_url="https://api.example.com",
          timeout=30.0,
      ) as client:
          response = await client.get("/users")
          assert response.status_code == 200

          # Concurrent requests
          responses = await asyncio.gather(
              client.get("/users/1"),
              client.get("/users/2"),
              client.get("/users/3"),
          )

  # Pytest fixture for API client
  import pytest

  @pytest.fixture(scope="session")
  def api_client():
      with httpx.Client(
          base_url="https://api.example.com",
          headers={"Authorization": "Bearer test-token"},
          timeout=10.0,
      ) as client:
          yield client

  def test_create_user(api_client):
      response = api_client.post("/users", json={
          "name": "Alice",
          "email": "alice@example.com"
      })
      assert response.status_code == 201
      data = response.json()
      assert data["name"] == "Alice"

  # Response validation with schema
  def test_user_schema(api_client):
      response = api_client.get("/users/1")
      data = response.json()
      assert isinstance(data["id"], int)
      assert isinstance(data["name"], str)
      assert "@" in data["email"]
  ```

  Для тестування API рекомендується: використовуйте session/client для повторного використання з'єднань, налаштуйте retry для flaky мережі, валідуйте не тільки status code, але й schema відповіді (pydantic, jsonschema), та ізолюйте тести через створення/видалення тестових даних.
en_answer: |
  **requests** is a synchronous HTTP library, the de facto standard for Python. **httpx** is a modern alternative with async/await support and HTTP/2. Both have similar APIs, but httpx is better suited for async tests.

  **Sessions** (requests) / **Client** (httpx) persist cookies, headers, and connection pools between requests, making API testing faster and more convenient. **Auth** is implemented through built-in classes or custom handlers.

  **Retries** via `urllib3.Retry` (requests) or httpx transport provide resilience to temporary network errors.

  ```python
  import requests
  import httpx
  from requests.adapters import HTTPAdapter
  from urllib3.util.retry import Retry

  # requests: Session for connection pooling and cookies
  session = requests.Session()
  session.headers.update({"Authorization": "Bearer token123"})
  session.verify = True  # SSL verification

  response = session.get("https://api.example.com/users")
  assert response.status_code == 200

  # requests: Retry strategy
  retry_strategy = Retry(
      total=3,
      backoff_factor=1,
      status_forcelist=[429, 500, 502, 503, 504],
      allowed_methods=["GET", "POST"],
  )
  adapter = HTTPAdapter(max_retries=retry_strategy)
  session.mount("https://", adapter)
  session.mount("http://", adapter)

  # requests: Custom auth
  from requests.auth import AuthBase

  class TokenAuth(AuthBase):
      def __init__(self, token):
          self.token = token

      def __call__(self, r):
          r.headers["Authorization"] = f"Bearer {self.token}"
          return r

  session.auth = TokenAuth("my-token")

  # httpx: Sync client
  with httpx.Client(
      base_url="https://api.example.com",
      headers={"X-API-Key": "key123"},
      timeout=30.0,
  ) as client:
      response = client.get("/users")
      assert response.status_code == 200

  # httpx: Async client
  async def test_async_api():
      async with httpx.AsyncClient(
          base_url="https://api.example.com",
          timeout=30.0,
      ) as client:
          response = await client.get("/users")
          assert response.status_code == 200

          # Concurrent requests
          responses = await asyncio.gather(
              client.get("/users/1"),
              client.get("/users/2"),
              client.get("/users/3"),
          )

  # Pytest fixture for API client
  import pytest

  @pytest.fixture(scope="session")
  def api_client():
      with httpx.Client(
          base_url="https://api.example.com",
          headers={"Authorization": "Bearer test-token"},
          timeout=10.0,
      ) as client:
          yield client

  def test_create_user(api_client):
      response = api_client.post("/users", json={
          "name": "Alice",
          "email": "alice@example.com"
      })
      assert response.status_code == 201
      data = response.json()
      assert data["name"] == "Alice"

  # Response validation with schema
  def test_user_schema(api_client):
      response = api_client.get("/users/1")
      data = response.json()
      assert isinstance(data["id"], int)
      assert isinstance(data["name"], str)
      assert "@" in data["email"]
  ```

  For API testing it is recommended to: use session/client for connection reuse, configure retry for flaky networks, validate not only status code but also response schema (pydantic, jsonschema), and isolate tests through creation/deletion of test data.
section: "python"
order: 35
tags:
  - api-testing
  - http
type: "basic"
---
