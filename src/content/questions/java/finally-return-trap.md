---
ua_question: "Чи виконається блок finally, якщо в try є return?"
en_question: "Will the finally block execute if there is a return in try?"
ua_answer: |
  > **Trap:** Багато хто вважає, що `return` у блоці `try` пропускає `finally`. Насправді `finally` ЗАВЖДИ виконується, і `return` у `finally` перезаписує `return` з `try`.

  Блок `finally` гарантовано виконується незалежно від того, як завершився блок `try` -- через нормальне виконання, `return`, виняток чи `break`. Єдині винятки: `System.exit()` та аварійне завершення JVM. Якщо і `try`, і `finally` містять `return`, значення з `finally` "перемагає".

  ```java
  static int getValue() {
      try {
          return 1;   // this return is remembered...
      } finally {
          return 2;   // ...but overridden by finally's return
      }
  }
  System.out.println(getValue()); // 2 (not 1!)

  // Exception is also swallowed by finally's return
  static int riskyMethod() {
      try {
          throw new RuntimeException("error");
      } finally {
          return 42;  // exception is silently swallowed!
      }
  }
  System.out.println(riskyMethod()); // 42 (no exception thrown)

  // Correct pattern: don't return in finally
  static int correctApproach() {
      int result = 0;
      try {
          result = computeValue();
          return result;
      } catch (Exception e) {
          log.error("Failed", e);
          return -1;
      } finally {
          cleanup(); // cleanup without return
      }
  }
  ```

  Це одна з найбільш контрінтуїтивних поведінок Java. `return` у `finally` не лише перезаписує значення з `try`, але й "ковтає" будь-який виняток, який мав бути кинутий -- виняток просто зникає. Тому правило: ніколи не використовуйте `return` у `finally`. Більшість IDE та статичних аналізаторів (SonarQube, SpotBugs) позначають це як critical issue.
en_answer: |
  > **Trap:** Many believe that `return` in the `try` block skips `finally`. In reality, `finally` ALWAYS executes, and `return` in `finally` overrides `return` from `try`.

  The `finally` block is guaranteed to execute regardless of how the `try` block completed -- through normal execution, `return`, exception, or `break`. The only exceptions: `System.exit()` and JVM crash. If both `try` and `finally` contain `return`, the value from `finally` "wins."

  ```java
  static int getValue() {
      try {
          return 1;   // this return is remembered...
      } finally {
          return 2;   // ...but overridden by finally's return
      }
  }
  System.out.println(getValue()); // 2 (not 1!)

  // Exception is also swallowed by finally's return
  static int riskyMethod() {
      try {
          throw new RuntimeException("error");
      } finally {
          return 42;  // exception is silently swallowed!
      }
  }
  System.out.println(riskyMethod()); // 42 (no exception thrown)

  // Correct pattern: don't return in finally
  static int correctApproach() {
      int result = 0;
      try {
          result = computeValue();
          return result;
      } catch (Exception e) {
          log.error("Failed", e);
          return -1;
      } finally {
          cleanup(); // cleanup without return
      }
  }
  ```

  This is one of Java's most counterintuitive behaviors. `return` in `finally` not only overrides the value from `try`, but also "swallows" any exception that would have been thrown -- the exception simply disappears. Therefore the rule: never use `return` in `finally`. Most IDEs and static analyzers (SonarQube, SpotBugs) flag this as a critical issue.
section: "java"
order: 23
tags:
  - exceptions
  - control-flow
  - pitfalls
type: "trick"
---
