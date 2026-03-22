---
ua_question: "Як працюють comprehensions та generator expressions?"
en_question: "How do comprehensions and generator expressions work?"
ua_answer: |
  Comprehensions -- це компактний синтаксис для створення колекцій. Python підтримує list, dict, set comprehensions та generator expressions.

  **List comprehension** створює новий список, обчислюючи вираз для кожного елемента ітерованого об'єкта. Може включати фільтрацію через `if` та вкладені цикли. Dict і set comprehensions працюють аналогічно.

  **Generator expression** виглядає як list comprehension, але в круглих дужках. Він не створює колекцію в пам'яті, а повертає генератор, що обчислює значення ліниво (по одному). Це критично для великих даних.

  ```python
  # List comprehension
  squares = [x ** 2 for x in range(10)]
  evens = [x for x in range(20) if x % 2 == 0]

  # Nested comprehension (flatten)
  matrix = [[1, 2], [3, 4], [5, 6]]
  flat = [num for row in matrix for num in row]
  # [1, 2, 3, 4, 5, 6]

  # Dict comprehension
  word = "hello"
  char_count = {c: word.count(c) for c in set(word)}
  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}

  # Set comprehension
  unique_lengths = {len(w) for w in ["hi", "hello", "ok", "hi"]}
  # {2, 5}

  # Generator expression -- lazy evaluation
  gen = (x ** 2 for x in range(1_000_000))
  print(next(gen))  # 0
  print(next(gen))  # 1
  # Memory: gen uses ~100 bytes vs list ~8MB

  # Generator in function calls (no extra parens needed)
  total = sum(x ** 2 for x in range(1000))
  has_even = any(x % 2 == 0 for x in [1, 3, 4, 7])

  # Walrus operator in comprehension (Python 3.8+)
  results = [y for x in range(10) if (y := x ** 2) > 20]
  # [25, 36, 49, 64, 81]
  ```

  Використовуйте list comprehension для невеликих/середніх колекцій, де потрібен повторний доступ. Generator expression -- для одноразової ітерації або великих даних. Уникайте складних вкладених comprehensions -- краще розбити на кілька рядків або використати звичайний цикл.
en_answer: |
  Comprehensions are a compact syntax for creating collections. Python supports list, dict, set comprehensions and generator expressions.

  **List comprehension** creates a new list by computing an expression for each element of an iterable. It can include filtering via `if` and nested loops. Dict and set comprehensions work similarly.

  **Generator expression** looks like a list comprehension but uses parentheses. It does not create a collection in memory but returns a generator that computes values lazily (one at a time). This is critical for large data.

  ```python
  # List comprehension
  squares = [x ** 2 for x in range(10)]
  evens = [x for x in range(20) if x % 2 == 0]

  # Nested comprehension (flatten)
  matrix = [[1, 2], [3, 4], [5, 6]]
  flat = [num for row in matrix for num in row]
  # [1, 2, 3, 4, 5, 6]

  # Dict comprehension
  word = "hello"
  char_count = {c: word.count(c) for c in set(word)}
  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}

  # Set comprehension
  unique_lengths = {len(w) for w in ["hi", "hello", "ok", "hi"]}
  # {2, 5}

  # Generator expression -- lazy evaluation
  gen = (x ** 2 for x in range(1_000_000))
  print(next(gen))  # 0
  print(next(gen))  # 1
  # Memory: gen uses ~100 bytes vs list ~8MB

  # Generator in function calls (no extra parens needed)
  total = sum(x ** 2 for x in range(1000))
  has_even = any(x % 2 == 0 for x in [1, 3, 4, 7])

  # Walrus operator in comprehension (Python 3.8+)
  results = [y for x in range(10) if (y := x ** 2) > 20]
  # [25, 36, 49, 64, 81]
  ```

  Use list comprehension for small/medium collections where repeated access is needed. Generator expression -- for one-time iteration or large data. Avoid complex nested comprehensions -- it is better to split into multiple lines or use a regular loop.
section: "python"
order: 4
tags:
  - core-language
  - syntax
type: "basic"
---
