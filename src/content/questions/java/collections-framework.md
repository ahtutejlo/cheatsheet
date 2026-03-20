---
ua_question: "Що таке Java Collections Framework?"
en_question: "What is Java Collections Framework?"
ua_answer: |
  Java Collections Framework -- це набір інтерфейсів та класів для зберігання та маніпуляції групами об'єктів.

  Основні інтерфейси:
  - **List** -- впорядкована колекція з дублікатами (ArrayList, LinkedList)
  - **Set** -- колекція без дублікатів (HashSet, TreeSet)
  - **Map** -- колекція пар ключ-значення (HashMap, TreeMap)

  ```java
  // List -- зберігає порядок, дозволяє дублікати
  List<String> list = new ArrayList<>();
  list.add("Java");
  list.add("Java"); // дублікат дозволений

  // Set -- без дублікатів
  Set<String> set = new HashSet<>();
  set.add("Java");
  set.add("Java"); // ігнорується

  // Map -- ключ-значення
  Map<String, Integer> map = new HashMap<>();
  map.put("Java", 1);
  map.put("Python", 2);
  ```
en_answer: |
  Java Collections Framework is a set of interfaces and classes for storing and manipulating groups of objects.

  Main interfaces:
  - **List** -- ordered collection with duplicates (ArrayList, LinkedList)
  - **Set** -- collection without duplicates (HashSet, TreeSet)
  - **Map** -- key-value pair collection (HashMap, TreeMap)

  ```java
  // List -- maintains order, allows duplicates
  List<String> list = new ArrayList<>();
  list.add("Java");
  list.add("Java"); // duplicate allowed

  // Set -- no duplicates
  Set<String> set = new HashSet<>();
  set.add("Java");
  set.add("Java"); // ignored

  // Map -- key-value pairs
  Map<String, Integer> map = new HashMap<>();
  map.put("Java", 1);
  map.put("Python", 2);
  ```
section: "java"
order: 3
tags:
  - collections
---
