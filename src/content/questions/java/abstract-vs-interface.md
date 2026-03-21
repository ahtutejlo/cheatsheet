---
ua_question: "Яка різниця між abstract class та interface?"
en_question: "What is the difference between abstract class and interface?"
ua_answer: |
  В Java **abstract class** та **interface** -- це два способи досягнення абстракції, але вони мають суттєві відмінності.

  **Abstract class:**
  - Може мати як абстрактні, так і звичайні методи
  - Може мати конструктор
  - Може мати поля (instance variables) з будь-яким модифікатором доступу
  - Клас може наслідувати лише один abstract class
  - Може мати стан (state)

  **Interface:**
  - До Java 8: тільки абстрактні методи
  - З Java 8: може мати `default` та `static` методи
  - З Java 9: може мати `private` методи
  - Поля лише `public static final` (константи)
  - Клас може імплементувати кілька interfaces
  - Немає конструктора

  ```java
  abstract class Animal {
      protected String name;

      Animal(String name) { this.name = name; }

      abstract void speak();

      void breathe() { System.out.println("Breathing..."); }
  }

  interface Swimmable {
      void swim();
      default void float_() { System.out.println("Floating..."); }
  }

  class Duck extends Animal implements Swimmable {
      Duck(String name) { super(name); }
      void speak() { System.out.println("Quack!"); }
      public void swim() { System.out.println("Swimming..."); }
  }
  ```

  **Коли що використовувати:** abstract class -- для спорідненої ієрархії з спільним станом; interface -- для контракту поведінки, який можуть реалізувати різні класи.
en_answer: |
  In Java, **abstract class** and **interface** are two ways to achieve abstraction, but they have significant differences.

  **Abstract class:**
  - Can have both abstract and concrete methods
  - Can have a constructor
  - Can have fields (instance variables) with any access modifier
  - A class can extend only one abstract class
  - Can have state

  **Interface:**
  - Before Java 8: only abstract methods
  - Since Java 8: can have `default` and `static` methods
  - Since Java 9: can have `private` methods
  - Fields are only `public static final` (constants)
  - A class can implement multiple interfaces
  - No constructor

  ```java
  abstract class Animal {
      protected String name;

      Animal(String name) { this.name = name; }

      abstract void speak();

      void breathe() { System.out.println("Breathing..."); }
  }

  interface Swimmable {
      void swim();
      default void float_() { System.out.println("Floating..."); }
  }

  class Duck extends Animal implements Swimmable {
      Duck(String name) { super(name); }
      void speak() { System.out.println("Quack!"); }
      public void swim() { System.out.println("Swimming..."); }
  }
  ```

  **When to use what:** abstract class -- for related hierarchy with shared state; interface -- for a behavior contract that different classes can implement.
section: "java"
order: 4
tags:
  - oop
  - abstraction
---
