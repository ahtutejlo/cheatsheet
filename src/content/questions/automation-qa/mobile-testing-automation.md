---
ua_question: "Як автоматизувати тестування мобільних додатків?"
en_question: "How to automate mobile app testing?"
ua_answer: |
  Автоматизація мобільного тестування використовує спеціалізовані інструменти для взаємодії з нативними, гібридними та мобільними веб-додатками.

  **Основні інструменти:**
  - **Appium** -- кросплатформний інструмент (Android + iOS), використовує WebDriver протокол
  - **Espresso** -- нативний фреймворк для Android від Google
  - **XCUITest** -- нативний фреймворк для iOS від Apple
  - **Detox** -- E2E тестування React Native додатків

  **Appium -- переваги:**
  - Один код для Android та iOS
  - Підтримує Java, Python, JavaScript, C#
  - Не потребує модифікації додатку
  - Підтримує нативні, гібридні та мобільні веб-додатки

  ```java
  // Appium приклад
  DesiredCapabilities caps = new DesiredCapabilities();
  caps.setCapability("platformName", "Android");
  caps.setCapability("deviceName", "Pixel_6");
  caps.setCapability("app", "/path/to/app.apk");

  AndroidDriver driver = new AndroidDriver(
      new URL("http://localhost:4723"), caps
  );

  driver.findElement(By.id("com.app:id/login_btn")).click();
  ```

  **Виклики мобільної автоматизації:**
  - Різноманітність пристроїв та версій ОС
  - Жести (свайпи, пінчі, тривале натискання)
  - Сповіщення та системні діалоги
  - Мережеві умови (офлайн, повільна мережа)

  Для покриття різних пристроїв використовуються хмарні ферми: **BrowserStack**, **Sauce Labs**, **AWS Device Farm**.
en_answer: |
  Mobile test automation uses specialized tools to interact with native, hybrid, and mobile web applications.

  **Main tools:**
  - **Appium** -- cross-platform tool (Android + iOS), uses WebDriver protocol
  - **Espresso** -- native Android framework from Google
  - **XCUITest** -- native iOS framework from Apple
  - **Detox** -- E2E testing for React Native apps

  **Appium -- advantages:**
  - One codebase for Android and iOS
  - Supports Java, Python, JavaScript, C#
  - No app modification required
  - Supports native, hybrid, and mobile web apps

  ```java
  // Appium example
  DesiredCapabilities caps = new DesiredCapabilities();
  caps.setCapability("platformName", "Android");
  caps.setCapability("deviceName", "Pixel_6");
  caps.setCapability("app", "/path/to/app.apk");

  AndroidDriver driver = new AndroidDriver(
      new URL("http://localhost:4723"), caps
  );

  driver.findElement(By.id("com.app:id/login_btn")).click();
  ```

  **Mobile automation challenges:**
  - Device and OS version diversity
  - Gestures (swipes, pinches, long press)
  - Notifications and system dialogs
  - Network conditions (offline, slow network)

  Cloud device farms are used for device coverage: **BrowserStack**, **Sauce Labs**, **AWS Device Farm**.
section: "automation-qa"
order: 10
tags:
  - mobile-testing
  - appium
---
