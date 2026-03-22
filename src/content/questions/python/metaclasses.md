---
ua_question: "Як працюють метакласи: __new__ vs __init__, коли вони потрібні?"
en_question: "How do metaclasses work: __new__ vs __init__, when are they needed?"
ua_answer: |
  В Python все є об'єктом, включно з класами. **Метаклас** -- це "клас класів", тобто тип, екземпляри якого є класами. За замовчуванням метаклас -- це `type`. Коли ви пишете `class Foo:`, Python викликає `type("Foo", bases, namespace)`.

  **`__new__`** метакласу викликається перед створенням класу і може змінити ім'я, базові класи та namespace. **`__init__`** метакласу викликається після створення -- клас вже існує, але можна додати атрибути чи валідацію.

  Метакласи потрібні рідко -- більшість задач вирішуються декораторами класів або `__init_subclass__`. Але вони корисні для ORM, API-фреймворків, системи плагінів.

  ```python
  # Basic metaclass
  class Meta(type):
      def __new__(mcs, name, bases, namespace):
          # Called before class creation
          print(f"Creating class: {name}")
          # Can modify namespace
          namespace["created_by"] = "Meta"
          cls = super().__new__(mcs, name, bases, namespace)
          return cls

      def __init__(cls, name, bases, namespace):
          # Called after class creation
          super().__init__(name, bases, namespace)
          cls.registry = []

  class MyClass(metaclass=Meta):
      pass

  print(MyClass.created_by)  # "Meta"

  # Practical: auto-registry pattern
  class PluginMeta(type):
      plugins: dict = {}

      def __init__(cls, name, bases, namespace):
          super().__init__(name, bases, namespace)
          if bases:  # skip the base class itself
              PluginMeta.plugins[name] = cls

  class Plugin(metaclass=PluginMeta):
      pass

  class AuthPlugin(Plugin):
      pass

  class CachePlugin(Plugin):
      pass

  print(PluginMeta.plugins)
  # {'AuthPlugin': <class 'AuthPlugin'>, 'CachePlugin': <class 'CachePlugin'>}

  # Modern alternative: __init_subclass__ (Python 3.6+)
  class PluginBase:
      plugins: dict = {}

      def __init_subclass__(cls, **kwargs):
          super().__init_subclass__(**kwargs)
          PluginBase.plugins[cls.__name__] = cls

  class LogPlugin(PluginBase):
      pass

  # Singleton via metaclass
  class SingletonMeta(type):
      _instances: dict = {}

      def __call__(cls, *args, **kwargs):
          if cls not in cls._instances:
              cls._instances[cls] = super().__call__(*args, **kwargs)
          return cls._instances[cls]

  class Database(metaclass=SingletonMeta):
      def __init__(self):
          self.connection = "connected"

  db1 = Database()
  db2 = Database()
  print(db1 is db2)  # True
  ```

  Правило: якщо задачу можна вирішити декоратором класу або `__init_subclass__` -- не використовуйте метакласи. Метакласи потрібні, коли ви хочете контролювати сам процес створення класу або його неможливо вирішити іншими засобами (наприклад, Django ORM, SQLAlchemy declarative base).
en_answer: |
  In Python everything is an object, including classes. A **metaclass** is a "class of classes," meaning a type whose instances are classes. The default metaclass is `type`. When you write `class Foo:`, Python calls `type("Foo", bases, namespace)`.

  **`__new__`** of a metaclass is called before class creation and can modify the name, base classes, and namespace. **`__init__`** of a metaclass is called after creation -- the class already exists, but you can add attributes or validation.

  Metaclasses are rarely needed -- most tasks are solved by class decorators or `__init_subclass__`. But they are useful for ORMs, API frameworks, and plugin systems.

  ```python
  # Basic metaclass
  class Meta(type):
      def __new__(mcs, name, bases, namespace):
          # Called before class creation
          print(f"Creating class: {name}")
          # Can modify namespace
          namespace["created_by"] = "Meta"
          cls = super().__new__(mcs, name, bases, namespace)
          return cls

      def __init__(cls, name, bases, namespace):
          # Called after class creation
          super().__init__(name, bases, namespace)
          cls.registry = []

  class MyClass(metaclass=Meta):
      pass

  print(MyClass.created_by)  # "Meta"

  # Practical: auto-registry pattern
  class PluginMeta(type):
      plugins: dict = {}

      def __init__(cls, name, bases, namespace):
          super().__init__(name, bases, namespace)
          if bases:  # skip the base class itself
              PluginMeta.plugins[name] = cls

  class Plugin(metaclass=PluginMeta):
      pass

  class AuthPlugin(Plugin):
      pass

  class CachePlugin(Plugin):
      pass

  print(PluginMeta.plugins)
  # {'AuthPlugin': <class 'AuthPlugin'>, 'CachePlugin': <class 'CachePlugin'>}

  # Modern alternative: __init_subclass__ (Python 3.6+)
  class PluginBase:
      plugins: dict = {}

      def __init_subclass__(cls, **kwargs):
          super().__init_subclass__(**kwargs)
          PluginBase.plugins[cls.__name__] = cls

  class LogPlugin(PluginBase):
      pass

  # Singleton via metaclass
  class SingletonMeta(type):
      _instances: dict = {}

      def __call__(cls, *args, **kwargs):
          if cls not in cls._instances:
              cls._instances[cls] = super().__call__(*args, **kwargs)
          return cls._instances[cls]

  class Database(metaclass=SingletonMeta):
      def __init__(self):
          self.connection = "connected"

  db1 = Database()
  db2 = Database()
  print(db1 is db2)  # True
  ```

  The rule: if the task can be solved with a class decorator or `__init_subclass__` -- do not use metaclasses. Metaclasses are needed when you want to control the class creation process itself or it cannot be solved by other means (e.g., Django ORM, SQLAlchemy declarative base).
section: "python"
order: 20
tags:
  - oop
  - internals
type: "deep"
---
