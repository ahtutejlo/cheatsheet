---
ua_question: "Які вбудовані fixtures є в pytest: capsys, tmp_path, caplog?"
en_question: "What built-in fixtures does pytest have: capsys, tmp_path, caplog?"
ua_answer: |
  pytest постачається з набором вбудованих fixtures для типових потреб: перехоплення виводу, тимчасові файли, логування, запити, а також специфічні для платформи утиліти.

  **capsys / capfd:** перехоплюють stdout та stderr. `capsys` — для Python-рівневого виводу, `capfd` — для дескрипторів файлів (включно з C-розширеннями). `capsysbinary` / `capfdbinary` — для бінарного виводу.

  **tmp_path / tmp_path_factory:** надають `pathlib.Path` об'єкт до унікальної тимчасової директорії. `tmp_path` — function-scoped (окрема директорія для кожного тесту), `tmp_path_factory` — session-scoped (спільна директорія для всієї сесії).

  **caplog:** перехоплює записи Python logging. Дозволяє перевіряти, чи були зроблені певні log-записи, змінювати log level для тесту.

  ```python
  import pytest
  import logging

  # capsys -- перехоплення stdout/stderr
  def test_print_output(capsys):
      print("hello")
      print("error", file=__import__("sys").stderr)
      captured = capsys.readouterr()
      assert captured.out == "hello\n"
      assert captured.err == "error\n"

  def test_capture_reset(capsys):
      print("first")
      capsys.readouterr()  # очистити буфер
      print("second")
      captured = capsys.readouterr()
      assert "first" not in captured.out
      assert "second" in captured.out

  # tmp_path -- тимчасова директорія (pathlib.Path)
  def test_write_file(tmp_path):
      config_file = tmp_path / "config.json"
      config_file.write_text('{"key": "value"}')
      result = load_config(config_file)
      assert result["key"] == "value"

  def test_nested_dirs(tmp_path):
      subdir = tmp_path / "data" / "processed"
      subdir.mkdir(parents=True)
      assert subdir.is_dir()

  # tmp_path_factory -- для session-scoped fixtures
  @pytest.fixture(scope="session")
  def shared_data_dir(tmp_path_factory):
      data_dir = tmp_path_factory.mktemp("shared")
      (data_dir / "test.db").write_text("db content")
      return data_dir

  # caplog -- перехоплення логів
  def test_logs_warning(caplog):
      with caplog.at_level(logging.WARNING):
          perform_risky_operation()
      assert "Connection timeout" in caplog.text
      assert any(r.levelname == "WARNING" for r in caplog.records)

  def test_log_level_filter(caplog):
      with caplog.at_level(logging.DEBUG, logger="myapp.db"):
          db_operation()
      # тільки записи від myapp.db з DEBUG і вище
      assert "Query executed" in caplog.text

  def test_no_errors_logged(caplog):
      with caplog.at_level(logging.ERROR):
          safe_operation()
      assert len(caplog.records) == 0

  # monkeypatch -- підміна (детальніше в окремій картці)
  # request -- мета-інформація про поточний тест
  def test_meta(request):
      print(f"Test: {request.node.name}")
      print(f"Module: {request.module.__name__}")

  # pytestconfig -- доступ до конфігурації pytest
  def test_config(pytestconfig):
      rootdir = pytestconfig.rootdir
      assert (rootdir / "pytest.ini").exists()

  # recwarn -- перехоплення warnings
  def test_deprecation_warning(recwarn):
      call_deprecated_function()
      assert len(recwarn) == 1
      assert issubclass(recwarn[0].category, DeprecationWarning)
  ```

  `tmp_path` автоматично очищується після тестової сесії (pytest зберігає останні 3 запуски). На відміну від старого `tmpdir` (повертав `py.path.local`), `tmp_path` повертає сучасний `pathlib.Path`. `caplog.records` — список `logging.LogRecord`, що дозволяє перевіряти будь-який атрибут запису.
en_answer: |
  pytest ships with a set of built-in fixtures for common needs: output capture, temporary files, logging, requests, and platform-specific utilities.

  **capsys / capfd:** capture stdout and stderr. `capsys` — for Python-level output, `capfd` — for file descriptors (including C extensions). `capsysbinary` / `capfdbinary` — for binary output.

  **tmp_path / tmp_path_factory:** provide a `pathlib.Path` object to a unique temporary directory. `tmp_path` — function-scoped (separate directory per test), `tmp_path_factory` — session-scoped (shared directory for the whole session).

  **caplog:** captures Python logging records. Lets you check whether specific log messages were emitted, and change log level for a test.

  ```python
  import pytest
  import logging

  # capsys -- capture stdout/stderr
  def test_print_output(capsys):
      print("hello")
      print("error", file=__import__("sys").stderr)
      captured = capsys.readouterr()
      assert captured.out == "hello\n"
      assert captured.err == "error\n"

  def test_capture_reset(capsys):
      print("first")
      capsys.readouterr()  # clear buffer
      print("second")
      captured = capsys.readouterr()
      assert "first" not in captured.out
      assert "second" in captured.out

  # tmp_path -- temporary directory (pathlib.Path)
  def test_write_file(tmp_path):
      config_file = tmp_path / "config.json"
      config_file.write_text('{"key": "value"}')
      result = load_config(config_file)
      assert result["key"] == "value"

  def test_nested_dirs(tmp_path):
      subdir = tmp_path / "data" / "processed"
      subdir.mkdir(parents=True)
      assert subdir.is_dir()

  # tmp_path_factory -- for session-scoped fixtures
  @pytest.fixture(scope="session")
  def shared_data_dir(tmp_path_factory):
      data_dir = tmp_path_factory.mktemp("shared")
      (data_dir / "test.db").write_text("db content")
      return data_dir

  # caplog -- log capture
  def test_logs_warning(caplog):
      with caplog.at_level(logging.WARNING):
          perform_risky_operation()
      assert "Connection timeout" in caplog.text
      assert any(r.levelname == "WARNING" for r in caplog.records)

  def test_log_level_filter(caplog):
      with caplog.at_level(logging.DEBUG, logger="myapp.db"):
          db_operation()
      # only records from myapp.db at DEBUG and above
      assert "Query executed" in caplog.text

  def test_no_errors_logged(caplog):
      with caplog.at_level(logging.ERROR):
          safe_operation()
      assert len(caplog.records) == 0

  # request -- meta-information about the current test
  def test_meta(request):
      print(f"Test: {request.node.name}")
      print(f"Module: {request.module.__name__}")

  # pytestconfig -- access to pytest configuration
  def test_config(pytestconfig):
      rootdir = pytestconfig.rootdir
      assert (rootdir / "pytest.ini").exists()

  # recwarn -- warning capture
  def test_deprecation_warning(recwarn):
      call_deprecated_function()
      assert len(recwarn) == 1
      assert issubclass(recwarn[0].category, DeprecationWarning)
  ```

  `tmp_path` is automatically cleaned up after the test session (pytest keeps the last 3 runs). Unlike the old `tmpdir` (returned `py.path.local`), `tmp_path` returns a modern `pathlib.Path`. `caplog.records` is a list of `logging.LogRecord`, allowing you to check any attribute of a log entry.
section: "python"
order: 47
tags:
  - pytest
  - fixtures
type: "basic"
---
