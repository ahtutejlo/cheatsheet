---
ua_question: "Як порівнювати рядки в Java?"
en_question: "How to compare strings in Java?"
ua_answer: |
  В Java рядки -- це об'єкти, тому оператор `==` порівнює посилання (адреси в пам'яті), а не вміст. Для порівняння вмісту рядків потрібно використовувати спеціальні методи класу `String`.

  **Основні способи порівняння:**

  ```java
  String a = "Hello";
  String b = new String("Hello");
  String c = "hello";

  // == порівнює посилання, НЕ вміст
  System.out.println(a == b);              // false (різні об'єкти)

  // equals() -- порівняння вмісту (case-sensitive)
  System.out.println(a.equals(b));         // true

  // equalsIgnoreCase() -- без урахування регістру
  System.out.println(a.equalsIgnoreCase(c)); // true

  // compareTo() -- лексикографічне порівняння (повертає int)
  System.out.println(a.compareTo(b));      // 0 (рівні)
  System.out.println(a.compareTo(c));      // -32 (різниця кодів символів)

  // compareToIgnoreCase() -- лексикографічне без урахування регістру
  System.out.println(a.compareToIgnoreCase(c)); // 0
  ```

  **Порівняння з урахуванням локалі:**

  Для коректного порівняння рядків у різних мовах (наприклад, німецька, турецька) використовуйте `Collator` або перетворення регістру з `Locale`:

  ```java
  import java.text.Collator;
  import java.util.Locale;

  // Locale-aware порівняння
  Collator collator = Collator.getInstance(new Locale("uk", "UA"));
  int result = collator.compare("ґанок", "дім");
  System.out.println(result); // від'ємне (ґ < д в українській абетці)

  // Турецька проблема: toLowerCase() без Locale може дати неочікуваний результат
  String turkish = "TITLE";
  System.out.println(turkish.toLowerCase(Locale.ENGLISH)); // "title"
  System.out.println(turkish.toLowerCase(new Locale("tr"))); // "tıtle" (Turkish İ → ı)
  ```

  **Порівняння через перетворення регістру:**

  ```java
  String s1 = "Hello World";
  String s2 = "HELLO WORLD";

  // Порівняння через toLowerCase/toUpperCase
  boolean match = s1.toLowerCase().equals(s2.toLowerCase()); // true

  // Безпечніший варіант з Locale
  boolean safeMatch = s1.toLowerCase(Locale.ROOT).equals(s2.toLowerCase(Locale.ROOT));
  ```

  **Правила:** завжди використовуйте `equals()` для порівняння вмісту рядків, `equalsIgnoreCase()` для порівняння без урахування регістру, та `Collator` для локалізованого сортування. Уникайте `==` для рядків -- він працює лише для літералів з String Pool.
en_answer: |
  In Java, strings are objects, so the `==` operator compares references (memory addresses), not content. To compare string content, you need to use special methods of the `String` class.

  **Main comparison approaches:**

  ```java
  String a = "Hello";
  String b = new String("Hello");
  String c = "hello";

  // == compares references, NOT content
  System.out.println(a == b);              // false (different objects)

  // equals() -- content comparison (case-sensitive)
  System.out.println(a.equals(b));         // true

  // equalsIgnoreCase() -- case-insensitive comparison
  System.out.println(a.equalsIgnoreCase(c)); // true

  // compareTo() -- lexicographic comparison (returns int)
  System.out.println(a.compareTo(b));      // 0 (equal)
  System.out.println(a.compareTo(c));      // -32 (character code difference)

  // compareToIgnoreCase() -- lexicographic case-insensitive
  System.out.println(a.compareToIgnoreCase(c)); // 0
  ```

  **Locale-aware comparison:**

  For correct string comparison across different languages (e.g., German, Turkish), use `Collator` or case conversion with `Locale`:

  ```java
  import java.text.Collator;
  import java.util.Locale;

  // Locale-aware comparison
  Collator collator = Collator.getInstance(new Locale("uk", "UA"));
  int result = collator.compare("ґанок", "дім");
  System.out.println(result); // negative (ґ < д in Ukrainian alphabet)

  // Turkish problem: toLowerCase() without Locale can give unexpected results
  String turkish = "TITLE";
  System.out.println(turkish.toLowerCase(Locale.ENGLISH)); // "title"
  System.out.println(turkish.toLowerCase(new Locale("tr"))); // "tıtle" (Turkish İ → ı)
  ```

  **Comparison via case conversion:**

  ```java
  String s1 = "Hello World";
  String s2 = "HELLO WORLD";

  // Comparison via toLowerCase/toUpperCase
  boolean match = s1.toLowerCase().equals(s2.toLowerCase()); // true

  // Safer variant with Locale
  boolean safeMatch = s1.toLowerCase(Locale.ROOT).equals(s2.toLowerCase(Locale.ROOT));
  ```

  **Rules:** always use `equals()` for string content comparison, `equalsIgnoreCase()` for case-insensitive comparison, and `Collator` for locale-aware sorting. Avoid `==` for strings -- it only works for literals from the String Pool.
section: "java"
order: 31
tags:
  - strings
  - comparison
type: "basic"
---
