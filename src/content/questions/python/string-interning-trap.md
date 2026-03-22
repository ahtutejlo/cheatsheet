---
ua_question: "Коли `is` працює для рядків і що таке string interning?"
en_question: "When does `is` work for strings and what is string interning?"
ua_answer: |
  > **Trap:** Розробники помічають, що `"hello" is "hello"` повертає `True`, і вважають, що `is` можна використовувати для порівняння рядків. Насправді це працює лише для інтернованих рядків, і поведінка залежить від реалізації.

  **String interning** -- це оптимізація CPython, де певні рядки зберігаються в єдиному екземплярі. CPython автоматично інтернує: рядкові літерали, що виглядають як ідентифікатори (літери, цифри, `_`), імена атрибутів та модулів, ключі словників. Рядки з пробілами та спецсимволами зазвичай НЕ інтернуються.

  Компілятор також може об'єднувати однакові константи в одному code object (constant folding), що створює ілюзію інтернування.

  ```python
  # Interned strings (identifier-like)
  a = "hello"
  b = "hello"
  print(a is b)  # True -- interned

  # NOT interned (contains space)
  a = "hello world"
  b = "hello world"
  print(a is b)  # May be True in .py file (constant folding)
                  # but False if created dynamically

  # Dynamic strings are NOT interned
  a = "hello"
  b = "".join(["h", "e", "l", "l", "o"])
  print(a == b)  # True
  print(a is b)  # False -- different objects!

  # Explicit interning
  import sys
  a = sys.intern("hello world!")
  b = sys.intern("hello world!")
  print(a is b)  # True -- explicitly interned

  # When interning helps: large dicts with repeated string keys
  keys = [sys.intern(f"field_{i}") for i in range(1000)]
  # Saves memory and speeds up dict lookups (identity check before hash)

  # Constant folding in compiler
  a = "ab" + "cd"   # folded to "abcd" at compile time
  b = "abcd"
  print(a is b)  # True (same constant)

  x = "ab"
  c = x + "cd"      # computed at runtime
  print(c is b)  # False (different object)

  # Empty string and single characters are always interned
  a = ""
  b = ""
  print(a is b)  # True

  a = "x"
  b = "x"
  print(a is b)  # True (single char, always interned)

  # ALWAYS use == for string comparison
  name = get_user_name()
  if name == "admin":  # correct
      ...
  # if name is "admin":  # SyntaxWarning in Python 3.8+
  ```

  Python 3.8+ видає `SyntaxWarning` при використанні `is` з рядковими/числовими літералами. Це ще раз підтверджує: `is` -- тільки для `None`, `True`, `False`. Для рядків завжди використовуйте `==`.
en_answer: |
  > **Trap:** Developers notice that `"hello" is "hello"` returns `True` and assume `is` can be used for string comparison. In reality this only works for interned strings, and behavior depends on the implementation.

  **String interning** is a CPython optimization where certain strings are stored as a single instance. CPython automatically interns: string literals that look like identifiers (letters, digits, `_`), attribute and module names, dictionary keys. Strings with spaces and special characters are usually NOT interned.

  The compiler can also merge identical constants in the same code object (constant folding), creating an illusion of interning.

  ```python
  # Interned strings (identifier-like)
  a = "hello"
  b = "hello"
  print(a is b)  # True -- interned

  # NOT interned (contains space)
  a = "hello world"
  b = "hello world"
  print(a is b)  # May be True in .py file (constant folding)
                  # but False if created dynamically

  # Dynamic strings are NOT interned
  a = "hello"
  b = "".join(["h", "e", "l", "l", "o"])
  print(a == b)  # True
  print(a is b)  # False -- different objects!

  # Explicit interning
  import sys
  a = sys.intern("hello world!")
  b = sys.intern("hello world!")
  print(a is b)  # True -- explicitly interned

  # When interning helps: large dicts with repeated string keys
  keys = [sys.intern(f"field_{i}") for i in range(1000)]
  # Saves memory and speeds up dict lookups (identity check before hash)

  # Constant folding in compiler
  a = "ab" + "cd"   # folded to "abcd" at compile time
  b = "abcd"
  print(a is b)  # True (same constant)

  x = "ab"
  c = x + "cd"      # computed at runtime
  print(c is b)  # False (different object)

  # Empty string and single characters are always interned
  a = ""
  b = ""
  print(a is b)  # True

  a = "x"
  b = "x"
  print(a is b)  # True (single char, always interned)

  # ALWAYS use == for string comparison
  name = get_user_name()
  if name == "admin":  # correct
      ...
  # if name is "admin":  # SyntaxWarning in Python 3.8+
  ```

  Python 3.8+ issues a `SyntaxWarning` when using `is` with string/numeric literals. This confirms once again: `is` -- only for `None`, `True`, `False`. For strings always use `==`.
section: "python"
order: 27
tags:
  - gotchas
  - internals
type: "trick"
---
