---
ua_question: "Що таке Generics в Java?"
en_question: "What are Generics in Java?"
ua_answer: |
  Generics (узагальнення) в Java дозволяють створювати класи, інтерфейси та методи, які працюють з параметризованими типами. Це забезпечує типобезпеку на етапі компіляції.

  **Переваги Generics:**
  - **Типобезпека** -- помилки виявляються при компіляції, а не під час виконання
  - **Відсутність кастування** -- не потрібно явно приводити типи
  - **Повторне використання** -- один клас/метод працює з різними типами

  ```java
  // Без Generics (небезпечно)
  List list = new ArrayList();
  list.add("Hello");
  String s = (String) list.get(0); // потрібен каст

  // З Generics (безпечно)
  List<String> list = new ArrayList<>();
  list.add("Hello");
  String s = list.get(0); // каст не потрібен
  ```

  **Wildcards (символи підстановки):**
  - `<? extends T>` -- upper bounded (читання) -- будь-який підтип T
  - `<? super T>` -- lower bounded (запис) -- будь-який супертип T
  - `<?>` -- unbounded -- будь-який тип

  ```java
  // Generic клас
  public class Box<T> {
      private T value;
      public void set(T value) { this.value = value; }
      public T get() { return value; }
  }

  Box<String> stringBox = new Box<>();
  stringBox.set("Hello");

  Box<Integer> intBox = new Box<>();
  intBox.set(42);
  ```

  **Type Erasure:** Generics існують лише на етапі компіляції. Під час виконання всі типи стираються до Object або до верхньої межі (bounded type).
en_answer: |
  Generics in Java allow creating classes, interfaces, and methods that work with parameterized types. This provides type safety at compile time.

  **Advantages of Generics:**
  - **Type safety** -- errors detected at compile time, not at runtime
  - **No casting** -- no need for explicit type casting
  - **Reusability** -- one class/method works with different types

  ```java
  // Without Generics (unsafe)
  List list = new ArrayList();
  list.add("Hello");
  String s = (String) list.get(0); // cast needed

  // With Generics (safe)
  List<String> list = new ArrayList<>();
  list.add("Hello");
  String s = list.get(0); // no cast needed
  ```

  **Wildcards:**
  - `<? extends T>` -- upper bounded (reading) -- any subtype of T
  - `<? super T>` -- lower bounded (writing) -- any supertype of T
  - `<?>` -- unbounded -- any type

  ```java
  // Generic class
  public class Box<T> {
      private T value;
      public void set(T value) { this.value = value; }
      public T get() { return value; }
  }

  Box<String> stringBox = new Box<>();
  stringBox.set("Hello");

  Box<Integer> intBox = new Box<>();
  intBox.set(42);
  ```

  **Type Erasure:** Generics exist only at compile time. At runtime, all types are erased to Object or to the upper bound (bounded type).
section: "java"
order: 6
tags:
  - generics
  - type-safety
---
