---
ua_question: "Як pytest-xdist запускає тести паралельно і які підводні камені?"
en_question: "How does pytest-xdist run tests in parallel and what are the pitfalls?"
ua_answer: |
  `pytest-xdist` — плагін для паралельного виконання тестів через розподіл між кількома worker-процесами або машинами. Прапорець `-n auto` автоматично визначає кількість CPU і запускає відповідну кількість workers; `-n 4` задає конкретне число.

  Workers — це окремі процеси Python, кожен зі своїм інтерпретатором. pytest-xdist збирає всі тести на master-процесі, потім розподіляє їх по workers. Режими розподілу: `load` (за замовчуванням — балансування по черзі), `loadscope` (тести одного модуля або класу разом), `loadfile` (увесь файл в одному worker), `no` (без паралелізму).

  **Головний підводний камінь:** session-scoped fixtures виконуються окремо в кожному worker, а не спільно. Якщо session fixture піднімає БД або HTTP-сервер — він запуститься N разів. Вирішення: `pytest-xdist` надає `worker_id` fixture і хуки `pytest_configure_node` / `xdist_group` для координації.

  ```python
  # Встановлення
  # pip install pytest-xdist

  # Запуск
  # pytest -n auto          # автовизначення CPU
  # pytest -n 4             # 4 workers
  # pytest -n 4 --dist=loadscope   # клас/модуль разом

  # Проблема: session fixture запускається в кожному worker
  @pytest.fixture(scope="session")
  def database():
      # Буде викликано 4 рази при -n 4 !
      db = setup_database()
      yield db
      teardown_database(db)

  # Вирішення: tmpdir_factory + xdist worker id
  import pytest
  from xdist import get_xdist_worker_id

  @pytest.fixture(scope="session")
  def database(tmp_path_factory, worker_id):
      if worker_id == "master":
          # Немає паралелізму — звичайна ініціалізація
          db = setup_database()
          yield db
          teardown_database(db)
      else:
          # Worker — підключаємось до спільної БД, яка вже існує
          root_tmp = tmp_path_factory.getbasetemp().parent
          db_path = root_tmp / "shared_db"
          yield connect_to_database(db_path)

  # Маркер для групування: тести одного класу — один worker
  # pytest -n 4 --dist=loadscope

  # Примусити тест завжди в одному worker
  @pytest.mark.xdist_group("serial_tests")
  def test_order_dependent():
      ...

  # Вимкнути паралелізм для окремого тесту
  @pytest.mark.xdist_group(name="serial")
  def test_uses_shared_resource():
      ...

  # Перевірка worker_id всередині тесту
  def test_something(worker_id):
      print(f"Running on worker: {worker_id}")
      # "master" або "gw0", "gw1", ...
  ```

  Паралелізм дає виграш тільки для CPU-bound або незалежних I/O тестів. Тести з shared state (БД без транзакцій, файлова система, порти) потребують додаткової ізоляції. Типовий реальний приклад: при 1000 тестів і `-n auto` (8 CPU) час виконання падає з 5 хв до 45 сек.
en_answer: |
  `pytest-xdist` is a plugin for parallel test execution by distributing tests across multiple worker processes or machines. The `-n auto` flag automatically detects CPU count and launches a matching number of workers; `-n 4` sets a specific number.

  Workers are separate Python processes, each with their own interpreter. pytest-xdist collects all tests on the master process, then distributes them to workers. Distribution modes: `load` (default — round-robin balancing), `loadscope` (tests in the same module or class together), `loadfile` (whole file in one worker), `no` (no parallelism).

  **Main pitfall:** session-scoped fixtures run separately in each worker, not shared. If a session fixture starts a DB or HTTP server — it will start N times. Solution: `pytest-xdist` provides the `worker_id` fixture and `pytest_configure_node` / `xdist_group` hooks for coordination.

  ```python
  # Install
  # pip install pytest-xdist

  # Run
  # pytest -n auto          # auto-detect CPU
  # pytest -n 4             # 4 workers
  # pytest -n 4 --dist=loadscope   # keep class/module together

  # Problem: session fixture runs in each worker
  @pytest.fixture(scope="session")
  def database():
      # Will be called 4 times with -n 4 !
      db = setup_database()
      yield db
      teardown_database(db)

  # Solution: tmpdir_factory + xdist worker id
  import pytest
  from xdist import get_xdist_worker_id

  @pytest.fixture(scope="session")
  def database(tmp_path_factory, worker_id):
      if worker_id == "master":
          # No parallelism — normal initialization
          db = setup_database()
          yield db
          teardown_database(db)
      else:
          # Worker — connect to already-existing shared DB
          root_tmp = tmp_path_factory.getbasetemp().parent
          db_path = root_tmp / "shared_db"
          yield connect_to_database(db_path)

  # Marker to group: tests in the same class go to one worker
  # pytest -n 4 --dist=loadscope

  # Force a test to always run in the same worker group
  @pytest.mark.xdist_group("serial_tests")
  def test_order_dependent():
      ...

  # Check worker_id inside a test
  def test_something(worker_id):
      print(f"Running on worker: {worker_id}")
      # "master" or "gw0", "gw1", ...
  ```

  Parallelism only pays off for CPU-bound or independent I/O tests. Tests with shared state (DB without transactions, filesystem, ports) require extra isolation. A typical real-world example: with 1000 tests and `-n auto` (8 CPUs), execution time drops from 5 min to 45 sec.
section: "python"
order: 44
tags:
  - pytest
  - performance
  - configuration
type: "basic"
---
