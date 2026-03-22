---
ua_question: "Як інтегрувати Allure з pytest: декоратори, кроки, вкладення?"
en_question: "How to integrate Allure with pytest: decorators, steps, attachments?"
ua_answer: |
  **Allure** -- це фреймворк для створення детальних та візуально привабливих звітів тестування. Інтеграція з pytest через плагін `allure-pytest` дозволяє додавати метадані, кроки, вкладення та категоризацію тестів.

  **Декоратори** додають метадані: `@allure.title`, `@allure.description`, `@allure.severity`, `@allure.feature`, `@allure.story`. Це структурує звіт за функціональними областями та пріоритетами.

  **Steps** (`@allure.step` або `with allure.step()`) розбивають тест на логічні кроки, що відображаються у звіті. **Attachments** дозволяють додавати скріншоти, логи, JSON-відповіді до звіту.

  ```python
  import allure
  import pytest

  # Decorators for test metadata
  @allure.epic("User Management")
  @allure.feature("Authentication")
  @allure.story("Login")
  @allure.severity(allure.severity_level.CRITICAL)
  @allure.title("Successful login with valid credentials")
  def test_login_success(api_client):
      with allure.step("Send login request"):
          response = api_client.post("/login", json={
              "username": "admin",
              "password": "secret"
          })

      with allure.step("Verify response status"):
          assert response.status_code == 200

      with allure.step("Verify token in response"):
          data = response.json()
          assert "token" in data
          allure.attach(
              str(data),
              name="Response body",
              attachment_type=allure.attachment_type.JSON
          )

  # Step as decorator
  @allure.step("Create user with name: {name}")
  def create_user(name, role="user"):
      # step parameters are shown in report
      return {"name": name, "role": role}

  # Attachments
  @allure.feature("UI Testing")
  def test_screenshot_on_failure(page):
      try:
          page.click("#submit")
          assert page.title() == "Success"
      except AssertionError:
          allure.attach(
              page.screenshot(),
              name="failure_screenshot",
              attachment_type=allure.attachment_type.PNG
          )
          raise

  # Dynamic title and description
  def test_dynamic_info():
      allure.dynamic.title("Dynamic test title")
      allure.dynamic.description("Generated at runtime")
      allure.dynamic.tag("regression", "smoke")
      allure.dynamic.severity(allure.severity_level.MINOR)

  # Links to issues and test cases
  @allure.link("https://jira.example.com/browse/PROJ-123")
  @allure.issue("PROJ-456")
  @allure.testcase("TC-789")
  def test_with_links():
      ...

  # Parametrize with allure IDs
  @pytest.mark.parametrize("role,expected", [
      pytest.param("admin", True, id="admin-access"),
      pytest.param("viewer", False, id="viewer-denied"),
  ])
  @allure.feature("Authorization")
  def test_access(role, expected):
      allure.dynamic.title(f"Access check for {role}")
      assert check_access(role) == expected

  # conftest.py: auto-attach logs on failure
  @pytest.hookimpl(tryfirst=True, hookwrapper=True)
  def pytest_runtest_makereport(item, call):
      outcome = yield
      report = outcome.get_result()
      if report.when == "call" and report.failed:
          allure.attach(
              get_test_logs(),
              name="test_logs",
              attachment_type=allure.attachment_type.TEXT
          )
  ```

  Команди для роботи з Allure: `pytest --alluredir=allure-results` для генерації результатів, `allure serve allure-results` для локального перегляду, `allure generate allure-results -o allure-report` для статичного звіту. В CI інтегруйте через Allure Jenkins/GitLab плагін.
en_answer: |
  **Allure** is a framework for creating detailed and visually appealing test reports. Integration with pytest via the `allure-pytest` plugin allows adding metadata, steps, attachments, and test categorization.

  **Decorators** add metadata: `@allure.title`, `@allure.description`, `@allure.severity`, `@allure.feature`, `@allure.story`. This structures the report by functional areas and priorities.

  **Steps** (`@allure.step` or `with allure.step()`) break a test into logical steps displayed in the report. **Attachments** allow adding screenshots, logs, JSON responses to the report.

  ```python
  import allure
  import pytest

  # Decorators for test metadata
  @allure.epic("User Management")
  @allure.feature("Authentication")
  @allure.story("Login")
  @allure.severity(allure.severity_level.CRITICAL)
  @allure.title("Successful login with valid credentials")
  def test_login_success(api_client):
      with allure.step("Send login request"):
          response = api_client.post("/login", json={
              "username": "admin",
              "password": "secret"
          })

      with allure.step("Verify response status"):
          assert response.status_code == 200

      with allure.step("Verify token in response"):
          data = response.json()
          assert "token" in data
          allure.attach(
              str(data),
              name="Response body",
              attachment_type=allure.attachment_type.JSON
          )

  # Step as decorator
  @allure.step("Create user with name: {name}")
  def create_user(name, role="user"):
      # step parameters are shown in report
      return {"name": name, "role": role}

  # Attachments
  @allure.feature("UI Testing")
  def test_screenshot_on_failure(page):
      try:
          page.click("#submit")
          assert page.title() == "Success"
      except AssertionError:
          allure.attach(
              page.screenshot(),
              name="failure_screenshot",
              attachment_type=allure.attachment_type.PNG
          )
          raise

  # Dynamic title and description
  def test_dynamic_info():
      allure.dynamic.title("Dynamic test title")
      allure.dynamic.description("Generated at runtime")
      allure.dynamic.tag("regression", "smoke")
      allure.dynamic.severity(allure.severity_level.MINOR)

  # Links to issues and test cases
  @allure.link("https://jira.example.com/browse/PROJ-123")
  @allure.issue("PROJ-456")
  @allure.testcase("TC-789")
  def test_with_links():
      ...

  # Parametrize with allure IDs
  @pytest.mark.parametrize("role,expected", [
      pytest.param("admin", True, id="admin-access"),
      pytest.param("viewer", False, id="viewer-denied"),
  ])
  @allure.feature("Authorization")
  def test_access(role, expected):
      allure.dynamic.title(f"Access check for {role}")
      assert check_access(role) == expected

  # conftest.py: auto-attach logs on failure
  @pytest.hookimpl(tryfirst=True, hookwrapper=True)
  def pytest_runtest_makereport(item, call):
      outcome = yield
      report = outcome.get_result()
      if report.when == "call" and report.failed:
          allure.attach(
              get_test_logs(),
              name="test_logs",
              attachment_type=allure.attachment_type.TEXT
          )
  ```

  Commands for working with Allure: `pytest --alluredir=allure-results` for generating results, `allure serve allure-results` for local viewing, `allure generate allure-results -o allure-report` for a static report. In CI integrate via the Allure Jenkins/GitLab plugin.
section: "python"
order: 34
tags:
  - pytest
  - reporting
type: "basic"
---
