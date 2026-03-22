---
ua_question: "Як працюють абстрактні класи (ABC) та Protocol?"
en_question: "How do abstract classes (ABC) and Protocol work?"
ua_answer: |
  **ABC (Abstract Base Class)** -- це клас, який не може бути інстанційований безпосередньо і вимагає від підкласів реалізації абстрактних методів. Це номінальне типізування -- клас повинен явно наслідувати від ABC.

  **Protocol** (Python 3.8+, `typing.Protocol`) -- це структурне типізування (duck typing для type checker). Клас вважається сумісним з Protocol, якщо має потрібні методи, навіть без явного наслідування. Перевірка відбувається статично (mypy) або через `runtime_checkable`.

  ABC використовується для строгих контрактів, Protocol -- для гнучких інтерфейсів без зв'язування ієрархії класів.

  ```python
  from abc import ABC, abstractmethod
  from typing import Protocol, runtime_checkable

  # ABC -- nominal typing
  class Repository(ABC):
      @abstractmethod
      def get(self, id: int):
          ...

      @abstractmethod
      def save(self, entity) -> None:
          ...

      def get_or_none(self, id: int):
          """Concrete method with default implementation."""
          try:
              return self.get(id)
          except KeyError:
              return None

  class UserRepository(Repository):
      def get(self, id: int):
          return {"id": id, "name": "Alice"}

      def save(self, entity) -> None:
          print(f"Saving {entity}")

  # repo = Repository()  # TypeError: Can't instantiate abstract class
  repo = UserRepository()  # OK

  # Protocol -- structural typing
  @runtime_checkable
  class Closeable(Protocol):
      def close(self) -> None:
          ...

  class DatabaseConn:
      def close(self) -> None:
          print("Connection closed")

  class FileHandle:
      def close(self) -> None:
          print("File closed")

  def cleanup(resource: Closeable) -> None:
      resource.close()

  # Both work -- no inheritance needed
  cleanup(DatabaseConn())
  cleanup(FileHandle())
  print(isinstance(DatabaseConn(), Closeable))  # True (runtime_checkable)

  # Abstract properties
  class Shape(ABC):
      @property
      @abstractmethod
      def area(self) -> float:
          ...

  class Circle(Shape):
      def __init__(self, radius: float):
          self.radius = radius

      @property
      def area(self) -> float:
          return 3.14159 * self.radius ** 2
  ```

  На практиці: використовуйте ABC для фреймворків, де потрібна гарантія реалізації контракту (репозиторії, адаптери). Використовуйте Protocol для бібліотечного коду та інтерфейсів, де не хочете нав'язувати ієрархію наслідування (callback-и, сервіси).
en_answer: |
  **ABC (Abstract Base Class)** is a class that cannot be instantiated directly and requires subclasses to implement abstract methods. This is nominal typing -- the class must explicitly inherit from the ABC.

  **Protocol** (Python 3.8+, `typing.Protocol`) enables structural typing (duck typing for the type checker). A class is considered compatible with a Protocol if it has the required methods, even without explicit inheritance. Checking happens statically (mypy) or via `runtime_checkable`.

  ABC is used for strict contracts, Protocol -- for flexible interfaces without coupling class hierarchies.

  ```python
  from abc import ABC, abstractmethod
  from typing import Protocol, runtime_checkable

  # ABC -- nominal typing
  class Repository(ABC):
      @abstractmethod
      def get(self, id: int):
          ...

      @abstractmethod
      def save(self, entity) -> None:
          ...

      def get_or_none(self, id: int):
          """Concrete method with default implementation."""
          try:
              return self.get(id)
          except KeyError:
              return None

  class UserRepository(Repository):
      def get(self, id: int):
          return {"id": id, "name": "Alice"}

      def save(self, entity) -> None:
          print(f"Saving {entity}")

  # repo = Repository()  # TypeError: Can't instantiate abstract class
  repo = UserRepository()  # OK

  # Protocol -- structural typing
  @runtime_checkable
  class Closeable(Protocol):
      def close(self) -> None:
          ...

  class DatabaseConn:
      def close(self) -> None:
          print("Connection closed")

  class FileHandle:
      def close(self) -> None:
          print("File closed")

  def cleanup(resource: Closeable) -> None:
      resource.close()

  # Both work -- no inheritance needed
  cleanup(DatabaseConn())
  cleanup(FileHandle())
  print(isinstance(DatabaseConn(), Closeable))  # True (runtime_checkable)

  # Abstract properties
  class Shape(ABC):
      @property
      @abstractmethod
      def area(self) -> float:
          ...

  class Circle(Shape):
      def __init__(self, radius: float):
          self.radius = radius

      @property
      def area(self) -> float:
          return 3.14159 * self.radius ** 2
  ```

  In practice: use ABC for frameworks where contract implementation must be guaranteed (repositories, adapters). Use Protocol for library code and interfaces where you do not want to impose an inheritance hierarchy (callbacks, services).
section: "python"
order: 12
tags:
  - oop
  - typing
type: "basic"
---
