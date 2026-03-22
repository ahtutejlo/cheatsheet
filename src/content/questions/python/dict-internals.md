---
ua_question: "Як влаштований dict у Python?"
en_question: "How does Python dict work internally?"
ua_answer: |
  Python dict реалізований як **хеш-таблиця** з відкритою адресацією. Починаючи з CPython 3.6, словники зберігають порядок вставки як деталь реалізації, а з Python 3.7 це гарантується специфікацією.

  Внутрішня структура складається з двох масивів: **compact dict** має масив індексів (sparse) та щільний масив записів (key, hash, value). Коли ви додаєте пару, Python обчислює `hash(key)`, знаходить позицію в масиві індексів, і зберігає запис у щільному масиві. При колізії використовується **пробування** (probing) для пошуку вільного слота.

  Коефіцієнт заповнення тримається нижче 2/3 -- коли словник заповнюється, він збільшується (зазвичай у 2-4 рази), і всі записи перехешовуються. Саме тому ключі словника повинні бути хешовані і імутабельні.

  ```python
  # Dict operations are O(1) average, O(n) worst case
  d = {"name": "Alice", "age": 30}

  # Insertion O(1)
  d["city"] = "Kyiv"

  # Lookup O(1)
  print(d["name"])  # "Alice"

  # Keys must be hashable (immutable)
  d[(1, 2)] = "tuple key"   # OK -- tuple is hashable
  # d[[1, 2]] = "list key"  # TypeError -- list is unhashable

  # Custom hashable objects
  class Point:
      def __init__(self, x, y):
          self.x = x
          self.y = y

      def __hash__(self):
          return hash((self.x, self.y))

      def __eq__(self, other):
          return self.x == other.x and self.y == other.y

  cache = {Point(0, 0): "origin", Point(1, 1): "diagonal"}

  # Dict memory: sys.getsizeof
  import sys
  print(sys.getsizeof({}))        # 64 bytes (empty dict)
  print(sys.getsizeof(d))         # 232+ bytes
  ```

  Складність основних операцій: вставка, пошук, видалення -- O(1) в середньому. У найгіршому випадку (всі колізії) -- O(n), але на практиці це майже неможливо завдяки якісній хеш-функції. Dict є фундаментом Python -- namespace модулів, атрибути об'єктів, keyword arguments -- все це словники.
en_answer: |
  Python dict is implemented as a **hash table** with open addressing. Starting from CPython 3.6, dictionaries preserve insertion order as an implementation detail, and from Python 3.7 this is guaranteed by specification.

  The internal structure consists of two arrays: the **compact dict** has an index array (sparse) and a dense array of entries (key, hash, value). When you add a pair, Python computes `hash(key)`, finds a position in the index array, and stores the entry in the dense array. On collision, **probing** is used to find a free slot.

  The load factor is kept below 2/3 -- when the dict fills up, it grows (usually by 2-4x), and all entries are rehashed. This is why dictionary keys must be hashable and immutable.

  ```python
  # Dict operations are O(1) average, O(n) worst case
  d = {"name": "Alice", "age": 30}

  # Insertion O(1)
  d["city"] = "Kyiv"

  # Lookup O(1)
  print(d["name"])  # "Alice"

  # Keys must be hashable (immutable)
  d[(1, 2)] = "tuple key"   # OK -- tuple is hashable
  # d[[1, 2]] = "list key"  # TypeError -- list is unhashable

  # Custom hashable objects
  class Point:
      def __init__(self, x, y):
          self.x = x
          self.y = y

      def __hash__(self):
          return hash((self.x, self.y))

      def __eq__(self, other):
          return self.x == other.x and self.y == other.y

  cache = {Point(0, 0): "origin", Point(1, 1): "diagonal"}

  # Dict memory: sys.getsizeof
  import sys
  print(sys.getsizeof({}))        # 64 bytes (empty dict)
  print(sys.getsizeof(d))         # 232+ bytes
  ```

  Complexity of basic operations: insertion, lookup, deletion -- O(1) on average. In the worst case (all collisions) -- O(n), but in practice this is nearly impossible thanks to a quality hash function. Dict is the foundation of Python -- module namespaces, object attributes, keyword arguments -- all are dictionaries.
section: "python"
order: 3
tags:
  - core-language
  - collections
type: "basic"
---
