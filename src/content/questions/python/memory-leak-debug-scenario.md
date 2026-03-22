---
ua_question: "Як знайти та виправити витік пам'яті в тестовому наборі?"
en_question: "How to debug a memory leak in a test suite?"
ua_answer: |
  Витік пам'яті в тестах проявляється як постійне зростання споживання RAM при запуску великого набору тестів. Причини: незакриті ресурси (з'єднання, файли), циклічні посилання, кешування в fixtures, глобальний стан.

  **Крок 1: Ідентифікація.** Використовуйте `tracemalloc` для відстеження алокацій та `objgraph` для візуалізації графу об'єктів. `pytest-memray` дає детальний профіль пам'яті по тестах.

  **Крок 2: Локалізація.** Звузьте проблему: запускайте тести групами, відключайте fixtures по черзі, перевіряйте session-scope fixtures на наявність накопичення даних.

  **Крок 3: Виправлення.** Забезпечте teardown для всіх ресурсів, уникайте зберігання великих об'єктів у session fixtures, використовуйте weakref для кешів.

  ```python
  import tracemalloc
  import gc
  import objgraph
  import pytest

  # Step 1: tracemalloc -- find where memory is allocated
  def test_find_leak():
      tracemalloc.start()

      # ... run suspicious code ...
      snapshot1 = tracemalloc.take_snapshot()
      # ... run more code ...
      snapshot2 = tracemalloc.take_snapshot()

      # Compare snapshots
      stats = snapshot2.compare_to(snapshot1, "lineno")
      for stat in stats[:10]:
          print(stat)
      # Shows: file:line, size diff, count diff

      tracemalloc.stop()

  # Step 2: objgraph -- find what holds references
  def test_find_references():
      gc.collect()
      # Find objects that grew in count
      objgraph.show_growth(limit=10)

      # Find what holds a reference to specific object
      leaked_objects = objgraph.by_type("MyConnection")
      if leaked_objects:
          objgraph.show_backrefs(
              leaked_objects[0],
              max_depth=5,
              filename="refs.png"
          )

  # Common leak: fixture not cleaning up
  # BAD
  @pytest.fixture(scope="session")
  def event_log():
      log = []
      yield log
      # log grows with every test that appends to it!

  # GOOD
  @pytest.fixture
  def event_log():
      log = []
      yield log
      log.clear()

  # Common leak: unclosed connections
  # BAD
  @pytest.fixture
  def db():
      return create_connection()  # never closed!

  # GOOD
  @pytest.fixture
  def db():
      conn = create_connection()
      yield conn
      conn.close()

  # Common leak: class-level state
  class TestAPI:
      responses = []  # shared across all instances!

      def test_one(self):
          self.responses.append(big_response())  # accumulates

  # Pytest plugin to monitor memory
  # conftest.py
  import psutil
  import os

  @pytest.hookimpl(tryfirst=True)
  def pytest_runtest_teardown(item):
      process = psutil.Process(os.getpid())
      mem_mb = process.memory_info().rss / 1024 / 1024
      if mem_mb > 500:  # threshold in MB
          gc.collect()
          new_mem = process.memory_info().rss / 1024 / 1024
          if new_mem > 500:
              print(f"\nWARNING: Memory {new_mem:.0f}MB after {item.name}")

  # pytest-memray: detailed memory profiling
  # pip install pytest-memray
  # pytest --memray
  # pytest --memray --most-allocations=10

  # Force GC between tests (last resort)
  @pytest.fixture(autouse=True)
  def force_gc():
      yield
      gc.collect()
  ```

  Профілактика: використовуйте `yield` з teardown у всіх fixtures, уникайте session-scope для мутабельних даних, запускайте `pytest --memray` в CI для раннього виявлення, і встановіть ліміт пам'яті через `resource.setrlimit` або Docker memory limits.
en_answer: |
  Memory leaks in tests manifest as constant RAM consumption growth when running a large test suite. Causes: unclosed resources (connections, files), circular references, caching in fixtures, global state.

  **Step 1: Identification.** Use `tracemalloc` to track allocations and `objgraph` to visualize the object graph. `pytest-memray` provides detailed per-test memory profiles.

  **Step 2: Localization.** Narrow the problem: run tests in groups, disable fixtures one by one, check session-scope fixtures for data accumulation.

  **Step 3: Fix.** Ensure teardown for all resources, avoid storing large objects in session fixtures, use weakref for caches.

  ```python
  import tracemalloc
  import gc
  import objgraph
  import pytest

  # Step 1: tracemalloc -- find where memory is allocated
  def test_find_leak():
      tracemalloc.start()

      # ... run suspicious code ...
      snapshot1 = tracemalloc.take_snapshot()
      # ... run more code ...
      snapshot2 = tracemalloc.take_snapshot()

      # Compare snapshots
      stats = snapshot2.compare_to(snapshot1, "lineno")
      for stat in stats[:10]:
          print(stat)
      # Shows: file:line, size diff, count diff

      tracemalloc.stop()

  # Step 2: objgraph -- find what holds references
  def test_find_references():
      gc.collect()
      # Find objects that grew in count
      objgraph.show_growth(limit=10)

      # Find what holds a reference to specific object
      leaked_objects = objgraph.by_type("MyConnection")
      if leaked_objects:
          objgraph.show_backrefs(
              leaked_objects[0],
              max_depth=5,
              filename="refs.png"
          )

  # Common leak: fixture not cleaning up
  # BAD
  @pytest.fixture(scope="session")
  def event_log():
      log = []
      yield log
      # log grows with every test that appends to it!

  # GOOD
  @pytest.fixture
  def event_log():
      log = []
      yield log
      log.clear()

  # Common leak: unclosed connections
  # BAD
  @pytest.fixture
  def db():
      return create_connection()  # never closed!

  # GOOD
  @pytest.fixture
  def db():
      conn = create_connection()
      yield conn
      conn.close()

  # Common leak: class-level state
  class TestAPI:
      responses = []  # shared across all instances!

      def test_one(self):
          self.responses.append(big_response())  # accumulates

  # Pytest plugin to monitor memory
  # conftest.py
  import psutil
  import os

  @pytest.hookimpl(tryfirst=True)
  def pytest_runtest_teardown(item):
      process = psutil.Process(os.getpid())
      mem_mb = process.memory_info().rss / 1024 / 1024
      if mem_mb > 500:  # threshold in MB
          gc.collect()
          new_mem = process.memory_info().rss / 1024 / 1024
          if new_mem > 500:
              print(f"\nWARNING: Memory {new_mem:.0f}MB after {item.name}")

  # pytest-memray: detailed memory profiling
  # pip install pytest-memray
  # pytest --memray
  # pytest --memray --most-allocations=10

  # Force GC between tests (last resort)
  @pytest.fixture(autouse=True)
  def force_gc():
      yield
      gc.collect()
  ```

  Prevention: use `yield` with teardown in all fixtures, avoid session-scope for mutable data, run `pytest --memray` in CI for early detection, and set memory limits via `resource.setrlimit` or Docker memory limits.
section: "python"
order: 39
tags:
  - debugging
  - memory
type: "practical"
---
