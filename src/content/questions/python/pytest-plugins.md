---
ua_question: "Які основні pytest плагіни: xdist, rerunfailures, timeout?"
en_question: "What are the main pytest plugins: xdist, rerunfailures, timeout?"
ua_answer: |
  Екосистема pytest має сотні плагінів. Найважливіші для продуктивної роботи: **pytest-xdist** (паралельне виконання), **pytest-rerunfailures** (повторний запуск flaky тестів), **pytest-timeout** (ліміт часу), та інші.

  **pytest-xdist** запускає тести в кількох процесах або навіть на різних машинах. Режими розподілу: `loadfile` (всі тести з одного файлу -- в одному worker), `loadscope` (за scope), `load` (рівномірний розподіл).

  **pytest-rerunfailures** автоматично перезапускає тести, що впали, вказану кількість разів. Корисний для flaky тестів (нестабільні API, race conditions).

  **pytest-timeout** обмежує час виконання тесту -- незамінний для CI, де зависший тест може заблокувати pipeline.

  ```python
  # pytest-xdist: parallel execution
  # pip install pytest-xdist
  # pytest -n auto          # auto-detect CPU cores
  # pytest -n 4             # 4 workers
  # pytest -n auto --dist loadfile  # group by file

  # Ensure test isolation for parallel execution
  @pytest.fixture(scope="session")
  def db_name(worker_id):
      """Unique DB per worker for xdist."""
      if worker_id == "master":
          return "test_db"
      return f"test_db_{worker_id}"

  # pytest-rerunfailures: retry flaky tests
  # pip install pytest-rerunfailures
  # pytest --reruns 3                # retry failed 3 times
  # pytest --reruns 3 --reruns-delay 2  # wait 2s between retries

  @pytest.mark.flaky(reruns=3, reruns_delay=1)
  def test_external_api():
      response = requests.get("https://api.example.com/health")
      assert response.status_code == 200

  # pytest-timeout: time limits
  # pip install pytest-timeout
  # pytest --timeout=30      # 30s per test globally

  @pytest.mark.timeout(10)
  def test_with_timeout():
      """Fails if takes more than 10 seconds."""
      result = slow_computation()
      assert result is not None

  # pytest-cov: coverage reporting
  # pip install pytest-cov
  # pytest --cov=myapp --cov-report=html --cov-fail-under=80

  # pytest-asyncio: async test support
  # pip install pytest-asyncio
  @pytest.mark.asyncio
  async def test_async_endpoint():
      async with aiohttp.ClientSession() as session:
          async with session.get("http://localhost:8080") as resp:
              assert resp.status == 200

  # pytest-mock: convenient mock fixture
  # pip install pytest-mock
  def test_with_mocker(mocker):
      mock_send = mocker.patch("myapp.email.send")
      process_order(order)
      mock_send.assert_called_once()

  # pytest-freezegun: freeze time
  # pip install pytest-freezegun
  @pytest.mark.freeze_time("2024-01-01")
  def test_new_year():
      assert is_new_year() is True

  # pyproject.toml configuration
  # [tool.pytest.ini_options]
  # addopts = "-n auto --timeout=60 --reruns=2 -v"
  # markers = ["slow", "integration"]
  ```

  Комбінація плагінів для CI: `pytest -n auto --timeout=60 --reruns=2 --cov=myapp --cov-fail-under=80`. Це дає паралельне виконання, захист від зависання, повторний запуск flaky тестів та перевірку покриття в одній команді.
en_answer: |
  The pytest ecosystem has hundreds of plugins. The most important for productive work: **pytest-xdist** (parallel execution), **pytest-rerunfailures** (retry flaky tests), **pytest-timeout** (time limits), and others.

  **pytest-xdist** runs tests in multiple processes or even on different machines. Distribution modes: `loadfile` (all tests from one file in one worker), `loadscope` (by scope), `load` (even distribution).

  **pytest-rerunfailures** automatically reruns failed tests a specified number of times. Useful for flaky tests (unstable APIs, race conditions).

  **pytest-timeout** limits test execution time -- indispensable for CI where a stuck test can block the pipeline.

  ```python
  # pytest-xdist: parallel execution
  # pip install pytest-xdist
  # pytest -n auto          # auto-detect CPU cores
  # pytest -n 4             # 4 workers
  # pytest -n auto --dist loadfile  # group by file

  # Ensure test isolation for parallel execution
  @pytest.fixture(scope="session")
  def db_name(worker_id):
      """Unique DB per worker for xdist."""
      if worker_id == "master":
          return "test_db"
      return f"test_db_{worker_id}"

  # pytest-rerunfailures: retry flaky tests
  # pip install pytest-rerunfailures
  # pytest --reruns 3                # retry failed 3 times
  # pytest --reruns 3 --reruns-delay 2  # wait 2s between retries

  @pytest.mark.flaky(reruns=3, reruns_delay=1)
  def test_external_api():
      response = requests.get("https://api.example.com/health")
      assert response.status_code == 200

  # pytest-timeout: time limits
  # pip install pytest-timeout
  # pytest --timeout=30      # 30s per test globally

  @pytest.mark.timeout(10)
  def test_with_timeout():
      """Fails if takes more than 10 seconds."""
      result = slow_computation()
      assert result is not None

  # pytest-cov: coverage reporting
  # pip install pytest-cov
  # pytest --cov=myapp --cov-report=html --cov-fail-under=80

  # pytest-asyncio: async test support
  # pip install pytest-asyncio
  @pytest.mark.asyncio
  async def test_async_endpoint():
      async with aiohttp.ClientSession() as session:
          async with session.get("http://localhost:8080") as resp:
              assert resp.status == 200

  # pytest-mock: convenient mock fixture
  # pip install pytest-mock
  def test_with_mocker(mocker):
      mock_send = mocker.patch("myapp.email.send")
      process_order(order)
      mock_send.assert_called_once()

  # pytest-freezegun: freeze time
  # pip install pytest-freezegun
  @pytest.mark.freeze_time("2024-01-01")
  def test_new_year():
      assert is_new_year() is True

  # pyproject.toml configuration
  # [tool.pytest.ini_options]
  # addopts = "-n auto --timeout=60 --reruns=2 -v"
  # markers = ["slow", "integration"]
  ```

  Plugin combination for CI: `pytest -n auto --timeout=60 --reruns=2 --cov=myapp --cov-fail-under=80`. This provides parallel execution, hang protection, flaky test retries, and coverage checks in one command.
section: "python"
order: 33
tags:
  - pytest
  - plugins
type: "basic"
---
