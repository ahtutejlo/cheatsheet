---
ua_question: "Як працюють контекстні менеджери та with statement?"
en_question: "How do context managers and the with statement work?"
ua_answer: |
  Контекстний менеджер -- це об'єкт, що реалізує протокол `__enter__()` і `__exit__()`. Оператор `with` гарантує, що `__exit__()` буде викликаний навіть при виникненні винятку, забезпечуючи надійне очищення ресурсів.

  `__enter__()` викликається на вході в блок `with` і може повертати значення (доступне через `as`). `__exit__(exc_type, exc_val, exc_tb)` викликається на виході -- при нормальному завершенні всі три аргументи будуть `None`. Якщо `__exit__` повертає `True`, виняток пригнічується.

  Модуль `contextlib` надає зручні утиліти: `@contextmanager` дозволяє створювати контекстні менеджери з генераторних функцій, а `ExitStack` -- для динамічного управління кількома ресурсами.

  ```python
  # Class-based context manager
  class DatabaseConnection:
      def __init__(self, connection_string):
          self.connection_string = connection_string
          self.conn = None

      def __enter__(self):
          self.conn = create_connection(self.connection_string)
          return self.conn

      def __exit__(self, exc_type, exc_val, exc_tb):
          if exc_type is not None:
              self.conn.rollback()
          else:
              self.conn.commit()
          self.conn.close()
          return False  # do not suppress exceptions

  # Generator-based context manager
  from contextlib import contextmanager

  @contextmanager
  def temp_directory():
      import tempfile, shutil
      dirpath = tempfile.mkdtemp()
      try:
          yield dirpath
      finally:
          shutil.rmtree(dirpath)

  with temp_directory() as tmpdir:
      print(f"Working in {tmpdir}")
  # directory is deleted after the block

  # ExitStack for dynamic resource management
  from contextlib import ExitStack

  def process_files(filenames):
      with ExitStack() as stack:
          files = [stack.enter_context(open(f)) for f in filenames]
          # all files are open here
          for f in files:
              print(f.readline())
      # all files are closed here

  # suppress() -- ignore specific exceptions
  from contextlib import suppress

  with suppress(FileNotFoundError):
      os.remove("nonexistent.txt")
  ```

  Контекстні менеджери -- це ідіоматичний Python-спосіб управління ресурсами: файли, з'єднання з БД, мережеві сокети, блокування (locks). Вони замінюють конструкції try/finally і роблять код чистішим та безпечнішим.
en_answer: |
  A context manager is an object implementing the `__enter__()` and `__exit__()` protocol. The `with` statement guarantees that `__exit__()` will be called even when an exception occurs, ensuring reliable resource cleanup.

  `__enter__()` is called on entering the `with` block and can return a value (accessible via `as`). `__exit__(exc_type, exc_val, exc_tb)` is called on exit -- with normal completion all three arguments are `None`. If `__exit__` returns `True`, the exception is suppressed.

  The `contextlib` module provides convenient utilities: `@contextmanager` allows creating context managers from generator functions, and `ExitStack` -- for dynamically managing multiple resources.

  ```python
  # Class-based context manager
  class DatabaseConnection:
      def __init__(self, connection_string):
          self.connection_string = connection_string
          self.conn = None

      def __enter__(self):
          self.conn = create_connection(self.connection_string)
          return self.conn

      def __exit__(self, exc_type, exc_val, exc_tb):
          if exc_type is not None:
              self.conn.rollback()
          else:
              self.conn.commit()
          self.conn.close()
          return False  # do not suppress exceptions

  # Generator-based context manager
  from contextlib import contextmanager

  @contextmanager
  def temp_directory():
      import tempfile, shutil
      dirpath = tempfile.mkdtemp()
      try:
          yield dirpath
      finally:
          shutil.rmtree(dirpath)

  with temp_directory() as tmpdir:
      print(f"Working in {tmpdir}")
  # directory is deleted after the block

  # ExitStack for dynamic resource management
  from contextlib import ExitStack

  def process_files(filenames):
      with ExitStack() as stack:
          files = [stack.enter_context(open(f)) for f in filenames]
          # all files are open here
          for f in files:
              print(f.readline())
      # all files are closed here

  # suppress() -- ignore specific exceptions
  from contextlib import suppress

  with suppress(FileNotFoundError):
      os.remove("nonexistent.txt")
  ```

  Context managers are the idiomatic Python way to manage resources: files, database connections, network sockets, locks. They replace try/finally constructs and make code cleaner and safer.
section: "python"
order: 7
tags:
  - core-language
  - patterns
type: "basic"
---
