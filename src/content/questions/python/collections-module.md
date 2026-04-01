---
ua_question: "Що дає модуль collections: defaultdict, Counter, deque, namedtuple?"
en_question: "What does the collections module provide: defaultdict, Counter, deque, namedtuple?"
ua_answer: |
  Модуль `collections` містить спеціалізовані контейнери, що розширюють вбудовані dict, list, tuple. Основні: `defaultdict`, `Counter`, `deque`, `OrderedDict`, `namedtuple`, `ChainMap`.

  **`defaultdict`** — словник, що автоматично створює значення за замовчуванням для відсутніх ключів. Приймає callable як factory (list, int, set, або кастомна функція). Уникає `KeyError` і шаблонного коду з `setdefault`.

  **`Counter`** — словник для підрахунку. Підтримує арифметику (додавання, різниця), `most_common(n)`, `elements()`. Ідеальний для аналізу частот.

  **`deque`** (double-ended queue) — двостороння черга з O(1) вставкою та видаленням з обох кінців. На відміну від list, `appendleft` і `popleft` — O(1), а не O(n).

  ```python
  from collections import defaultdict, Counter, deque, OrderedDict, ChainMap, namedtuple

  # defaultdict -- автоматична ініціалізація
  # без defaultdict:
  counts = {}
  for word in words:
      counts[word] = counts.get(word, 0) + 1

  # з defaultdict:
  counts = defaultdict(int)
  for word in words:
      counts[word] += 1  # int() = 0 для нових ключів

  # defaultdict з list -- групування
  grouped = defaultdict(list)
  for item in [("a", 1), ("b", 2), ("a", 3)]:
      grouped[item[0]].append(item[1])
  # {"a": [1, 3], "b": [2]}

  # defaultdict(set) -- унікальні значення по ключу
  graph = defaultdict(set)
  graph["A"].add("B")
  graph["A"].add("C")

  # Counter -- підрахунок елементів
  words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
  c = Counter(words)
  print(c)              # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
  print(c.most_common(2))  # [('apple', 3), ('banana', 2)]
  print(c["apple"])     # 3
  print(c["missing"])   # 0 (не KeyError!)

  # Counter арифметика
  c1 = Counter(["a", "b", "a"])
  c2 = Counter(["b", "b", "c"])
  print(c1 + c2)   # Counter({'a': 2, 'b': 3, 'c': 1})
  print(c1 - c2)   # Counter({'a': 2}) -- від'ємні відкидаються
  print(c1 & c2)   # Counter({'b': 1}) -- мінімум
  print(c1 | c2)   # Counter({'b': 2, 'a': 2, 'c': 1}) -- максимум

  # Counter з рядком
  letter_freq = Counter("mississippi")
  # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})

  # deque -- ефективна двостороння черга
  dq = deque([1, 2, 3])
  dq.appendleft(0)   # [0, 1, 2, 3] O(1)
  dq.append(4)       # [0, 1, 2, 3, 4] O(1)
  dq.popleft()       # повертає 0, O(1)
  dq.pop()           # повертає 4, O(1)

  # deque з maxlen -- фіксований розмір (буфер кільця)
  recent = deque(maxlen=5)
  for i in range(10):
      recent.append(i)
  print(recent)  # deque([5, 6, 7, 8, 9], maxlen=5) -- старі автовидаляються

  # deque для черги (FIFO) і стека (LIFO)
  queue = deque()
  queue.append("task1")
  queue.append("task2")
  next_task = queue.popleft()  # FIFO: "task1"

  stack = deque()
  stack.append("item1")
  stack.append("item2")
  top = stack.pop()  # LIFO: "item2"

  # deque.rotate -- зсув елементів
  dq = deque([1, 2, 3, 4, 5])
  dq.rotate(2)   # [4, 5, 1, 2, 3]
  dq.rotate(-1)  # [5, 1, 2, 3, 4]

  # ChainMap -- об'єднання кількох словників (read-only view)
  defaults = {"color": "red", "size": "medium"}
  user_prefs = {"color": "blue"}
  config = ChainMap(user_prefs, defaults)
  print(config["color"])  # "blue" (user_prefs перший)
  print(config["size"])   # "medium" (з defaults)
  ```

  `deque` — правильний вибір для черг і стеків (не `list`, бо `list.insert(0, x)` — O(n)). `Counter` — для будь-якого частотного аналізу. `defaultdict` позбавляє від `KeyError` і `setdefault` шаблону.
en_answer: |
  The `collections` module contains specialized containers that extend built-in dict, list, tuple. Main ones: `defaultdict`, `Counter`, `deque`, `OrderedDict`, `namedtuple`, `ChainMap`.

  **`defaultdict`** is a dict that automatically creates a default value for missing keys. Takes a callable as factory (list, int, set, or a custom function). Avoids `KeyError` and boilerplate `setdefault` code.

  **`Counter`** is a dict for counting. Supports arithmetic (addition, difference), `most_common(n)`, `elements()`. Ideal for frequency analysis.

  **`deque`** (double-ended queue) is a two-ended queue with O(1) insertion and deletion from both ends. Unlike list, `appendleft` and `popleft` are O(1), not O(n).

  ```python
  from collections import defaultdict, Counter, deque, OrderedDict, ChainMap, namedtuple

  # defaultdict -- automatic initialization
  # without defaultdict:
  counts = {}
  for word in words:
      counts[word] = counts.get(word, 0) + 1

  # with defaultdict:
  counts = defaultdict(int)
  for word in words:
      counts[word] += 1  # int() = 0 for new keys

  # defaultdict with list -- grouping
  grouped = defaultdict(list)
  for item in [("a", 1), ("b", 2), ("a", 3)]:
      grouped[item[0]].append(item[1])
  # {"a": [1, 3], "b": [2]}

  # defaultdict(set) -- unique values per key
  graph = defaultdict(set)
  graph["A"].add("B")
  graph["A"].add("C")

  # Counter -- counting elements
  words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
  c = Counter(words)
  print(c)              # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
  print(c.most_common(2))  # [('apple', 3), ('banana', 2)]
  print(c["apple"])     # 3
  print(c["missing"])   # 0 (not KeyError!)

  # Counter arithmetic
  c1 = Counter(["a", "b", "a"])
  c2 = Counter(["b", "b", "c"])
  print(c1 + c2)   # Counter({'a': 2, 'b': 3, 'c': 1})
  print(c1 - c2)   # Counter({'a': 2}) -- negatives dropped
  print(c1 & c2)   # Counter({'b': 1}) -- minimum
  print(c1 | c2)   # Counter({'b': 2, 'a': 2, 'c': 1}) -- maximum

  # Counter from string
  letter_freq = Counter("mississippi")
  # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})

  # deque -- efficient double-ended queue
  dq = deque([1, 2, 3])
  dq.appendleft(0)   # [0, 1, 2, 3] O(1)
  dq.append(4)       # [0, 1, 2, 3, 4] O(1)
  dq.popleft()       # returns 0, O(1)
  dq.pop()           # returns 4, O(1)

  # deque with maxlen -- fixed size (ring buffer)
  recent = deque(maxlen=5)
  for i in range(10):
      recent.append(i)
  print(recent)  # deque([5, 6, 7, 8, 9], maxlen=5) -- old items auto-removed

  # deque for queue (FIFO) and stack (LIFO)
  queue = deque()
  queue.append("task1")
  queue.append("task2")
  next_task = queue.popleft()  # FIFO: "task1"

  stack = deque()
  stack.append("item1")
  stack.append("item2")
  top = stack.pop()  # LIFO: "item2"

  # deque.rotate -- shift elements
  dq = deque([1, 2, 3, 4, 5])
  dq.rotate(2)   # [4, 5, 1, 2, 3]
  dq.rotate(-1)  # [5, 1, 2, 3, 4]

  # ChainMap -- combine multiple dicts (read-only view)
  defaults = {"color": "red", "size": "medium"}
  user_prefs = {"color": "blue"}
  config = ChainMap(user_prefs, defaults)
  print(config["color"])  # "blue" (user_prefs first)
  print(config["size"])   # "medium" (from defaults)
  ```

  `deque` is the right choice for queues and stacks (not `list`, since `list.insert(0, x)` is O(n)). `Counter` is for any frequency analysis. `defaultdict` eliminates `KeyError` and `setdefault` boilerplate.
section: "python"
order: 51
tags:
  - core-language
  - performance
type: "basic"
---
