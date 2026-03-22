---
ua_question: "В чому різниця між `is` та `==`?"
en_question: "What is the difference between `is` and `==`?"
ua_answer: |
  `==` порівнює **значення** (equality) -- викликає метод `__eq__` об'єкта. `is` порівнює **ідентичність** (identity) -- перевіряє, чи дві змінні посилаються на один і той самий об'єкт у пам'яті (`id(a) == id(b)`).

  **Коли використовувати `is`:** тільки для порівняння з синглтонами -- `None`, `True`, `False`. Це рекомендація PEP 8: пишіть `if x is None`, а не `if x == None`. Також `is` використовується для перевірки сентинельних значень.

  **Коли використовувати `==`:** для порівняння значень у всіх інших випадках -- числа, рядки, списки, об'єкти з визначеним `__eq__`.

  ```python
  # == compares values, is compares identity
  a = [1, 2, 3]
  b = [1, 2, 3]
  print(a == b)   # True  -- same value
  print(a is b)   # False -- different objects

  c = a
  print(a is c)   # True  -- same object

  # Always use 'is' with None
  x = None
  print(x is None)      # True  (correct)
  print(x == None)      # True  (works but bad practice)

  # Why == with None is dangerous
  class Tricky:
      def __eq__(self, other):
          return True  # equals everything

  t = Tricky()
  print(t == None)   # True  (misleading!)
  print(t is None)   # False (correct)

  # Sentinel pattern
  _MISSING = object()

  def get(dictionary, key, default=_MISSING):
      try:
          return dictionary[key]
      except KeyError:
          if default is _MISSING:
              raise
          return default

  # CPython caches small integers and some strings
  a = 256
  b = 256
  print(a is b)   # True  (cached)

  a = 257
  b = 257
  print(a is b)   # False (not cached, but may vary by context)
  ```

  Головне правило: `is` -- для ідентичності (чи це той самий об'єкт?), `==` -- для еквівалентності (чи значення однакові?). Ніколи не використовуйте `is` для порівняння чисел або рядків -- результат залежить від деталей реалізації CPython і може змінюватися.
en_answer: |
  `==` compares **values** (equality) -- calls the object's `__eq__` method. `is` compares **identity** -- checks whether two variables reference the same object in memory (`id(a) == id(b)`).

  **When to use `is`:** only for comparing with singletons -- `None`, `True`, `False`. This is a PEP 8 recommendation: write `if x is None`, not `if x == None`. Also `is` is used for checking sentinel values.

  **When to use `==`:** for comparing values in all other cases -- numbers, strings, lists, objects with defined `__eq__`.

  ```python
  # == compares values, is compares identity
  a = [1, 2, 3]
  b = [1, 2, 3]
  print(a == b)   # True  -- same value
  print(a is b)   # False -- different objects

  c = a
  print(a is c)   # True  -- same object

  # Always use 'is' with None
  x = None
  print(x is None)      # True  (correct)
  print(x == None)      # True  (works but bad practice)

  # Why == with None is dangerous
  class Tricky:
      def __eq__(self, other):
          return True  # equals everything

  t = Tricky()
  print(t == None)   # True  (misleading!)
  print(t is None)   # False (correct)

  # Sentinel pattern
  _MISSING = object()

  def get(dictionary, key, default=_MISSING):
      try:
          return dictionary[key]
      except KeyError:
          if default is _MISSING:
              raise
          return default

  # CPython caches small integers and some strings
  a = 256
  b = 256
  print(a is b)   # True  (cached)

  a = 257
  b = 257
  print(a is b)   # False (not cached, but may vary by context)
  ```

  The main rule: `is` -- for identity (is it the same object?), `==` -- for equivalence (are the values equal?). Never use `is` for comparing numbers or strings -- the result depends on CPython implementation details and can change.
section: "python"
order: 14
tags:
  - core-language
  - gotchas
type: "basic"
---
