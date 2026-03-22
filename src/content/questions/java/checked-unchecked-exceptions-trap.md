---
ua_question: "Чи є RuntimeException checked-винятком, оскільки він наслідує Exception?"
en_question: "Is RuntimeException a checked exception since it extends Exception?"
ua_answer: |
  > **Trap:** Оскільки RuntimeException extends Exception, логічно припустити, що він є checked. Насправді RuntimeException та всі його підкласи -- це unchecked-винятки, і компілятор не вимагає їх обробки.

  В Java ієрархія винятків розділена на дві категорії: checked (перевірені) та unchecked (неперевірені). Checked-винятки -- це підкласи Exception, які НЕ є підкласами RuntimeException. Unchecked -- це RuntimeException, його підкласи та Error. Компілятор вимагає обробки (try/catch або throws) лише для checked-винятків.

  ```java
  // Throwable hierarchy
  // Throwable
  // ├── Error (unchecked)            -- JVM errors, don't catch
  // │   ├── OutOfMemoryError
  // │   └── StackOverflowError
  // └── Exception
  //     ├── RuntimeException (unchecked) -- programming errors
  //     │   ├── NullPointerException
  //     │   ├── IllegalArgumentException
  //     │   ├── IndexOutOfBoundsException
  //     │   └── ClassCastException
  //     ├── IOException (checked)     -- must handle
  //     ├── SQLException (checked)    -- must handle
  //     └── InterruptedException (checked)

  // Checked: compiler forces handling
  void readFile() throws IOException {    // must declare or catch
      FileReader fr = new FileReader("file.txt");
  }

  // Unchecked: no compiler requirement
  void parseNumber(String s) {
      int n = Integer.parseInt(s);  // may throw NumberFormatException
      // no throws declaration needed, no try/catch required
  }

  // Common mistake: catching too broadly
  try {
      riskyOperation();
  } catch (Exception e) {       // catches BOTH checked and unchecked!
      // NullPointerException silently swallowed here
      log.error("Error", e);
  }
  ```

  Розповсюджена помилка на співбесідах -- малювати ієрархію, де всі підкласи Exception є checked. Запам'ятовуйте: лінія розділу проходить саме через RuntimeException. Практична порада: використовуйте checked-винятки для відновлюваних помилок (файл не знайдено, мережа недоступна), а unchecked -- для помилок програмування (null-посилання, невірний аргумент).
en_answer: |
  > **Trap:** Since RuntimeException extends Exception, it seems logical that it is checked. In reality, RuntimeException and all its subclasses are unchecked exceptions, and the compiler does not require handling them.

  In Java, the exception hierarchy is divided into two categories: checked and unchecked. Checked exceptions are subclasses of Exception that are NOT subclasses of RuntimeException. Unchecked are RuntimeException, its subclasses, and Error. The compiler requires handling (try/catch or throws) only for checked exceptions.

  ```java
  // Throwable hierarchy
  // Throwable
  // ├── Error (unchecked)            -- JVM errors, don't catch
  // │   ├── OutOfMemoryError
  // │   └── StackOverflowError
  // └── Exception
  //     ├── RuntimeException (unchecked) -- programming errors
  //     │   ├── NullPointerException
  //     │   ├── IllegalArgumentException
  //     │   ├── IndexOutOfBoundsException
  //     │   └── ClassCastException
  //     ├── IOException (checked)     -- must handle
  //     ├── SQLException (checked)    -- must handle
  //     └── InterruptedException (checked)

  // Checked: compiler forces handling
  void readFile() throws IOException {    // must declare or catch
      FileReader fr = new FileReader("file.txt");
  }

  // Unchecked: no compiler requirement
  void parseNumber(String s) {
      int n = Integer.parseInt(s);  // may throw NumberFormatException
      // no throws declaration needed, no try/catch required
  }

  // Common mistake: catching too broadly
  try {
      riskyOperation();
  } catch (Exception e) {       // catches BOTH checked and unchecked!
      // NullPointerException silently swallowed here
      log.error("Error", e);
  }
  ```

  A common interview mistake is drawing a hierarchy where all Exception subclasses are checked. Remember: the dividing line runs specifically through RuntimeException. Practical advice: use checked exceptions for recoverable errors (file not found, network unavailable), and unchecked for programming errors (null reference, invalid argument).
section: "java"
order: 24
tags:
  - exceptions
  - error-handling
  - pitfalls
type: "trick"
---
