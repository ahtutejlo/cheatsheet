---
ua_question: "Які є способи ітерації по масивах і колекціях у Java?"
en_question: "What are the ways to iterate over arrays and collections in Java?"
ua_answer: |
  Java надає кілька способів перебору масивів і колекцій, кожен з яких має свої переваги та сценарії використання.

  **1. Класичний цикл for:**

  ```java
  String[] fruits = {"Apple", "Banana", "Cherry"};

  // Доступ за індексом -- повний контроль
  for (int i = 0; i < fruits.length; i++) {
      System.out.println(i + ": " + fruits[i]);
  }

  // Для List -- аналогічно
  List<String> list = List.of("Apple", "Banana", "Cherry");
  for (int i = 0; i < list.size(); i++) {
      System.out.println(list.get(i));
  }
  ```

  **2. Enhanced for-each (починаючи з Java 5):**

  ```java
  // Для масивів
  for (String fruit : fruits) {
      System.out.println(fruit);
  }

  // Для будь-якої Iterable колекції
  Set<String> set = Set.of("A", "B", "C");
  for (String item : set) {
      System.out.println(item);
  }
  ```

  **3. Iterator / ListIterator:**

  ```java
  List<String> list = new ArrayList<>(List.of("Apple", "Banana", "Cherry"));

  // Iterator -- безпечне видалення під час ітерації
  Iterator<String> it = list.iterator();
  while (it.hasNext()) {
      String fruit = it.next();
      if (fruit.equals("Banana")) {
          it.remove(); // безпечне видалення
      }
  }

  // ListIterator -- двонаправлена ітерація + модифікація
  ListIterator<String> lit = list.listIterator();
  while (lit.hasNext()) {
      String fruit = lit.next();
      lit.set(fruit.toUpperCase()); // заміна елемента
  }
  ```

  **4. Stream API (починаючи з Java 8):**

  ```java
  // Arrays.stream() для масивів
  Arrays.stream(fruits)
      .filter(f -> f.startsWith("A"))
      .map(String::toUpperCase)
      .forEach(System.out::println);

  // Collection.stream() для колекцій
  list.stream()
      .sorted()
      .distinct()
      .forEach(System.out::println);
  ```

  **5. Iterable.forEach() (починаючи з Java 8):**

  ```java
  // Метод forEach з лямбда-виразом
  list.forEach(fruit -> System.out.println(fruit));

  // Method reference
  list.forEach(System.out::println);

  // Для Map
  Map<String, Integer> map = Map.of("A", 1, "B", 2);
  map.forEach((key, value) -> System.out.println(key + "=" + value));
  ```

  **Порівняння підходів:**
  - **Класичний for** -- коли потрібен індекс або модифікація за індексом
  - **For-each** -- найчистіший синтаксис для простого перебору
  - **Iterator** -- коли потрібно видаляти елементи під час ітерації
  - **Stream** -- для ланцюжків трансформацій (filter/map/reduce)
  - **forEach** -- компактний синтаксис для простих операцій
en_answer: |
  Java provides several ways to iterate over arrays and collections, each with its own advantages and use cases.

  **1. Classic for loop:**

  ```java
  String[] fruits = {"Apple", "Banana", "Cherry"};

  // Index-based access -- full control
  for (int i = 0; i < fruits.length; i++) {
      System.out.println(i + ": " + fruits[i]);
  }

  // For List -- same approach
  List<String> list = List.of("Apple", "Banana", "Cherry");
  for (int i = 0; i < list.size(); i++) {
      System.out.println(list.get(i));
  }
  ```

  **2. Enhanced for-each (since Java 5):**

  ```java
  // For arrays
  for (String fruit : fruits) {
      System.out.println(fruit);
  }

  // For any Iterable collection
  Set<String> set = Set.of("A", "B", "C");
  for (String item : set) {
      System.out.println(item);
  }
  ```

  **3. Iterator / ListIterator:**

  ```java
  List<String> list = new ArrayList<>(List.of("Apple", "Banana", "Cherry"));

  // Iterator -- safe removal during iteration
  Iterator<String> it = list.iterator();
  while (it.hasNext()) {
      String fruit = it.next();
      if (fruit.equals("Banana")) {
          it.remove(); // safe removal
      }
  }

  // ListIterator -- bidirectional iteration + modification
  ListIterator<String> lit = list.listIterator();
  while (lit.hasNext()) {
      String fruit = lit.next();
      lit.set(fruit.toUpperCase()); // replace element
  }
  ```

  **4. Stream API (since Java 8):**

  ```java
  // Arrays.stream() for arrays
  Arrays.stream(fruits)
      .filter(f -> f.startsWith("A"))
      .map(String::toUpperCase)
      .forEach(System.out::println);

  // Collection.stream() for collections
  list.stream()
      .sorted()
      .distinct()
      .forEach(System.out::println);
  ```

  **5. Iterable.forEach() (since Java 8):**

  ```java
  // forEach with lambda expression
  list.forEach(fruit -> System.out.println(fruit));

  // Method reference
  list.forEach(System.out::println);

  // For Map
  Map<String, Integer> map = Map.of("A", 1, "B", 2);
  map.forEach((key, value) -> System.out.println(key + "=" + value));
  ```

  **Comparison of approaches:**
  - **Classic for** -- when you need the index or index-based modification
  - **For-each** -- cleanest syntax for simple iteration
  - **Iterator** -- when you need to remove elements during iteration
  - **Stream** -- for transformation chains (filter/map/reduce)
  - **forEach** -- compact syntax for simple operations
section: "java"
order: 32
tags:
  - arrays
  - collections
  - iteration
type: "basic"
---
