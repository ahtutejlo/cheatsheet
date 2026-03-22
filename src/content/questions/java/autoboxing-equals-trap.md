---
ua_question: "Чи можна використовувати == замість equals() для wrapper-типів?"
en_question: "Can you use == instead of equals() for wrapper types?"
ua_answer: |
  > **Trap:** Деякі розробники вважають, що `equals()` та `==` взаємозамінні для wrapper-типів (Integer, Long, Double тощо), бо "вони ж представляють прості значення". Насправді `==` порівнює посилання, і результат залежить від кешування.

  Для wrapper-типів `==` порівнює посилання на об'єкти, а не їхні значення. Результат `==` є непередбачуваним: для Integer у діапазоні [-128, 127] він поверне true (через кеш), а за межами -- false. Для Long діапазон кешу такий самий. Для Double та Float кешування взагалі не застосовується.

  ```java
  // Integer: cached range surprise
  Integer i1 = 100;
  Integer i2 = 100;
  System.out.println(i1 == i2);        // true (cached)
  System.out.println(i1.equals(i2));   // true

  Integer i3 = 200;
  Integer i4 = 200;
  System.out.println(i3 == i4);        // false (not cached!)
  System.out.println(i3.equals(i4));   // true

  // Long: same caching behavior
  Long l1 = 127L;
  Long l2 = 127L;
  System.out.println(l1 == l2);        // true (cached)

  Long l3 = 128L;
  Long l4 = 128L;
  System.out.println(l3 == l4);        // false

  // Double: NO caching at all
  Double d1 = 1.0;
  Double d2 = 1.0;
  System.out.println(d1 == d2);        // false (never cached)
  System.out.println(d1.equals(d2));   // true

  // Mixed types: equals returns false for different types!
  Integer intVal = 42;
  Long longVal = 42L;
  System.out.println(intVal.equals(longVal)); // false (different types)
  ```

  Правило просте: завжди використовуйте `equals()` для порівняння wrapper-типів. Додатково, `equals()` між різними wrapper-типами (Integer vs Long) завжди повертає false, навіть якщо числове значення однакове -- це ще одне джерело помилок.
en_answer: |
  > **Trap:** Some developers believe `equals()` and `==` are interchangeable for wrapper types (Integer, Long, Double, etc.) because "they represent simple values." In reality, `==` compares references, and the result depends on caching.

  For wrapper types, `==` compares object references, not their values. The result of `==` is unpredictable: for Integer in the range [-128, 127] it returns true (due to cache), but outside that range it returns false. For Long, the cache range is the same. For Double and Float, caching is not applied at all.

  ```java
  // Integer: cached range surprise
  Integer i1 = 100;
  Integer i2 = 100;
  System.out.println(i1 == i2);        // true (cached)
  System.out.println(i1.equals(i2));   // true

  Integer i3 = 200;
  Integer i4 = 200;
  System.out.println(i3 == i4);        // false (not cached!)
  System.out.println(i3.equals(i4));   // true

  // Long: same caching behavior
  Long l1 = 127L;
  Long l2 = 127L;
  System.out.println(l1 == l2);        // true (cached)

  Long l3 = 128L;
  Long l4 = 128L;
  System.out.println(l3 == l4);        // false

  // Double: NO caching at all
  Double d1 = 1.0;
  Double d2 = 1.0;
  System.out.println(d1 == d2);        // false (never cached)
  System.out.println(d1.equals(d2));   // true

  // Mixed types: equals returns false for different types!
  Integer intVal = 42;
  Long longVal = 42L;
  System.out.println(intVal.equals(longVal)); // false (different types)
  ```

  The rule is simple: always use `equals()` for comparing wrapper types. Additionally, `equals()` between different wrapper types (Integer vs Long) always returns false, even if the numeric value is the same -- this is another source of bugs.
section: "java"
order: 22
tags:
  - autoboxing
  - equals
  - pitfalls
type: "trick"
---
