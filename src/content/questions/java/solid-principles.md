---
ua_question: "Що таке принципи SOLID?"
en_question: "What are SOLID principles?"
ua_answer: |
  SOLID -- це п'ять принципів об'єктно-орієнтованого проєктування:

  1. **S** -- Single Responsibility (Єдина відповідальність)
  2. **O** -- Open/Closed (Відкритість/Закритість)
  3. **L** -- Liskov Substitution (Підстановка Лісков)
  4. **I** -- Interface Segregation (Розділення інтерфейсів)
  5. **D** -- Dependency Inversion (Інверсія залежностей)

  ```java
  // Single Responsibility -- клас має одну причину для зміни
  public class UserService {
      public User createUser(String email) {
          return new User(email);
      }
  }

  public class EmailService {
      public void sendWelcomeEmail(User user) {
          // відправка email
      }
  }

  // Dependency Inversion -- залежність від абстракцій
  public class OrderService {
      private final PaymentGateway gateway;

      public OrderService(PaymentGateway gateway) {
          this.gateway = gateway;
      }
  }
  ```
en_answer: |
  SOLID is five principles of object-oriented design:

  1. **S** -- Single Responsibility
  2. **O** -- Open/Closed
  3. **L** -- Liskov Substitution
  4. **I** -- Interface Segregation
  5. **D** -- Dependency Inversion

  ```java
  // Single Responsibility -- a class has one reason to change
  public class UserService {
      public User createUser(String email) {
          return new User(email);
      }
  }

  public class EmailService {
      public void sendWelcomeEmail(User user) {
          // send email
      }
  }

  // Dependency Inversion -- depend on abstractions
  public class OrderService {
      private final PaymentGateway gateway;

      public OrderService(PaymentGateway gateway) {
          this.gateway = gateway;
      }
  }
  ```
section: "java"
order: 2
tags:
  - fundamentals
  - oop
  - solid
---
