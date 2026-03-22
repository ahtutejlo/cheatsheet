---
ua_question: "Як працюють *args, **kwargs та розпакування аргументів?"
en_question: "How do *args, **kwargs, and argument unpacking work?"
ua_answer: |
  `*args` збирає позиційні аргументи в кортеж, а `**kwargs` збирає іменовані аргументи в словник. Це дозволяє створювати функції з довільною кількістю аргументів.

  Python має чітке впорядкування параметрів: positional → `*args` → keyword-only → `**kwargs`. Після `*args` (або голої `*`) всі параметри стають keyword-only. Оператор `/` (Python 3.8+) робить параметри перед ним positional-only.

  Розпакування працює і при виклику: `*iterable` розпаковує в позиційні аргументи, `**dict` -- в іменовані. Це також працює в присвоєннях та літералах колекцій.

  ```python
  # *args collects positional arguments into a tuple
  def log(level, *messages):
      for msg in messages:
          print(f"[{level}] {msg}")

  log("INFO", "Server started", "Port 8080")

  # **kwargs collects keyword arguments into a dict
  def create_user(**kwargs):
      return {k: v for k, v in kwargs.items() if v is not None}

  user = create_user(name="Alice", age=30, email=None)
  # {'name': 'Alice', 'age': 30}

  # Full parameter order
  def full_example(pos_only, /, normal, *, kw_only, **kwargs):
      print(pos_only, normal, kw_only, kwargs)

  full_example(1, normal=2, kw_only=3, extra=4)

  # Unpacking in function calls
  def point(x, y, z):
      return f"({x}, {y}, {z})"

  coords = [1, 2, 3]
  print(point(*coords))  # "(1, 2, 3)"

  config = {"x": 10, "y": 20, "z": 30}
  print(point(**config))  # "(10, 20, 30)"

  # Unpacking in assignments (Python 3)
  first, *middle, last = [1, 2, 3, 4, 5]
  print(first, middle, last)  # 1 [2, 3, 4] 5

  # Unpacking in literals
  merged = {**config, "w": 40}
  combined = [*coords, 4, 5]
  ```

  Розпакування аргументів -- потужний інструмент для написання гнучких API, декораторів (які повинні передавати аргументи далі) та для роботи з конфігураціями. Правильне використання keyword-only та positional-only параметрів допомагає створювати зрозумілі та стійкі до помилок інтерфейси.
en_answer: |
  `*args` collects positional arguments into a tuple, and `**kwargs` collects keyword arguments into a dictionary. This allows creating functions with an arbitrary number of arguments.

  Python has a strict parameter ordering: positional → `*args` → keyword-only → `**kwargs`. After `*args` (or bare `*`) all parameters become keyword-only. The `/` operator (Python 3.8+) makes parameters before it positional-only.

  Unpacking also works at call sites: `*iterable` unpacks into positional arguments, `**dict` -- into keyword arguments. This also works in assignments and collection literals.

  ```python
  # *args collects positional arguments into a tuple
  def log(level, *messages):
      for msg in messages:
          print(f"[{level}] {msg}")

  log("INFO", "Server started", "Port 8080")

  # **kwargs collects keyword arguments into a dict
  def create_user(**kwargs):
      return {k: v for k, v in kwargs.items() if v is not None}

  user = create_user(name="Alice", age=30, email=None)
  # {'name': 'Alice', 'age': 30}

  # Full parameter order
  def full_example(pos_only, /, normal, *, kw_only, **kwargs):
      print(pos_only, normal, kw_only, kwargs)

  full_example(1, normal=2, kw_only=3, extra=4)

  # Unpacking in function calls
  def point(x, y, z):
      return f"({x}, {y}, {z})"

  coords = [1, 2, 3]
  print(point(*coords))  # "(1, 2, 3)"

  config = {"x": 10, "y": 20, "z": 30}
  print(point(**config))  # "(10, 20, 30)"

  # Unpacking in assignments (Python 3)
  first, *middle, last = [1, 2, 3, 4, 5]
  print(first, middle, last)  # 1 [2, 3, 4] 5

  # Unpacking in literals
  merged = {**config, "w": 40}
  combined = [*coords, 4, 5]
  ```

  Argument unpacking is a powerful tool for writing flexible APIs, decorators (which must pass arguments through), and for working with configurations. Proper use of keyword-only and positional-only parameters helps create clear and error-resistant interfaces.
section: "python"
order: 8
tags:
  - core-language
  - functions
type: "basic"
---
