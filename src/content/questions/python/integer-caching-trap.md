---
ua_question: "Чому `is` іноді працює для порівняння чисел, а іноді ні?"
en_question: "Why does `is` sometimes work for comparing numbers and sometimes not?"
ua_answer: |
  > **Trap:** Розробники помічають, що `256 is 256` повертає `True`, і починають використовувати `is` для порівняння чисел. Але `257 is 257` може повернути `False`, бо CPython кешує лише цілі числа від -5 до 256.

  CPython створює та кешує об'єкти для цілих чисел в діапазоні [-5, 256] при старті інтерпретатора. Будь-яке використання числа з цього діапазону повертає той самий об'єкт. Числа за межами діапазону створюються як нові об'єкти при кожному використанні.

  Поведінка `is` для чисел за межами кешу залежить від контексту: в інтерактивному REPL кожний рядок компілюється окремо, а в модулі/функції компілятор може оптимізувати і перевикористати константи.

  ```python
  # Cached range: -5 to 256
  a = 256
  b = 256
  print(a is b)  # True -- same cached object

  a = 257
  b = 257
  print(a is b)  # False in REPL, may be True in a .py file!

  a = -5
  b = -5
  print(a is b)  # True -- lower bound of cache

  a = -6
  b = -6
  print(a is b)  # False in REPL

  # In a .py file or function, compiler may fold constants:
  def test():
      a = 1000
      b = 1000
      return a is b  # Often True! (compiler optimization)

  # NEVER rely on this behavior!
  print(test())  # True (CPython implementation detail)

  # Same applies to operations
  a = 200 + 57
  b = 257
  print(a is b)  # False (computed at runtime, not cached)

  a = 200 + 56
  b = 256
  print(a is b)  # True (result is in cache range)

  # The fix: ALWAYS use == for value comparison
  x = 1000
  y = 1000
  print(x == y)  # True -- always correct
  print(x is y)  # Unpredictable -- never use for values!

  # id() shows object identity
  print(id(256), id(256))   # same id
  print(id(257), id(257))   # may differ
  ```

  Це чисто деталь реалізації CPython -- інші інтерпретатори (PyPy, Jython) можуть кешувати інші діапазони або не кешувати зовсім. Правило залишається незмінним: `is` тільки для `None`, `True`, `False`; `==` для всього іншого.
en_answer: |
  > **Trap:** Developers notice that `256 is 256` returns `True` and start using `is` for number comparison. But `257 is 257` may return `False` because CPython only caches integers from -5 to 256.

  CPython creates and caches objects for integers in the range [-5, 256] at interpreter startup. Any use of a number in this range returns the same object. Numbers outside the range are created as new objects each time.

  The behavior of `is` for numbers outside the cache depends on context: in an interactive REPL each line is compiled separately, while in a module/function the compiler may optimize and reuse constants.

  ```python
  # Cached range: -5 to 256
  a = 256
  b = 256
  print(a is b)  # True -- same cached object

  a = 257
  b = 257
  print(a is b)  # False in REPL, may be True in a .py file!

  a = -5
  b = -5
  print(a is b)  # True -- lower bound of cache

  a = -6
  b = -6
  print(a is b)  # False in REPL

  # In a .py file or function, compiler may fold constants:
  def test():
      a = 1000
      b = 1000
      return a is b  # Often True! (compiler optimization)

  # NEVER rely on this behavior!
  print(test())  # True (CPython implementation detail)

  # Same applies to operations
  a = 200 + 57
  b = 257
  print(a is b)  # False (computed at runtime, not cached)

  a = 200 + 56
  b = 256
  print(a is b)  # True (result is in cache range)

  # The fix: ALWAYS use == for value comparison
  x = 1000
  y = 1000
  print(x == y)  # True -- always correct
  print(x is y)  # Unpredictable -- never use for values!

  # id() shows object identity
  print(id(256), id(256))   # same id
  print(id(257), id(257))   # may differ
  ```

  This is purely a CPython implementation detail -- other interpreters (PyPy, Jython) may cache different ranges or not cache at all. The rule remains the same: `is` only for `None`, `True`, `False`; `==` for everything else.
section: "python"
order: 24
tags:
  - gotchas
  - internals
type: "trick"
---
