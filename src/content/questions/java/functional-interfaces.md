---
ua_question: "Що таке функціональні інтерфейси в Java?"
en_question: "What are functional interfaces in Java?"
ua_answer: |
  Функціональний інтерфейс (Functional Interface) -- це інтерфейс, який має рівно один абстрактний метод. Він може бути використаний як цільовий тип для лямбда-виразів та посилань на методи.

  **Вбудовані функціональні інтерфейси (java.util.function):**

  | Інтерфейс | Метод | Опис |
  |-----------|-------|------|
  | `Function<T,R>` | `R apply(T t)` | Перетворення T -> R |
  | `Predicate<T>` | `boolean test(T t)` | Умова, повертає boolean |
  | `Consumer<T>` | `void accept(T t)` | Споживає значення |
  | `Supplier<T>` | `T get()` | Постачає значення |
  | `UnaryOperator<T>` | `T apply(T t)` | T -> T |
  | `BiFunction<T,U,R>` | `R apply(T t, U u)` | (T, U) -> R |

  ```java
  // Predicate
  Predicate<String> isLong = s -> s.length() > 5;
  System.out.println(isLong.test("Hello")); // false

  // Function
  Function<String, Integer> toLength = String::length;
  System.out.println(toLength.apply("Hello")); // 5

  // Consumer
  Consumer<String> printer = System.out::println;
  printer.accept("Hello"); // Hello

  // Композиція
  Predicate<String> isShort = isLong.negate();
  Function<String, String> toUpper = String::toUpperCase;
  Function<String, String> addExcl = s -> s + "!";
  Function<String, String> shout = toUpper.andThen(addExcl);
  System.out.println(shout.apply("hello")); // HELLO!
  ```

  Анотація `@FunctionalInterface` не обов'язкова, але рекомендована -- вона забезпечує перевірку компілятором.
en_answer: |
  A Functional Interface is an interface that has exactly one abstract method. It can be used as a target type for lambda expressions and method references.

  **Built-in functional interfaces (java.util.function):**

  | Interface | Method | Description |
  |-----------|--------|-------------|
  | `Function<T,R>` | `R apply(T t)` | Transform T -> R |
  | `Predicate<T>` | `boolean test(T t)` | Condition, returns boolean |
  | `Consumer<T>` | `void accept(T t)` | Consumes a value |
  | `Supplier<T>` | `T get()` | Supplies a value |
  | `UnaryOperator<T>` | `T apply(T t)` | T -> T |
  | `BiFunction<T,U,R>` | `R apply(T t, U u)` | (T, U) -> R |

  ```java
  // Predicate
  Predicate<String> isLong = s -> s.length() > 5;
  System.out.println(isLong.test("Hello")); // false

  // Function
  Function<String, Integer> toLength = String::length;
  System.out.println(toLength.apply("Hello")); // 5

  // Consumer
  Consumer<String> printer = System.out::println;
  printer.accept("Hello"); // Hello

  // Composition
  Predicate<String> isShort = isLong.negate();
  Function<String, String> toUpper = String::toUpperCase;
  Function<String, String> addExcl = s -> s + "!";
  Function<String, String> shout = toUpper.andThen(addExcl);
  System.out.println(shout.apply("hello")); // HELLO!
  ```

  The `@FunctionalInterface` annotation is optional but recommended -- it ensures compile-time verification.
section: "java"
order: 14
tags:
  - functional-programming
  - lambda
---
