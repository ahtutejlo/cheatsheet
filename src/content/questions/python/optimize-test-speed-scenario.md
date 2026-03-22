---
ua_question: "Як оптимізувати швидкість виконання тестів?"
en_question: "How to optimize test execution time?"
ua_answer: |
  Повільні тести -- одна з найбільших проблем CI/CD. Оптимізація включає: паралелізацію, правильне використання scope fixtures, профілювання найповільніших тестів, і архітектурні рішення.

  **Крок 1: Профілювання.** Знайдіть найповільніші тести та fixtures. `pytest --durations=20` показує топ-20 найповільніших. `pytest-profiling` дає детальний breakdown.

  **Крок 2: Паралелізація.** `pytest-xdist` запускає тести в кількох процесах. Але потрібна ізоляція -- окремі БД, порти, тимчасові директорії для кожного worker.

  **Крок 3: Оптимізація fixtures.** Піднімайте дорогі fixtures на session scope, використовуйте transaction rollback замість recreate, кешуйте незмінні дані.

  ```python
  import pytest

  # Step 1: Find slow tests
  # pytest --durations=20 -v
  # pytest --durations-min=1.0  # only tests > 1s

  # Step 2: Parallel execution
  # pytest -n auto  # auto-detect CPU cores
  # pytest -n 4 --dist loadscope  # group by module/class

  # Isolate resources per worker
  @pytest.fixture(scope="session")
  def db_url(worker_id):
      if worker_id == "master":
          return "postgresql://localhost/test"
      return f"postgresql://localhost/test_{worker_id}"

  @pytest.fixture(scope="session")
  def server_port(worker_id):
      base_port = 8000
      if worker_id == "master":
          return base_port
      worker_num = int(worker_id.replace("gw", ""))
      return base_port + worker_num + 1

  # Step 3: Optimize fixtures -- session scope for expensive setup
  @pytest.fixture(scope="session")
  def db_engine(db_url):
      engine = create_engine(db_url)
      Base.metadata.create_all(engine)
      yield engine
      Base.metadata.drop_all(engine)
      engine.dispose()

  # Transaction rollback instead of recreating data
  @pytest.fixture
  def db_session(db_engine):
      conn = db_engine.connect()
      trans = conn.begin()
      session = Session(bind=conn)
      yield session
      session.close()
      trans.rollback()
      conn.close()

  # Cache test data that doesn't change
  @pytest.fixture(scope="session")
  def reference_data(db_engine):
      """Load once, reuse across all tests."""
      with Session(db_engine) as session:
          load_fixtures(session, "reference_data.json")
          session.commit()

  # Lazy fixture loading
  @pytest.fixture
  def heavy_resource(request):
      if "needs_heavy" not in [m.name for m in request.node.iter_markers()]:
          pytest.skip("Not needed")
      return create_heavy_resource()

  # Use in-memory database for unit tests
  @pytest.fixture(scope="session")
  def fast_db():
      engine = create_engine("sqlite:///:memory:")
      Base.metadata.create_all(engine)
      return engine

  # Conditional test collection
  # conftest.py
  def pytest_collection_modifyitems(config, items):
      if config.getoption("--quick"):
          skip_slow = pytest.mark.skip(reason="--quick mode")
          for item in items:
              if "slow" in item.keywords:
                  item.add_marker(skip_slow)

  def pytest_addoption(parser):
      parser.addoption("--quick", action="store_true",
                       help="Skip slow tests")

  # pytest.ini optimization
  # [tool.pytest.ini_options]
  # addopts = "-n auto --dist loadscope --timeout=30"
  # testpaths = ["tests"]
  # norecursedirs = [".git", "node_modules", "__pycache__"]
  ```

  Типовий результат оптимізації: 1) xdist дає ~4x прискорення на 4 ядрах; 2) session fixtures замість function -- до 10x для DB-тестів; 3) transaction rollback замість truncate -- до 5x; 4) пропуск slow тестів локально -- миттєвий feedback loop. Цільовий час CI: < 5 хвилин для всього набору.
en_answer: |
  Slow tests are one of the biggest CI/CD problems. Optimization includes: parallelization, proper fixture scope usage, profiling the slowest tests, and architectural decisions.

  **Step 1: Profiling.** Find the slowest tests and fixtures. `pytest --durations=20` shows the top 20 slowest. `pytest-profiling` gives a detailed breakdown.

  **Step 2: Parallelization.** `pytest-xdist` runs tests in multiple processes. But isolation is needed -- separate DBs, ports, temp directories for each worker.

  **Step 3: Fixture optimization.** Elevate expensive fixtures to session scope, use transaction rollback instead of recreate, cache immutable data.

  ```python
  import pytest

  # Step 1: Find slow tests
  # pytest --durations=20 -v
  # pytest --durations-min=1.0  # only tests > 1s

  # Step 2: Parallel execution
  # pytest -n auto  # auto-detect CPU cores
  # pytest -n 4 --dist loadscope  # group by module/class

  # Isolate resources per worker
  @pytest.fixture(scope="session")
  def db_url(worker_id):
      if worker_id == "master":
          return "postgresql://localhost/test"
      return f"postgresql://localhost/test_{worker_id}"

  @pytest.fixture(scope="session")
  def server_port(worker_id):
      base_port = 8000
      if worker_id == "master":
          return base_port
      worker_num = int(worker_id.replace("gw", ""))
      return base_port + worker_num + 1

  # Step 3: Optimize fixtures -- session scope for expensive setup
  @pytest.fixture(scope="session")
  def db_engine(db_url):
      engine = create_engine(db_url)
      Base.metadata.create_all(engine)
      yield engine
      Base.metadata.drop_all(engine)
      engine.dispose()

  # Transaction rollback instead of recreating data
  @pytest.fixture
  def db_session(db_engine):
      conn = db_engine.connect()
      trans = conn.begin()
      session = Session(bind=conn)
      yield session
      session.close()
      trans.rollback()
      conn.close()

  # Cache test data that doesn't change
  @pytest.fixture(scope="session")
  def reference_data(db_engine):
      """Load once, reuse across all tests."""
      with Session(db_engine) as session:
          load_fixtures(session, "reference_data.json")
          session.commit()

  # Lazy fixture loading
  @pytest.fixture
  def heavy_resource(request):
      if "needs_heavy" not in [m.name for m in request.node.iter_markers()]:
          pytest.skip("Not needed")
      return create_heavy_resource()

  # Use in-memory database for unit tests
  @pytest.fixture(scope="session")
  def fast_db():
      engine = create_engine("sqlite:///:memory:")
      Base.metadata.create_all(engine)
      return engine

  # Conditional test collection
  # conftest.py
  def pytest_collection_modifyitems(config, items):
      if config.getoption("--quick"):
          skip_slow = pytest.mark.skip(reason="--quick mode")
          for item in items:
              if "slow" in item.keywords:
                  item.add_marker(skip_slow)

  def pytest_addoption(parser):
      parser.addoption("--quick", action="store_true",
                       help="Skip slow tests")

  # pytest.ini optimization
  # [tool.pytest.ini_options]
  # addopts = "-n auto --dist loadscope --timeout=30"
  # testpaths = ["tests"]
  # norecursedirs = [".git", "node_modules", "__pycache__"]
  ```

  Typical optimization results: 1) xdist gives ~4x speedup on 4 cores; 2) session fixtures instead of function -- up to 10x for DB tests; 3) transaction rollback instead of truncate -- up to 5x; 4) skipping slow tests locally -- instant feedback loop. Target CI time: < 5 minutes for the entire suite.
section: "python"
order: 40
tags:
  - pytest
  - performance
type: "practical"
---
