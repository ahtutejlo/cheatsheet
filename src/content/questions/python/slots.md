---
ua_question: "Що таке __slots__ і коли їх використовувати?"
en_question: "What are __slots__ and when should you use them?"
ua_answer: |
  За замовчуванням кожен екземпляр Python-класу має `__dict__` — словник для зберігання атрибутів. `__slots__` замінює цей словник фіксованим набором дескрипторів на рівні класу, що економить пам'ять і прискорює доступ до атрибутів.

  Коли визначено `__slots__`, Python не створює `__dict__` для екземплярів — атрибути зберігаються у компактній структурі даних. Виграш у пам'яті зазвичай 40-50% для класів з кількома атрибутами; виграш у швидкості доступу — 10-20%.

  **Підводні камені:** при наслідуванні `__slots__` потрібно визначати в кожному класі ієрархії; якщо батьківський клас не має `__slots__`, `__dict__` все одно буде у дочірнього класу; `__slots__` несумісний з деякими метапрограмними патернами.

  ```python
  import sys

  # Звичайний клас — є __dict__
  class PointDict:
      def __init__(self, x, y):
          self.x = x
          self.y = y

  # Клас зі slots — без __dict__
  class PointSlots:
      __slots__ = ("x", "y")

      def __init__(self, x, y):
          self.x = x
          self.y = y

  # Порівняння пам'яті
  p_dict = PointDict(1, 2)
  p_slots = PointSlots(1, 2)

  print(sys.getsizeof(p_dict))    # ~48 bytes (тільки об'єкт)
  print(sys.getsizeof(p_dict.__dict__))  # ~232 bytes (dict overhead!)
  print(sys.getsizeof(p_slots))   # ~56 bytes (включно зі slots)
  # p_slots.__dict__  -- AttributeError!

  # Slots забороняють довільні атрибути
  p_slots.z = 3  # AttributeError: 'PointSlots' object has no attribute 'z'

  # Slots при наслідуванні
  class Point3D(PointSlots):
      __slots__ = ("z",)  # тільки нові атрибути

      def __init__(self, x, y, z):
          super().__init__(x, y)
          self.z = z

  # Якщо не визначити __slots__ у підкласі -- __dict__ повернеться
  class BadChild(PointSlots):
      pass  # тепер є і __dict__, і успадковані slots

  # Slots з default значеннями через ClassVar
  from typing import ClassVar

  class Config:
      __slots__ = ("host", "port")
      DEFAULT_PORT: ClassVar[int] = 8080  # ClassVar — на рівні класу, не екземпляра

      def __init__(self, host, port=None):
          self.host = host
          self.port = port or self.DEFAULT_PORT

  # dataclasses зі slots (Python 3.10+)
  from dataclasses import dataclass

  @dataclass(slots=True)
  class Vector:
      x: float
      y: float
      z: float

  v = Vector(1.0, 2.0, 3.0)
  # v.__dict__  -- AttributeError!

  # Коли НЕ варто використовувати slots:
  # - Класи з динамічним набором атрибутів
  # - Pickle/copy якщо є кастомна логіка
  # - Множинне наслідування від кількох класів зі slots
  ```

  `__slots__` корисні для high-performance об'єктів, що створюються мільйонами разів (трейдинг, обробка даних, ігрові об'єкти). У Python 3.10+ `@dataclass(slots=True)` — найзручніший спосіб отримати ці переваги без ручного оголошення.
en_answer: |
  By default, every Python class instance has a `__dict__` — a dictionary for storing attributes. `__slots__` replaces this dictionary with a fixed set of descriptors at the class level, saving memory and speeding up attribute access.

  When `__slots__` is defined, Python does not create `__dict__` for instances — attributes are stored in a compact data structure. Memory savings are typically 40-50% for classes with a few attributes; attribute access speed gains are 10-20%.

  **Pitfalls:** in inheritance, `__slots__` must be defined in each class in the hierarchy; if a parent class does not have `__slots__`, the child class will still have `__dict__`; `__slots__` is incompatible with some metaprogramming patterns.

  ```python
  import sys

  # Regular class -- has __dict__
  class PointDict:
      def __init__(self, x, y):
          self.x = x
          self.y = y

  # Class with slots -- no __dict__
  class PointSlots:
      __slots__ = ("x", "y")

      def __init__(self, x, y):
          self.x = x
          self.y = y

  # Memory comparison
  p_dict = PointDict(1, 2)
  p_slots = PointSlots(1, 2)

  print(sys.getsizeof(p_dict))    # ~48 bytes (object only)
  print(sys.getsizeof(p_dict.__dict__))  # ~232 bytes (dict overhead!)
  print(sys.getsizeof(p_slots))   # ~56 bytes (including slots)
  # p_slots.__dict__  -- AttributeError!

  # Slots prevent arbitrary attributes
  p_slots.z = 3  # AttributeError: 'PointSlots' object has no attribute 'z'

  # Slots in inheritance
  class Point3D(PointSlots):
      __slots__ = ("z",)  # only new attributes

      def __init__(self, x, y, z):
          super().__init__(x, y)
          self.z = z

  # If __slots__ is not defined in a subclass -- __dict__ comes back
  class BadChild(PointSlots):
      pass  # now has both __dict__ and inherited slots

  # dataclasses with slots (Python 3.10+)
  from dataclasses import dataclass

  @dataclass(slots=True)
  class Vector:
      x: float
      y: float
      z: float

  v = Vector(1.0, 2.0, 3.0)
  # v.__dict__  -- AttributeError!

  # When NOT to use slots:
  # - Classes with dynamic attribute sets
  # - Pickle/copy with custom logic
  # - Multiple inheritance from multiple slotted classes
  ```

  `__slots__` are useful for high-performance objects created millions of times (trading, data processing, game objects). In Python 3.10+, `@dataclass(slots=True)` is the most convenient way to get these benefits without manual declaration.
section: "python"
order: 48
tags:
  - core-language
  - oop
  - performance
type: "basic"
---
