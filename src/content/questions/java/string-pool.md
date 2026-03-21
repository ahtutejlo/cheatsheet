---
ua_question: "Що таке String Pool в Java?"
en_question: "What is the String Pool in Java?"
ua_answer: |
  String Pool (пул рядків) -- це спеціальна область пам'яті в heap, де Java зберігає унікальні рядкові літерали. Це оптимізація, яка дозволяє повторно використовувати рядки замість створення нових об'єктів.

  **Як це працює:**
  ```java
  String s1 = "Hello";    // створює рядок у String Pool
  String s2 = "Hello";    // використовує той самий об'єкт з Pool
  String s3 = new String("Hello"); // створює НОВИЙ об'єкт у heap

  System.out.println(s1 == s2);      // true (та сама адреса)
  System.out.println(s1 == s3);      // false (різні об'єкти)
  System.out.println(s1.equals(s3)); // true (однаковий вміст)
  ```

  **Важливі факти:**
  - Рядки в Java **незмінні (immutable)** -- будь-яка "зміна" створює новий об'єкт
  - Метод `intern()` додає рядок до Pool
  - `StringBuilder` та `StringBuffer` використовуються для ефективної конкатенації

  ```java
  String s3 = new String("Hello");
  String s4 = s3.intern(); // повертає посилання з Pool
  System.out.println(s1 == s4); // true

  // Ефективна конкатенація
  StringBuilder sb = new StringBuilder();
  for (int i = 0; i < 1000; i++) {
      sb.append("item").append(i);
  }
  String result = sb.toString();
  ```

  **Порівняння рядків:** завжди використовуйте `.equals()` для порівняння вмісту, а не `==`, який порівнює посилання.
en_answer: |
  String Pool is a special memory area in the heap where Java stores unique string literals. This is an optimization that allows reusing strings instead of creating new objects.

  **How it works:**
  ```java
  String s1 = "Hello";    // creates string in String Pool
  String s2 = "Hello";    // reuses the same object from Pool
  String s3 = new String("Hello"); // creates a NEW object in heap

  System.out.println(s1 == s2);      // true (same reference)
  System.out.println(s1 == s3);      // false (different objects)
  System.out.println(s1.equals(s3)); // true (same content)
  ```

  **Important facts:**
  - Strings in Java are **immutable** -- any "change" creates a new object
  - The `intern()` method adds a string to the Pool
  - `StringBuilder` and `StringBuffer` are used for efficient concatenation

  ```java
  String s3 = new String("Hello");
  String s4 = s3.intern(); // returns reference from Pool
  System.out.println(s1 == s4); // true

  // Efficient concatenation
  StringBuilder sb = new StringBuilder();
  for (int i = 0; i < 1000; i++) {
      sb.append("item").append(i);
  }
  String result = sb.toString();
  ```

  **String comparison:** always use `.equals()` for content comparison, not `==`, which compares references.
section: "java"
order: 8
tags:
  - strings
  - memory
---
