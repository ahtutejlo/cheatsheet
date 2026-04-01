---
ua_question: "Що дає модуль functools: lru_cache, partial, reduce, wraps?"
en_question: "What does the functools module provide: lru_cache, partial, reduce, wraps?"
ua_answer: |
  `functools` — стандартний модуль для роботи з функціями вищого порядку. Найчастіше на співбесідах питають про `lru_cache`, `partial`, `reduce` та `wraps`.

  **`lru_cache`** — декоратор мемоїзації з LRU (Least Recently Used) витісненням. Кешує результати функції за аргументами. `maxsize=None` (або `@cache` у Python 3.9+) — необмежений кеш. Аргументи мають бути хешованими.

  **`partial`** — часткове застосування функцій. Фіксує деякі аргументи, повертає нову функцію. Корисне для callback'ів і налаштування поведінки.

  **`reduce`** — згортка послідовності з бінарною функцією (ліве фолдування). **`wraps`** — зберігає метадані оригінальної функції у декораторах.

  ```python
  from functools import lru_cache, cache, partial, reduce, wraps, total_ordering

  # lru_cache -- мемоїзація
  @lru_cache(maxsize=128)
  def fibonacci(n):
      if n < 2:
          return n
      return fibonacci(n - 1) + fibonacci(n - 2)

  fibonacci(30)   # швидко завдяки кешуванню
  print(fibonacci.cache_info())
  # CacheInfo(hits=28, misses=31, maxsize=128, currsize=31)
  fibonacci.cache_clear()  # очистити кеш

  # Python 3.9+ -- cache (необмежений, трохи швидший)
  @cache
  def expensive(x):
      return x ** 2

  # lru_cache з методами -- обережно!
  class DataFetcher:
      @lru_cache(maxsize=100)
      def fetch(self, url):  # self не хешується якщо є __dict__
          return requests.get(url).json()
  # Краще: методний кеш через functools.cached_property або lru_cache на staticmethod

  # partial -- часткове застосування
  def power(base, exponent):
      return base ** exponent

  square = partial(power, exponent=2)
  cube = partial(power, exponent=3)

  print(square(5))   # 25
  print(cube(3))     # 27

  # partial для налаштування callback'ів
  import logging
  log_error = partial(logging.log, logging.ERROR)
  log_debug = partial(logging.log, logging.DEBUG)
  log_error("Something went wrong")

  # partial з positional args
  def send_email(to, subject, body, cc=None):
      ...

  send_welcome = partial(send_email, subject="Welcome!", body="Hello!")
  send_welcome(to="user@example.com")

  # reduce -- ліве фолдування
  from functools import reduce

  nums = [1, 2, 3, 4, 5]
  total = reduce(lambda acc, x: acc + x, nums)          # 15
  product = reduce(lambda acc, x: acc * x, nums)        # 120
  maximum = reduce(lambda a, b: a if a > b else b, nums) # 5

  # reduce з initial value
  result = reduce(lambda acc, x: acc + [x * 2], nums, [])
  # [2, 4, 6, 8, 10]

  # wraps -- зберегти метадані у декораторі
  def my_decorator(func):
      @wraps(func)  # без цього func.__name__ буде "wrapper"
      def wrapper(*args, **kwargs):
          print("Before")
          result = func(*args, **kwargs)
          print("After")
          return result
      return wrapper

  @my_decorator
  def greet(name):
      """Say hello."""
      return f"Hello, {name}!"

  print(greet.__name__)  # "greet" (не "wrapper")
  print(greet.__doc__)   # "Say hello."

  # total_ordering -- заповнити методи порівняння автоматично
  @total_ordering
  class Student:
      def __init__(self, name, grade):
          self.name = name
          self.grade = grade

      def __eq__(self, other):
          return self.grade == other.grade

      def __lt__(self, other):
          return self.grade < other.grade
      # автоматично додаються __le__, __gt__, __ge__
  ```

  `lru_cache` — один з найчастіших способів оптимізації у Python. Важливо пам'ятати: він не очищується автоматично, може спричинити memory leak при великих об'єктах або нехешованих аргументах, і не підходить для методів зі змінним станом `self`.
en_answer: |
  `functools` is the standard module for higher-order function utilities. The most commonly asked about in interviews are `lru_cache`, `partial`, `reduce`, and `wraps`.

  **`lru_cache`** is a memoization decorator with LRU (Least Recently Used) eviction. Caches function results by arguments. `maxsize=None` (or `@cache` in Python 3.9+) is an unbounded cache. Arguments must be hashable.

  **`partial`** is partial function application. Fixes some arguments and returns a new function. Useful for callbacks and behavior customization.

  **`reduce`** folds a sequence with a binary function (left fold). **`wraps`** preserves the original function's metadata in decorators.

  ```python
  from functools import lru_cache, cache, partial, reduce, wraps, total_ordering

  # lru_cache -- memoization
  @lru_cache(maxsize=128)
  def fibonacci(n):
      if n < 2:
          return n
      return fibonacci(n - 1) + fibonacci(n - 2)

  fibonacci(30)   # fast due to caching
  print(fibonacci.cache_info())
  # CacheInfo(hits=28, misses=31, maxsize=128, currsize=31)
  fibonacci.cache_clear()  # clear cache

  # Python 3.9+ -- cache (unbounded, slightly faster)
  @cache
  def expensive(x):
      return x ** 2

  # partial -- partial application
  def power(base, exponent):
      return base ** exponent

  square = partial(power, exponent=2)
  cube = partial(power, exponent=3)

  print(square(5))   # 25
  print(cube(3))     # 27

  # partial for callback customization
  import logging
  log_error = partial(logging.log, logging.ERROR)
  log_debug = partial(logging.log, logging.DEBUG)
  log_error("Something went wrong")

  # partial with positional args
  def send_email(to, subject, body, cc=None):
      ...

  send_welcome = partial(send_email, subject="Welcome!", body="Hello!")
  send_welcome(to="user@example.com")

  # reduce -- left fold
  from functools import reduce

  nums = [1, 2, 3, 4, 5]
  total = reduce(lambda acc, x: acc + x, nums)          # 15
  product = reduce(lambda acc, x: acc * x, nums)        # 120
  maximum = reduce(lambda a, b: a if a > b else b, nums) # 5

  # reduce with initial value
  result = reduce(lambda acc, x: acc + [x * 2], nums, [])
  # [2, 4, 6, 8, 10]

  # wraps -- preserve metadata in a decorator
  def my_decorator(func):
      @wraps(func)  # without this, func.__name__ would be "wrapper"
      def wrapper(*args, **kwargs):
          print("Before")
          result = func(*args, **kwargs)
          print("After")
          return result
      return wrapper

  @my_decorator
  def greet(name):
      """Say hello."""
      return f"Hello, {name}!"

  print(greet.__name__)  # "greet" (not "wrapper")
  print(greet.__doc__)   # "Say hello."

  # total_ordering -- auto-fill comparison methods
  @total_ordering
  class Student:
      def __init__(self, name, grade):
          self.name = name
          self.grade = grade

      def __eq__(self, other):
          return self.grade == other.grade

      def __lt__(self, other):
          return self.grade < other.grade
      # __le__, __gt__, __ge__ added automatically
  ```

  `lru_cache` is one of the most common Python optimization techniques. Important to remember: it doesn't auto-clear, can cause memory leaks with large objects or unhashable arguments, and is not suitable for methods with mutable `self` state.
section: "python"
order: 50
tags:
  - core-language
  - performance
type: "basic"
---
