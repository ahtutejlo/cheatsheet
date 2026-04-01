---
ua_question: "Як тестувати async код з pytest-asyncio?"
en_question: "How do you test async code with pytest-asyncio?"
ua_answer: |
  `pytest-asyncio` — плагін для тестування асинхронного коду (async/await) у pytest. Без нього async тест-функція не запускається коректно: pytest не знає, що це корутина. Плагін запускає кожен тест у власному event loop.

  **Режими роботи:** `asyncio_mode = "auto"` (у pytest.ini) автоматично виявляє async тести без декораторів. `asyncio_mode = "strict"` (за замовчуванням) вимагає явного `@pytest.mark.asyncio` на кожному тесті. Async fixtures позначаються `@pytest_asyncio.fixture`.

  Важливо: не змішуйте sync та async fixtures без уваги до event loop — async fixture не може бути надана sync тесту. `pytest-anyio` — альтернатива для роботи з Trio та іншими backend'ами.

  ```python
  # pip install pytest-asyncio

  # pytest.ini або pyproject.toml
  # [pytest]
  # asyncio_mode = auto

  import pytest
  import pytest_asyncio
  import asyncio
  import httpx

  # Простий async тест
  @pytest.mark.asyncio
  async def test_async_function():
      result = await some_async_operation()
      assert result == expected

  # З asyncio_mode = auto — декоратор не потрібен
  async def test_auto_mode():
      await asyncio.sleep(0)
      assert True

  # Async fixture
  @pytest_asyncio.fixture
  async def async_client():
      async with httpx.AsyncClient(base_url="http://testserver") as client:
          yield client

  async def test_api_call(async_client):
      response = await async_client.get("/health")
      assert response.status_code == 200

  # Async fixture з scope
  @pytest_asyncio.fixture(scope="session")
  async def db_pool():
      pool = await create_pool(DSN)
      yield pool
      await pool.close()

  # Тестування виключень у async коді
  async def test_raises_on_timeout():
      with pytest.raises(asyncio.TimeoutError):
          await asyncio.wait_for(slow_operation(), timeout=0.1)

  # Тестування кількох корутин одночасно
  async def test_concurrent():
      results = await asyncio.gather(
          fetch("https://api.example.com/a"),
          fetch("https://api.example.com/b"),
      )
      assert all(r.status == 200 for r in results)

  # Мокування async функцій
  from unittest.mock import AsyncMock, patch

  async def test_with_async_mock():
      with patch("myapp.service.fetch_data", new_callable=AsyncMock) as mock:
          mock.return_value = {"status": "ok"}
          result = await process()
          assert result["status"] == "ok"
          mock.assert_awaited_once()
  ```

  Типова помилка: використання `unittest.mock.MagicMock` для async функцій — він не підтримує `await`. Завжди використовуйте `AsyncMock` для підміни корутин. У Python 3.8+ `AsyncMock` вбудований у `unittest.mock`.
en_answer: |
  `pytest-asyncio` is a plugin for testing async/await code in pytest. Without it, an async test function doesn't run correctly: pytest doesn't know it's a coroutine. The plugin runs each test in its own event loop.

  **Modes:** `asyncio_mode = "auto"` (in pytest.ini) auto-discovers async tests without decorators. `asyncio_mode = "strict"` (default) requires explicit `@pytest.mark.asyncio` on each test. Async fixtures are marked with `@pytest_asyncio.fixture`.

  Important: don't mix sync and async fixtures carelessly — async fixtures cannot be provided to sync tests. `pytest-anyio` is an alternative for Trio and other backends.

  ```python
  # pip install pytest-asyncio

  # pytest.ini or pyproject.toml
  # [pytest]
  # asyncio_mode = auto

  import pytest
  import pytest_asyncio
  import asyncio
  import httpx

  # Simple async test
  @pytest.mark.asyncio
  async def test_async_function():
      result = await some_async_operation()
      assert result == expected

  # With asyncio_mode = auto -- no decorator needed
  async def test_auto_mode():
      await asyncio.sleep(0)
      assert True

  # Async fixture
  @pytest_asyncio.fixture
  async def async_client():
      async with httpx.AsyncClient(base_url="http://testserver") as client:
          yield client

  async def test_api_call(async_client):
      response = await async_client.get("/health")
      assert response.status_code == 200

  # Async fixture with scope
  @pytest_asyncio.fixture(scope="session")
  async def db_pool():
      pool = await create_pool(DSN)
      yield pool
      await pool.close()

  # Testing exceptions in async code
  async def test_raises_on_timeout():
      with pytest.raises(asyncio.TimeoutError):
          await asyncio.wait_for(slow_operation(), timeout=0.1)

  # Testing multiple coroutines concurrently
  async def test_concurrent():
      results = await asyncio.gather(
          fetch("https://api.example.com/a"),
          fetch("https://api.example.com/b"),
      )
      assert all(r.status == 200 for r in results)

  # Mocking async functions
  from unittest.mock import AsyncMock, patch

  async def test_with_async_mock():
      with patch("myapp.service.fetch_data", new_callable=AsyncMock) as mock:
          mock.return_value = {"status": "ok"}
          result = await process()
          assert result["status"] == "ok"
          mock.assert_awaited_once()
  ```

  A common mistake: using `unittest.mock.MagicMock` for async functions — it doesn't support `await`. Always use `AsyncMock` for coroutine substitutions. In Python 3.8+, `AsyncMock` is built into `unittest.mock`.
section: "python"
order: 45
tags:
  - pytest
  - async
  - fixtures
type: "basic"
---
