---
ua_question: "Що таке Enum у Java і як його використовувати?"
en_question: "What are Enums in Java and how to use them?"
ua_answer: |
  Enum (перелік) -- це спеціальний тип даних у Java, який представляє фіксований набір констант. На відміну від звичайних констант, enum забезпечує типобезпеку та може мати поля, конструктори та методи.

  **Базовий enum:**

  ```java
  public enum Season {
      SPRING, SUMMER, AUTUMN, WINTER
  }

  // Використання
  Season current = Season.SUMMER;
  System.out.println(current);        // SUMMER
  System.out.println(current.name()); // SUMMER
  System.out.println(current.ordinal()); // 1 (порядковий номер)

  // Перебір всіх значень
  for (Season s : Season.values()) {
      System.out.println(s);
  }

  // Створення з рядка
  Season s = Season.valueOf("WINTER"); // WINTER
  ```

  **Enum з полями, конструктором і методами:**

  ```java
  public enum Planet {
      MERCURY(3.303e+23, 2.4397e6),
      VENUS(4.869e+24, 6.0518e6),
      EARTH(5.976e+24, 6.37814e6);

      private final double mass;
      private final double radius;

      Planet(double mass, double radius) {
          this.mass = mass;
          this.radius = radius;
      }

      public double surfaceGravity() {
          final double G = 6.67300E-11;
          return G * mass / (radius * radius);
      }

      public double surfaceWeight(double otherMass) {
          return otherMass * surfaceGravity();
      }
  }

  // Використання
  double weight = Planet.EARTH.surfaceWeight(75);
  System.out.println("Weight on Earth: " + weight);
  ```

  **Enum з абстрактними методами:**

  ```java
  public enum Operation {
      ADD {
          @Override
          public double apply(double a, double b) { return a + b; }
      },
      SUBTRACT {
          @Override
          public double apply(double a, double b) { return a - b; }
      },
      MULTIPLY {
          @Override
          public double apply(double a, double b) { return a * b; }
      };

      public abstract double apply(double a, double b);
  }

  // Використання
  double result = Operation.ADD.apply(10, 5); // 15.0
  ```

  **Enum у switch та EnumSet:**

  ```java
  // Switch з enum
  Season season = Season.SUMMER;
  switch (season) {
      case SPRING -> System.out.println("Весна");
      case SUMMER -> System.out.println("Літо");
      case AUTUMN -> System.out.println("Осінь");
      case WINTER -> System.out.println("Зима");
  }

  // EnumSet -- оптимізована колекція для enum
  EnumSet<Season> warm = EnumSet.of(Season.SPRING, Season.SUMMER);
  EnumSet<Season> cold = EnumSet.complementOf(warm);
  EnumSet<Season> all = EnumSet.allOf(Season.class);

  System.out.println(warm.contains(Season.SUMMER)); // true
  ```

  Enum у Java -- це повноцінний клас, який неявно наслідує `java.lang.Enum`. Він гарантує єдиний екземпляр кожної константи (Singleton), серіалізацію та потокобезпечність. Використовуйте enum замість цілочислових констант або рядків для фіксованих наборів значень.
en_answer: |
  Enum (enumeration) is a special data type in Java that represents a fixed set of constants. Unlike regular constants, enum provides type safety and can have fields, constructors, and methods.

  **Basic enum:**

  ```java
  public enum Season {
      SPRING, SUMMER, AUTUMN, WINTER
  }

  // Usage
  Season current = Season.SUMMER;
  System.out.println(current);        // SUMMER
  System.out.println(current.name()); // SUMMER
  System.out.println(current.ordinal()); // 1 (ordinal number)

  // Iterate over all values
  for (Season s : Season.values()) {
      System.out.println(s);
  }

  // Create from string
  Season s = Season.valueOf("WINTER"); // WINTER
  ```

  **Enum with fields, constructor, and methods:**

  ```java
  public enum Planet {
      MERCURY(3.303e+23, 2.4397e6),
      VENUS(4.869e+24, 6.0518e6),
      EARTH(5.976e+24, 6.37814e6);

      private final double mass;
      private final double radius;

      Planet(double mass, double radius) {
          this.mass = mass;
          this.radius = radius;
      }

      public double surfaceGravity() {
          final double G = 6.67300E-11;
          return G * mass / (radius * radius);
      }

      public double surfaceWeight(double otherMass) {
          return otherMass * surfaceGravity();
      }
  }

  // Usage
  double weight = Planet.EARTH.surfaceWeight(75);
  System.out.println("Weight on Earth: " + weight);
  ```

  **Enum with abstract methods:**

  ```java
  public enum Operation {
      ADD {
          @Override
          public double apply(double a, double b) { return a + b; }
      },
      SUBTRACT {
          @Override
          public double apply(double a, double b) { return a - b; }
      },
      MULTIPLY {
          @Override
          public double apply(double a, double b) { return a * b; }
      };

      public abstract double apply(double a, double b);
  }

  // Usage
  double result = Operation.ADD.apply(10, 5); // 15.0
  ```

  **Enum in switch and EnumSet:**

  ```java
  // Switch with enum
  Season season = Season.SUMMER;
  switch (season) {
      case SPRING -> System.out.println("Spring");
      case SUMMER -> System.out.println("Summer");
      case AUTUMN -> System.out.println("Autumn");
      case WINTER -> System.out.println("Winter");
  }

  // EnumSet -- optimized collection for enum
  EnumSet<Season> warm = EnumSet.of(Season.SPRING, Season.SUMMER);
  EnumSet<Season> cold = EnumSet.complementOf(warm);
  EnumSet<Season> all = EnumSet.allOf(Season.class);

  System.out.println(warm.contains(Season.SUMMER)); // true
  ```

  Enum in Java is a full-fledged class that implicitly extends `java.lang.Enum`. It guarantees a single instance of each constant (Singleton), serialization, and thread safety. Use enum instead of integer constants or strings for fixed sets of values.
section: "java"
order: 33
tags:
  - enum
  - oop
type: "basic"
---
