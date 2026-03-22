---
ua_question: "Як працюють pytest fixtures: scope, autouse, parametrize, factory?"
en_question: "How do pytest fixtures work: scope, autouse, parametrize, factory?"
ua_answer: |
  Fixtures -- це основний механізм pytest для setup/teardown та dependency injection. Fixture -- це функція з декоратором `@pytest.fixture`, яка надає тестам дані або ресурси. Pytest автоматично інжектить fixtures за іменем параметра тесту.

  **Scope** визначає життєвий цикл: `function` (за замовчуванням, створюється для кожного тесту), `class`, `module`, `package`, `session` (один раз за всю сесію). Вибір scope впливає на швидкість та ізоляцію.

  **autouse=True** автоматично застосовує fixture до всіх тестів у scope без явного запиту. **Parametrize** на fixture рівні запускає всі залежні тести для кожного параметра. **Factory pattern** -- fixture повертає функцію для створення об'єктів з кастомними параметрами.

  ```python
  import pytest

  # Basic fixture with teardown (yield)
  @pytest.fixture
  def db_connection():
      conn = create_connection("test_db")
      yield conn
      conn.close()  # teardown

  def test_query(db_connection):
      result = db_connection.execute("SELECT 1")
      assert result == 1

  # Fixture scopes
  @pytest.fixture(scope="session")
  def app():
      """Created once per test session."""
      return create_app(testing=True)

  @pytest.fixture(scope="module")
  def api_client(app):
      """Created once per test module."""
      return app.test_client()

  # autouse -- applies to all tests automatically
  @pytest.fixture(autouse=True)
  def reset_db(db_connection):
      yield
      db_connection.rollback()

  # Parametrized fixture
  @pytest.fixture(params=["chrome", "firefox", "safari"])
  def browser(request):
      driver = create_driver(request.param)
      yield driver
      driver.quit()

  def test_login(browser):
      # runs 3 times: chrome, firefox, safari
      browser.get("/login")
      assert browser.title == "Login"

  # Factory fixture
  @pytest.fixture
  def make_user(db_connection):
      created = []

      def _make_user(name="Alice", age=30, **kwargs):
          user = User(name=name, age=age, **kwargs)
          db_connection.add(user)
          created.append(user)
          return user

      yield _make_user

      # cleanup
      for user in created:
          db_connection.delete(user)

  def test_multiple_users(make_user):
      admin = make_user(name="Admin", role="admin")
      user = make_user(name="User", role="viewer")
      assert admin.role != user.role

  # Request fixture for dynamic behavior
  @pytest.fixture
  def tmp_file(request, tmp_path):
      ext = getattr(request, "param", ".txt")
      filepath = tmp_path / f"test{ext}"
      filepath.write_text("test content")
      return filepath
  ```

  Fixtures утворюють DAG (directed acyclic graph) залежностей -- pytest автоматично розв'язує порядок створення та teardown (LIFO). Використовуйте `yield` для teardown замість `addfinalizer` -- це читабельніше і підтримує exception handling.
en_answer: |
  Fixtures are pytest's primary mechanism for setup/teardown and dependency injection. A fixture is a function with the `@pytest.fixture` decorator that provides tests with data or resources. Pytest automatically injects fixtures by test parameter name.

  **Scope** defines the lifecycle: `function` (default, created for each test), `class`, `module`, `package`, `session` (once per entire session). Scope choice affects speed and isolation.

  **autouse=True** automatically applies the fixture to all tests in scope without explicit request. **Parametrize** at fixture level runs all dependent tests for each parameter. **Factory pattern** -- fixture returns a function for creating objects with custom parameters.

  ```python
  import pytest

  # Basic fixture with teardown (yield)
  @pytest.fixture
  def db_connection():
      conn = create_connection("test_db")
      yield conn
      conn.close()  # teardown

  def test_query(db_connection):
      result = db_connection.execute("SELECT 1")
      assert result == 1

  # Fixture scopes
  @pytest.fixture(scope="session")
  def app():
      """Created once per test session."""
      return create_app(testing=True)

  @pytest.fixture(scope="module")
  def api_client(app):
      """Created once per test module."""
      return app.test_client()

  # autouse -- applies to all tests automatically
  @pytest.fixture(autouse=True)
  def reset_db(db_connection):
      yield
      db_connection.rollback()

  # Parametrized fixture
  @pytest.fixture(params=["chrome", "firefox", "safari"])
  def browser(request):
      driver = create_driver(request.param)
      yield driver
      driver.quit()

  def test_login(browser):
      # runs 3 times: chrome, firefox, safari
      browser.get("/login")
      assert browser.title == "Login"

  # Factory fixture
  @pytest.fixture
  def make_user(db_connection):
      created = []

      def _make_user(name="Alice", age=30, **kwargs):
          user = User(name=name, age=age, **kwargs)
          db_connection.add(user)
          created.append(user)
          return user

      yield _make_user

      # cleanup
      for user in created:
          db_connection.delete(user)

  def test_multiple_users(make_user):
      admin = make_user(name="Admin", role="admin")
      user = make_user(name="User", role="viewer")
      assert admin.role != user.role

  # Request fixture for dynamic behavior
  @pytest.fixture
  def tmp_file(request, tmp_path):
      ext = getattr(request, "param", ".txt")
      filepath = tmp_path / f"test{ext}"
      filepath.write_text("test content")
      return filepath
  ```

  Fixtures form a DAG (directed acyclic graph) of dependencies -- pytest automatically resolves creation order and teardown (LIFO). Use `yield` for teardown instead of `addfinalizer` -- it is more readable and supports exception handling.
section: "python"
order: 28
tags:
  - pytest
  - fixtures
type: "basic"
---
