---
ua_question: "Як працює модуль logging: конфігурація, рівні, інтеграція з тестами?"
en_question: "How does the logging module work: config, levels, test integration?"
ua_answer: |
  Модуль `logging` -- стандартний інструмент Python для структурованого логування. Він базується на ієрархії логерів (dot-separated names), де дочірній логер наслідує налаштування батьківського.

  **Рівні:** `DEBUG` (10) → `INFO` (20) → `WARNING` (30) → `ERROR` (40) → `CRITICAL` (50). Логер обробляє повідомлення з рівнем >= свого рівня. **Handlers** визначають куди писати (консоль, файл, мережа), **Formatters** -- як форматувати.

  В тестах логування допомагає діагностувати падіння. pytest має вбудовану підтримку через `caplog` fixture та `--log-cli-level` прапорець.

  ```python
  import logging

  # Basic configuration
  logging.basicConfig(
      level=logging.INFO,
      format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
      datefmt="%Y-%m-%d %H:%M:%S",
  )

  # Module-level logger (best practice)
  logger = logging.getLogger(__name__)

  def process_order(order_id):
      logger.info("Processing order %s", order_id)
      try:
          result = validate(order_id)
          logger.debug("Validation result: %s", result)
      except ValueError as e:
          logger.error("Validation failed for order %s: %s", order_id, e)
          raise

  # Advanced: dict-based configuration
  import logging.config

  LOGGING_CONFIG = {
      "version": 1,
      "disable_existing_loggers": False,
      "formatters": {
          "standard": {
              "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
          },
          "json": {
              "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
              "format": "%(asctime)s %(levelname)s %(name)s %(message)s"
          },
      },
      "handlers": {
          "console": {
              "class": "logging.StreamHandler",
              "formatter": "standard",
              "level": "INFO",
          },
          "file": {
              "class": "logging.handlers.RotatingFileHandler",
              "filename": "app.log",
              "maxBytes": 10_000_000,
              "backupCount": 5,
              "formatter": "standard",
          },
      },
      "loggers": {
          "": {"handlers": ["console", "file"], "level": "DEBUG"},
          "myapp.db": {"level": "WARNING"},
      },
  }

  logging.config.dictConfig(LOGGING_CONFIG)

  # pytest integration: caplog fixture
  import pytest

  def test_logging_output(caplog):
      with caplog.at_level(logging.WARNING):
          logger.warning("Low disk space: %d%%", 5)
          logger.info("This is not captured")

      assert "Low disk space" in caplog.text
      assert len(caplog.records) == 1
      assert caplog.records[0].levelname == "WARNING"

  # caplog with specific logger
  def test_specific_logger(caplog):
      with caplog.at_level(logging.DEBUG, logger="myapp.services"):
          get_logger("myapp.services").debug("detail")
      assert "detail" in caplog.text

  # pytest --log-cli-level=DEBUG  (show logs in console during tests)
  # pytest --log-file=test.log    (save logs to file)
  ```

  Найкращі практики: використовуйте `__name__` для імені логера (повторює ієрархію модулів), передавайте змінні через `%s` а не f-string (lazy evaluation), не логуйте секрети, налаштовуйте рівень через конфігурацію, а не в коді.
en_answer: |
  The `logging` module is Python's standard tool for structured logging. It is based on a hierarchy of loggers (dot-separated names), where a child logger inherits settings from the parent.

  **Levels:** `DEBUG` (10) -> `INFO` (20) -> `WARNING` (30) -> `ERROR` (40) -> `CRITICAL` (50). A logger processes messages with level >= its own level. **Handlers** determine where to write (console, file, network), **Formatters** -- how to format.

  In tests, logging helps diagnose failures. pytest has built-in support via the `caplog` fixture and `--log-cli-level` flag.

  ```python
  import logging

  # Basic configuration
  logging.basicConfig(
      level=logging.INFO,
      format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
      datefmt="%Y-%m-%d %H:%M:%S",
  )

  # Module-level logger (best practice)
  logger = logging.getLogger(__name__)

  def process_order(order_id):
      logger.info("Processing order %s", order_id)
      try:
          result = validate(order_id)
          logger.debug("Validation result: %s", result)
      except ValueError as e:
          logger.error("Validation failed for order %s: %s", order_id, e)
          raise

  # Advanced: dict-based configuration
  import logging.config

  LOGGING_CONFIG = {
      "version": 1,
      "disable_existing_loggers": False,
      "formatters": {
          "standard": {
              "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
          },
          "json": {
              "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
              "format": "%(asctime)s %(levelname)s %(name)s %(message)s"
          },
      },
      "handlers": {
          "console": {
              "class": "logging.StreamHandler",
              "formatter": "standard",
              "level": "INFO",
          },
          "file": {
              "class": "logging.handlers.RotatingFileHandler",
              "filename": "app.log",
              "maxBytes": 10_000_000,
              "backupCount": 5,
              "formatter": "standard",
          },
      },
      "loggers": {
          "": {"handlers": ["console", "file"], "level": "DEBUG"},
          "myapp.db": {"level": "WARNING"},
      },
  }

  logging.config.dictConfig(LOGGING_CONFIG)

  # pytest integration: caplog fixture
  import pytest

  def test_logging_output(caplog):
      with caplog.at_level(logging.WARNING):
          logger.warning("Low disk space: %d%%", 5)
          logger.info("This is not captured")

      assert "Low disk space" in caplog.text
      assert len(caplog.records) == 1
      assert caplog.records[0].levelname == "WARNING"

  # caplog with specific logger
  def test_specific_logger(caplog):
      with caplog.at_level(logging.DEBUG, logger="myapp.services"):
          get_logger("myapp.services").debug("detail")
      assert "detail" in caplog.text

  # pytest --log-cli-level=DEBUG  (show logs in console during tests)
  # pytest --log-file=test.log    (save logs to file)
  ```

  Best practices: use `__name__` for logger name (mirrors module hierarchy), pass variables via `%s` not f-strings (lazy evaluation), do not log secrets, configure levels through configuration, not in code.
section: "python"
order: 36
tags:
  - core-language
  - debugging
type: "basic"
---
