---
ua_question: "Як спроектувати ієрархію fixtures для DB + API + UI тестів?"
en_question: "How to design a fixture hierarchy for DB + API + UI tests?"
ua_answer: |
  При проектуванні тестового фреймворку з різними рівнями (DB, API, UI) ключове -- правильна ієрархія fixtures з відповідними scope та чітким розділенням відповідальності.

  **Принципи:** session-scope для дорогих ресурсів (з'єднання з БД, браузер), module/class-scope для тестових даних, function-scope для ізоляції. Fixtures повинні утворювати ланцюг залежностей: DB → API client → UI page.

  **Стратегія очищення:** transaction rollback для DB (найшвидший), API cleanup через DELETE endpoints, UI -- не потребує окремого cleanup, якщо DB відкочена.

  ```python
  # tests/conftest.py -- root level
  import pytest

  @pytest.fixture(scope="session")
  def app_config():
      return {
          "db_url": "postgresql://test:test@localhost/test_db",
          "api_url": "http://localhost:8080",
          "browser": "chromium",
      }

  @pytest.fixture(scope="session")
  def db_engine(app_config):
      from sqlalchemy import create_engine
      engine = create_engine(app_config["db_url"])
      yield engine
      engine.dispose()

  @pytest.fixture(scope="session")
  def db_schema(db_engine):
      """Create tables once per session."""
      Base.metadata.create_all(db_engine)
      yield
      Base.metadata.drop_all(db_engine)

  @pytest.fixture
  def db_session(db_engine, db_schema):
      """Transaction-isolated session per test."""
      connection = db_engine.connect()
      transaction = connection.begin()
      session = Session(bind=connection)
      yield session
      session.close()
      transaction.rollback()
      connection.close()

  # tests/fixtures/factories.py
  @pytest.fixture
  def make_user(db_session):
      def _make(name="Alice", email=None, role="user"):
          email = email or f"{name.lower()}@test.com"
          user = User(name=name, email=email, role=role)
          db_session.add(user)
          db_session.flush()  # get ID without committing
          return user
      return _make

  @pytest.fixture
  def admin_user(make_user):
      return make_user(name="Admin", role="admin")

  # tests/integration/conftest.py -- API level
  @pytest.fixture(scope="session")
  def api_client(app_config):
      import httpx
      with httpx.Client(
          base_url=app_config["api_url"],
          timeout=10.0,
      ) as client:
          yield client

  @pytest.fixture
  def auth_client(api_client, admin_user):
      """API client authenticated as admin."""
      response = api_client.post("/auth/login", json={
          "email": admin_user.email,
          "password": "admin123",
      })
      token = response.json()["token"]
      api_client.headers["Authorization"] = f"Bearer {token}"
      yield api_client
      del api_client.headers["Authorization"]

  # tests/e2e/conftest.py -- UI level
  @pytest.fixture(scope="session")
  def browser(app_config):
      from playwright.sync_api import sync_playwright
      pw = sync_playwright().start()
      browser = pw.chromium.launch(headless=True)
      yield browser
      browser.close()
      pw.stop()

  @pytest.fixture
  def page(browser, app_config, admin_user):
      """Authenticated browser page."""
      page = browser.new_page()
      page.goto(f"{app_config['api_url']}/login")
      page.fill("#email", admin_user.email)
      page.fill("#password", "admin123")
      page.click("#login-btn")
      page.wait_for_url("**/dashboard")
      yield page
      page.close()

  # tests/integration/test_users.py
  def test_create_user_api(auth_client, db_session):
      response = auth_client.post("/api/users", json={
          "name": "Bob", "email": "bob@test.com"
      })
      assert response.status_code == 201
      # Verify in DB
      user = db_session.query(User).filter_by(email="bob@test.com").first()
      assert user is not None

  # tests/e2e/test_user_flow.py
  def test_create_user_ui(page, db_session):
      page.goto("/users/new")
      page.fill("#name", "Charlie")
      page.fill("#email", "charlie@test.com")
      page.click("#save")
      page.wait_for_selector(".success-message")
      # Verify in DB
      assert db_session.query(User).filter_by(name="Charlie").count() == 1
  ```

  Ключові принципи: мінімізуйте scope дорогих ресурсів (session для DB engine, function для session), використовуйте factory fixtures замість фіксованих даних, завжди очищуйте через rollback (не DELETE), і тримайте UI fixtures тонкими -- бізнес-логіка тестується на API рівні.
en_answer: |
  When designing a test framework with different levels (DB, API, UI), the key is a proper fixture hierarchy with appropriate scopes and clear separation of responsibilities.

  **Principles:** session-scope for expensive resources (DB connections, browser), module/class-scope for test data, function-scope for isolation. Fixtures should form a dependency chain: DB -> API client -> UI page.

  **Cleanup strategy:** transaction rollback for DB (fastest), API cleanup via DELETE endpoints, UI -- does not need separate cleanup if DB is rolled back.

  ```python
  # tests/conftest.py -- root level
  import pytest

  @pytest.fixture(scope="session")
  def app_config():
      return {
          "db_url": "postgresql://test:test@localhost/test_db",
          "api_url": "http://localhost:8080",
          "browser": "chromium",
      }

  @pytest.fixture(scope="session")
  def db_engine(app_config):
      from sqlalchemy import create_engine
      engine = create_engine(app_config["db_url"])
      yield engine
      engine.dispose()

  @pytest.fixture(scope="session")
  def db_schema(db_engine):
      """Create tables once per session."""
      Base.metadata.create_all(db_engine)
      yield
      Base.metadata.drop_all(db_engine)

  @pytest.fixture
  def db_session(db_engine, db_schema):
      """Transaction-isolated session per test."""
      connection = db_engine.connect()
      transaction = connection.begin()
      session = Session(bind=connection)
      yield session
      session.close()
      transaction.rollback()
      connection.close()

  # tests/fixtures/factories.py
  @pytest.fixture
  def make_user(db_session):
      def _make(name="Alice", email=None, role="user"):
          email = email or f"{name.lower()}@test.com"
          user = User(name=name, email=email, role=role)
          db_session.add(user)
          db_session.flush()  # get ID without committing
          return user
      return _make

  @pytest.fixture
  def admin_user(make_user):
      return make_user(name="Admin", role="admin")

  # tests/integration/conftest.py -- API level
  @pytest.fixture(scope="session")
  def api_client(app_config):
      import httpx
      with httpx.Client(
          base_url=app_config["api_url"],
          timeout=10.0,
      ) as client:
          yield client

  @pytest.fixture
  def auth_client(api_client, admin_user):
      """API client authenticated as admin."""
      response = api_client.post("/auth/login", json={
          "email": admin_user.email,
          "password": "admin123",
      })
      token = response.json()["token"]
      api_client.headers["Authorization"] = f"Bearer {token}"
      yield api_client
      del api_client.headers["Authorization"]

  # tests/e2e/conftest.py -- UI level
  @pytest.fixture(scope="session")
  def browser(app_config):
      from playwright.sync_api import sync_playwright
      pw = sync_playwright().start()
      browser = pw.chromium.launch(headless=True)
      yield browser
      browser.close()
      pw.stop()

  @pytest.fixture
  def page(browser, app_config, admin_user):
      """Authenticated browser page."""
      page = browser.new_page()
      page.goto(f"{app_config['api_url']}/login")
      page.fill("#email", admin_user.email)
      page.fill("#password", "admin123")
      page.click("#login-btn")
      page.wait_for_url("**/dashboard")
      yield page
      page.close()

  # tests/integration/test_users.py
  def test_create_user_api(auth_client, db_session):
      response = auth_client.post("/api/users", json={
          "name": "Bob", "email": "bob@test.com"
      })
      assert response.status_code == 201
      # Verify in DB
      user = db_session.query(User).filter_by(email="bob@test.com").first()
      assert user is not None

  # tests/e2e/test_user_flow.py
  def test_create_user_ui(page, db_session):
      page.goto("/users/new")
      page.fill("#name", "Charlie")
      page.fill("#email", "charlie@test.com")
      page.click("#save")
      page.wait_for_selector(".success-message")
      # Verify in DB
      assert db_session.query(User).filter_by(name="Charlie").count() == 1
  ```

  Key principles: minimize scope of expensive resources (session for DB engine, function for session), use factory fixtures instead of fixed data, always clean up via rollback (not DELETE), and keep UI fixtures thin -- business logic is tested at the API level.
section: "python"
order: 38
tags:
  - pytest
  - architecture
type: "practical"
---
