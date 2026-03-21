---
ua_question: "Чому потрібно перевизначати equals() і hashCode()?"
en_question: "Why should you override equals() and hashCode()?"
ua_answer: |
  Методи `equals()` і `hashCode()` визначені в класі `Object` і використовуються для порівняння об'єктів та роботи з хеш-колекціями (HashMap, HashSet).

  **Контракт equals() і hashCode():**
  - Якщо `a.equals(b)` повертає `true`, то `a.hashCode() == b.hashCode()`
  - Якщо `hashCode` різні, то `equals` повинен повернути `false`
  - Однаковий `hashCode` **не гарантує** рівність (колізії)

  **Що буде, якщо не перевизначити:**
  ```java
  class User {
      String name;
      User(String name) { this.name = name; }
  }

  User u1 = new User("John");
  User u2 = new User("John");

  Set<User> set = new HashSet<>();
  set.add(u1);
  set.add(u2);
  System.out.println(set.size()); // 2 (а очікуємо 1!)
  ```

  **Правильна реалізація:**
  ```java
  class User {
      String name;
      int age;

      @Override
      public boolean equals(Object o) {
          if (this == o) return true;
          if (o == null || getClass() != o.getClass()) return false;
          User user = (User) o;
          return age == user.age && Objects.equals(name, user.name);
      }

      @Override
      public int hashCode() {
          return Objects.hash(name, age);
      }
  }
  ```

  **Правило:** якщо перевизначаєте `equals()`, завжди перевизначайте `hashCode()`. Порушення контракту призводить до непередбачуваної поведінки в HashMap, HashSet, Hashtable.
en_answer: |
  Methods `equals()` and `hashCode()` are defined in the `Object` class and are used for object comparison and hash-based collections (HashMap, HashSet).

  **equals() and hashCode() contract:**
  - If `a.equals(b)` returns `true`, then `a.hashCode() == b.hashCode()`
  - If `hashCode` values differ, `equals` must return `false`
  - Same `hashCode` **does not guarantee** equality (collisions)

  **What happens without overriding:**
  ```java
  class User {
      String name;
      User(String name) { this.name = name; }
  }

  User u1 = new User("John");
  User u2 = new User("John");

  Set<User> set = new HashSet<>();
  set.add(u1);
  set.add(u2);
  System.out.println(set.size()); // 2 (but we expect 1!)
  ```

  **Correct implementation:**
  ```java
  class User {
      String name;
      int age;

      @Override
      public boolean equals(Object o) {
          if (this == o) return true;
          if (o == null || getClass() != o.getClass()) return false;
          User user = (User) o;
          return age == user.age && Objects.equals(name, user.name);
      }

      @Override
      public int hashCode() {
          return Objects.hash(name, age);
      }
  }
  ```

  **Rule:** if you override `equals()`, always override `hashCode()`. Violating the contract leads to unpredictable behavior in HashMap, HashSet, Hashtable.
section: "java"
order: 9
tags:
  - oop
  - equals-hashcode
---
