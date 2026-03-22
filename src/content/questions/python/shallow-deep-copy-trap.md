---
ua_question: "В чому підступність shallow copy та коли потрібен deep copy?"
en_question: "What are the pitfalls of shallow copy and when is deep copy needed?"
ua_answer: |
  > **Trap:** Розробники використовують `list.copy()`, `dict.copy()` або `[:]` і вважають, що отримали повністю незалежну копію. Насправді це shallow copy -- копіюються лише посилання на вкладені об'єкти, а не самі об'єкти.

  **Shallow copy** створює новий контейнер, але елементи -- це ті самі об'єкти. Для плоских структур (список чисел/рядків) це працює нормально, бо елементи імутабельні. Але для вкладених мутабельних об'єктів (список списків, dict з dict) зміна вкладеного об'єкта через одну копію видима через іншу.

  **Deep copy** (`copy.deepcopy()`) рекурсивно копіює всі вкладені об'єкти. Використовуйте, коли структура має вкладені мутабельні об'єкти, які повинні бути незалежними.

  ```python
  import copy

  # Shallow copy -- nested objects are shared
  original = [[1, 2], [3, 4], [5, 6]]
  shallow = original.copy()  # or list(original) or original[:]

  shallow[0].append(99)
  print(original)  # [[1, 2, 99], [3, 4], [5, 6]] -- modified!

  shallow.append([7, 8])
  print(original)  # [[1, 2, 99], [3, 4], [5, 6]] -- not modified
  # The outer list is independent, but inner lists are shared

  # Deep copy -- fully independent
  original = [[1, 2], [3, 4]]
  deep = copy.deepcopy(original)

  deep[0].append(99)
  print(original)  # [[1, 2], [3, 4]] -- not modified!

  # Dict shallow copy
  config = {"db": {"host": "localhost", "port": 5432}}
  config_copy = config.copy()

  config_copy["db"]["port"] = 3306
  print(config["db"]["port"])  # 3306 -- modified!

  config_deep = copy.deepcopy(config)
  config_deep["db"]["port"] = 9999
  print(config["db"]["port"])  # 3306 -- safe!

  # Shallow copy methods comparison
  lst = [1, [2, 3]]
  a = lst[:]             # slice
  b = list(lst)          # constructor
  c = lst.copy()         # method
  d = copy.copy(lst)     # copy module
  # All four create shallow copies

  # deepcopy handles circular references
  a = [1, 2]
  a.append(a)  # circular reference
  b = copy.deepcopy(a)
  print(b[2] is b)  # True (circular ref preserved in copy)
  print(b is a)      # False (different object)

  # Custom __copy__ and __deepcopy__
  class Config:
      def __init__(self, data):
          self.data = data
          self._cache = {}  # should not be copied

      def __copy__(self):
          new = Config(self.data)  # shallow
          return new

      def __deepcopy__(self, memo):
          new = Config(copy.deepcopy(self.data, memo))
          return new
  ```

  Правило: для плоских структур shallow copy достатньо. Для вкладених мутабельних структур -- використовуйте `deepcopy`. Але `deepcopy` повільний і може бути проблемним з великими об'єктами або циклічними посиланнями -- профілюйте при необхідності.
en_answer: |
  > **Trap:** Developers use `list.copy()`, `dict.copy()`, or `[:]` and believe they have a fully independent copy. In reality this is a shallow copy -- only references to nested objects are copied, not the objects themselves.

  **Shallow copy** creates a new container, but elements are the same objects. For flat structures (list of numbers/strings) this works fine since elements are immutable. But for nested mutable objects (list of lists, dict of dicts) changing a nested object through one copy is visible through the other.

  **Deep copy** (`copy.deepcopy()`) recursively copies all nested objects. Use it when the structure has nested mutable objects that must be independent.

  ```python
  import copy

  # Shallow copy -- nested objects are shared
  original = [[1, 2], [3, 4], [5, 6]]
  shallow = original.copy()  # or list(original) or original[:]

  shallow[0].append(99)
  print(original)  # [[1, 2, 99], [3, 4], [5, 6]] -- modified!

  shallow.append([7, 8])
  print(original)  # [[1, 2, 99], [3, 4], [5, 6]] -- not modified
  # The outer list is independent, but inner lists are shared

  # Deep copy -- fully independent
  original = [[1, 2], [3, 4]]
  deep = copy.deepcopy(original)

  deep[0].append(99)
  print(original)  # [[1, 2], [3, 4]] -- not modified!

  # Dict shallow copy
  config = {"db": {"host": "localhost", "port": 5432}}
  config_copy = config.copy()

  config_copy["db"]["port"] = 3306
  print(config["db"]["port"])  # 3306 -- modified!

  config_deep = copy.deepcopy(config)
  config_deep["db"]["port"] = 9999
  print(config["db"]["port"])  # 3306 -- safe!

  # Shallow copy methods comparison
  lst = [1, [2, 3]]
  a = lst[:]             # slice
  b = list(lst)          # constructor
  c = lst.copy()         # method
  d = copy.copy(lst)     # copy module
  # All four create shallow copies

  # deepcopy handles circular references
  a = [1, 2]
  a.append(a)  # circular reference
  b = copy.deepcopy(a)
  print(b[2] is b)  # True (circular ref preserved in copy)
  print(b is a)      # False (different object)

  # Custom __copy__ and __deepcopy__
  class Config:
      def __init__(self, data):
          self.data = data
          self._cache = {}  # should not be copied

      def __copy__(self):
          new = Config(self.data)  # shallow
          return new

      def __deepcopy__(self, memo):
          new = Config(copy.deepcopy(self.data, memo))
          return new
  ```

  The rule: for flat structures shallow copy is sufficient. For nested mutable structures -- use `deepcopy`. But `deepcopy` is slow and can be problematic with large objects or circular references -- profile when necessary.
section: "python"
order: 26
tags:
  - gotchas
  - core-language
type: "trick"
---
