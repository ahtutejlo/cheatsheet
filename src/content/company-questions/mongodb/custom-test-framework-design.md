---
company: "mongodb"
stage: "coding-2-frameworks-performance"
ua_question: "Спроєктуй мінімальний тестовий фреймворк з підтримкою fixtures, параметризації та звітності"
en_question: "Design a minimal test framework with fixtures, parameterization, and reporting support"
ua_answer: |
  Мінімальний тестовий фреймворк повинен мати:
  - **Test discovery** — автоматичний пошук тестів
  - **Fixtures** — setup/teardown з управлінням ресурсами
  - **Параметризація** — один тест, багато наборів даних
  - **Assertions** — порівняння з чіткими повідомленнями
  - **Reporting** — результати з деталями помилок

  ```python
  import time
  import traceback
  import functools
  from dataclasses import dataclass, field
  from typing import Any, Callable
  from contextlib import contextmanager

  @dataclass
  class TestResult:
      name: str
      status: str  # "pass" | "fail" | "error"
      duration: float = 0
      error: str | None = None
      params: dict | None = None

  class TestFramework:
      def __init__(self):
          self._tests: list[tuple[str, Callable, dict | None]] = []
          self._fixtures: dict[str, Callable] = {}
          self._results: list[TestResult] = []

      def fixture(self, fn):
          """Register a fixture (context manager)."""
          @contextmanager
          @functools.wraps(fn)
          def wrapper():
              gen = fn()
              value = next(gen)
              try:
                  yield value
              finally:
                  try:
                      next(gen)
                  except StopIteration:
                      pass
          self._fixtures[fn.__name__] = wrapper
          return wrapper

      def test(self, fn=None, *, params: list[dict] | None = None):
          """Register a test, optionally with parameters."""
          def decorator(f):
              if params:
                  for p in params:
                      name = f"{f.__name__}[{p}]"
                      self._tests.append((name, f, p))
              else:
                  self._tests.append((f.__name__, f, None))
              return f
          return decorator(fn) if fn else decorator

      def run(self) -> list[TestResult]:
          for name, fn, params in self._tests:
              start = time.time()
              try:
                  # Resolve fixtures
                  import inspect
                  sig = inspect.signature(fn)
                  kwargs = {}
                  fixtures_cm = []
                  for param_name in sig.parameters:
                      if param_name in self._fixtures:
                          cm = self._fixtures[param_name]()
                          val = cm.__enter__()
                          fixtures_cm.append(cm)
                          kwargs[param_name] = val
                  if params:
                      kwargs.update(params)

                  fn(**kwargs)
                  self._results.append(TestResult(name, "pass",
                      time.time() - start, params=params))

                  for cm in reversed(fixtures_cm):
                      cm.__exit__(None, None, None)

              except AssertionError as e:
                  self._results.append(TestResult(name, "fail",
                      time.time() - start, str(e), params))
              except Exception as e:
                  self._results.append(TestResult(name, "error",
                      time.time() - start, traceback.format_exc(), params))

          return self._results

      def report(self):
          passed = sum(1 for r in self._results if r.status == "pass")
          failed = sum(1 for r in self._results if r.status == "fail")
          errors = sum(1 for r in self._results if r.status == "error")
          total_time = sum(r.duration for r in self._results)

          print(f"\n{'='*60}")
          print(f"Results: {passed} passed, {failed} failed, {errors} errors")
          print(f"Total time: {total_time:.3f}s")
          print(f"{'='*60}")

          for r in self._results:
              icon = "✅" if r.status == "pass" else "❌"
              print(f"  {icon} {r.name} ({r.duration:.3f}s)")
              if r.error:
                  print(f"     {r.error.splitlines()[0]}")

  # --- Usage ---
  fw = TestFramework()

  @fw.fixture
  def db():
      conn = {"connected": True}  # setup
      yield conn
      conn["connected"] = False   # teardown

  @fw.test
  def test_connection(db):
      assert db["connected"] is True

  @fw.test(params=[
      {"x": 1, "expected": 1},
      {"x": 0, "expected": 0},
      {"x": -1, "expected": 1},
  ])
  def test_abs(x, expected):
      assert abs(x) == expected

  fw.run()
  fw.report()
  ```

  На інтерв'ю важливо показати:
  1. Розуміння архітектури (discovery, execution, reporting — окремі компоненти)
  2. Розширюваність (легко додати нові features)
  3. Обробку помилок (тест не повинен крашити весь run)
en_answer: |
  A minimal test framework should have:
  - **Test discovery** — automatic test detection
  - **Fixtures** — setup/teardown with resource management
  - **Parameterization** — one test, many data sets
  - **Assertions** — comparison with clear messages
  - **Reporting** — results with error details

  ```python
  import time
  import traceback
  import functools
  from dataclasses import dataclass, field
  from typing import Any, Callable
  from contextlib import contextmanager

  @dataclass
  class TestResult:
      name: str
      status: str  # "pass" | "fail" | "error"
      duration: float = 0
      error: str | None = None
      params: dict | None = None

  class TestFramework:
      def __init__(self):
          self._tests: list[tuple[str, Callable, dict | None]] = []
          self._fixtures: dict[str, Callable] = {}
          self._results: list[TestResult] = []

      def fixture(self, fn):
          """Register a fixture (context manager)."""
          @contextmanager
          @functools.wraps(fn)
          def wrapper():
              gen = fn()
              value = next(gen)
              try:
                  yield value
              finally:
                  try:
                      next(gen)
                  except StopIteration:
                      pass
          self._fixtures[fn.__name__] = wrapper
          return wrapper

      def test(self, fn=None, *, params: list[dict] | None = None):
          """Register a test, optionally with parameters."""
          def decorator(f):
              if params:
                  for p in params:
                      name = f"{f.__name__}[{p}]"
                      self._tests.append((name, f, p))
              else:
                  self._tests.append((f.__name__, f, None))
              return f
          return decorator(fn) if fn else decorator

      def run(self) -> list[TestResult]:
          for name, fn, params in self._tests:
              start = time.time()
              try:
                  # Resolve fixtures
                  import inspect
                  sig = inspect.signature(fn)
                  kwargs = {}
                  fixtures_cm = []
                  for param_name in sig.parameters:
                      if param_name in self._fixtures:
                          cm = self._fixtures[param_name]()
                          val = cm.__enter__()
                          fixtures_cm.append(cm)
                          kwargs[param_name] = val
                  if params:
                      kwargs.update(params)

                  fn(**kwargs)
                  self._results.append(TestResult(name, "pass",
                      time.time() - start, params=params))

                  for cm in reversed(fixtures_cm):
                      cm.__exit__(None, None, None)

              except AssertionError as e:
                  self._results.append(TestResult(name, "fail",
                      time.time() - start, str(e), params))
              except Exception as e:
                  self._results.append(TestResult(name, "error",
                      time.time() - start, traceback.format_exc(), params))

          return self._results

      def report(self):
          passed = sum(1 for r in self._results if r.status == "pass")
          failed = sum(1 for r in self._results if r.status == "fail")
          errors = sum(1 for r in self._results if r.status == "error")
          total_time = sum(r.duration for r in self._results)

          print(f"\n{'='*60}")
          print(f"Results: {passed} passed, {failed} failed, {errors} errors")
          print(f"Total time: {total_time:.3f}s")
          print(f"{'='*60}")

          for r in self._results:
              icon = "✅" if r.status == "pass" else "❌"
              print(f"  {icon} {r.name} ({r.duration:.3f}s)")
              if r.error:
                  print(f"     {r.error.splitlines()[0]}")

  # --- Usage ---
  fw = TestFramework()

  @fw.fixture
  def db():
      conn = {"connected": True}  # setup
      yield conn
      conn["connected"] = False   # teardown

  @fw.test
  def test_connection(db):
      assert db["connected"] is True

  @fw.test(params=[
      {"x": 1, "expected": 1},
      {"x": 0, "expected": 0},
      {"x": -1, "expected": 1},
  ])
  def test_abs(x, expected):
      assert abs(x) == expected

  fw.run()
  fw.report()
  ```

  In an interview, it's important to demonstrate:
  1. Architecture understanding (discovery, execution, reporting — separate components)
  2. Extensibility (easy to add new features)
  3. Error handling (a test shouldn't crash the entire run)
tags: [testing, frameworks, python, design]
order: 1
---
