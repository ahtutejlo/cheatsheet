---
ua_question: "Як Python керує пам'яттю: refcount, GC, __slots__, weakref?"
en_question: "How does Python manage memory: refcount, GC, __slots__, weakref?"
ua_answer: |
  Управління пам'яттю в CPython базується на двох механізмах: **reference counting** (основний) та **циклічний збирач сміття** (допоміжний для циклічних посилань).

  **Reference counting:** кожен об'єкт має лічильник посилань. Коли лічильник досягає 0, пам'ять звільняється негайно. Це детерміновано і ефективно, але не може виявити циклічні посилання (A → B → A).

  **Generational GC:** працює у трьох поколіннях (0, 1, 2). Нові об'єкти потрапляють у покоління 0. Об'єкти, що пережили збирання, переходять у старше покоління. Покоління 0 збирається найчастіше.

  **__slots__** замінює `__dict__` фіксованим набором атрибутів, економлячи пам'ять. **weakref** створює слабке посилання, що не збільшує refcount.

  ```python
  import sys
  import gc
  import weakref

  # Reference counting
  a = [1, 2, 3]
  print(sys.getrefcount(a))  # 2 (a + getrefcount arg)
  b = a
  print(sys.getrefcount(a))  # 3
  del b
  print(sys.getrefcount(a))  # 2

  # Circular reference -- needs GC
  class Node:
      def __init__(self):
          self.parent = None
          self.children = []

  parent = Node()
  child = Node()
  parent.children.append(child)
  child.parent = parent
  # refcount never reaches 0 -- GC handles this

  # GC control
  gc.collect()                    # force collection
  gc.get_threshold()              # (700, 10, 10) -- collection thresholds
  gc.disable()                    # disable automatic GC (use carefully)

  # __slots__ -- memory optimization
  class PointDict:
      def __init__(self, x, y):
          self.x = x
          self.y = y

  class PointSlots:
      __slots__ = ("x", "y")
      def __init__(self, x, y):
          self.x = x
          self.y = y

  print(sys.getsizeof(PointDict(1, 2)))   # 48 + dict ~104
  print(sys.getsizeof(PointSlots(1, 2)))   # 48 (no __dict__)

  # weakref -- reference without preventing GC
  class Cache:
      pass

  obj = Cache()
  ref = weakref.ref(obj)
  print(ref())       # <Cache object>
  del obj
  print(ref())       # None -- object was garbage collected

  # WeakValueDictionary for caches
  cache = weakref.WeakValueDictionary()
  obj = Cache()
  cache["key"] = obj
  del obj
  # cache["key"] now raises KeyError -- object was collected
  ```

  Для оптимізації пам'яті: використовуйте `__slots__` у класах з великою кількістю екземплярів, уникайте циклічних посилань або використовуйте weakref, профілюйте з `tracemalloc` або `objgraph`.
en_answer: |
  Memory management in CPython is based on two mechanisms: **reference counting** (primary) and a **cyclic garbage collector** (auxiliary for circular references).

  **Reference counting:** each object has a reference counter. When the counter reaches 0, memory is freed immediately. This is deterministic and efficient but cannot detect circular references (A -> B -> A).

  **Generational GC:** works in three generations (0, 1, 2). New objects go to generation 0. Objects that survive collection move to an older generation. Generation 0 is collected most frequently.

  **__slots__** replaces `__dict__` with a fixed set of attributes, saving memory. **weakref** creates a weak reference that does not increase the refcount.

  ```python
  import sys
  import gc
  import weakref

  # Reference counting
  a = [1, 2, 3]
  print(sys.getrefcount(a))  # 2 (a + getrefcount arg)
  b = a
  print(sys.getrefcount(a))  # 3
  del b
  print(sys.getrefcount(a))  # 2

  # Circular reference -- needs GC
  class Node:
      def __init__(self):
          self.parent = None
          self.children = []

  parent = Node()
  child = Node()
  parent.children.append(child)
  child.parent = parent
  # refcount never reaches 0 -- GC handles this

  # GC control
  gc.collect()                    # force collection
  gc.get_threshold()              # (700, 10, 10) -- collection thresholds
  gc.disable()                    # disable automatic GC (use carefully)

  # __slots__ -- memory optimization
  class PointDict:
      def __init__(self, x, y):
          self.x = x
          self.y = y

  class PointSlots:
      __slots__ = ("x", "y")
      def __init__(self, x, y):
          self.x = x
          self.y = y

  print(sys.getsizeof(PointDict(1, 2)))   # 48 + dict ~104
  print(sys.getsizeof(PointSlots(1, 2)))   # 48 (no __dict__)

  # weakref -- reference without preventing GC
  class Cache:
      pass

  obj = Cache()
  ref = weakref.ref(obj)
  print(ref())       # <Cache object>
  del obj
  print(ref())       # None -- object was garbage collected

  # WeakValueDictionary for caches
  cache = weakref.WeakValueDictionary()
  obj = Cache()
  cache["key"] = obj
  del obj
  # cache["key"] now raises KeyError -- object was collected
  ```

  For memory optimization: use `__slots__` in classes with many instances, avoid circular references or use weakref, profile with `tracemalloc` or `objgraph`.
section: "python"
order: 17
tags:
  - internals
  - memory
type: "deep"
---
