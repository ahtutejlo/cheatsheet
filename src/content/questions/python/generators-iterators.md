---
ua_question: "Як працюють генератори та ітератори в Python?"
en_question: "How do generators and iterators work in Python?"
ua_answer: |
  **Ітератор** -- це об'єкт, що реалізує протокол ітерації: методи `__iter__()` (повертає self) та `__next__()` (повертає наступний елемент або кидає `StopIteration`). Будь-який об'єкт з `__iter__()` називається ітерованим (iterable), а ітератор -- це iterable, що має стан і знає, де він зупинився.

  **Генератор** -- це спеціальний вид ітератора, створений за допомогою функції з `yield`. Коли функція з yield викликається, вона не виконується одразу, а повертає генераторний об'єкт. Виконання починається лише при виклику `next()` і призупиняється на кожному `yield`, зберігаючи весь стан фрейму.

  `yield` також може приймати значення через `send()`, що робить генератори основою для корутин.

  ```python
  # Custom iterator
  class Countdown:
      def __init__(self, start):
          self.current = start

      def __iter__(self):
          return self

      def __next__(self):
          if self.current <= 0:
              raise StopIteration
          self.current -= 1
          return self.current + 1

  for n in Countdown(3):
      print(n)  # 3, 2, 1

  # Generator function
  def fibonacci():
      a, b = 0, 1
      while True:
          yield a
          a, b = b, a + b

  fib = fibonacci()
  print([next(fib) for _ in range(8)])
  # [0, 1, 1, 2, 3, 5, 8, 13]

  # yield from -- delegate to sub-generator
  def chain(*iterables):
      for it in iterables:
          yield from it

  print(list(chain([1, 2], [3, 4], [5])))
  # [1, 2, 3, 4, 5]

  # send() -- two-way communication
  def accumulator():
      total = 0
      while True:
          value = yield total
          total += value

  acc = accumulator()
  next(acc)         # prime the generator
  print(acc.send(10))  # 10
  print(acc.send(20))  # 30
  print(acc.send(5))   # 35
  ```

  Генератори економлять пам'ять, обробляючи елементи по одному. Вони ідеальні для потокової обробки файлів, мережевих даних, та побудови pipeline'ів обробки даних. В Python 3 багато вбудованих функцій (`range`, `map`, `filter`, `zip`) повертають ліниві ітератори замість списків.
en_answer: |
  An **iterator** is an object implementing the iteration protocol: methods `__iter__()` (returns self) and `__next__()` (returns next element or raises `StopIteration`). Any object with `__iter__()` is called iterable, and an iterator is an iterable that has state and knows where it stopped.

  A **generator** is a special kind of iterator created using a function with `yield`. When a function with yield is called, it does not execute immediately but returns a generator object. Execution starts only when `next()` is called and pauses at each `yield`, preserving the entire frame state.

  `yield` can also receive values via `send()`, making generators the foundation for coroutines.

  ```python
  # Custom iterator
  class Countdown:
      def __init__(self, start):
          self.current = start

      def __iter__(self):
          return self

      def __next__(self):
          if self.current <= 0:
              raise StopIteration
          self.current -= 1
          return self.current + 1

  for n in Countdown(3):
      print(n)  # 3, 2, 1

  # Generator function
  def fibonacci():
      a, b = 0, 1
      while True:
          yield a
          a, b = b, a + b

  fib = fibonacci()
  print([next(fib) for _ in range(8)])
  # [0, 1, 1, 2, 3, 5, 8, 13]

  # yield from -- delegate to sub-generator
  def chain(*iterables):
      for it in iterables:
          yield from it

  print(list(chain([1, 2], [3, 4], [5])))
  # [1, 2, 3, 4, 5]

  # send() -- two-way communication
  def accumulator():
      total = 0
      while True:
          value = yield total
          total += value

  acc = accumulator()
  next(acc)         # prime the generator
  print(acc.send(10))  # 10
  print(acc.send(20))  # 30
  print(acc.send(5))   # 35
  ```

  Generators save memory by processing elements one at a time. They are ideal for streaming file processing, network data, and building data processing pipelines. In Python 3 many built-in functions (`range`, `map`, `filter`, `zip`) return lazy iterators instead of lists.
section: "python"
order: 5
tags:
  - core-language
  - iterators
type: "basic"
---
