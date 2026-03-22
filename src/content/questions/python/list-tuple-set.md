---
ua_question: "В чому різниця між list, tuple та set?"
en_question: "What is the difference between list, tuple, and set?"
ua_answer: |
  Три основні колекції Python мають різні характеристики та сценарії використання.

  **list** -- впорядкована мутабельна колекція, що дозволяє дублікати. Реалізована як динамічний масив. Доступ за індексом O(1), вставка/видалення в кінці O(1) амортизовано, пошук O(n).

  **tuple** -- впорядкована імутабельна колекція, що дозволяє дублікати. Займає менше пам'яті ніж list. Може бути ключем словника та елементом set. Використовується для повернення кількох значень з функції та для "записів" із фіксованою структурою.

  **set** -- невпорядкована мутабельна колекція унікальних елементів. Реалізована на базі хеш-таблиці. Пошук, додавання, видалення -- O(1) в середньому. Підтримує операції множин: об'єднання, перетин, різниця.

  ```python
  # list: ordered, mutable, allows duplicates
  fruits = ["apple", "banana", "apple"]
  fruits.append("cherry")
  fruits[0] = "mango"
  print(fruits)  # ['mango', 'banana', 'apple', 'cherry']

  # tuple: ordered, immutable, allows duplicates
  point = (10, 20)
  x, y = point  # unpacking
  # point[0] = 5  # TypeError

  # set: unordered, mutable, unique elements only
  tags = {"python", "java", "python"}
  print(tags)  # {'python', 'java'}

  # Set operations
  a = {1, 2, 3, 4}
  b = {3, 4, 5, 6}
  print(a & b)   # {3, 4}       intersection
  print(a | b)   # {1,2,3,4,5,6} union
  print(a - b)   # {1, 2}       difference
  print(a ^ b)   # {1, 2, 5, 6} symmetric difference

  # Performance: set membership is O(1) vs list O(n)
  import timeit
  big_list = list(range(10_000))
  big_set = set(range(10_000))
  # 9999 in big_list  -> ~0.1ms
  # 9999 in big_set   -> ~0.00005ms
  ```

  Обирайте list для впорядкованих колекцій із довільним доступом, tuple для імутабельних "записів" або ключів, set для швидкого пошуку та операцій над множинами.
en_answer: |
  The three main Python collections have different characteristics and use cases.

  **list** -- an ordered mutable collection that allows duplicates. Implemented as a dynamic array. Index access is O(1), append/pop at the end is amortized O(1), search is O(n).

  **tuple** -- an ordered immutable collection that allows duplicates. Uses less memory than list. Can be a dictionary key and a set element. Used for returning multiple values from functions and for "records" with fixed structure.

  **set** -- an unordered mutable collection of unique elements. Implemented using a hash table. Lookup, addition, removal -- O(1) on average. Supports set operations: union, intersection, difference.

  ```python
  # list: ordered, mutable, allows duplicates
  fruits = ["apple", "banana", "apple"]
  fruits.append("cherry")
  fruits[0] = "mango"
  print(fruits)  # ['mango', 'banana', 'apple', 'cherry']

  # tuple: ordered, immutable, allows duplicates
  point = (10, 20)
  x, y = point  # unpacking
  # point[0] = 5  # TypeError

  # set: unordered, mutable, unique elements only
  tags = {"python", "java", "python"}
  print(tags)  # {'python', 'java'}

  # Set operations
  a = {1, 2, 3, 4}
  b = {3, 4, 5, 6}
  print(a & b)   # {3, 4}       intersection
  print(a | b)   # {1,2,3,4,5,6} union
  print(a - b)   # {1, 2}       difference
  print(a ^ b)   # {1, 2, 5, 6} symmetric difference

  # Performance: set membership is O(1) vs list O(n)
  import timeit
  big_list = list(range(10_000))
  big_set = set(range(10_000))
  # 9999 in big_list  -> ~0.1ms
  # 9999 in big_set   -> ~0.00005ms
  ```

  Choose list for ordered collections with random access, tuple for immutable "records" or keys, set for fast lookups and set operations.
section: "python"
order: 2
tags:
  - core-language
  - collections
type: "basic"
---
