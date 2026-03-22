---
ua_question: "Як працює наслідування та MRO в Python?"
en_question: "How does inheritance and MRO work in Python?"
ua_answer: |
  Python підтримує **множинне наслідування**, і порядок розв'язання методів (MRO -- Method Resolution Order) визначається алгоритмом **C3-лінеаризації**. MRO гарантує, що кожен клас з'являється рівно один раз і порядок наслідування зберігається.

  `super()` не просто викликає батьківський клас -- він слідує MRO. Це критично при множинному наслідуванні: `super()` може викликати метод "сусіднього" класу в MRO, а не прямого батька. Це забезпечує кооперативне наслідування.

  Діамант наслідування (diamond problem) вирішується через MRO: спільний предок викликається лише один раз.

  ```python
  # MRO with multiple inheritance
  class A:
      def greet(self):
          print("A")

  class B(A):
      def greet(self):
          print("B")
          super().greet()

  class C(A):
      def greet(self):
          print("C")
          super().greet()

  class D(B, C):
      def greet(self):
          print("D")
          super().greet()

  d = D()
  d.greet()
  # D -> B -> C -> A  (each called once)

  print(D.__mro__)
  # (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

  # Cooperative multiple inheritance
  class Loggable:
      def __init__(self, **kwargs):
          print(f"Loggable init: {kwargs}")
          super().__init__(**kwargs)

  class Serializable:
      def __init__(self, **kwargs):
          print(f"Serializable init: {kwargs}")
          super().__init__(**kwargs)

  class Model(Loggable, Serializable):
      def __init__(self, name, **kwargs):
          print(f"Model init: {name}")
          super().__init__(name=name, **kwargs)

  m = Model("test")
  # Model init: test
  # Loggable init: {'name': 'test'}
  # Serializable init: {'name': 'test'}

  # isinstance and issubclass
  print(isinstance(d, A))    # True
  print(issubclass(D, (B, C)))  # True
  ```

  Правила для кооперативного множинного наслідування: завжди використовуйте `super()`, передавайте `**kwargs` через весь ланцюг, і проектуйте класи з урахуванням MRO. На практиці mixins -- найпоширеніший і найбезпечніший патерн множинного наслідування.
en_answer: |
  Python supports **multiple inheritance**, and the method resolution order (MRO) is determined by the **C3 linearization** algorithm. MRO guarantees that each class appears exactly once and the inheritance order is preserved.

  `super()` does not simply call the parent class -- it follows the MRO. This is critical with multiple inheritance: `super()` may call a method of a "sibling" class in the MRO, not the direct parent. This enables cooperative inheritance.

  The diamond inheritance problem is solved via MRO: the common ancestor is called only once.

  ```python
  # MRO with multiple inheritance
  class A:
      def greet(self):
          print("A")

  class B(A):
      def greet(self):
          print("B")
          super().greet()

  class C(A):
      def greet(self):
          print("C")
          super().greet()

  class D(B, C):
      def greet(self):
          print("D")
          super().greet()

  d = D()
  d.greet()
  # D -> B -> C -> A  (each called once)

  print(D.__mro__)
  # (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

  # Cooperative multiple inheritance
  class Loggable:
      def __init__(self, **kwargs):
          print(f"Loggable init: {kwargs}")
          super().__init__(**kwargs)

  class Serializable:
      def __init__(self, **kwargs):
          print(f"Serializable init: {kwargs}")
          super().__init__(**kwargs)

  class Model(Loggable, Serializable):
      def __init__(self, name, **kwargs):
          print(f"Model init: {name}")
          super().__init__(name=name, **kwargs)

  m = Model("test")
  # Model init: test
  # Loggable init: {'name': 'test'}
  # Serializable init: {'name': 'test'}

  # isinstance and issubclass
  print(isinstance(d, A))    # True
  print(issubclass(D, (B, C)))  # True
  ```

  Rules for cooperative multiple inheritance: always use `super()`, pass `**kwargs` through the entire chain, and design classes with MRO in mind. In practice, mixins are the most common and safest pattern for multiple inheritance.
section: "python"
order: 9
tags:
  - oop
  - inheritance
type: "basic"
---
