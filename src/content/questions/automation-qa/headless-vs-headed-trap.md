---
ua_question: "Чи поводяться headless та headed браузери однаково при тестуванні?"
en_question: "Do headless and headed browsers behave identically during testing?"
ua_answer: |
  > **Trap:** Headless-режим -- це просто браузер без вікна, поведінка ідентична. Насправді є суттєві відмінності, які впливають на результати тестів.

  Headless-браузери відрізняються від headed у кількох критичних аспектах:
  - **Viewport за замовчуванням:** headless Chrome використовує 800x600, headed -- розмір екрана. Це змінює responsive layout і може ховати елементи
  - **Рендеринг шрифтів:** headless не використовує GPU-прискорення, що впливає на субпіксельний рендеринг та розміри тексту
  - **WebGL та Canvas:** headless має обмежену підтримку WebGL, що ламає тести графічних компонентів
  - **Завантаження ресурсів:** деякі браузери в headless-режимі не завантажують зображення або CSS-анімації

  ```java
  // TRAP: Test passes headed, fails headless due to viewport
  @Test
  void testMobileMenu() {
      // Headless: 800x600 (default) -- mobile menu visible
      // Headed: 1920x1080 -- desktop menu visible
      driver.findElement(By.id("mobile-menu-btn")).click(); // fails in headed!
  }

  // CORRECT: Always set explicit viewport
  ChromeOptions options = new ChromeOptions();
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1920,1080");
  // Now behavior matches headed mode at same resolution

  // CORRECT: Set viewport for responsive testing
  driver.manage().window().setSize(new Dimension(375, 812)); // iPhone X
  // Explicit size works consistently in both modes
  ```

  Ця помилка поширена, бо headless-режим позиціонується як "той самий браузер, але швидший". У 95% випадків це правда, але решта 5% створюють найскладніші для діагностики flaky-тести.
en_answer: |
  > **Trap:** Headless mode is just a browser without a window, behavior is identical. In reality, there are significant differences that affect test results.

  Headless browsers differ from headed in several critical aspects:
  - **Default viewport:** headless Chrome uses 800x600, headed uses screen size. This changes responsive layout and can hide elements
  - **Font rendering:** headless does not use GPU acceleration, affecting sub-pixel rendering and text dimensions
  - **WebGL and Canvas:** headless has limited WebGL support, breaking tests of graphical components
  - **Resource loading:** some browsers in headless mode do not load images or CSS animations

  ```java
  // TRAP: Test passes headed, fails headless due to viewport
  @Test
  void testMobileMenu() {
      // Headless: 800x600 (default) -- mobile menu visible
      // Headed: 1920x1080 -- desktop menu visible
      driver.findElement(By.id("mobile-menu-btn")).click(); // fails in headed!
  }

  // CORRECT: Always set explicit viewport
  ChromeOptions options = new ChromeOptions();
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1920,1080");
  // Now behavior matches headed mode at same resolution

  // CORRECT: Set viewport for responsive testing
  driver.manage().window().setSize(new Dimension(375, 812)); // iPhone X
  // Explicit size works consistently in both modes
  ```

  This mistake is common because headless mode is positioned as "the same browser, but faster." In 95% of cases that is true, but the remaining 5% create the hardest-to-diagnose flaky tests.
section: "automation-qa"
order: 23
tags:
  - browsers
  - headless
  - cross-browser
type: "trick"
---
