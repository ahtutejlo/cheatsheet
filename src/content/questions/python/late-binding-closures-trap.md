---
ua_question: "Чому замикання в циклі захоплюють останнє значення змінної?"
en_question: "Why do closures in loops capture the last value of the variable?"
ua_answer: |
  > **Trap:** Розробники очікують, що лямбда або функція в циклі "запам'ятає" значення змінної на момент створення. Насправді замикання зберігає посилання на змінну, а не її значення, і читає актуальне значення при виклику.

  Це називається **late binding** -- замикання шукає значення змінної в момент виклику, а не в момент визначення. Після завершення циклу змінна має останнє значення, і всі замикання бачать саме його.

  Рішення: 1) дефолтний аргумент для "захоплення" значення (early binding), 2) `functools.partial`, 3) генератор/comprehension з локальною змінною.

  ```python
  # BUG: late binding closures
  functions = []
  for i in range(5):
      functions.append(lambda: i)

  print([f() for f in functions])
  # [4, 4, 4, 4, 4] -- all return the last value!

  # Why: lambda captures reference to 'i', not its value
  # After loop, i == 4, so all lambdas return 4

  # FIX 1: default argument (early binding)
  functions = []
  for i in range(5):
      functions.append(lambda i=i: i)  # i=i captures current value

  print([f() for f in functions])
  # [0, 1, 2, 3, 4] -- correct!

  # FIX 2: functools.partial
  from functools import partial

  def make_printer(x):
      return x

  functions = [partial(make_printer, i) for i in range(5)]
  print([f() for f in functions])
  # [0, 1, 2, 3, 4]

  # FIX 3: factory function (creates new scope)
  def make_func(n):
      def func():
          return n
      return func

  functions = [make_func(i) for i in range(5)]
  print([f() for f in functions])
  # [0, 1, 2, 3, 4]

  # Common real-world case: callback registration
  # BUG
  buttons = {}
  for name in ["save", "load", "delete"]:
      buttons[name] = lambda: print(f"Clicked {name}")

  buttons["save"]()    # "Clicked delete" -- wrong!
  buttons["delete"]()  # "Clicked delete"

  # FIX
  for name in ["save", "load", "delete"]:
      buttons[name] = lambda n=name: print(f"Clicked {n}")

  buttons["save"]()    # "Clicked save" -- correct!
  ```

  Ця проблема часто з'являється при створенні callbacks у GUI-фреймворках, реєстрації обробників подій, та параметризованих тестах. Розуміння різниці між early і late binding -- ключ до правильної роботи із замиканнями.
en_answer: |
  > **Trap:** Developers expect that a lambda or function in a loop will "remember" the variable's value at creation time. In reality, a closure stores a reference to the variable, not its value, and reads the current value at call time.

  This is called **late binding** -- the closure looks up the variable's value at call time, not at definition time. After the loop ends, the variable has the last value, and all closures see exactly that.

  Solutions: 1) default argument to "capture" the value (early binding), 2) `functools.partial`, 3) generator/comprehension with a local variable.

  ```python
  # BUG: late binding closures
  functions = []
  for i in range(5):
      functions.append(lambda: i)

  print([f() for f in functions])
  # [4, 4, 4, 4, 4] -- all return the last value!

  # Why: lambda captures reference to 'i', not its value
  # After loop, i == 4, so all lambdas return 4

  # FIX 1: default argument (early binding)
  functions = []
  for i in range(5):
      functions.append(lambda i=i: i)  # i=i captures current value

  print([f() for f in functions])
  # [0, 1, 2, 3, 4] -- correct!

  # FIX 2: functools.partial
  from functools import partial

  def make_printer(x):
      return x

  functions = [partial(make_printer, i) for i in range(5)]
  print([f() for f in functions])
  # [0, 1, 2, 3, 4]

  # FIX 3: factory function (creates new scope)
  def make_func(n):
      def func():
          return n
      return func

  functions = [make_func(i) for i in range(5)]
  print([f() for f in functions])
  # [0, 1, 2, 3, 4]

  # Common real-world case: callback registration
  # BUG
  buttons = {}
  for name in ["save", "load", "delete"]:
      buttons[name] = lambda: print(f"Clicked {name}")

  buttons["save"]()    # "Clicked delete" -- wrong!
  buttons["delete"]()  # "Clicked delete"

  # FIX
  for name in ["save", "load", "delete"]:
      buttons[name] = lambda n=name: print(f"Clicked {n}")

  buttons["save"]()    # "Clicked save" -- correct!
  ```

  This problem often appears when creating callbacks in GUI frameworks, registering event handlers, and parameterized tests. Understanding the difference between early and late binding is the key to correct closure usage.
section: "python"
order: 22
tags:
  - gotchas
  - closures
type: "trick"
---
