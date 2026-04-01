---
ua_question: "Як налаштувати pytest через pytest.ini та pyproject.toml?"
en_question: "How do you configure pytest via pytest.ini and pyproject.toml?"
ua_answer: |
  pytest підтримує конфігурацію через кілька файлів: `pytest.ini`, `pyproject.toml` (секція `[tool.pytest.ini_options]`), `setup.cfg` (секція `[tool:pytest]`), та `conftest.py`. pytest.ini і pyproject.toml є пріоритетними — вони визначають кореневу директорію проєкту.

  Ключові параметри: `testpaths` — де шукати тести; `addopts` — прапорці, що додаються автоматично до кожного запуску; `markers` — реєстрація кастомних маркерів (без цього `--strict-markers` падатиме); `filterwarnings` — контроль над попередженнями; `log_cli` — виведення логів у реальному часі під час тестів.

  ```ini
  # pytest.ini (найпростіший формат)
  [pytest]
  testpaths = tests
  addopts =
      -v
      --tb=short
      --strict-markers
      -p no:warnings
  markers =
      smoke: critical path tests
      regression: regression test suite
      slow: tests taking more than 1 second
      integration: tests requiring external services
  log_cli = true
  log_cli_level = INFO
  log_format = %(asctime)s %(levelname)s %(message)s
  filterwarnings =
      error
      ignore::DeprecationWarning:somelib
  ```

  ```toml
  # pyproject.toml (рекомендований сучасний формат)
  [tool.pytest.ini_options]
  testpaths = ["tests", "integration_tests"]
  addopts = [
      "-v",
      "--tb=short",
      "--strict-markers",
      "--cov=myapp",
      "--cov-report=term-missing",
  ]
  markers = [
      "smoke: critical path tests",
      "regression: regression test suite",
      "slow: tests taking more than 1 second",
      "integration: tests requiring external services",
  ]
  log_cli = true
  log_cli_level = "INFO"
  asyncio_mode = "auto"
  filterwarnings = [
      "error",
      "ignore::DeprecationWarning:somelib",
  ]

  # Виключення із збору тестів
  norecursedirs = [
      ".git", ".tox", "dist", "build",
      "node_modules", ".venv", "__pycache__",
  ]

  # Мінімальна версія pytest
  minversion = "7.0"
  ```

  ```python
  # conftest.py — програмна конфігурація
  import pytest

  def pytest_configure(config):
      """Реєстрація маркерів програмно."""
      config.addinivalue_line("markers", "flaky: known intermittent failures")

  def pytest_collection_modifyitems(items, config):
      """Автоматично додати маркер slow для тестів в slow/ директорії."""
      for item in items:
          if "slow" in str(item.fspath):
              item.add_marker(pytest.mark.slow)

  # pytest --co -q  # показати зібрані тести без запуску
  # pytest --markers  # список всіх маркерів
  # pytest --fixtures  # список всіх fixtures
  ```

  Гарна практика: завжди реєструйте маркери і запускайте з `--strict-markers` — це ловить опечатки в іменах маркерів. `addopts = --tb=short` скорочує вивід при невеликих помилках, `--tb=long` дає повний traceback для складних проблем.
en_answer: |
  pytest supports configuration via several files: `pytest.ini`, `pyproject.toml` (section `[tool.pytest.ini_options]`), `setup.cfg` (section `[tool:pytest]`), and `conftest.py`. pytest.ini and pyproject.toml are preferred — they define the project root directory.

  Key settings: `testpaths` — where to look for tests; `addopts` — flags added automatically to every run; `markers` — custom marker registration (without this, `--strict-markers` will fail); `filterwarnings` — warning control; `log_cli` — real-time log output during tests.

  ```ini
  # pytest.ini (simplest format)
  [pytest]
  testpaths = tests
  addopts =
      -v
      --tb=short
      --strict-markers
      -p no:warnings
  markers =
      smoke: critical path tests
      regression: regression test suite
      slow: tests taking more than 1 second
      integration: tests requiring external services
  log_cli = true
  log_cli_level = INFO
  log_format = %(asctime)s %(levelname)s %(message)s
  filterwarnings =
      error
      ignore::DeprecationWarning:somelib
  ```

  ```toml
  # pyproject.toml (recommended modern format)
  [tool.pytest.ini_options]
  testpaths = ["tests", "integration_tests"]
  addopts = [
      "-v",
      "--tb=short",
      "--strict-markers",
      "--cov=myapp",
      "--cov-report=term-missing",
  ]
  markers = [
      "smoke: critical path tests",
      "regression: regression test suite",
      "slow: tests taking more than 1 second",
      "integration: tests requiring external services",
  ]
  log_cli = true
  log_cli_level = "INFO"
  asyncio_mode = "auto"
  filterwarnings = [
      "error",
      "ignore::DeprecationWarning:somelib",
  ]

  # Exclude from test collection
  norecursedirs = [
      ".git", ".tox", "dist", "build",
      "node_modules", ".venv", "__pycache__",
  ]

  # Minimum pytest version
  minversion = "7.0"
  ```

  ```python
  # conftest.py -- programmatic configuration
  import pytest

  def pytest_configure(config):
      """Register markers programmatically."""
      config.addinivalue_line("markers", "flaky: known intermittent failures")

  def pytest_collection_modifyitems(items, config):
      """Auto-add slow marker for tests in slow/ directory."""
      for item in items:
          if "slow" in str(item.fspath):
              item.add_marker(pytest.mark.slow)

  # pytest --co -q  # show collected tests without running
  # pytest --markers  # list all markers
  # pytest --fixtures  # list all fixtures
  ```

  Best practice: always register markers and run with `--strict-markers` — it catches typos in marker names. `addopts = --tb=short` shortens output for small failures; `--tb=long` gives a full traceback for complex problems.
section: "python"
order: 46
tags:
  - pytest
  - configuration
type: "basic"
---
