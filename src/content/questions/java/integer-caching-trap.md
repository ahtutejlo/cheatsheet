---
ua_question: "Чи завжди == коректно порівнює Integer об'єкти?"
en_question: "Does == always correctly compare Integer objects?"
ua_answer: |
  > **Trap:** Розробники часто вважають, що `==` завжди працює для порівняння Integer, бо "Java кешує числа". Насправді кешування працює лише для діапазону -128..127.

  Java автоматично кешує Integer об'єкти в діапазоні від -128 до 127 (специфікація JLS 5.1.7). При autoboxing значень у цьому діапазоні повертається той самий об'єкт з кешу. Для значень за межами діапазону кожен autoboxing створює новий об'єкт, і `==` порівнює посилання, а не значення.

  ```java
  Integer a = 127;
  Integer b = 127;
  System.out.println(a == b);      // true  (cached, same reference)

  Integer c = 128;
  Integer d = 128;
  System.out.println(c == d);      // false (new objects, different references)

  Integer e = -128;
  Integer f = -128;
  System.out.println(e == f);      // true  (cached)

  Integer g = -129;
  Integer h = -129;
  System.out.println(g == h);      // false (out of cache range)

  // Always use equals() for Integer comparison
  System.out.println(c.equals(d)); // true  (compares values)

  // new Integer() NEVER uses cache (deprecated since Java 9)
  Integer x = new Integer(127);
  Integer y = new Integer(127);
  System.out.println(x == y);      // false (always new objects)
  ```

  Ця помилка особливо підступна, бо код працює коректно у тестах з малими числами і ламається у продакшені з великими ID або сумами. Верхню межу кешу можна збільшити через `-XX:AutoBoxCacheMax=N`, але покладатися на це не варто -- завжди використовуйте `equals()` для порівняння wrapper-типів.
en_answer: |
  > **Trap:** Developers often assume `==` always works for Integer comparison because "Java caches numbers." In reality, caching only works for the range -128..127.

  Java automatically caches Integer objects in the range from -128 to 127 (JLS specification 5.1.7). When autoboxing values in this range, the same object from the cache is returned. For values outside this range, each autoboxing creates a new object, and `==` compares references, not values.

  ```java
  Integer a = 127;
  Integer b = 127;
  System.out.println(a == b);      // true  (cached, same reference)

  Integer c = 128;
  Integer d = 128;
  System.out.println(c == d);      // false (new objects, different references)

  Integer e = -128;
  Integer f = -128;
  System.out.println(e == f);      // true  (cached)

  Integer g = -129;
  Integer h = -129;
  System.out.println(g == h);      // false (out of cache range)

  // Always use equals() for Integer comparison
  System.out.println(c.equals(d)); // true  (compares values)

  // new Integer() NEVER uses cache (deprecated since Java 9)
  Integer x = new Integer(127);
  Integer y = new Integer(127);
  System.out.println(x == y);      // false (always new objects)
  ```

  This bug is particularly insidious because the code works correctly in tests with small numbers and breaks in production with large IDs or amounts. The upper cache limit can be increased via `-XX:AutoBoxCacheMax=N`, but relying on this is not advisable -- always use `equals()` for comparing wrapper types.
section: "java"
order: 21
tags:
  - autoboxing
  - pitfalls
  - comparisons
type: "trick"
---
