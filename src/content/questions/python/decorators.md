---
ua_question: "Як працюють декоратори під капотом?"
en_question: "How do decorators work under the hood?"
ua_answer: |
  Декоратор -- це функція (або клас), яка приймає функцію як аргумент і повертає нову функцію (або модифіковану версію). Синтаксис `@decorator` -- це лише синтаксичний цукор: `@decorator` перед `def func()` еквівалентний `func = decorator(func)`.

  Декоратори використовують **замикання** (closures) для збереження посилання на оригінальну функцію. Важливо використовувати `functools.wraps`, щоб зберегти `__name__`, `__doc__` та інші атрибути оригінальної функції.

  Декоратори з аргументами -- це функція, що повертає декоратор (тобто три рівні вкладеності). Декоратор-клас реалізує `__call__` і може зберігати стан між викликами.

  ```python
  import functools
  import time

  # Simple decorator
  def timer(func):
      @functools.wraps(func)
      def wrapper(*args, **kwargs):
          start = time.perf_counter()
          result = func(*args, **kwargs)
          elapsed = time.perf_counter() - start
          print(f"{func.__name__} took {elapsed:.4f}s")
          return result
      return wrapper

  @timer
  def slow_function(n):
      """Compute sum of squares."""
      return sum(x ** 2 for x in range(n))

  slow_function(1_000_000)
  print(slow_function.__name__)  # "slow_function" (thanks to @wraps)

  # Decorator with arguments
  def retry(max_attempts=3, exceptions=(Exception,)):
      def decorator(func):
          @functools.wraps(func)
          def wrapper(*args, **kwargs):
              for attempt in range(1, max_attempts + 1):
                  try:
                      return func(*args, **kwargs)
                  except exceptions as e:
                      if attempt == max_attempts:
                          raise
                      print(f"Attempt {attempt} failed: {e}")
          return wrapper
      return decorator

  @retry(max_attempts=3, exceptions=(ConnectionError,))
  def fetch_data(url):
      ...

  # Class-based decorator with state
  class CountCalls:
      def __init__(self, func):
          functools.update_wrapper(self, func)
          self.func = func
          self.count = 0

      def __call__(self, *args, **kwargs):
          self.count += 1
          return self.func(*args, **kwargs)

  @CountCalls
  def greet(name):
      return f"Hello, {name}"

  greet("Alice")
  greet("Bob")
  print(greet.count)  # 2
  ```

  Декоратори широко використовуються у фреймворках: `@pytest.fixture`, `@app.route` у Flask, `@property`, `@staticmethod`, `@classmethod` -- все це декоратори. Розуміння їхнього механізму допомагає писати чистий, DRY код.
en_answer: |
  A decorator is a function (or class) that takes a function as an argument and returns a new function (or modified version). The `@decorator` syntax is just syntactic sugar: `@decorator` before `def func()` is equivalent to `func = decorator(func)`.

  Decorators use **closures** to hold a reference to the original function. It is important to use `functools.wraps` to preserve `__name__`, `__doc__` and other attributes of the original function.

  Decorators with arguments are a function that returns a decorator (three levels of nesting). A class-based decorator implements `__call__` and can maintain state between calls.

  ```python
  import functools
  import time

  # Simple decorator
  def timer(func):
      @functools.wraps(func)
      def wrapper(*args, **kwargs):
          start = time.perf_counter()
          result = func(*args, **kwargs)
          elapsed = time.perf_counter() - start
          print(f"{func.__name__} took {elapsed:.4f}s")
          return result
      return wrapper

  @timer
  def slow_function(n):
      """Compute sum of squares."""
      return sum(x ** 2 for x in range(n))

  slow_function(1_000_000)
  print(slow_function.__name__)  # "slow_function" (thanks to @wraps)

  # Decorator with arguments
  def retry(max_attempts=3, exceptions=(Exception,)):
      def decorator(func):
          @functools.wraps(func)
          def wrapper(*args, **kwargs):
              for attempt in range(1, max_attempts + 1):
                  try:
                      return func(*args, **kwargs)
                  except exceptions as e:
                      if attempt == max_attempts:
                          raise
                      print(f"Attempt {attempt} failed: {e}")
          return wrapper
      return decorator

  @retry(max_attempts=3, exceptions=(ConnectionError,))
  def fetch_data(url):
      ...

  # Class-based decorator with state
  class CountCalls:
      def __init__(self, func):
          functools.update_wrapper(self, func)
          self.func = func
          self.count = 0

      def __call__(self, *args, **kwargs):
          self.count += 1
          return self.func(*args, **kwargs)

  @CountCalls
  def greet(name):
      return f"Hello, {name}"

  greet("Alice")
  greet("Bob")
  print(greet.count)  # 2
  ```

  Decorators are widely used in frameworks: `@pytest.fixture`, `@app.route` in Flask, `@property`, `@staticmethod`, `@classmethod` -- all are decorators. Understanding their mechanism helps write clean, DRY code.
section: "python"
order: 6
tags:
  - core-language
  - functions
type: "basic"
---
