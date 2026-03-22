---
ua_question: "В чому різниця між except Exception та except BaseException?"
en_question: "What is the difference between except Exception and except BaseException?"
ua_answer: |
  > **Trap:** Розробники пишуть `except BaseException` або голий `except:`, думаючи, що це "надійніше". Насправді це перехоплює системні сигнали (KeyboardInterrupt, SystemExit), що робить програму неможливою для зупинки через Ctrl+C.

  `BaseException` -- корінь ієрархії винятків. Від нього наслідуються `KeyboardInterrupt`, `SystemExit`, `GeneratorExit` -- сигнали, які зазвичай НЕ слід перехоплювати. `Exception` -- базовий клас для "звичайних" помилок програми.

  Правило: завжди використовуйте `except Exception` (або конкретніший клас). `except BaseException` / `except:` -- лише у крайніх випадках (логування на верхньому рівні) з обов'язковим `raise`.

  ```python
  # Exception hierarchy
  # BaseException
  #   +-- SystemExit          (sys.exit())
  #   +-- KeyboardInterrupt   (Ctrl+C)
  #   +-- GeneratorExit       (generator.close())
  #   +-- Exception
  #       +-- ValueError
  #       +-- TypeError
  #       +-- RuntimeError
  #       +-- OSError (IOError, FileNotFoundError, etc.)
  #       +-- ...

  # BAD: catches Ctrl+C and sys.exit()
  try:
      while True:
          data = input("Enter data: ")
  except:  # bare except == except BaseException
      print("Something happened")
      # Ctrl+C will NOT stop this program!

  # BAD: same problem
  try:
      process_data()
  except BaseException:
      log_error()
      # SystemExit is caught -- sys.exit() won't work!

  # GOOD: catches program errors, not system signals
  try:
      process_data()
  except Exception as e:
      log_error(e)
      # Ctrl+C and sys.exit() still work

  # GOOD: specific exceptions
  try:
      value = int(user_input)
  except ValueError:
      print("Invalid number")

  # GOOD: multiple specific exceptions
  try:
      data = fetch_and_parse(url)
  except (ConnectionError, TimeoutError) as e:
      print(f"Network error: {e}")
  except ValueError as e:
      print(f"Parse error: {e}")

  # Only valid use of BaseException: top-level logging
  def main():
      try:
          app.run()
      except KeyboardInterrupt:
          print("\nShutting down gracefully...")
      except Exception as e:
          logging.critical(f"Unhandled error: {e}")
          raise  # always re-raise!

  # ExceptionGroup (Python 3.11+)
  try:
      async with asyncio.TaskGroup() as tg:
          tg.create_task(risky_task_1())
          tg.create_task(risky_task_2())
  except* ValueError as eg:
      print(f"Value errors: {eg.exceptions}")
  except* TypeError as eg:
      print(f"Type errors: {eg.exceptions}")
  ```

  Додаткова порада: завжди логуйте повний traceback (`logging.exception()` або `traceback.format_exc()`), використовуйте `raise` без аргументів для повторного підняття, і ніколи не ігноруйте винятки мовчки (`except: pass`).
en_answer: |
  > **Trap:** Developers write `except BaseException` or bare `except:`, thinking it is "more reliable." In reality, this catches system signals (KeyboardInterrupt, SystemExit), making the program impossible to stop with Ctrl+C.

  `BaseException` is the root of the exception hierarchy. `KeyboardInterrupt`, `SystemExit`, `GeneratorExit` inherit from it -- signals that usually should NOT be caught. `Exception` is the base class for "normal" program errors.

  The rule: always use `except Exception` (or a more specific class). `except BaseException` / `except:` -- only in extreme cases (top-level logging) with mandatory `raise`.

  ```python
  # Exception hierarchy
  # BaseException
  #   +-- SystemExit          (sys.exit())
  #   +-- KeyboardInterrupt   (Ctrl+C)
  #   +-- GeneratorExit       (generator.close())
  #   +-- Exception
  #       +-- ValueError
  #       +-- TypeError
  #       +-- RuntimeError
  #       +-- OSError (IOError, FileNotFoundError, etc.)
  #       +-- ...

  # BAD: catches Ctrl+C and sys.exit()
  try:
      while True:
          data = input("Enter data: ")
  except:  # bare except == except BaseException
      print("Something happened")
      # Ctrl+C will NOT stop this program!

  # BAD: same problem
  try:
      process_data()
  except BaseException:
      log_error()
      # SystemExit is caught -- sys.exit() won't work!

  # GOOD: catches program errors, not system signals
  try:
      process_data()
  except Exception as e:
      log_error(e)
      # Ctrl+C and sys.exit() still work

  # GOOD: specific exceptions
  try:
      value = int(user_input)
  except ValueError:
      print("Invalid number")

  # GOOD: multiple specific exceptions
  try:
      data = fetch_and_parse(url)
  except (ConnectionError, TimeoutError) as e:
      print(f"Network error: {e}")
  except ValueError as e:
      print(f"Parse error: {e}")

  # Only valid use of BaseException: top-level logging
  def main():
      try:
          app.run()
      except KeyboardInterrupt:
          print("\nShutting down gracefully...")
      except Exception as e:
          logging.critical(f"Unhandled error: {e}")
          raise  # always re-raise!

  # ExceptionGroup (Python 3.11+)
  try:
      async with asyncio.TaskGroup() as tg:
          tg.create_task(risky_task_1())
          tg.create_task(risky_task_2())
  except* ValueError as eg:
      print(f"Value errors: {eg.exceptions}")
  except* TypeError as eg:
      print(f"Type errors: {eg.exceptions}")
  ```

  Additional tip: always log the full traceback (`logging.exception()` or `traceback.format_exc()`), use `raise` without arguments for re-raising, and never silently ignore exceptions (`except: pass`).
section: "python"
order: 23
tags:
  - gotchas
  - exceptions
type: "trick"
---
