---
ua_question: "Які стратегії локаторів ви знаєте?"
en_question: "What locator strategies do you know?"
ua_answer: |
  Локатори -- це механізми пошуку елементів на веб-сторінці. Вибір правильного локатора впливає на стабільність та надійність тестів.

  **Основні стратегії локаторів у Selenium:**

  | Локатор | Приклад | Надійність |
  |---------|---------|------------|
  | **ID** | `By.id("login-btn")` | Висока |
  | **Name** | `By.name("username")` | Висока |
  | **CSS Selector** | `By.cssSelector(".btn.primary")` | Висока |
  | **XPath** | `By.xpath("//div[@class='header']")` | Середня |
  | **Class Name** | `By.className("submit-btn")` | Середня |
  | **Link Text** | `By.linkText("Click here")` | Низька |
  | **Tag Name** | `By.tagName("input")` | Низька |

  **Рекомендації:**
  - Пріоритет: **ID > data-testid > CSS Selector > XPath**
  - Уникайте абсолютних XPath -- вони крихкі
  - Використовуйте **data-testid** атрибути для стабільних локаторів
  - CSS селектори зазвичай швидші за XPath

  ```java
  // Добре -- стабільний локатор
  driver.findElement(By.cssSelector("[data-testid='submit-btn']"));

  // Погано -- крихкий абсолютний XPath
  driver.findElement(By.xpath("/html/body/div[2]/form/button[1]"));
  ```
en_answer: |
  Locators are mechanisms for finding elements on a web page. Choosing the right locator affects test stability and reliability.

  **Main locator strategies in Selenium:**

  | Locator | Example | Reliability |
  |---------|---------|-------------|
  | **ID** | `By.id("login-btn")` | High |
  | **Name** | `By.name("username")` | High |
  | **CSS Selector** | `By.cssSelector(".btn.primary")` | High |
  | **XPath** | `By.xpath("//div[@class='header']")` | Medium |
  | **Class Name** | `By.className("submit-btn")` | Medium |
  | **Link Text** | `By.linkText("Click here")` | Low |
  | **Tag Name** | `By.tagName("input")` | Low |

  **Recommendations:**
  - Priority: **ID > data-testid > CSS Selector > XPath**
  - Avoid absolute XPath -- they are brittle
  - Use **data-testid** attributes for stable locators
  - CSS selectors are usually faster than XPath

  ```java
  // Good -- stable locator
  driver.findElement(By.cssSelector("[data-testid='submit-btn']"));

  // Bad -- brittle absolute XPath
  driver.findElement(By.xpath("/html/body/div[2]/form/button[1]"));
  ```
section: "automation-qa"
order: 5
tags:
  - selenium
  - locators
---
