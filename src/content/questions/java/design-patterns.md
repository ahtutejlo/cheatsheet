---
ua_question: "Які патерни проектування ви знаєте?"
en_question: "What design patterns do you know?"
ua_answer: |
  Патерни проектування -- це перевірені рішення типових проблем в об'єктно-орієнтованому програмуванні. Вони поділяються на три категорії (GoF).

  **Породжуючі (Creational):**
  - **Singleton** -- один екземпляр класу на додаток
  - **Factory Method** -- делегування створення об'єктів підкласам
  - **Builder** -- покрокове створення складних об'єктів

  **Структурні (Structural):**
  - **Adapter** -- адаптація інтерфейсу до очікуваного
  - **Decorator** -- динамічне додавання поведінки
  - **Proxy** -- контроль доступу до об'єкта

  **Поведінкові (Behavioral):**
  - **Observer** -- сповіщення підписників про зміни
  - **Strategy** -- вибір алгоритму під час виконання
  - **Template Method** -- каркас алгоритму з кроками для перевизначення

  ```java
  // Singleton
  public class DatabaseConnection {
      private static volatile DatabaseConnection instance;

      private DatabaseConnection() {}

      public static DatabaseConnection getInstance() {
          if (instance == null) {
              synchronized (DatabaseConnection.class) {
                  if (instance == null) {
                      instance = new DatabaseConnection();
                  }
              }
          }
          return instance;
      }
  }

  // Strategy
  interface SortStrategy {
      void sort(int[] array);
  }

  class QuickSort implements SortStrategy {
      public void sort(int[] array) { /* quick sort */ }
  }

  class MergeSort implements SortStrategy {
      public void sort(int[] array) { /* merge sort */ }
  }
  ```
en_answer: |
  Design patterns are proven solutions to common problems in object-oriented programming. They are divided into three categories (GoF).

  **Creational:**
  - **Singleton** -- one instance of a class per application
  - **Factory Method** -- delegating object creation to subclasses
  - **Builder** -- step-by-step construction of complex objects

  **Structural:**
  - **Adapter** -- adapting an interface to the expected one
  - **Decorator** -- dynamically adding behavior
  - **Proxy** -- controlling access to an object

  **Behavioral:**
  - **Observer** -- notifying subscribers about changes
  - **Strategy** -- choosing an algorithm at runtime
  - **Template Method** -- algorithm skeleton with steps to override

  ```java
  // Singleton
  public class DatabaseConnection {
      private static volatile DatabaseConnection instance;

      private DatabaseConnection() {}

      public static DatabaseConnection getInstance() {
          if (instance == null) {
              synchronized (DatabaseConnection.class) {
                  if (instance == null) {
                      instance = new DatabaseConnection();
                  }
              }
          }
          return instance;
      }
  }

  // Strategy
  interface SortStrategy {
      void sort(int[] array);
  }

  class QuickSort implements SortStrategy {
      public void sort(int[] array) { /* quick sort */ }
  }

  class MergeSort implements SortStrategy {
      public void sort(int[] array) { /* merge sort */ }
  }
  ```
section: "java"
order: 12
tags:
  - design-patterns
  - oop
---
