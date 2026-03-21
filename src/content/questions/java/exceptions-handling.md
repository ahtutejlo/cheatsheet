---
ua_question: "Як працює обробка виключень в Java?"
en_question: "How does exception handling work in Java?"
ua_answer: |
  Обробка виключень в Java базується на механізмі `try-catch-finally`, який дозволяє перехоплювати та обробляти помилки під час виконання програми.

  **Ієрархія виключень:**
  - `Throwable` -- базовий клас
    - `Error` -- серйозні помилки JVM (OutOfMemoryError) -- не обробляємо
    - `Exception` -- виключення, які можна обробити
      - `RuntimeException` (unchecked) -- NullPointerException, ArrayIndexOutOfBoundsException
      - Checked exceptions -- IOException, SQLException (потрібен try-catch або throws)

  ```java
  try {
      int result = 10 / 0;
  } catch (ArithmeticException e) {
      System.out.println("Division by zero: " + e.getMessage());
  } catch (Exception e) {
      System.out.println("General error: " + e.getMessage());
  } finally {
      System.out.println("This always executes");
  }
  ```

  **Try-with-resources (Java 7+):** автоматично закриває ресурси, що імплементують `AutoCloseable`:

  ```java
  try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
      String line = reader.readLine();
  } catch (IOException e) {
      e.printStackTrace();
  }
  // reader автоматично закритий
  ```

  **Кастомні виключення:**
  ```java
  public class UserNotFoundException extends RuntimeException {
      public UserNotFoundException(String message) {
          super(message);
      }
  }
  ```
en_answer: |
  Exception handling in Java is based on the `try-catch-finally` mechanism, which allows catching and handling errors during program execution.

  **Exception hierarchy:**
  - `Throwable` -- base class
    - `Error` -- serious JVM errors (OutOfMemoryError) -- not handled
    - `Exception` -- exceptions that can be handled
      - `RuntimeException` (unchecked) -- NullPointerException, ArrayIndexOutOfBoundsException
      - Checked exceptions -- IOException, SQLException (require try-catch or throws)

  ```java
  try {
      int result = 10 / 0;
  } catch (ArithmeticException e) {
      System.out.println("Division by zero: " + e.getMessage());
  } catch (Exception e) {
      System.out.println("General error: " + e.getMessage());
  } finally {
      System.out.println("This always executes");
  }
  ```

  **Try-with-resources (Java 7+):** automatically closes resources implementing `AutoCloseable`:

  ```java
  try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
      String line = reader.readLine();
  } catch (IOException e) {
      e.printStackTrace();
  }
  // reader is automatically closed
  ```

  **Custom exceptions:**
  ```java
  public class UserNotFoundException extends RuntimeException {
      public UserNotFoundException(String message) {
          super(message);
      }
  }
  ```
section: "java"
order: 5
tags:
  - exceptions
  - error-handling
---
