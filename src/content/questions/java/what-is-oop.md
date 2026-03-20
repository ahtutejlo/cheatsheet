---
ua_question: "Що таке ООП?"
en_question: "What is OOP?"
ua_answer: |
  ООП (Об'єктно-орієнтоване програмування) -- це парадигма програмування, заснована на концепції об'єктів, які містять дані (поля) та поведінку (методи).

  Чотири основних принципи ООП:
  - **Інкапсуляція** -- приховування внутрішньої реалізації
  - **Наслідування** -- створення нових класів на основі існуючих
  - **Поліморфізм** -- різна поведінка для різних типів
  - **Абстракція** -- виділення суттєвих характеристик

  ```java
  public class Animal {
      private String name;

      public Animal(String name) {
          this.name = name;
      }

      public String speak() {
          return name + " makes a sound";
      }
  }

  public class Dog extends Animal {
      public Dog(String name) {
          super(name);
      }

      @Override
      public String speak() {
          return "Woof!";
      }
  }
  ```
en_answer: |
  OOP (Object-Oriented Programming) is a programming paradigm based on the concept of objects that contain data (fields) and behavior (methods).

  Four main principles of OOP:
  - **Encapsulation** -- hiding internal implementation
  - **Inheritance** -- creating new classes based on existing ones
  - **Polymorphism** -- different behavior for different types
  - **Abstraction** -- highlighting essential characteristics

  ```java
  public class Animal {
      private String name;

      public Animal(String name) {
          this.name = name;
      }

      public String speak() {
          return name + " makes a sound";
      }
  }

  public class Dog extends Animal {
      public Dog(String name) {
          super(name);
      }

      @Override
      public String speak() {
          return "Woof!";
      }
  }
  ```
section: "java"
order: 1
tags:
  - fundamentals
  - oop
---
