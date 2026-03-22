---
ua_question: "Що таке мутабельні та імутабельні типи в Python?"
en_question: "What are mutable vs immutable types in Python?"
ua_answer: |
  В Python всі об'єкти поділяються на **мутабельні** (можна змінити після створення) та **імутабельні** (не можна змінити після створення).

  **Імутабельні типи:** `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`, `bool`. Коли ви "змінюєте" імутабельний об'єкт, Python насправді створює новий об'єкт в пам'яті. Саме тому імутабельні типи можуть бути ключами словника та елементами множини -- їхній хеш ніколи не зміниться.

  **Мутабельні типи:** `list`, `dict`, `set`, `bytearray`, а також більшість користувацьких класів. Зміна мутабельного об'єкта не створює нового -- всі посилання на нього бачать зміни.

  ```python
  # Immutable: "changing" creates a new object
  a = "hello"
  b = a
  a += " world"
  print(b)        # "hello" -- b still points to original
  print(id(a) == id(b))  # False -- a is a new object

  # Mutable: changes are visible through all references
  x = [1, 2, 3]
  y = x
  x.append(4)
  print(y)        # [1, 2, 3, 4] -- same object
  print(id(x) == id(y))  # True -- same object

  # Tuples are immutable but can contain mutable objects
  t = ([1, 2], [3, 4])
  t[0].append(99)
  print(t)        # ([1, 2, 99], [3, 4]) -- inner list changed
  # t[0] = [5]    # TypeError: 'tuple' does not support item assignment
  ```

  Розуміння мутабельності критично важливе для уникнення багів із спільними посиланнями, дефолтними аргументами функцій та передачею об'єктів між потоками. Правило: якщо потрібна гарантія незмінності -- використовуйте імутабельні типи.
en_answer: |
  In Python all objects are divided into **mutable** (can be changed after creation) and **immutable** (cannot be changed after creation).

  **Immutable types:** `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`, `bool`. When you "change" an immutable object, Python actually creates a new object in memory. This is why immutable types can be dictionary keys and set elements -- their hash never changes.

  **Mutable types:** `list`, `dict`, `set`, `bytearray`, and most user-defined classes. Changing a mutable object does not create a new one -- all references to it see the changes.

  ```python
  # Immutable: "changing" creates a new object
  a = "hello"
  b = a
  a += " world"
  print(b)        # "hello" -- b still points to original
  print(id(a) == id(b))  # False -- a is a new object

  # Mutable: changes are visible through all references
  x = [1, 2, 3]
  y = x
  x.append(4)
  print(y)        # [1, 2, 3, 4] -- same object
  print(id(x) == id(y))  # True -- same object

  # Tuples are immutable but can contain mutable objects
  t = ([1, 2], [3, 4])
  t[0].append(99)
  print(t)        # ([1, 2, 99], [3, 4]) -- inner list changed
  # t[0] = [5]    # TypeError: 'tuple' does not support item assignment
  ```

  Understanding mutability is critical to avoiding bugs with shared references, default function arguments, and passing objects between threads. The rule: if you need a guarantee of immutability -- use immutable types.
section: "python"
order: 1
tags:
  - core-language
  - types
type: "basic"
---
