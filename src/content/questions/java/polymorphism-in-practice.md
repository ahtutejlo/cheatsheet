---
ua_question: "Як працює поліморфізм у Java?"
en_question: "How does polymorphism work in Java?"
ua_answer: |
  Поліморфізм -- це здатність об'єктів різних типів реагувати на один і той самий виклик методу по-різному. В Java існує два типи поліморфізму: compile-time (перевантаження) та runtime (перевизначення).

  **1. Compile-time поліморфізм (method overloading):**

  Кілька методів з однаковою назвою, але різними параметрами в одному класі. Компілятор визначає, який метод викликати, на етапі компіляції.

  ```java
  public class Calculator {
      // Перевантажені методи -- різні параметри
      public int add(int a, int b) {
          return a + b;
      }

      public double add(double a, double b) {
          return a + b;
      }

      public int add(int a, int b, int c) {
          return a + b + c;
      }

      public String add(String a, String b) {
          return a + b;
      }
  }

  Calculator calc = new Calculator();
  calc.add(1, 2);        // викликає add(int, int)
  calc.add(1.5, 2.5);    // викликає add(double, double)
  calc.add(1, 2, 3);     // викликає add(int, int, int)
  ```

  **2. Runtime поліморфізм (method overriding + dynamic dispatch):**

  Дочірній клас перевизначає метод батька. JVM визначає, який метод викликати, під час виконання на основі фактичного типу об'єкта.

  ```java
  public interface PaymentProcessor {
      void processPayment(double amount);
      String getProviderName();
  }

  public class CreditCardProcessor implements PaymentProcessor {
      @Override
      public void processPayment(double amount) {
          System.out.println("Credit card charge: $" + amount);
          // Логіка оплати карткою
      }

      @Override
      public String getProviderName() { return "Visa/MasterCard"; }
  }

  public class PayPalProcessor implements PaymentProcessor {
      @Override
      public void processPayment(double amount) {
          System.out.println("PayPal transfer: $" + amount);
          // Логіка оплати через PayPal
      }

      @Override
      public String getProviderName() { return "PayPal"; }
  }

  public class CryptoProcessor implements PaymentProcessor {
      @Override
      public void processPayment(double amount) {
          System.out.println("Crypto payment: $" + amount);
          // Логіка оплати криптовалютою
      }

      @Override
      public String getProviderName() { return "Bitcoin"; }
  }
  ```

  **Практичне використання -- dynamic dispatch:**

  ```java
  public class PaymentService {
      private final List<PaymentProcessor> processors;

      public PaymentService(List<PaymentProcessor> processors) {
          this.processors = processors;
      }

      public void processAll(double amount) {
          // Поліморфний виклик -- JVM обирає правильну реалізацію
          for (PaymentProcessor processor : processors) {
              System.out.print(processor.getProviderName() + ": ");
              processor.processPayment(amount);
          }
      }
  }

  // Використання
  List<PaymentProcessor> processors = List.of(
      new CreditCardProcessor(),
      new PayPalProcessor(),
      new CryptoProcessor()
  );

  PaymentService service = new PaymentService(processors);
  service.processAll(100.0);
  // Visa/MasterCard: Credit card charge: $100.0
  // PayPal: PayPal transfer: $100.0
  // Bitcoin: Crypto payment: $100.0
  ```

  **Поліморфізм з абстрактними класами:**

  ```java
  public abstract class Shape {
      public abstract double area();

      // Загальний метод для всіх фігур
      public void printArea() {
          System.out.printf("%s area: %.2f%n", getClass().getSimpleName(), area());
      }
  }

  public class Circle extends Shape {
      private double radius;
      public Circle(double radius) { this.radius = radius; }

      @Override
      public double area() { return Math.PI * radius * radius; }
  }

  public class Rectangle extends Shape {
      private double width, height;
      public Rectangle(double w, double h) { this.width = w; this.height = h; }

      @Override
      public double area() { return width * height; }
  }

  // Поліморфний масив
  Shape[] shapes = { new Circle(5), new Rectangle(3, 4) };
  for (Shape s : shapes) {
      s.printArea(); // dynamic dispatch -- викликається правильний area()
  }
  ```

  Поліморфізм -- один з ключових принципів ООП, який дозволяє писати гнучкий і розширюваний код. Overloading вирішується компілятором (статичне зв'язування), а overriding -- JVM під час виконання (динамічне зв'язування). Саме runtime поліморфізм дозволяє дотримуватися принципу Open/Closed з SOLID.
en_answer: |
  Polymorphism is the ability of objects of different types to respond to the same method call in different ways. Java has two types of polymorphism: compile-time (overloading) and runtime (overriding).

  **1. Compile-time polymorphism (method overloading):**

  Multiple methods with the same name but different parameters in one class. The compiler determines which method to call at compile time.

  ```java
  public class Calculator {
      // Overloaded methods -- different parameters
      public int add(int a, int b) {
          return a + b;
      }

      public double add(double a, double b) {
          return a + b;
      }

      public int add(int a, int b, int c) {
          return a + b + c;
      }

      public String add(String a, String b) {
          return a + b;
      }
  }

  Calculator calc = new Calculator();
  calc.add(1, 2);        // calls add(int, int)
  calc.add(1.5, 2.5);    // calls add(double, double)
  calc.add(1, 2, 3);     // calls add(int, int, int)
  ```

  **2. Runtime polymorphism (method overriding + dynamic dispatch):**

  A child class overrides the parent's method. The JVM determines which method to call at runtime based on the actual object type.

  ```java
  public interface PaymentProcessor {
      void processPayment(double amount);
      String getProviderName();
  }

  public class CreditCardProcessor implements PaymentProcessor {
      @Override
      public void processPayment(double amount) {
          System.out.println("Credit card charge: $" + amount);
          // Card payment logic
      }

      @Override
      public String getProviderName() { return "Visa/MasterCard"; }
  }

  public class PayPalProcessor implements PaymentProcessor {
      @Override
      public void processPayment(double amount) {
          System.out.println("PayPal transfer: $" + amount);
          // PayPal payment logic
      }

      @Override
      public String getProviderName() { return "PayPal"; }
  }

  public class CryptoProcessor implements PaymentProcessor {
      @Override
      public void processPayment(double amount) {
          System.out.println("Crypto payment: $" + amount);
          // Crypto payment logic
      }

      @Override
      public String getProviderName() { return "Bitcoin"; }
  }
  ```

  **Practical usage -- dynamic dispatch:**

  ```java
  public class PaymentService {
      private final List<PaymentProcessor> processors;

      public PaymentService(List<PaymentProcessor> processors) {
          this.processors = processors;
      }

      public void processAll(double amount) {
          // Polymorphic call -- JVM picks the correct implementation
          for (PaymentProcessor processor : processors) {
              System.out.print(processor.getProviderName() + ": ");
              processor.processPayment(amount);
          }
      }
  }

  // Usage
  List<PaymentProcessor> processors = List.of(
      new CreditCardProcessor(),
      new PayPalProcessor(),
      new CryptoProcessor()
  );

  PaymentService service = new PaymentService(processors);
  service.processAll(100.0);
  // Visa/MasterCard: Credit card charge: $100.0
  // PayPal: PayPal transfer: $100.0
  // Bitcoin: Crypto payment: $100.0
  ```

  **Polymorphism with abstract classes:**

  ```java
  public abstract class Shape {
      public abstract double area();

      // Common method for all shapes
      public void printArea() {
          System.out.printf("%s area: %.2f%n", getClass().getSimpleName(), area());
      }
  }

  public class Circle extends Shape {
      private double radius;
      public Circle(double radius) { this.radius = radius; }

      @Override
      public double area() { return Math.PI * radius * radius; }
  }

  public class Rectangle extends Shape {
      private double width, height;
      public Rectangle(double w, double h) { this.width = w; this.height = h; }

      @Override
      public double area() { return width * height; }
  }

  // Polymorphic array
  Shape[] shapes = { new Circle(5), new Rectangle(3, 4) };
  for (Shape s : shapes) {
      s.printArea(); // dynamic dispatch -- correct area() is called
  }
  ```

  Polymorphism is one of the key OOP principles that enables flexible and extensible code. Overloading is resolved by the compiler (static binding), while overriding is resolved by the JVM at runtime (dynamic binding). Runtime polymorphism is what enables adherence to the Open/Closed principle from SOLID.
section: "java"
order: 35
tags:
  - oop
  - polymorphism
type: "basic"
---
