---
ua_question: "В чому різниця між unittest.mock та monkeypatch?"
en_question: "What is the difference between unittest.mock and monkeypatch?"
ua_answer: |
  **unittest.mock** (модуль `unittest.mock`) -- це потужна бібліотека для створення моків, стабів та спай-об'єктів. Основні класи: `Mock`, `MagicMock`, `patch`. Підтримує автоматичне відстеження викликів, налаштування return_value та side_effect.

  **monkeypatch** -- це вбудована pytest fixture для тимчасової заміни атрибутів, змінних середовища та елементів словника. Простіший API, автоматичний rollback після тесту, але менше можливостей для assertion'ів.

  Правило: `monkeypatch` для простих замін (env vars, config), `unittest.mock` для складних сценаріїв (перевірка викликів, side effects, async моки).

  ```python
  import pytest
  from unittest.mock import Mock, MagicMock, patch, AsyncMock

  # monkeypatch -- simple attribute replacement
  def test_env_variable(monkeypatch):
      monkeypatch.setenv("API_KEY", "test-key")
      assert os.environ["API_KEY"] == "test-key"
      # automatically restored after test

  def test_replace_function(monkeypatch):
      monkeypatch.setattr("myapp.services.send_email", lambda *a: None)
      # send_email is now a no-op

  # unittest.mock -- Mock objects
  def test_with_mock():
      api = Mock()
      api.get_user.return_value = {"name": "Alice"}

      result = api.get_user(42)
      assert result == {"name": "Alice"}
      api.get_user.assert_called_once_with(42)

  # patch -- temporarily replace in specific module
  @patch("myapp.services.requests.get")
  def test_api_call(mock_get):
      mock_get.return_value.status_code = 200
      mock_get.return_value.json.return_value = {"data": "test"}

      result = fetch_data("http://api.example.com")
      assert result == {"data": "test"}
      mock_get.assert_called_once()

  # patch as context manager
  def test_with_context():
      with patch("myapp.db.connection") as mock_conn:
          mock_conn.execute.return_value = [{"id": 1}]
          result = get_users()
          assert len(result) == 1

  # side_effect -- dynamic behavior
  def test_side_effect():
      mock = Mock()
      mock.side_effect = [1, 2, ValueError("error")]

      assert mock() == 1
      assert mock() == 2
      with pytest.raises(ValueError):
          mock()

  # AsyncMock for async code
  @pytest.mark.asyncio
  async def test_async_mock():
      mock_fetch = AsyncMock(return_value={"status": "ok"})

      result = await mock_fetch("url")
      assert result == {"status": "ok"}

  # spec -- restrict mock to real interface
  def test_with_spec():
      mock = Mock(spec=UserService)
      mock.get_user.return_value = User("Alice")
      # mock.nonexistent_method()  # AttributeError!

  # monkeypatch dict
  def test_config(monkeypatch):
      monkeypatch.setitem(app_config, "debug", True)
      monkeypatch.delitem(app_config, "secret", raising=False)
  ```

  Антипатерн: надмірне мокування -- якщо тест моком замінює більшість логіки, він тестує лише моки, а не реальний код. Використовуйте моки для зовнішніх залежностей (API, DB, email), а не для внутрішньої логіки.
en_answer: |
  **unittest.mock** (the `unittest.mock` module) is a powerful library for creating mocks, stubs, and spy objects. Main classes: `Mock`, `MagicMock`, `patch`. Supports automatic call tracking, configuring return_value and side_effect.

  **monkeypatch** is a built-in pytest fixture for temporarily replacing attributes, environment variables, and dictionary items. Simpler API, automatic rollback after test, but fewer assertion capabilities.

  Rule: `monkeypatch` for simple replacements (env vars, config), `unittest.mock` for complex scenarios (call verification, side effects, async mocks).

  ```python
  import pytest
  from unittest.mock import Mock, MagicMock, patch, AsyncMock

  # monkeypatch -- simple attribute replacement
  def test_env_variable(monkeypatch):
      monkeypatch.setenv("API_KEY", "test-key")
      assert os.environ["API_KEY"] == "test-key"
      # automatically restored after test

  def test_replace_function(monkeypatch):
      monkeypatch.setattr("myapp.services.send_email", lambda *a: None)
      # send_email is now a no-op

  # unittest.mock -- Mock objects
  def test_with_mock():
      api = Mock()
      api.get_user.return_value = {"name": "Alice"}

      result = api.get_user(42)
      assert result == {"name": "Alice"}
      api.get_user.assert_called_once_with(42)

  # patch -- temporarily replace in specific module
  @patch("myapp.services.requests.get")
  def test_api_call(mock_get):
      mock_get.return_value.status_code = 200
      mock_get.return_value.json.return_value = {"data": "test"}

      result = fetch_data("http://api.example.com")
      assert result == {"data": "test"}
      mock_get.assert_called_once()

  # patch as context manager
  def test_with_context():
      with patch("myapp.db.connection") as mock_conn:
          mock_conn.execute.return_value = [{"id": 1}]
          result = get_users()
          assert len(result) == 1

  # side_effect -- dynamic behavior
  def test_side_effect():
      mock = Mock()
      mock.side_effect = [1, 2, ValueError("error")]

      assert mock() == 1
      assert mock() == 2
      with pytest.raises(ValueError):
          mock()

  # AsyncMock for async code
  @pytest.mark.asyncio
  async def test_async_mock():
      mock_fetch = AsyncMock(return_value={"status": "ok"})

      result = await mock_fetch("url")
      assert result == {"status": "ok"}

  # spec -- restrict mock to real interface
  def test_with_spec():
      mock = Mock(spec=UserService)
      mock.get_user.return_value = User("Alice")
      # mock.nonexistent_method()  # AttributeError!

  # monkeypatch dict
  def test_config(monkeypatch):
      monkeypatch.setitem(app_config, "debug", True)
      monkeypatch.delitem(app_config, "secret", raising=False)
  ```

  Anti-pattern: excessive mocking -- if a test replaces most logic with mocks, it only tests the mocks, not the real code. Use mocks for external dependencies (API, DB, email), not for internal logic.
section: "python"
order: 32
tags:
  - pytest
  - mocking
type: "basic"
---
