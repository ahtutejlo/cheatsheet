---
ua_question: "Як працює система імпортів: пошук модулів, циклічні імпорти?"
en_question: "How does the import system work: module resolution, circular imports?"
ua_answer: |
  Система імпортів Python шукає модулі в певному порядку: `sys.modules` (кеш) → вбудовані модулі → `sys.path` (список директорій). `sys.path` включає директорію скрипта, PYTHONPATH, site-packages.

  **Процес імпорту:** 1) перевірка `sys.modules` -- якщо модуль вже завантажений, повертається кешований об'єкт; 2) пошук finder'а, який може знайти модуль; 3) loader створює module object і виконує код модуля; 4) результат кешується в `sys.modules`.

  **Циклічні імпорти** виникають, коли модуль A імпортує B, а B імпортує A. Python не падає -- він повертає частково ініціалізований об'єкт модуля з кешу. Але атрибути, визначені після точки циклу, будуть відсутні, що призводить до `ImportError` або `AttributeError`.

  ```python
  # Module resolution order
  import sys
  print(sys.path)
  # ['', '/usr/lib/python3.11', '/usr/lib/python3.11/site-packages', ...]

  # Check if module is cached
  print("json" in sys.modules)  # True if already imported

  # Relative imports (inside packages)
  # mypackage/
  #   __init__.py
  #   module_a.py
  #   subpackage/
  #     __init__.py
  #     module_b.py

  # In module_b.py:
  # from .. import module_a       # parent package
  # from ..module_a import func   # specific name from parent
  # from . import sibling         # same package

  # Circular import problem
  # --- file: models.py ---
  # from services import process_user  # imports services
  # class User:
  #     ...

  # --- file: services.py ---
  # from models import User  # imports models -- CIRCULAR!
  # def process_user(user: User):
  #     ...

  # Solutions for circular imports:

  # 1. Import inside function (lazy import)
  def process_user(user):
      from models import User  # imported only when called
      ...

  # 2. TYPE_CHECKING guard (best for type hints)
  from __future__ import annotations
  from typing import TYPE_CHECKING

  if TYPE_CHECKING:
      from models import User  # only for type checkers, not at runtime

  def process_user(user: "User") -> None:
      ...

  # 3. Restructure: extract shared code to a third module

  # importlib for dynamic imports
  import importlib
  module = importlib.import_module("json")
  data = module.loads('{"key": "value"}')

  # Reload module (useful in testing/development)
  importlib.reload(module)
  ```

  Найкращі практики: уникайте циклічних імпортів через реструктуризацію коду (dependency inversion), використовуйте `TYPE_CHECKING` для type hints, lazy imports для опціональних залежностей. Знання системи імпортів допомагає розуміти помилки `ModuleNotFoundError` та структурувати великі проєкти.
en_answer: |
  The Python import system searches for modules in a specific order: `sys.modules` (cache) -> built-in modules -> `sys.path` (list of directories). `sys.path` includes the script directory, PYTHONPATH, and site-packages.

  **Import process:** 1) check `sys.modules` -- if the module is already loaded, the cached object is returned; 2) find a finder that can locate the module; 3) loader creates a module object and executes the module code; 4) the result is cached in `sys.modules`.

  **Circular imports** occur when module A imports B and B imports A. Python does not crash -- it returns a partially initialized module object from the cache. But attributes defined after the cycle point will be missing, leading to `ImportError` or `AttributeError`.

  ```python
  # Module resolution order
  import sys
  print(sys.path)
  # ['', '/usr/lib/python3.11', '/usr/lib/python3.11/site-packages', ...]

  # Check if module is cached
  print("json" in sys.modules)  # True if already imported

  # Relative imports (inside packages)
  # mypackage/
  #   __init__.py
  #   module_a.py
  #   subpackage/
  #     __init__.py
  #     module_b.py

  # In module_b.py:
  # from .. import module_a       # parent package
  # from ..module_a import func   # specific name from parent
  # from . import sibling         # same package

  # Circular import problem
  # --- file: models.py ---
  # from services import process_user  # imports services
  # class User:
  #     ...

  # --- file: services.py ---
  # from models import User  # imports models -- CIRCULAR!
  # def process_user(user: User):
  #     ...

  # Solutions for circular imports:

  # 1. Import inside function (lazy import)
  def process_user(user):
      from models import User  # imported only when called
      ...

  # 2. TYPE_CHECKING guard (best for type hints)
  from __future__ import annotations
  from typing import TYPE_CHECKING

  if TYPE_CHECKING:
      from models import User  # only for type checkers, not at runtime

  def process_user(user: "User") -> None:
      ...

  # 3. Restructure: extract shared code to a third module

  # importlib for dynamic imports
  import importlib
  module = importlib.import_module("json")
  data = module.loads('{"key": "value"}')

  # Reload module (useful in testing/development)
  importlib.reload(module)
  ```

  Best practices: avoid circular imports through code restructuring (dependency inversion), use `TYPE_CHECKING` for type hints, lazy imports for optional dependencies. Understanding the import system helps debug `ModuleNotFoundError` errors and structure large projects.
section: "python"
order: 18
tags:
  - internals
  - modules
type: "deep"
---
