---
ua_question: "Що станеться, якщо використати мутабельний об'єкт як значення за замовчуванням?"
en_question: "What happens if you use a mutable object as a default argument?"
ua_answer: |
  > **Trap:** Розробники часто пишуть `def f(items=[])`, очікуючи, що кожен виклик отримає новий порожній список. Насправді список створюється один раз при визначенні функції і спільний між усіма викликами.

  Дефолтні аргументи обчислюються один раз -- при визначенні функції (`def`), а не при кожному виклику. Для імутабельних типів (`int`, `str`, `None`) це не проблема, бо їх не можна змінити. Але мутабельні типи (`list`, `dict`, `set`) зберігають зміни між викликами, що призводить до неочікуваних багів.

  Правильний патерн -- використовувати `None` як дефолт і створювати об'єкт всередині функції.

  ```python
  # BUG: mutable default argument
  def add_item(item, items=[]):
      items.append(item)
      return items

  print(add_item("a"))  # ['a']
  print(add_item("b"))  # ['a', 'b'] -- BUG! Expected ['b']
  print(add_item("c"))  # ['a', 'b', 'c'] -- keeps growing!

  # The default list is stored as function attribute
  print(add_item.__defaults__)  # (['a', 'b', 'c'],)

  # CORRECT: use None as default
  def add_item_fixed(item, items=None):
      if items is None:
          items = []
      items.append(item)
      return items

  print(add_item_fixed("a"))  # ['a']
  print(add_item_fixed("b"))  # ['b'] -- correct!

  # Same issue with dict
  def bad_cache(key, value, cache={}):
      cache[key] = value
      return cache

  bad_cache("a", 1)
  print(bad_cache("b", 2))  # {'a': 1, 'b': 2} -- shared!

  # Same issue with set
  def bad_collect(item, seen=set()):
      seen.add(item)
      return seen

  # Intentional use: memoization
  def fibonacci(n, memo={}):
      if n in memo:
          return memo[n]
      if n <= 1:
          return n
      memo[n] = fibonacci(n - 1) + fibonacci(n - 2)
      return memo[n]
  # This works because we WANT shared state
  ```

  Цей баг особливо підступний у тестах: тести проходять ізольовано, але падають при запуску разом, бо спільний дефолтний об'єкт "забруднюється" між тестами. Деякі лінтери (pylint, ruff) мають правило для виявлення мутабельних дефолтів (`B006`, `W0102`).
en_answer: |
  > **Trap:** Developers often write `def f(items=[])`, expecting each call to get a new empty list. In reality, the list is created once at function definition time and shared between all calls.

  Default arguments are evaluated once -- at function definition time (`def`), not at each call. For immutable types (`int`, `str`, `None`) this is not a problem since they cannot be changed. But mutable types (`list`, `dict`, `set`) retain changes between calls, leading to unexpected bugs.

  The correct pattern is to use `None` as default and create the object inside the function.

  ```python
  # BUG: mutable default argument
  def add_item(item, items=[]):
      items.append(item)
      return items

  print(add_item("a"))  # ['a']
  print(add_item("b"))  # ['a', 'b'] -- BUG! Expected ['b']
  print(add_item("c"))  # ['a', 'b', 'c'] -- keeps growing!

  # The default list is stored as function attribute
  print(add_item.__defaults__)  # (['a', 'b', 'c'],)

  # CORRECT: use None as default
  def add_item_fixed(item, items=None):
      if items is None:
          items = []
      items.append(item)
      return items

  print(add_item_fixed("a"))  # ['a']
  print(add_item_fixed("b"))  # ['b'] -- correct!

  # Same issue with dict
  def bad_cache(key, value, cache={}):
      cache[key] = value
      return cache

  bad_cache("a", 1)
  print(bad_cache("b", 2))  # {'a': 1, 'b': 2} -- shared!

  # Same issue with set
  def bad_collect(item, seen=set()):
      seen.add(item)
      return seen

  # Intentional use: memoization
  def fibonacci(n, memo={}):
      if n in memo:
          return memo[n]
      if n <= 1:
          return n
      memo[n] = fibonacci(n - 1) + fibonacci(n - 2)
      return memo[n]
  # This works because we WANT shared state
  ```

  This bug is particularly insidious in tests: tests pass in isolation but fail when run together because the shared default object gets "polluted" between tests. Some linters (pylint, ruff) have rules for detecting mutable defaults (`B006`, `W0102`).
section: "python"
order: 21
tags:
  - gotchas
  - functions
type: "trick"
---
