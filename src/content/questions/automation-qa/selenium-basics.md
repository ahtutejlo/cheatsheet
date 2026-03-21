---
ua_question: "Що таке Selenium і як він працює?"
en_question: "What is Selenium and how does it work?"
ua_answer: |
  Selenium -- це набір інструментів з відкритим кодом для автоматизації веб-браузерів. Він дозволяє програмно взаємодіяти з веб-сторінками так само, як це робить користувач.

  **Компоненти Selenium:**
  - **Selenium WebDriver** -- основний інструмент для автоматизації браузерів через API
  - **Selenium Grid** -- дозволяє запускати тести паралельно на різних машинах та браузерах
  - **Selenium IDE** -- розширення для браузера для запису та відтворення тестів

  **Як працює WebDriver:**
  1. Тестовий скрипт відправляє команди через WebDriver API
  2. WebDriver передає команди відповідному драйверу браузера (ChromeDriver, GeckoDriver)
  3. Драйвер взаємодіє з браузером через нативні команди
  4. Браузер виконує дії та повертає результати

  ```java
  WebDriver driver = new ChromeDriver();
  driver.get("https://example.com");

  WebElement searchBox = driver.findElement(By.name("q"));
  searchBox.sendKeys("Selenium");
  searchBox.submit();

  String title = driver.getTitle();
  assertTrue(title.contains("Selenium"));

  driver.quit();
  ```

  Selenium підтримує Java, Python, C#, JavaScript, Ruby та Kotlin.
en_answer: |
  Selenium is an open-source set of tools for automating web browsers. It allows programmatic interaction with web pages just as a user would.

  **Selenium components:**
  - **Selenium WebDriver** -- the main tool for browser automation through an API
  - **Selenium Grid** -- allows running tests in parallel on different machines and browsers
  - **Selenium IDE** -- a browser extension for recording and replaying tests

  **How WebDriver works:**
  1. Test script sends commands via WebDriver API
  2. WebDriver passes commands to the appropriate browser driver (ChromeDriver, GeckoDriver)
  3. Driver interacts with the browser through native commands
  4. Browser executes actions and returns results

  ```java
  WebDriver driver = new ChromeDriver();
  driver.get("https://example.com");

  WebElement searchBox = driver.findElement(By.name("q"));
  searchBox.sendKeys("Selenium");
  searchBox.submit();

  String title = driver.getTitle();
  assertTrue(title.contains("Selenium"));

  driver.quit();
  ```

  Selenium supports Java, Python, C#, JavaScript, Ruby, and Kotlin.
section: "automation-qa"
order: 4
tags:
  - selenium
  - webdriver
---
