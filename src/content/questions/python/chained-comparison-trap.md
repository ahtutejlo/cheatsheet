---
ua_question: "Як працюють ланцюгові порівняння (a < b < c) в Python?"
en_question: "How do chained comparisons (a < b < c) work in Python?"
ua_answer: |
  > **Trap:** Розробники з досвідом C/Java інтерпретують `a < b < c` як `(a < b) < c`, тобто порівняння boolean з числом. В Python це `a < b and b < c` -- математичний ланцюг порівнянь.

  Python автоматично розгортає ланцюгові порівняння: `a op1 b op2 c` стає `a op1 b and b op2 c`, де `b` обчислюється лише один раз. Це працює з будь-якими операторами порівняння (`<`, `>`, `<=`, `>=`, `==`, `!=`, `is`, `in`).

  Це елегантна фіча, але може створювати неочікувану поведінку, особливо при змішуванні різних операторів або при використанні `is` та `in` в ланцюгах.

  ```python
  # Python: chained comparison
  x = 5
  print(1 < x < 10)    # True  (1 < 5 and 5 < 10)
  print(1 < x > 3)     # True  (1 < 5 and 5 > 3)
  print(1 < x < 3)     # False (1 < 5 and 5 < 3 -> False)

  # In C/Java: (1 < x) < 10 -> True < 10 -> 1 < 10 -> True (wrong logic)

  # b is evaluated only once
  def expensive():
      print("called!")
      return 5

  print(1 < expensive() < 10)
  # "called!" prints only once

  # Surprising chains
  print(1 < 2 < 3 < 4 < 5)   # True
  print(1 < 2 > 0 < 5 == 5)  # True (all pairs satisfied)

  # Mixing is and ==
  a = 1
  print(a == 1 is True)
  # Equivalent to: a == 1 and 1 is True
  # -> True and True -> True (but confusing!)

  # Gotcha with 'in'
  print(1 in [1, 2] == True)
  # Equivalent to: 1 in [1, 2] and [1, 2] == True
  # -> True and False -> False (surprising!)

  # Better: use parentheses for clarity
  print((1 in [1, 2]) == True)  # True

  # Practical: range check
  def is_valid_port(port: int) -> bool:
      return 1 <= port <= 65535

  # Practical: equality chain
  a = b = c = 5
  print(a == b == c)  # True

  # Practical: sorted check
  def is_sorted(lst):
      return all(a <= b for a, b in zip(lst, lst[1:]))
  ```

  Ланцюгові порівняння -- це пітонічний спосіб писати перевірки діапазонів та послідовних порівнянь. Але при змішуванні `is`, `in`, `==` в одному ланцюзі результат може бути неінтуїтивним -- в таких випадках використовуйте дужки.
en_answer: |
  > **Trap:** Developers with C/Java experience interpret `a < b < c` as `(a < b) < c`, i.e., comparing a boolean with a number. In Python this is `a < b and b < c` -- a mathematical comparison chain.

  Python automatically expands chained comparisons: `a op1 b op2 c` becomes `a op1 b and b op2 c`, where `b` is evaluated only once. This works with any comparison operators (`<`, `>`, `<=`, `>=`, `==`, `!=`, `is`, `in`).

  This is an elegant feature but can create unexpected behavior, especially when mixing different operators or using `is` and `in` in chains.

  ```python
  # Python: chained comparison
  x = 5
  print(1 < x < 10)    # True  (1 < 5 and 5 < 10)
  print(1 < x > 3)     # True  (1 < 5 and 5 > 3)
  print(1 < x < 3)     # False (1 < 5 and 5 < 3 -> False)

  # In C/Java: (1 < x) < 10 -> True < 10 -> 1 < 10 -> True (wrong logic)

  # b is evaluated only once
  def expensive():
      print("called!")
      return 5

  print(1 < expensive() < 10)
  # "called!" prints only once

  # Surprising chains
  print(1 < 2 < 3 < 4 < 5)   # True
  print(1 < 2 > 0 < 5 == 5)  # True (all pairs satisfied)

  # Mixing is and ==
  a = 1
  print(a == 1 is True)
  # Equivalent to: a == 1 and 1 is True
  # -> True and True -> True (but confusing!)

  # Gotcha with 'in'
  print(1 in [1, 2] == True)
  # Equivalent to: 1 in [1, 2] and [1, 2] == True
  # -> True and False -> False (surprising!)

  # Better: use parentheses for clarity
  print((1 in [1, 2]) == True)  # True

  # Practical: range check
  def is_valid_port(port: int) -> bool:
      return 1 <= port <= 65535

  # Practical: equality chain
  a = b = c = 5
  print(a == b == c)  # True

  # Practical: sorted check
  def is_sorted(lst):
      return all(a <= b for a, b in zip(lst, lst[1:]))
  ```

  Chained comparisons are the Pythonic way to write range checks and sequential comparisons. But when mixing `is`, `in`, `==` in one chain, the result can be unintuitive -- in such cases use parentheses.
section: "python"
order: 25
tags:
  - gotchas
  - syntax
type: "trick"
---
