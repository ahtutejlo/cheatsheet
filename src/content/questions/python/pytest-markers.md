---
ua_question: "Як працюють маркери pytest: skip, xfail, custom?"
en_question: "How do pytest markers work: skip, xfail, custom?"
ua_answer: |
  Маркери (markers) -- це спосіб додати метадані до тестів для контролю їх виконання. Вбудовані маркери керують пропуском та очікуваними помилками, а кастомні -- дозволяють фільтрувати та групувати тести.

  **skip** -- безумовно пропускає тест. **skipif** -- пропускає за умовою (версія Python, ОС, залежності). **xfail** -- тест, який очікувано падає (known bug, not yet implemented). Якщо xfail тест раптом проходить -- це `XPASS`, що може бути помилкою або сигналом видалити маркер.

  Кастомні маркери реєструються в `pytest.ini` або `conftest.py` і використовуються для фільтрації через `-m` прапорець.

  ```python
  import pytest
  import sys

  # skip -- always skip
  @pytest.mark.skip(reason="Not implemented yet")
  def test_future_feature():
      ...

  # skipif -- conditional skip
  @pytest.mark.skipif(
      sys.platform == "win32",
      reason="Unix-only test"
  )
  def test_unix_permissions():
      ...

  @pytest.mark.skipif(
      sys.version_info < (3, 11),
      reason="Requires Python 3.11+ TaskGroup"
  )
  def test_task_group():
      ...

  # Runtime skip
  def test_database():
      if not is_db_available():
          pytest.skip("Database not available")
      ...

  # xfail -- expected failure
  @pytest.mark.xfail(reason="Bug #123 not fixed yet")
  def test_known_bug():
      assert broken_function() == expected

  @pytest.mark.xfail(raises=ZeroDivisionError)
  def test_division_bug():
      1 / 0

  @pytest.mark.xfail(strict=True)
  def test_must_fail():
      # If this passes, the test FAILS (XPASS -> FAIL)
      assert False

  # Custom markers
  @pytest.mark.slow
  def test_heavy_computation():
      ...

  @pytest.mark.integration
  def test_api_endpoint():
      ...

  @pytest.mark.smoke
  def test_health_check():
      ...

  # Register markers in conftest.py or pytest.ini
  # [pytest]
  # markers =
  #     slow: marks tests as slow
  #     integration: integration tests
  #     smoke: smoke tests

  # Run specific markers:
  # pytest -m "smoke"
  # pytest -m "not slow"
  # pytest -m "integration and not slow"

  # Marker with parameters
  @pytest.mark.timeout(10)
  def test_with_timeout():
      ...

  # Apply marker to entire module
  pytestmark = pytest.mark.integration

  # Apply marker to class
  @pytest.mark.slow
  class TestHeavyOperations:
      def test_compute(self):
          ...
      def test_render(self):
          ...
  ```

  Маркери допомагають організувати тестовий набір: запускати тільки smoke тести в CI pipeline, пропускати повільні тести під час розробки, відслідковувати відомі баги через xfail. Завжди реєструйте кастомні маркери -- `--strict-markers` попередить про невідомі маркери.
en_answer: |
  Markers are a way to add metadata to tests to control their execution. Built-in markers control skipping and expected failures, while custom markers allow filtering and grouping tests.

  **skip** -- unconditionally skips a test. **skipif** -- skips based on condition (Python version, OS, dependencies). **xfail** -- a test that is expected to fail (known bug, not yet implemented). If an xfail test unexpectedly passes -- this is `XPASS`, which can be a mistake or a signal to remove the marker.

  Custom markers are registered in `pytest.ini` or `conftest.py` and used for filtering via the `-m` flag.

  ```python
  import pytest
  import sys

  # skip -- always skip
  @pytest.mark.skip(reason="Not implemented yet")
  def test_future_feature():
      ...

  # skipif -- conditional skip
  @pytest.mark.skipif(
      sys.platform == "win32",
      reason="Unix-only test"
  )
  def test_unix_permissions():
      ...

  @pytest.mark.skipif(
      sys.version_info < (3, 11),
      reason="Requires Python 3.11+ TaskGroup"
  )
  def test_task_group():
      ...

  # Runtime skip
  def test_database():
      if not is_db_available():
          pytest.skip("Database not available")
      ...

  # xfail -- expected failure
  @pytest.mark.xfail(reason="Bug #123 not fixed yet")
  def test_known_bug():
      assert broken_function() == expected

  @pytest.mark.xfail(raises=ZeroDivisionError)
  def test_division_bug():
      1 / 0

  @pytest.mark.xfail(strict=True)
  def test_must_fail():
      # If this passes, the test FAILS (XPASS -> FAIL)
      assert False

  # Custom markers
  @pytest.mark.slow
  def test_heavy_computation():
      ...

  @pytest.mark.integration
  def test_api_endpoint():
      ...

  @pytest.mark.smoke
  def test_health_check():
      ...

  # Register markers in conftest.py or pytest.ini
  # [pytest]
  # markers =
  #     slow: marks tests as slow
  #     integration: integration tests
  #     smoke: smoke tests

  # Run specific markers:
  # pytest -m "smoke"
  # pytest -m "not slow"
  # pytest -m "integration and not slow"

  # Marker with parameters
  @pytest.mark.timeout(10)
  def test_with_timeout():
      ...

  # Apply marker to entire module
  pytestmark = pytest.mark.integration

  # Apply marker to class
  @pytest.mark.slow
  class TestHeavyOperations:
      def test_compute(self):
          ...
      def test_render(self):
          ...
  ```

  Markers help organize the test suite: run only smoke tests in CI pipeline, skip slow tests during development, track known bugs via xfail. Always register custom markers -- `--strict-markers` will warn about unknown markers.
section: "python"
order: 30
tags:
  - pytest
  - configuration
type: "basic"
---
