---
ua_question: "Як працюють дескриптори Python: __get__, __set__, __delete__?"
en_question: "How do Python descriptors work: __get__, __set__, __delete__?"
ua_answer: |
  Дескриптор — це об'єкт, що визначає поведінку доступу до атрибута іншого класу через методи `__get__`, `__set__`, `__delete__`. Це механізм, на якому побудовані `property`, `classmethod`, `staticmethod` та `functools.cached_property`.

  **Non-data descriptor** реалізує лише `__get__` (функції, classmethod, staticmethod). **Data descriptor** реалізує `__get__` і `__set__` (або `__delete__`). Різниця критична: data descriptor має пріоритет над `__dict__` екземпляра, non-data descriptor — ні.

  Протокол пошуку атрибута: 1) data descriptor з класу (або MRO); 2) `__dict__` екземпляра; 3) non-data descriptor з класу.

  ```python
  # Non-data descriptor (тільки __get__)
  class LazyProperty:
      """Обчислює значення один раз, зберігає в __dict__ екземпляра."""
      def __init__(self, func):
          self.func = func
          self.attrname = None

      def __set_name__(self, owner, name):
          self.attrname = name

      def __get__(self, obj, objtype=None):
          if obj is None:
              return self  # доступ через клас -- повертаємо дескриптор
          value = self.func(obj)
          obj.__dict__[self.attrname] = value  # кешуємо в __dict__
          return value

  class Circle:
      def __init__(self, radius):
          self.radius = radius

      @LazyProperty
      def area(self):
          import math
          return math.pi * self.radius ** 2

  c = Circle(5)
  print(c.area)   # обчислюється перший раз
  print(c.area)   # береться з __dict__ (дескриптор не викликається!)

  # Data descriptor (є __get__ і __set__)
  class Validator:
      """Validates attribute value on assignment."""
      def __set_name__(self, owner, name):
          self.name = f"_{name}"

      def __get__(self, obj, objtype=None):
          if obj is None:
              return self
          return getattr(obj, self.name, None)

      def __set__(self, obj, value):
          self.validate(value)
          setattr(obj, self.name, value)

      def validate(self, value):
          raise NotImplementedError

  class PositiveNumber(Validator):
      def validate(self, value):
          if not isinstance(value, (int, float)) or value <= 0:
              raise ValueError(f"Expected positive number, got {value!r}")

  class Product:
      price = PositiveNumber()
      quantity = PositiveNumber()

      def __init__(self, price, quantity):
          self.price = price        # викликає PositiveNumber.__set__
          self.quantity = quantity  # теж валідує

  p = Product(10.99, 5)
  # p.price = -1  # ValueError!

  # property -- вбудований data descriptor
  class Temperature:
      def __init__(self, celsius=0):
          self._celsius = celsius

      @property
      def fahrenheit(self):
          return self._celsius * 9/5 + 32

      @fahrenheit.setter
      def fahrenheit(self, value):
          self._celsius = (value - 32) * 5/9

  t = Temperature(100)
  print(t.fahrenheit)   # 212.0
  t.fahrenheit = 32
  print(t._celsius)     # 0.0

  # __set_name__ -- хук що викликається при створенні класу
  # отримує ім'я атрибута автоматично (Python 3.6+)
  class TypeChecked:
      def __set_name__(self, owner, name):
          self.public_name = name
          self.private_name = f"_{name}"

      def __init__(self, expected_type):
          self.expected_type = expected_type

      def __get__(self, obj, objtype=None):
          return getattr(obj, self.private_name)

      def __set__(self, obj, value):
          if not isinstance(value, self.expected_type):
              raise TypeError(f"{self.public_name} must be {self.expected_type}")
          setattr(obj, self.private_name, value)

  class User:
      name = TypeChecked(str)
      age = TypeChecked(int)

      def __init__(self, name, age):
          self.name = name
          self.age = age
  ```

  Дескриптори — основа Python object model. `property` — це просто зручний синтаксис для data descriptor. Якщо вам потрібна однакова логіка валідації або перетворення в кількох атрибутах одного або різних класів, дескриптор елегантніший за `property` у кожному місці.
en_answer: |
  A descriptor is an object that defines the behavior of attribute access for another class through the `__get__`, `__set__`, `__delete__` methods. This is the mechanism underlying `property`, `classmethod`, `staticmethod`, and `functools.cached_property`.

  **Non-data descriptor** implements only `__get__` (functions, classmethod, staticmethod). **Data descriptor** implements `__get__` and `__set__` (or `__delete__`). The difference is critical: a data descriptor takes priority over the instance `__dict__`, a non-data descriptor does not.

  Attribute lookup protocol: 1) data descriptor from the class (or MRO); 2) instance `__dict__`; 3) non-data descriptor from the class.

  ```python
  # Non-data descriptor (only __get__)
  class LazyProperty:
      """Computes value once, stores it in instance __dict__."""
      def __init__(self, func):
          self.func = func
          self.attrname = None

      def __set_name__(self, owner, name):
          self.attrname = name

      def __get__(self, obj, objtype=None):
          if obj is None:
              return self  # access via class -- return descriptor
          value = self.func(obj)
          obj.__dict__[self.attrname] = value  # cache in __dict__
          return value

  class Circle:
      def __init__(self, radius):
          self.radius = radius

      @LazyProperty
      def area(self):
          import math
          return math.pi * self.radius ** 2

  c = Circle(5)
  print(c.area)   # computed first time
  print(c.area)   # taken from __dict__ (descriptor not called!)

  # Data descriptor (has __get__ and __set__)
  class Validator:
      """Validates attribute value on assignment."""
      def __set_name__(self, owner, name):
          self.name = f"_{name}"

      def __get__(self, obj, objtype=None):
          if obj is None:
              return self
          return getattr(obj, self.name, None)

      def __set__(self, obj, value):
          self.validate(value)
          setattr(obj, self.name, value)

      def validate(self, value):
          raise NotImplementedError

  class PositiveNumber(Validator):
      def validate(self, value):
          if not isinstance(value, (int, float)) or value <= 0:
              raise ValueError(f"Expected positive number, got {value!r}")

  class Product:
      price = PositiveNumber()
      quantity = PositiveNumber()

      def __init__(self, price, quantity):
          self.price = price        # calls PositiveNumber.__set__
          self.quantity = quantity  # also validates

  p = Product(10.99, 5)
  # p.price = -1  # ValueError!

  # property -- built-in data descriptor
  class Temperature:
      def __init__(self, celsius=0):
          self._celsius = celsius

      @property
      def fahrenheit(self):
          return self._celsius * 9/5 + 32

      @fahrenheit.setter
      def fahrenheit(self, value):
          self._celsius = (value - 32) * 5/9

  t = Temperature(100)
  print(t.fahrenheit)   # 212.0
  t.fahrenheit = 32
  print(t._celsius)     # 0.0

  # __set_name__ -- hook called during class creation
  # automatically receives the attribute name (Python 3.6+)
  class TypeChecked:
      def __set_name__(self, owner, name):
          self.public_name = name
          self.private_name = f"_{name}"

      def __init__(self, expected_type):
          self.expected_type = expected_type

      def __get__(self, obj, objtype=None):
          return getattr(obj, self.private_name)

      def __set__(self, obj, value):
          if not isinstance(value, self.expected_type):
              raise TypeError(f"{self.public_name} must be {self.expected_type}")
          setattr(obj, self.private_name, value)

  class User:
      name = TypeChecked(str)
      age = TypeChecked(int)

      def __init__(self, name, age):
          self.name = name
          self.age = age
  ```

  Descriptors are the foundation of the Python object model. `property` is just syntactic sugar for a data descriptor. If you need the same validation or transformation logic across multiple attributes of one or different classes, a descriptor is more elegant than a `property` in each place.
section: "python"
order: 49
tags:
  - core-language
  - oop
type: "deep"
---
