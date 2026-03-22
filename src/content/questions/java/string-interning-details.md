---
ua_question: "Як працює String interning та String Pool у деталях?"
en_question: "How does String interning and String Pool work in detail?"
ua_answer: |
  String Pool -- це спеціальна хеш-таблиця (StringTable) у JVM, яка зберігає унікальні екземпляри рядків. Починаючи з Java 7, String Pool знаходиться у heap (раніше в PermGen), що дозволяє збирати невикористані рядки збирачем сміття.

  **Механізм intern():** метод `String.intern()` перевіряє, чи є рядок з таким вмістом у пулі. Якщо є -- повертає посилання на нього. Якщо немає -- додає рядок у пул і повертає посилання. Рядкові літерали автоматично інтернуються при завантаженні класу.

  ```java
  String s1 = "hello";                  // auto-interned at class load
  String s2 = "hello";                  // same reference from pool
  String s3 = new String("hello");      // new object on heap
  String s4 = s3.intern();              // returns reference from pool

  System.out.println(s1 == s2);         // true  (same pool reference)
  System.out.println(s1 == s3);         // false (heap vs pool)
  System.out.println(s1 == s4);         // true  (intern returned pool ref)

  // Concatenation at compile time vs runtime
  String s5 = "hel" + "lo";            // compile-time constant -> pool
  System.out.println(s1 == s5);         // true

  String part = "lo";
  String s6 = "hel" + part;            // runtime concat -> new object
  System.out.println(s1 == s6);         // false
  System.out.println(s1 == s6.intern()); // true
  ```

  **Налаштування та продуктивність:** розмір StringTable контролюється через `-XX:StringTableSize=N` (за замовчуванням 65536 у Java 11+). Більший розмір зменшує колізії хешів. Для моніторингу: `-XX:+PrintStringTableStatistics` показує статистику при завершенні JVM.

  Надмірне використання `intern()` може призвести до проблем: повільний пошук у великій таблиці, збільшення часу GC, та потенційні витоки пам'яті якщо інтерновані рядки ніколи не використовуються повторно. Інтернуйте лише рядки, які гарантовано повторюються багато разів (наприклад, імена полів з XML/JSON парсинга).
en_answer: |
  String Pool is a special hash table (StringTable) in the JVM that stores unique string instances. Starting from Java 7, the String Pool resides in the heap (previously in PermGen), allowing unused strings to be garbage collected.

  **The intern() mechanism:** the `String.intern()` method checks if a string with the same content exists in the pool. If it does -- returns a reference to it. If not -- adds the string to the pool and returns the reference. String literals are automatically interned at class loading time.

  ```java
  String s1 = "hello";                  // auto-interned at class load
  String s2 = "hello";                  // same reference from pool
  String s3 = new String("hello");      // new object on heap
  String s4 = s3.intern();              // returns reference from pool

  System.out.println(s1 == s2);         // true  (same pool reference)
  System.out.println(s1 == s3);         // false (heap vs pool)
  System.out.println(s1 == s4);         // true  (intern returned pool ref)

  // Concatenation at compile time vs runtime
  String s5 = "hel" + "lo";            // compile-time constant -> pool
  System.out.println(s1 == s5);         // true

  String part = "lo";
  String s6 = "hel" + part;            // runtime concat -> new object
  System.out.println(s1 == s6);         // false
  System.out.println(s1 == s6.intern()); // true
  ```

  **Tuning and performance:** StringTable size is controlled via `-XX:StringTableSize=N` (default 65536 in Java 11+). A larger size reduces hash collisions. For monitoring: `-XX:+PrintStringTableStatistics` shows statistics at JVM shutdown.

  Excessive use of `intern()` can cause problems: slow lookups in a large table, increased GC time, and potential memory leaks if interned strings are never reused. Only intern strings that are guaranteed to repeat many times (e.g., field names from XML/JSON parsing).
section: "java"
order: 20
tags:
  - strings
  - jvm
  - memory
type: "deep"
---
