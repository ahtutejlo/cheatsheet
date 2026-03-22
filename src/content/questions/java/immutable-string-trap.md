---
ua_question: "Чи ефективна конкатенація рядків через += у циклі?"
en_question: "Is string concatenation with += efficient in a loop?"
ua_answer: |
  > **Trap:** Оскільки String -- це об'єкт, розробники вважають, що `+=` просто дописує дані до існуючого рядка. Насправді кожна операція `+=` створює новий об'єкт String, бо рядки в Java незмінні (immutable).

  String у Java є immutable -- після створення його вміст не може бути змінений. Кожна конкатенація через `+` або `+=` створює новий об'єкт String та копіює всі символи. У циклі з N ітерацій це призводить до O(N^2) складності по часу та створення N тимчасових об'єктів, що навантажує GC.

  ```java
  // BAD: O(n^2) time, creates n temporary objects
  String result = "";
  for (int i = 0; i < 100_000; i++) {
      result += "item" + i + ",";  // new String each iteration!
  }
  // ~10 seconds, ~5GB allocated

  // GOOD: O(n) time, single buffer
  StringBuilder sb = new StringBuilder();
  for (int i = 0; i < 100_000; i++) {
      sb.append("item").append(i).append(",");
  }
  String result = sb.toString();
  // ~5 milliseconds, ~10MB allocated

  // NOTE: single-line concatenation is fine
  // Compiler optimizes this automatically (Java 9+ uses StringConcatFactory)
  String name = first + " " + last;  // OK, no loop

  // StringBuffer vs StringBuilder
  // StringBuilder -- not thread-safe, faster (use in single thread)
  // StringBuffer  -- thread-safe (synchronized), slower
  ```

  Сучасні компілятори (Java 9+) використовують `invokedynamic` та `StringConcatFactory` для оптимізації одиничних конкатенацій, але це НЕ допомагає у циклах. Правило: якщо конкатенація відбувається у циклі або кількість операцій невідома заздалегідь -- використовуйте StringBuilder. Для конкатенації відомої кількості рядків в одному виразі -- `+` цілком прийнятний.
en_answer: |
  > **Trap:** Since String is an object, developers assume `+=` simply appends data to the existing string. In reality, each `+=` operation creates a new String object because strings in Java are immutable.

  String in Java is immutable -- after creation, its content cannot be changed. Each concatenation via `+` or `+=` creates a new String object and copies all characters. In a loop with N iterations, this leads to O(N^2) time complexity and creates N temporary objects, putting pressure on the GC.

  ```java
  // BAD: O(n^2) time, creates n temporary objects
  String result = "";
  for (int i = 0; i < 100_000; i++) {
      result += "item" + i + ",";  // new String each iteration!
  }
  // ~10 seconds, ~5GB allocated

  // GOOD: O(n) time, single buffer
  StringBuilder sb = new StringBuilder();
  for (int i = 0; i < 100_000; i++) {
      sb.append("item").append(i).append(",");
  }
  String result = sb.toString();
  // ~5 milliseconds, ~10MB allocated

  // NOTE: single-line concatenation is fine
  // Compiler optimizes this automatically (Java 9+ uses StringConcatFactory)
  String name = first + " " + last;  // OK, no loop

  // StringBuffer vs StringBuilder
  // StringBuilder -- not thread-safe, faster (use in single thread)
  // StringBuffer  -- thread-safe (synchronized), slower
  ```

  Modern compilers (Java 9+) use `invokedynamic` and `StringConcatFactory` to optimize single concatenations, but this does NOT help in loops. The rule: if concatenation happens in a loop or the number of operations is unknown in advance -- use StringBuilder. For concatenating a known number of strings in a single expression -- `+` is perfectly acceptable.
section: "java"
order: 25
tags:
  - strings
  - performance
  - pitfalls
type: "trick"
---
