---
ua_question: "Чи можна комбінувати implicit та explicit waits для надійнішого очікування?"
en_question: "Can you combine implicit and explicit waits for more reliable waiting?"
ua_answer: |
  > **Trap:** Здається логічним використовувати implicit wait як "страховку" разом з explicit wait для більшої надійності. Насправді їх комбінування створює непередбачувану поведінку.

  Коли implicit і explicit waits активні одночасно, вони не складаються арифметично. Implicit wait впливає на кожен виклик `findElement()` всередині explicit wait, що може призвести до очікування значно довшого за очікуване, або, навпаки, до передчасного таймауту.

  Наприклад, якщо implicit wait = 10 секунд, а explicit wait перевіряє `invisibilityOfElement` з таймаутом 5 секунд, implicit wait буде чекати 10 секунд на кожній ітерації polling, роблячи explicit wait фактично марним.

  ```java
  // TRAP: Mixing waits -- unpredictable behavior
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

  // This explicit wait may take up to 10s per poll cycle
  // instead of failing fast when element is not found
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
  wait.until(ExpectedConditions.invisibilityOfElementLocated(
      By.id("loading-spinner")
  ));
  // Total wait time is UNPREDICTABLE, not 5 seconds!

  // CORRECT: Use only explicit waits
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(0));

  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
  wait.until(ExpectedConditions.invisibilityOfElementLocated(
      By.id("loading-spinner")
  ));
  // Predictable: polls every 500ms, times out after exactly 15s
  ```

  Ця помилка дуже поширена, бо документація Selenium не акцентує увагу на конфлікті між типами очікувань, а інтуїтивно здається, що "більше очікувань = краще".
en_answer: |
  > **Trap:** It seems logical to use implicit wait as a "safety net" alongside explicit wait for more reliability. In reality, combining them creates unpredictable behavior.

  When implicit and explicit waits are both active, they do not add up arithmetically. Implicit wait affects every `findElement()` call inside the explicit wait, which can lead to waiting much longer than expected, or conversely, to premature timeouts.

  For example, if implicit wait = 10 seconds and explicit wait checks `invisibilityOfElement` with a 5-second timeout, implicit wait will wait 10 seconds on each polling iteration, making the explicit wait effectively useless.

  ```java
  // TRAP: Mixing waits -- unpredictable behavior
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

  // This explicit wait may take up to 10s per poll cycle
  // instead of failing fast when element is not found
  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
  wait.until(ExpectedConditions.invisibilityOfElementLocated(
      By.id("loading-spinner")
  ));
  // Total wait time is UNPREDICTABLE, not 5 seconds!

  // CORRECT: Use only explicit waits
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(0));

  WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
  wait.until(ExpectedConditions.invisibilityOfElementLocated(
      By.id("loading-spinner")
  ));
  // Predictable: polls every 500ms, times out after exactly 15s
  ```

  This mistake is very common because Selenium documentation does not emphasize the conflict between wait types, and intuitively it seems like "more waits = better."
section: "automation-qa"
order: 21
tags:
  - waits
  - selenium
  - pitfalls
type: "trick"
---
