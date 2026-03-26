---
ua_question: "Як працює наслідування в Java?"
en_question: "How does inheritance work in Java?"
ua_answer: |
  Наслідування -- це механізм ООП, який дозволяє створювати новий клас на основі існуючого. Дочірній клас (subclass) отримує всі поля та методи батьківського класу (superclass) і може додавати власні або перевизначати успадковані.

  **Основи -- extends та super:**

  ```java
  public class Animal {
      protected String name;
      protected int age;

      public Animal(String name, int age) {
          this.name = name;
          this.age = age;
          System.out.println("Animal constructor");
      }

      public void eat() {
          System.out.println(name + " is eating");
      }

      public String info() {
          return name + ", age: " + age;
      }
  }

  public class Dog extends Animal {
      private String breed;

      public Dog(String name, int age, String breed) {
          super(name, age); // виклик конструктора батька -- ОБОВ'ЯЗКОВИЙ першим рядком
          this.breed = breed;
          System.out.println("Dog constructor");
      }

      // Перевизначення методу
      @Override
      public String info() {
          return super.info() + ", breed: " + breed; // виклик методу батька
      }

      // Новий метод
      public void bark() {
          System.out.println(name + " says: Woof!");
      }
  }
  ```

  **Ланцюжок конструкторів (constructor chaining):**

  ```java
  public class ServiceDog extends Dog {
      private String task;

      public ServiceDog(String name, int age, String breed, String task) {
          super(name, age, breed); // викликає Dog -> Animal
          this.task = task;
      }

      @Override
      public String info() {
          return super.info() + ", task: " + task;
      }
  }

  // Порядок виклику конструкторів:
  ServiceDog rex = new ServiceDog("Rex", 3, "Shepherd", "Search");
  // Виведе:
  // Animal constructor
  // Dog constructor
  ```

  **Перевизначення методів -- правила @Override:**

  ```java
  public class Cat extends Animal {
      public Cat(String name, int age) {
          super(name, age);
      }

      @Override
      public void eat() {
          System.out.println(name + " is eating fish"); // змінена поведінка
      }

      // Помилка компіляції -- не можна звузити модифікатор доступу
      // @Override
      // private void eat() { } // protected -> private ЗАБОРОНЕНО

      // Можна розширити: protected -> public ДОЗВОЛЕНО
  }

  // Поліморфне використання
  Animal animal = new Cat("Whiskers", 2);
  animal.eat(); // "Whiskers is eating fish" -- викликається метод Cat
  ```

  **Коли використовувати наслідування vs композицію:**

  ```java
  // НАСЛІДУВАННЯ (is-a): Dog IS an Animal
  class Dog extends Animal { }

  // КОМПОЗИЦІЯ (has-a): Car HAS an Engine -- зазвичай краще
  class Car {
      private Engine engine; // замість extends Engine

      public void start() {
          engine.ignite();
      }
  }
  ```

  Перевагу слід надавати композиції над наслідуванням ("Favor composition over inheritance" -- Effective Java). Наслідування створює жорстку залежність між класами. Використовуйте наслідування лише коли існує чітке відношення "є" (is-a), а не "має" (has-a).
en_answer: |
  Inheritance is an OOP mechanism that allows creating a new class based on an existing one. The child class (subclass) receives all fields and methods of the parent class (superclass) and can add its own or override inherited ones.

  **Basics -- extends and super:**

  ```java
  public class Animal {
      protected String name;
      protected int age;

      public Animal(String name, int age) {
          this.name = name;
          this.age = age;
          System.out.println("Animal constructor");
      }

      public void eat() {
          System.out.println(name + " is eating");
      }

      public String info() {
          return name + ", age: " + age;
      }
  }

  public class Dog extends Animal {
      private String breed;

      public Dog(String name, int age, String breed) {
          super(name, age); // parent constructor call -- MUST be the first line
          this.breed = breed;
          System.out.println("Dog constructor");
      }

      // Method overriding
      @Override
      public String info() {
          return super.info() + ", breed: " + breed; // calling parent method
      }

      // New method
      public void bark() {
          System.out.println(name + " says: Woof!");
      }
  }
  ```

  **Constructor chaining:**

  ```java
  public class ServiceDog extends Dog {
      private String task;

      public ServiceDog(String name, int age, String breed, String task) {
          super(name, age, breed); // calls Dog -> Animal
          this.task = task;
      }

      @Override
      public String info() {
          return super.info() + ", task: " + task;
      }
  }

  // Constructor call order:
  ServiceDog rex = new ServiceDog("Rex", 3, "Shepherd", "Search");
  // Prints:
  // Animal constructor
  // Dog constructor
  ```

  **Method overriding -- @Override rules:**

  ```java
  public class Cat extends Animal {
      public Cat(String name, int age) {
          super(name, age);
      }

      @Override
      public void eat() {
          System.out.println(name + " is eating fish"); // changed behavior
      }

      // Compile error -- cannot narrow access modifier
      // @Override
      // private void eat() { } // protected -> private FORBIDDEN

      // Can widen: protected -> public ALLOWED
  }

  // Polymorphic usage
  Animal animal = new Cat("Whiskers", 2);
  animal.eat(); // "Whiskers is eating fish" -- Cat's method is called
  ```

  **When to use inheritance vs composition:**

  ```java
  // INHERITANCE (is-a): Dog IS an Animal
  class Dog extends Animal { }

  // COMPOSITION (has-a): Car HAS an Engine -- usually better
  class Car {
      private Engine engine; // instead of extends Engine

      public void start() {
          engine.ignite();
      }
  }
  ```

  Prefer composition over inheritance ("Favor composition over inheritance" -- Effective Java). Inheritance creates tight coupling between classes. Use inheritance only when there is a clear "is-a" relationship, not "has-a".
section: "java"
order: 34
tags:
  - oop
  - inheritance
type: "basic"
---
