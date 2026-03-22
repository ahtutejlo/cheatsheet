---
ua_question: "Як працює conftest.py та коли що туди класти?"
en_question: "How does conftest.py hierarchy work and when to put what there?"
ua_answer: |
  `conftest.py` -- це спеціальний файл pytest для спільних fixtures, hooks та plugins. Pytest автоматично збирає всі `conftest.py` від кореня проекту до директорії тесту. Fixtures з `conftest.py` доступні всім тестам у тій самій директорії та піддиректоріях без імпорту.

  **Ієрархія:** fixtures з нижчого рівня перекривають fixtures з вищого рівня (за іменем). Це дозволяє мати загальну конфігурацію на рівні проекту та спеціалізовану -- на рівні модуля.

  **Що класти в conftest.py:** fixtures (особливо спільні), hooks (`pytest_configure`, `pytest_collection_modifyitems`), custom markers, plugin imports. **Чого НЕ класти:** тести, бізнес-логіку, утилітні функції (для них створіть окремий модуль).

  ```python
  # Project structure
  # tests/
  #   conftest.py          <- session-level fixtures, hooks
  #   unit/
  #     conftest.py        <- unit test fixtures
  #     test_models.py
  #   integration/
  #     conftest.py        <- integration fixtures (DB, API)
  #     test_api.py
  #   e2e/
  #     conftest.py        <- browser fixtures
  #     test_flows.py

  # tests/conftest.py -- root level
  import pytest

  def pytest_configure(config):
      """Register custom markers."""
      config.addinivalue_line("markers", "slow: mark test as slow")
      config.addinivalue_line("markers", "integration: integration test")

  @pytest.fixture(scope="session")
  def app_config():
      return {"env": "test", "debug": True}

  @pytest.fixture(scope="session")
  def base_url(app_config):
      return "http://localhost:8080"

  # tests/integration/conftest.py -- integration level
  import pytest

  @pytest.fixture(scope="module")
  def db(app_config):
      """Database connection for integration tests."""
      conn = create_db(app_config["db_url"])
      yield conn
      conn.drop_all()

  @pytest.fixture(autouse=True)
  def clean_tables(db):
      """Auto-cleanup after each test."""
      yield
      db.rollback()

  # tests/e2e/conftest.py -- e2e level
  import pytest

  @pytest.fixture(scope="session")
  def browser():
      from playwright.sync_api import sync_playwright
      pw = sync_playwright().start()
      browser = pw.chromium.launch(headless=True)
      yield browser
      browser.close()
      pw.stop()

  @pytest.fixture
  def page(browser, base_url):
      page = browser.new_page()
      page.goto(base_url)
      yield page
      page.close()

  # Override fixtures at lower level
  # tests/unit/conftest.py
  @pytest.fixture
  def db():
      """Unit tests use mock DB instead of real one."""
      return MockDatabase()

  # Hooks in conftest
  def pytest_collection_modifyitems(items):
      """Auto-mark slow tests."""
      for item in items:
          if "e2e" in str(item.fspath):
              item.add_marker(pytest.mark.slow)
  ```

  Практичні правила: session-scope fixtures (app, DB pool, browser) -- в кореневому conftest. Module-scope fixtures -- в conftest директорії тестів. autouse fixtures для cleanup -- на відповідному рівні. Не створюйте один гігантський conftest -- розділяйте за рівнями.
en_answer: |
  `conftest.py` is a special pytest file for shared fixtures, hooks, and plugins. Pytest automatically collects all `conftest.py` files from the project root to the test directory. Fixtures from `conftest.py` are available to all tests in the same directory and subdirectories without importing.

  **Hierarchy:** fixtures from a lower level override fixtures from a higher level (by name). This allows having general configuration at the project level and specialized configuration at the module level.

  **What to put in conftest.py:** fixtures (especially shared ones), hooks (`pytest_configure`, `pytest_collection_modifyitems`), custom markers, plugin imports. **What NOT to put:** tests, business logic, utility functions (create a separate module for those).

  ```python
  # Project structure
  # tests/
  #   conftest.py          <- session-level fixtures, hooks
  #   unit/
  #     conftest.py        <- unit test fixtures
  #     test_models.py
  #   integration/
  #     conftest.py        <- integration fixtures (DB, API)
  #     test_api.py
  #   e2e/
  #     conftest.py        <- browser fixtures
  #     test_flows.py

  # tests/conftest.py -- root level
  import pytest

  def pytest_configure(config):
      """Register custom markers."""
      config.addinivalue_line("markers", "slow: mark test as slow")
      config.addinivalue_line("markers", "integration: integration test")

  @pytest.fixture(scope="session")
  def app_config():
      return {"env": "test", "debug": True}

  @pytest.fixture(scope="session")
  def base_url(app_config):
      return "http://localhost:8080"

  # tests/integration/conftest.py -- integration level
  import pytest

  @pytest.fixture(scope="module")
  def db(app_config):
      """Database connection for integration tests."""
      conn = create_db(app_config["db_url"])
      yield conn
      conn.drop_all()

  @pytest.fixture(autouse=True)
  def clean_tables(db):
      """Auto-cleanup after each test."""
      yield
      db.rollback()

  # tests/e2e/conftest.py -- e2e level
  import pytest

  @pytest.fixture(scope="session")
  def browser():
      from playwright.sync_api import sync_playwright
      pw = sync_playwright().start()
      browser = pw.chromium.launch(headless=True)
      yield browser
      browser.close()
      pw.stop()

  @pytest.fixture
  def page(browser, base_url):
      page = browser.new_page()
      page.goto(base_url)
      yield page
      page.close()

  # Override fixtures at lower level
  # tests/unit/conftest.py
  @pytest.fixture
  def db():
      """Unit tests use mock DB instead of real one."""
      return MockDatabase()

  # Hooks in conftest
  def pytest_collection_modifyitems(items):
      """Auto-mark slow tests."""
      for item in items:
          if "e2e" in str(item.fspath):
              item.add_marker(pytest.mark.slow)
  ```

  Practical rules: session-scope fixtures (app, DB pool, browser) -- in the root conftest. Module-scope fixtures -- in the test directory conftest. autouse fixtures for cleanup -- at the appropriate level. Do not create one giant conftest -- split by levels.
section: "python"
order: 29
tags:
  - pytest
  - architecture
type: "basic"
---
