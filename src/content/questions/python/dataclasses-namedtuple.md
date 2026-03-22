---
ua_question: "В чому різниця між dataclasses, namedtuple та звичайними класами?"
en_question: "What is the difference between dataclasses, namedtuple, and regular classes?"
ua_answer: |
  Python пропонує кілька способів створення класів-контейнерів даних, кожен зі своїми перевагами.

  **namedtuple** -- імутабельний, легковісний, наслідує від tuple. Ідеальний для простих записів з фіксованими полями. Не підтримує значення за замовчуванням (до Python 3.6.1), не дозволяє мутацію.

  **dataclass** (Python 3.7+) -- генерує `__init__`, `__repr__`, `__eq__` автоматично. Мутабельний за замовчуванням, підтримує значення за замовчуванням, наслідування, post-init обробку. Може бути заморожений (`frozen=True`) для імутабельності.

  **Звичайний клас** -- повний контроль, але потребує написання boilerplate коду вручну. Використовуйте, коли потрібна складна логіка ініціалізації або нестандартна поведінка.

  ```python
  from collections import namedtuple
  from dataclasses import dataclass, field
  from typing import List

  # namedtuple -- immutable, lightweight
  Point = namedtuple("Point", ["x", "y"])
  p = Point(1, 2)
  print(p.x, p[0])   # 1 1
  # p.x = 5          # AttributeError
  x, y = p            # unpacking works (it's a tuple)

  # dataclass -- mutable by default, rich features
  @dataclass
  class User:
      name: str
      age: int
      email: str = ""
      tags: List[str] = field(default_factory=list)

      def __post_init__(self):
          self.name = self.name.strip().title()

  u = User("  alice  ", 30)
  print(u)  # User(name='Alice', age=30, email='', tags=[])
  u.age = 31  # OK -- mutable

  # Frozen dataclass -- immutable, hashable
  @dataclass(frozen=True)
  class Config:
      host: str
      port: int
      debug: bool = False

  c = Config("localhost", 8080)
  # c.port = 9090  # FrozenInstanceError
  config_set = {c}   # OK -- frozen dataclasses are hashable

  # dataclass with slots (Python 3.10+)
  @dataclass(slots=True)
  class FastPoint:
      x: float
      y: float
      # Uses __slots__ -- less memory, faster attribute access

  # Comparison
  import sys
  print(sys.getsizeof(Point(1, 2)))      # ~64 bytes
  print(sys.getsizeof(User("a", 1)))     # ~48 bytes (just the instance)
  print(sys.getsizeof(FastPoint(1, 2)))   # ~48 bytes (no __dict__)
  ```

  Правило вибору: `namedtuple` для простих імутабельних записів (координати, результати запитів), `dataclass` для більшості випадків (моделі, конфігурації, DTO), звичайний клас для складної бізнес-логіки. `@dataclass(frozen=True, slots=True)` -- найкращий вибір для продуктивності та безпеки.
en_answer: |
  Python offers several ways to create data container classes, each with its own advantages.

  **namedtuple** -- immutable, lightweight, inherits from tuple. Ideal for simple records with fixed fields. Does not support default values (before Python 3.6.1), does not allow mutation.

  **dataclass** (Python 3.7+) -- generates `__init__`, `__repr__`, `__eq__` automatically. Mutable by default, supports default values, inheritance, post-init processing. Can be frozen (`frozen=True`) for immutability.

  **Regular class** -- full control but requires writing boilerplate code manually. Use when you need complex initialization logic or non-standard behavior.

  ```python
  from collections import namedtuple
  from dataclasses import dataclass, field
  from typing import List

  # namedtuple -- immutable, lightweight
  Point = namedtuple("Point", ["x", "y"])
  p = Point(1, 2)
  print(p.x, p[0])   # 1 1
  # p.x = 5          # AttributeError
  x, y = p            # unpacking works (it's a tuple)

  # dataclass -- mutable by default, rich features
  @dataclass
  class User:
      name: str
      age: int
      email: str = ""
      tags: List[str] = field(default_factory=list)

      def __post_init__(self):
          self.name = self.name.strip().title()

  u = User("  alice  ", 30)
  print(u)  # User(name='Alice', age=30, email='', tags=[])
  u.age = 31  # OK -- mutable

  # Frozen dataclass -- immutable, hashable
  @dataclass(frozen=True)
  class Config:
      host: str
      port: int
      debug: bool = False

  c = Config("localhost", 8080)
  # c.port = 9090  # FrozenInstanceError
  config_set = {c}   # OK -- frozen dataclasses are hashable

  # dataclass with slots (Python 3.10+)
  @dataclass(slots=True)
  class FastPoint:
      x: float
      y: float
      # Uses __slots__ -- less memory, faster attribute access

  # Comparison
  import sys
  print(sys.getsizeof(Point(1, 2)))      # ~64 bytes
  print(sys.getsizeof(User("a", 1)))     # ~48 bytes (just the instance)
  print(sys.getsizeof(FastPoint(1, 2)))   # ~48 bytes (no __dict__)
  ```

  Rule of thumb: `namedtuple` for simple immutable records (coordinates, query results), `dataclass` for most cases (models, configs, DTOs), regular class for complex business logic. `@dataclass(frozen=True, slots=True)` is the best choice for performance and safety.
section: "python"
order: 11
tags:
  - oop
  - data-structures
type: "basic"
---
