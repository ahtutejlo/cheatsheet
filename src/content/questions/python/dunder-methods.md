---
ua_question: "Які основні dunder-методи та навіщо вони потрібні?"
en_question: "What are the main dunder methods and why are they needed?"
ua_answer: |
  Dunder-методи (double underscore, "магічні методи") -- це спеціальні методи Python, які дозволяють об'єктам інтегруватися з вбудованими операторами та функціями мови. Вони визначають поведінку об'єкта при порівнянні, арифметиці, виводі, ітерації тощо.

  **Представлення:** `__repr__` повертає однозначне представлення для розробника (ідеально -- валідний Python), `__str__` -- зрозуміле людині представлення. `__repr__` використовується як fallback, якщо `__str__` не визначений.

  **Порівняння та хешування:** `__eq__` визначає `==`, а також впливає на хешування. Якщо ви перевизначаєте `__eq__`, об'єкт стає нехешованим -- потрібно також визначити `__hash__`. Для повного набору порівнянь використовуйте `@functools.total_ordering`.

  ```python
  from functools import total_ordering

  @total_ordering
  class Money:
      def __init__(self, amount, currency="USD"):
          self.amount = amount
          self.currency = currency

      def __repr__(self):
          return f"Money({self.amount!r}, {self.currency!r})"

      def __str__(self):
          return f"{self.amount:.2f} {self.currency}"

      def __eq__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          return self.amount == other.amount and self.currency == other.currency

      def __lt__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          if self.currency != other.currency:
              raise ValueError("Cannot compare different currencies")
          return self.amount < other.amount

      def __hash__(self):
          return hash((self.amount, self.currency))

      def __add__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          if self.currency != other.currency:
              raise ValueError("Cannot add different currencies")
          return Money(self.amount + other.amount, self.currency)

      def __bool__(self):
          return self.amount != 0

      def __len__(self):
          return abs(int(self.amount * 100))  # cents

  a = Money(10.50)
  b = Money(20.00)
  print(repr(a))     # Money(10.5, 'USD')
  print(str(a))      # 10.50 USD
  print(a + b)       # 30.50 USD
  print(a < b)       # True
  print(bool(Money(0)))  # False
  ```

  Ключові групи dunder-методів: створення (`__init__`, `__new__`), представлення (`__repr__`, `__str__`, `__format__`), порівняння (`__eq__`, `__lt__`, `__hash__`), арифметика (`__add__`, `__mul__`, `__radd__`), контейнер (`__len__`, `__getitem__`, `__contains__`), контекст (`__enter__`, `__exit__`), атрибути (`__getattr__`, `__setattr__`).
en_answer: |
  Dunder methods (double underscore, "magic methods") are special Python methods that allow objects to integrate with built-in operators and language functions. They define object behavior for comparison, arithmetic, printing, iteration, and more.

  **Representation:** `__repr__` returns an unambiguous developer representation (ideally valid Python), `__str__` -- a human-readable representation. `__repr__` is used as a fallback if `__str__` is not defined.

  **Comparison and hashing:** `__eq__` defines `==` and also affects hashing. If you override `__eq__`, the object becomes unhashable -- you also need to define `__hash__`. For a full set of comparisons use `@functools.total_ordering`.

  ```python
  from functools import total_ordering

  @total_ordering
  class Money:
      def __init__(self, amount, currency="USD"):
          self.amount = amount
          self.currency = currency

      def __repr__(self):
          return f"Money({self.amount!r}, {self.currency!r})"

      def __str__(self):
          return f"{self.amount:.2f} {self.currency}"

      def __eq__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          return self.amount == other.amount and self.currency == other.currency

      def __lt__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          if self.currency != other.currency:
              raise ValueError("Cannot compare different currencies")
          return self.amount < other.amount

      def __hash__(self):
          return hash((self.amount, self.currency))

      def __add__(self, other):
          if not isinstance(other, Money):
              return NotImplemented
          if self.currency != other.currency:
              raise ValueError("Cannot add different currencies")
          return Money(self.amount + other.amount, self.currency)

      def __bool__(self):
          return self.amount != 0

      def __len__(self):
          return abs(int(self.amount * 100))  # cents

  a = Money(10.50)
  b = Money(20.00)
  print(repr(a))     # Money(10.5, 'USD')
  print(str(a))      # 10.50 USD
  print(a + b)       # 30.50 USD
  print(a < b)       # True
  print(bool(Money(0)))  # False
  ```

  Key groups of dunder methods: creation (`__init__`, `__new__`), representation (`__repr__`, `__str__`, `__format__`), comparison (`__eq__`, `__lt__`, `__hash__`), arithmetic (`__add__`, `__mul__`, `__radd__`), container (`__len__`, `__getitem__`, `__contains__`), context (`__enter__`, `__exit__`), attributes (`__getattr__`, `__setattr__`).
section: "python"
order: 10
tags:
  - oop
  - core-language
type: "basic"
---
