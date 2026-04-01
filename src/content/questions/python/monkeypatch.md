---
ua_question: "Як працює monkeypatch у pytest: підміна функцій, env vars, атрибутів?"
en_question: "How does monkeypatch work in pytest: substituting functions, env vars, attributes?"
ua_answer: |
  `monkeypatch` — вбудована pytest fixture для тимчасової підміни об'єктів, функцій, атрибутів, змінних середовища та системних шляхів. Після завершення тесту всі зміни автоматично відкочуються — не потрібно вручну зберігати оригінал.

  Основні методи: `monkeypatch.setattr(obj, name, value)` підмінює атрибут або метод; `monkeypatch.delattr` видаляє атрибут; `monkeypatch.setenv` / `monkeypatch.delenv` керують змінними середовища; `monkeypatch.syspath_prepend` додає шлях до `sys.path`; `monkeypatch.chdir` змінює поточний каталог.

  Ключова відмінність від `unittest.mock.patch`: monkeypatch не створює Mock-об'єктів — він підмінює реальними значеннями або функціями. Для перевірки викликів (call count, args) все одно потрібен `unittest.mock.MagicMock`.

  ```python
  import pytest
  import os

  # Підміна функції в модулі
  def test_get_user(monkeypatch):
      def mock_fetch(user_id):
          return {"id": user_id, "name": "Test User"}

      monkeypatch.setattr("myapp.api.fetch_user", mock_fetch)
      result = get_user(42)
      assert result["name"] == "Test User"

  # Підміна методу класу
  class PaymentGateway:
      def charge(self, amount):
          # real HTTP call
          ...

  def test_payment(monkeypatch):
      monkeypatch.setattr(PaymentGateway, "charge", lambda self, amount: True)
      gw = PaymentGateway()
      assert gw.charge(100) is True

  # Підміна env vars
  def test_config_from_env(monkeypatch):
      monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
      monkeypatch.delenv("SECRET_KEY", raising=False)  # не кидати якщо не існує
      config = load_config()
      assert config.db_url == "sqlite:///:memory:"

  # Підміна вбудованих функцій
  def test_input(monkeypatch):
      monkeypatch.setattr("builtins.input", lambda _: "yes")
      result = ask_confirmation()
      assert result is True

  # Підміна атрибуту модуля (константа)
  import myapp.settings as settings

  def test_with_debug_mode(monkeypatch):
      monkeypatch.setattr(settings, "DEBUG", True)
      assert settings.DEBUG is True
  # після тесту settings.DEBUG повернеться до оригінального значення

  # Комбінація з MagicMock для перевірки викликів
  from unittest.mock import MagicMock

  def test_sends_email(monkeypatch):
      mock_send = MagicMock(return_value=True)
      monkeypatch.setattr("myapp.notifications.send_email", mock_send)
      notify_user(user_id=1)
      mock_send.assert_called_once_with(to="user@example.com", subject="Welcome")
  ```

  Scope monkeypatch за замовчуванням — `function`, тобто зміни живуть лише один тест. Для session-wide підмін існує `monkeypatch` з `scope="session"` через власну fixture-обгортку. Перевага перед `unittest.mock.patch` — читабельніший синтаксис без контекстних менеджерів або декораторів.
en_answer: |
  `monkeypatch` is a built-in pytest fixture for temporarily replacing objects, functions, attributes, environment variables, and system paths. All changes are automatically rolled back after the test ends — no manual saving of the original is needed.

  Main methods: `monkeypatch.setattr(obj, name, value)` replaces an attribute or method; `monkeypatch.delattr` removes an attribute; `monkeypatch.setenv` / `monkeypatch.delenv` manage environment variables; `monkeypatch.syspath_prepend` adds a path to `sys.path`; `monkeypatch.chdir` changes the current directory.

  Key difference from `unittest.mock.patch`: monkeypatch does not create Mock objects — it replaces with real values or functions. To verify calls (call count, args) you still need `unittest.mock.MagicMock`.

  ```python
  import pytest
  import os

  # Replace a function in a module
  def test_get_user(monkeypatch):
      def mock_fetch(user_id):
          return {"id": user_id, "name": "Test User"}

      monkeypatch.setattr("myapp.api.fetch_user", mock_fetch)
      result = get_user(42)
      assert result["name"] == "Test User"

  # Replace a class method
  class PaymentGateway:
      def charge(self, amount):
          # real HTTP call
          ...

  def test_payment(monkeypatch):
      monkeypatch.setattr(PaymentGateway, "charge", lambda self, amount: True)
      gw = PaymentGateway()
      assert gw.charge(100) is True

  # Replace env vars
  def test_config_from_env(monkeypatch):
      monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
      monkeypatch.delenv("SECRET_KEY", raising=False)  # don't raise if absent
      config = load_config()
      assert config.db_url == "sqlite:///:memory:"

  # Replace built-in functions
  def test_input(monkeypatch):
      monkeypatch.setattr("builtins.input", lambda _: "yes")
      result = ask_confirmation()
      assert result is True

  # Replace a module-level attribute (constant)
  import myapp.settings as settings

  def test_with_debug_mode(monkeypatch):
      monkeypatch.setattr(settings, "DEBUG", True)
      assert settings.DEBUG is True
  # after the test, settings.DEBUG reverts to its original value

  # Combine with MagicMock for call verification
  from unittest.mock import MagicMock

  def test_sends_email(monkeypatch):
      mock_send = MagicMock(return_value=True)
      monkeypatch.setattr("myapp.notifications.send_email", mock_send)
      notify_user(user_id=1)
      mock_send.assert_called_once_with(to="user@example.com", subject="Welcome")
  ```

  The monkeypatch scope defaults to `function`, meaning changes live only for one test. For session-wide substitutions, wrap monkeypatch in a custom session-scoped fixture. The advantage over `unittest.mock.patch` is more readable syntax without context managers or decorators.
section: "python"
order: 43
tags:
  - pytest
  - mocking
  - fixtures
type: "basic"
---
