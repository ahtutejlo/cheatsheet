---
ua_question: "Що таке Stream API в Java?"
en_question: "What is the Stream API in Java?"
ua_answer: |
  Stream API (Java 8+) -- це набір інструментів для функціональної обробки колекцій даних. Stream дозволяє декларативно описувати операції над даними замість імперативних циклів.

  **Основні характеристики:**
  - Stream не зберігає дані -- він обробляє їх
  - Stream не модифікує джерело
  - Операції виконуються **ліниво** (lazy evaluation)
  - Stream можна використати лише один раз

  **Типи операцій:**
  - **Проміжні (intermediate):** `filter`, `map`, `sorted`, `distinct`, `flatMap` -- повертають новий Stream
  - **Термінальні (terminal):** `collect`, `forEach`, `count`, `reduce`, `findFirst` -- повертають результат

  ```java
  List<String> names = List.of("Anna", "Bob", "Alice", "Brian", "Amy");

  // Фільтрація та трансформація
  List<String> result = names.stream()
      .filter(name -> name.startsWith("A"))
      .map(String::toUpperCase)
      .sorted()
      .collect(Collectors.toList());
  // [ALICE, AMY, ANNA]

  // Підрахунок
  long count = names.stream()
      .filter(name -> name.length() > 3)
      .count(); // 3

  // Reduce
  int sum = List.of(1, 2, 3, 4, 5).stream()
      .reduce(0, Integer::sum); // 15
  ```

  **Parallel Streams:** `list.parallelStream()` розподіляє обробку між кількома потоками для великих колекцій.
en_answer: |
  Stream API (Java 8+) is a set of tools for functional data collection processing. Stream allows declaratively describing operations on data instead of imperative loops.

  **Main characteristics:**
  - Stream does not store data -- it processes it
  - Stream does not modify the source
  - Operations are executed **lazily** (lazy evaluation)
  - Stream can be used only once

  **Types of operations:**
  - **Intermediate:** `filter`, `map`, `sorted`, `distinct`, `flatMap` -- return a new Stream
  - **Terminal:** `collect`, `forEach`, `count`, `reduce`, `findFirst` -- return a result

  ```java
  List<String> names = List.of("Anna", "Bob", "Alice", "Brian", "Amy");

  // Filtering and transformation
  List<String> result = names.stream()
      .filter(name -> name.startsWith("A"))
      .map(String::toUpperCase)
      .sorted()
      .collect(Collectors.toList());
  // [ALICE, AMY, ANNA]

  // Counting
  long count = names.stream()
      .filter(name -> name.length() > 3)
      .count(); // 3

  // Reduce
  int sum = List.of(1, 2, 3, 4, 5).stream()
      .reduce(0, Integer::sum); // 15
  ```

  **Parallel Streams:** `list.parallelStream()` distributes processing across multiple threads for large collections.
section: "java"
order: 10
tags:
  - streams
  - functional-programming
---
