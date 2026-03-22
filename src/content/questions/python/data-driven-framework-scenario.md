---
ua_question: "Як побудувати data-driven тестовий фреймворк з YAML/JSON?"
en_question: "How to build a data-driven test framework with YAML/JSON?"
ua_answer: |
  Data-driven тестування відокремлює тестову логіку від тестових даних. Дані зберігаються у зовнішніх файлах (YAML, JSON, CSV), а тести параметризуються цими даними. Це дозволяє нетехнічним членам команди додавати тест-кейси без зміни коду.

  **Архітектура:** файл даних описує вхідні параметри та очікувані результати, pytest parametrize або fixture завантажує дані, тест-функція -- це чистий шаблон без hardcoded значень.

  **Переваги:** легке додавання нових кейсів, читабельні тестові дані, розділення відповідальності, можливість генерації тестів з TMS (Test Management System).

  ```python
  # test_data/login_tests.yaml
  # ---
  # - id: valid_login
  #   description: "Login with valid credentials"
  #   input:
  #     username: "admin"
  #     password: "secret123"
  #   expected:
  #     status_code: 200
  #     has_token: true
  #
  # - id: invalid_password
  #   description: "Login with wrong password"
  #   input:
  #     username: "admin"
  #     password: "wrong"
  #   expected:
  #     status_code: 401
  #     error: "Invalid credentials"

  # Data loader utility
  import yaml
  import json
  from pathlib import Path
  from typing import Any

  def load_test_data(filename: str) -> list[dict[str, Any]]:
      path = Path(__file__).parent / "test_data" / filename
      if path.suffix in (".yaml", ".yml"):
          with open(path) as f:
              return yaml.safe_load(f)
      elif path.suffix == ".json":
          with open(path) as f:
              return json.load(f)
      raise ValueError(f"Unsupported format: {path.suffix}")

  def make_test_id(case: dict) -> str:
      return case.get("id", case.get("description", "unknown"))

  # Parametrized test using YAML data
  import pytest

  login_data = load_test_data("login_tests.yaml")

  @pytest.mark.parametrize(
      "case",
      login_data,
      ids=[make_test_id(c) for c in login_data]
  )
  def test_login(api_client, case):
      response = api_client.post("/login", json=case["input"])
      assert response.status_code == case["expected"]["status_code"]

      if case["expected"].get("has_token"):
          assert "token" in response.json()
      if "error" in case["expected"]:
          assert response.json()["error"] == case["expected"]["error"]

  # Advanced: custom pytest plugin for YAML test files
  # conftest.py
  def pytest_collect_file(parent, file_path):
      if file_path.suffix in (".yaml", ".yml") and file_path.name.startswith("test_"):
          return YamlFile.from_parent(parent, path=file_path)

  class YamlFile(pytest.File):
      def collect(self):
          data = yaml.safe_load(self.path.read_text())
          for case in data:
              yield YamlItem.from_parent(
                  self,
                  name=case["id"],
                  spec=case,
              )

  class YamlItem(pytest.Item):
      def __init__(self, name, parent, spec):
          super().__init__(name, parent)
          self.spec = spec

      def runtest(self):
          # Execute based on spec
          action = self.spec["action"]
          if action == "api_call":
              run_api_test(self.spec)
          elif action == "db_check":
              run_db_test(self.spec)

      def repr_failure(self, excinfo):
          return f"Test {self.name} failed: {excinfo.value}"

  # Schema validation for test data
  from pydantic import BaseModel, Field

  class TestCase(BaseModel):
      id: str
      description: str = ""
      input: dict
      expected: dict
      tags: list[str] = Field(default_factory=list)
      skip: bool = False
      skip_reason: str = ""

  def load_validated_data(filename: str) -> list[TestCase]:
      raw = load_test_data(filename)
      return [TestCase(**case) for case in raw]
  ```

  Рекомендації: валідуйте структуру тестових даних (pydantic, jsonschema), тримайте файли даних поруч з тестами, використовуйте YAML для людських даних та JSON для автоматично згенерованих, додавайте `id` до кожного кейсу для зрозумілих звітів, і версіонуйте тестові дані разом з кодом.
en_answer: |
  Data-driven testing separates test logic from test data. Data is stored in external files (YAML, JSON, CSV), and tests are parameterized with this data. This allows non-technical team members to add test cases without changing code.

  **Architecture:** the data file describes input parameters and expected results, pytest parametrize or fixture loads the data, the test function is a clean template without hardcoded values.

  **Advantages:** easy addition of new cases, readable test data, separation of concerns, ability to generate tests from TMS (Test Management System).

  ```python
  # test_data/login_tests.yaml
  # ---
  # - id: valid_login
  #   description: "Login with valid credentials"
  #   input:
  #     username: "admin"
  #     password: "secret123"
  #   expected:
  #     status_code: 200
  #     has_token: true
  #
  # - id: invalid_password
  #   description: "Login with wrong password"
  #   input:
  #     username: "admin"
  #     password: "wrong"
  #   expected:
  #     status_code: 401
  #     error: "Invalid credentials"

  # Data loader utility
  import yaml
  import json
  from pathlib import Path
  from typing import Any

  def load_test_data(filename: str) -> list[dict[str, Any]]:
      path = Path(__file__).parent / "test_data" / filename
      if path.suffix in (".yaml", ".yml"):
          with open(path) as f:
              return yaml.safe_load(f)
      elif path.suffix == ".json":
          with open(path) as f:
              return json.load(f)
      raise ValueError(f"Unsupported format: {path.suffix}")

  def make_test_id(case: dict) -> str:
      return case.get("id", case.get("description", "unknown"))

  # Parametrized test using YAML data
  import pytest

  login_data = load_test_data("login_tests.yaml")

  @pytest.mark.parametrize(
      "case",
      login_data,
      ids=[make_test_id(c) for c in login_data]
  )
  def test_login(api_client, case):
      response = api_client.post("/login", json=case["input"])
      assert response.status_code == case["expected"]["status_code"]

      if case["expected"].get("has_token"):
          assert "token" in response.json()
      if "error" in case["expected"]:
          assert response.json()["error"] == case["expected"]["error"]

  # Advanced: custom pytest plugin for YAML test files
  # conftest.py
  def pytest_collect_file(parent, file_path):
      if file_path.suffix in (".yaml", ".yml") and file_path.name.startswith("test_"):
          return YamlFile.from_parent(parent, path=file_path)

  class YamlFile(pytest.File):
      def collect(self):
          data = yaml.safe_load(self.path.read_text())
          for case in data:
              yield YamlItem.from_parent(
                  self,
                  name=case["id"],
                  spec=case,
              )

  class YamlItem(pytest.Item):
      def __init__(self, name, parent, spec):
          super().__init__(name, parent)
          self.spec = spec

      def runtest(self):
          # Execute based on spec
          action = self.spec["action"]
          if action == "api_call":
              run_api_test(self.spec)
          elif action == "db_check":
              run_db_test(self.spec)

      def repr_failure(self, excinfo):
          return f"Test {self.name} failed: {excinfo.value}"

  # Schema validation for test data
  from pydantic import BaseModel, Field

  class TestCase(BaseModel):
      id: str
      description: str = ""
      input: dict
      expected: dict
      tags: list[str] = Field(default_factory=list)
      skip: bool = False
      skip_reason: str = ""

  def load_validated_data(filename: str) -> list[TestCase]:
      raw = load_test_data(filename)
      return [TestCase(**case) for case in raw]
  ```

  Recommendations: validate test data structure (pydantic, jsonschema), keep data files next to tests, use YAML for human-authored data and JSON for auto-generated, add `id` to each case for clear reports, and version test data together with code.
section: "python"
order: 42
tags:
  - pytest
  - architecture
type: "practical"
---
