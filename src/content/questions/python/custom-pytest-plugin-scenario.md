---
ua_question: "Як написати кастомний pytest плагін?"
en_question: "How to write a custom pytest plugin?"
ua_answer: |
  pytest плагіни розширюють функціональність через систему хуків (hooks). Плагін може бути локальним (в `conftest.py`), пакетом в проекті, або PyPI-пакетом для спільного використання.

  **Hooks** -- це функції з певними іменами, які pytest викликає на різних етапах: збирання тестів (`pytest_collection_modifyitems`), виконання (`pytest_runtest_protocol`), звітування (`pytest_terminal_summary`). Плагін реєструє хуки та може додавати fixtures, CLI опції, маркери.

  Для PyPI-плагіна потрібен entry point `pytest11` в `pyproject.toml`, щоб pytest автоматично знаходив плагін.

  ```python
  # Simple plugin: auto-retry flaky tests
  # File: conftest.py or pytest_retry_plugin.py

  import pytest
  import time

  def pytest_addoption(parser):
      """Add CLI options."""
      parser.addoption(
          "--retry", type=int, default=0,
          help="Retry failed tests N times"
      )
      parser.addoption(
          "--retry-delay", type=float, default=0.5,
          help="Delay between retries in seconds"
      )

  def pytest_configure(config):
      """Register custom markers."""
      config.addinivalue_line(
          "markers",
          "flaky(retries=N): mark test as flaky with N retries"
      )

  @pytest.hookimpl(tryfirst=True)
  def pytest_runtest_protocol(item, nextitem):
      """Retry failed tests."""
      # Get retry count from marker or CLI
      marker = item.get_closest_marker("flaky")
      if marker:
          retries = marker.kwargs.get("retries", 3)
      else:
          retries = item.config.getoption("--retry")

      if retries == 0:
          return None  # use default protocol

      delay = item.config.getoption("--retry-delay")

      for attempt in range(retries + 1):
          reports = run_test(item)
          if all(r.passed for r in reports if r.when == "call"):
              break
          if attempt < retries:
              time.sleep(delay)
              item.config.hook.pytest_report_teststatus(
                  report=reports[-1], config=item.config
              )
      return True  # prevent default protocol

  # Plugin: add environment info to report
  def pytest_terminal_summary(terminalreporter, config):
      """Add custom section to terminal output."""
      terminalreporter.section("Environment")
      import platform
      terminalreporter.write_line(f"Python: {platform.python_version()}")
      terminalreporter.write_line(f"OS: {platform.system()} {platform.release()}")

  # Plugin: custom test ordering
  def pytest_collection_modifyitems(config, items):
      """Run smoke tests first, then fast, then slow."""
      priority = {"smoke": 0, "fast": 1, "slow": 2}

      def get_priority(item):
          for marker_name, p in priority.items():
              if marker_name in [m.name for m in item.iter_markers()]:
                  return p
          return 1

      items.sort(key=get_priority)

  # Plugin: auto-attach test metadata
  @pytest.hookimpl(hookwrapper=True)
  def pytest_runtest_makereport(item, call):
      outcome = yield
      report = outcome.get_result()
      # Add custom properties to report
      if report.when == "call":
          report.user_properties.append(("duration", call.duration))
          if hasattr(item, "callspec"):
              report.user_properties.append(
                  ("params", str(item.callspec.params))
              )

  # Installable plugin: pyproject.toml
  # [project.entry-points.pytest11]
  # my_plugin = "my_plugin.plugin"
  #
  # Then in my_plugin/plugin.py:
  # def pytest_configure(config): ...
  # def pytest_addoption(parser): ...
  ```

  Для розробки плагіну: починайте з `conftest.py`, перевірте з `pytest --co` (collection only) та `pytest -p no:cacheprovider` (відключення плагінів). Використовуйте `pytester` fixture для тестування самого плагіну. Документація хуків: `pytest --help` та офіційний reference.
en_answer: |
  pytest plugins extend functionality through a hook system. A plugin can be local (in `conftest.py`), a package within the project, or a PyPI package for shared use.

  **Hooks** are functions with specific names that pytest calls at various stages: test collection (`pytest_collection_modifyitems`), execution (`pytest_runtest_protocol`), reporting (`pytest_terminal_summary`). A plugin registers hooks and can add fixtures, CLI options, markers.

  For a PyPI plugin, a `pytest11` entry point in `pyproject.toml` is needed so pytest automatically discovers the plugin.

  ```python
  # Simple plugin: auto-retry flaky tests
  # File: conftest.py or pytest_retry_plugin.py

  import pytest
  import time

  def pytest_addoption(parser):
      """Add CLI options."""
      parser.addoption(
          "--retry", type=int, default=0,
          help="Retry failed tests N times"
      )
      parser.addoption(
          "--retry-delay", type=float, default=0.5,
          help="Delay between retries in seconds"
      )

  def pytest_configure(config):
      """Register custom markers."""
      config.addinivalue_line(
          "markers",
          "flaky(retries=N): mark test as flaky with N retries"
      )

  @pytest.hookimpl(tryfirst=True)
  def pytest_runtest_protocol(item, nextitem):
      """Retry failed tests."""
      # Get retry count from marker or CLI
      marker = item.get_closest_marker("flaky")
      if marker:
          retries = marker.kwargs.get("retries", 3)
      else:
          retries = item.config.getoption("--retry")

      if retries == 0:
          return None  # use default protocol

      delay = item.config.getoption("--retry-delay")

      for attempt in range(retries + 1):
          reports = run_test(item)
          if all(r.passed for r in reports if r.when == "call"):
              break
          if attempt < retries:
              time.sleep(delay)
              item.config.hook.pytest_report_teststatus(
                  report=reports[-1], config=item.config
              )
      return True  # prevent default protocol

  # Plugin: add environment info to report
  def pytest_terminal_summary(terminalreporter, config):
      """Add custom section to terminal output."""
      terminalreporter.section("Environment")
      import platform
      terminalreporter.write_line(f"Python: {platform.python_version()}")
      terminalreporter.write_line(f"OS: {platform.system()} {platform.release()}")

  # Plugin: custom test ordering
  def pytest_collection_modifyitems(config, items):
      """Run smoke tests first, then fast, then slow."""
      priority = {"smoke": 0, "fast": 1, "slow": 2}

      def get_priority(item):
          for marker_name, p in priority.items():
              if marker_name in [m.name for m in item.iter_markers()]:
                  return p
          return 1

      items.sort(key=get_priority)

  # Plugin: auto-attach test metadata
  @pytest.hookimpl(hookwrapper=True)
  def pytest_runtest_makereport(item, call):
      outcome = yield
      report = outcome.get_result()
      # Add custom properties to report
      if report.when == "call":
          report.user_properties.append(("duration", call.duration))
          if hasattr(item, "callspec"):
              report.user_properties.append(
                  ("params", str(item.callspec.params))
              )

  # Installable plugin: pyproject.toml
  # [project.entry-points.pytest11]
  # my_plugin = "my_plugin.plugin"
  #
  # Then in my_plugin/plugin.py:
  # def pytest_configure(config): ...
  # def pytest_addoption(parser): ...
  ```

  For plugin development: start with `conftest.py`, verify with `pytest --co` (collection only) and `pytest -p no:cacheprovider` (disable plugins). Use the `pytester` fixture for testing the plugin itself. Hook documentation: `pytest --help` and official reference.
section: "python"
order: 41
tags:
  - pytest
  - plugins
type: "practical"
---
