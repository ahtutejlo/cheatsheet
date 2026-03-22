---
ua_question: "Як працюють type hints: Optional, Generic, TypeVar, Protocol?"
en_question: "How do type hints work: Optional, Generic, TypeVar, Protocol?"
ua_answer: |
  Type hints -- це анотації типів, що не впливають на виконання коду, але дозволяють статичним аналізаторам (mypy, pyright) знаходити помилки до запуску програми.

  **Optional[X]** еквівалентний `X | None` (Python 3.10+). Означає, що значення може бути типу X або None.

  **TypeVar** створює параметр типу для generic функцій і класів. Забезпечує зв'язок між типами вхідних і вихідних значень.

  **Generic** дозволяє створювати параметризовані класи -- контейнери, які зберігають типову інформацію для статичного аналізу.

  ```python
  from typing import (
      Optional, TypeVar, Generic, Protocol,
      List, Dict, Tuple, Union, Callable, Literal
  )

  # Optional -- value or None
  def find_user(user_id: int) -> Optional[dict]:
      if user_id <= 0:
          return None
      return {"id": user_id, "name": "Alice"}

  # Python 3.10+ syntax
  def find_user_modern(user_id: int) -> dict | None:
      ...

  # TypeVar -- generic functions
  T = TypeVar("T")
  K = TypeVar("K")
  V = TypeVar("V")

  def first(items: List[T]) -> T:
      return items[0]

  result = first([1, 2, 3])    # inferred as int
  result = first(["a", "b"])   # inferred as str

  # Bounded TypeVar
  from numbers import Number
  N = TypeVar("N", bound=Number)

  def add(a: N, b: N) -> N:
      return a + b

  # Generic class
  class Stack(Generic[T]):
      def __init__(self) -> None:
          self._items: List[T] = []

      def push(self, item: T) -> None:
          self._items.append(item)

      def pop(self) -> T:
          return self._items.pop()

  stack: Stack[int] = Stack()
  stack.push(1)
  # stack.push("x")  # mypy error: expected int

  # Callable type hints
  Handler = Callable[[str, int], bool]

  def register(path: str, handler: Handler) -> None:
      ...

  # Literal for specific values
  def set_mode(mode: Literal["read", "write", "append"]) -> None:
      ...

  # TypedDict for structured dicts
  from typing import TypedDict

  class UserDict(TypedDict):
      name: str
      age: int
      email: str

  user: UserDict = {"name": "Alice", "age": 30, "email": "a@b.com"}
  ```

  Type hints значно покращують якість коду: IDE надає кращий автокомпліт, рефакторинг стає безпечнішим, а баги виявляються до запуску. Рекомендація: завжди анотуйте публічні API, використовуйте `mypy --strict` для критичних проєктів.
en_answer: |
  Type hints are type annotations that do not affect code execution but allow static analyzers (mypy, pyright) to find errors before running the program.

  **Optional[X]** is equivalent to `X | None` (Python 3.10+). Means the value can be of type X or None.

  **TypeVar** creates a type parameter for generic functions and classes. Ensures a relationship between input and output types.

  **Generic** allows creating parameterized classes -- containers that preserve type information for static analysis.

  ```python
  from typing import (
      Optional, TypeVar, Generic, Protocol,
      List, Dict, Tuple, Union, Callable, Literal
  )

  # Optional -- value or None
  def find_user(user_id: int) -> Optional[dict]:
      if user_id <= 0:
          return None
      return {"id": user_id, "name": "Alice"}

  # Python 3.10+ syntax
  def find_user_modern(user_id: int) -> dict | None:
      ...

  # TypeVar -- generic functions
  T = TypeVar("T")
  K = TypeVar("K")
  V = TypeVar("V")

  def first(items: List[T]) -> T:
      return items[0]

  result = first([1, 2, 3])    # inferred as int
  result = first(["a", "b"])   # inferred as str

  # Bounded TypeVar
  from numbers import Number
  N = TypeVar("N", bound=Number)

  def add(a: N, b: N) -> N:
      return a + b

  # Generic class
  class Stack(Generic[T]):
      def __init__(self) -> None:
          self._items: List[T] = []

      def push(self, item: T) -> None:
          self._items.append(item)

      def pop(self) -> T:
          return self._items.pop()

  stack: Stack[int] = Stack()
  stack.push(1)
  # stack.push("x")  # mypy error: expected int

  # Callable type hints
  Handler = Callable[[str, int], bool]

  def register(path: str, handler: Handler) -> None:
      ...

  # Literal for specific values
  def set_mode(mode: Literal["read", "write", "append"]) -> None:
      ...

  # TypedDict for structured dicts
  from typing import TypedDict

  class UserDict(TypedDict):
      name: str
      age: int
      email: str

  user: UserDict = {"name": "Alice", "age": 30, "email": "a@b.com"}
  ```

  Type hints significantly improve code quality: IDEs provide better autocompletion, refactoring becomes safer, and bugs are detected before running. Recommendation: always annotate public APIs, use `mypy --strict` for critical projects.
section: "python"
order: 15
tags:
  - typing
  - core-language
type: "basic"
---
