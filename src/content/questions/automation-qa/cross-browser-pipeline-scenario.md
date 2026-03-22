---
ua_question: "Як налаштувати паралельне крос-браузерне тестування у CI-пайплайні?"
en_question: "How do you set up parallel cross-browser testing in a CI pipeline?"
ua_answer: |
  **Scenario:** Продукт підтримує Chrome, Firefox та Safari. Тестовий набір із 200 E2E-тестів виконується 40 хвилин на одному браузері. Потрібно запускати тести на всіх трьох браузерах без збільшення загального часу пайплайну.

  **Approach:**
  1. Налаштувати Selenium Grid або хмарний провайдер (BrowserStack, Sauce Labs) для паралельного запуску на кількох браузерах одночасно
  2. Використати CI matrix strategy для створення паралельних jobs -- кожен job тестує один браузер із власною конфігурацією
  3. Створити browser-specific конфігурацію для відомих відмінностей (viewport, scrolling behavior) та централізовану звітність для агрегації результатів

  **Solution:**
  ```yaml
  # .github/workflows/e2e-tests.yml
  name: E2E Cross-Browser Tests
  on: [push, pull_request]

  jobs:
    e2e:
      strategy:
        matrix:
          browser: [chrome, firefox, safari]
        fail-fast: false  # don't cancel other browsers if one fails
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4

        - name: Start Selenium Grid
          run: |
            docker compose -f docker-compose.grid.yml up -d
            ./wait-for-grid.sh

        - name: Run E2E tests
          run: |
            mvn test \
              -Dbrowser=${{ matrix.browser }} \
              -Dgrid.url=http://localhost:4444/wd/hub \
              -Dparallel.threads=4
          env:
            BROWSER: ${{ matrix.browser }}

        - name: Upload results
          if: always()
          uses: actions/upload-artifact@v4
          with:
            name: test-results-${{ matrix.browser }}
            path: target/surefire-reports/
  ```

  ```java
  // Browser-aware capability factory
  public class BrowserFactory {

      public static WebDriver create(String browser) {
          return switch (browser) {
              case "chrome" -> {
                  ChromeOptions opts = new ChromeOptions();
                  opts.addArguments("--headless=new", "--window-size=1920,1080");
                  yield new RemoteWebDriver(gridUrl, opts);
              }
              case "firefox" -> {
                  FirefoxOptions opts = new FirefoxOptions();
                  opts.addArguments("--headless", "--width=1920", "--height=1080");
                  yield new RemoteWebDriver(gridUrl, opts);
              }
              case "safari" -> {
                  SafariOptions opts = new SafariOptions();
                  yield new RemoteWebDriver(gridUrl, opts);
              }
              default -> throw new IllegalArgumentException("Unknown: " + browser);
          };
      }
  }
  ```
en_answer: |
  **Scenario:** The product supports Chrome, Firefox, and Safari. A test suite of 200 E2E tests takes 40 minutes on a single browser. You need to run tests on all three browsers without increasing the overall pipeline time.

  **Approach:**
  1. Set up Selenium Grid or a cloud provider (BrowserStack, Sauce Labs) for parallel execution on multiple browsers simultaneously
  2. Use CI matrix strategy to create parallel jobs -- each job tests one browser with its own configuration
  3. Create browser-specific configuration for known differences (viewport, scrolling behavior) and centralized reporting for result aggregation

  **Solution:**
  ```yaml
  # .github/workflows/e2e-tests.yml
  name: E2E Cross-Browser Tests
  on: [push, pull_request]

  jobs:
    e2e:
      strategy:
        matrix:
          browser: [chrome, firefox, safari]
        fail-fast: false  # don't cancel other browsers if one fails
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4

        - name: Start Selenium Grid
          run: |
            docker compose -f docker-compose.grid.yml up -d
            ./wait-for-grid.sh

        - name: Run E2E tests
          run: |
            mvn test \
              -Dbrowser=${{ matrix.browser }} \
              -Dgrid.url=http://localhost:4444/wd/hub \
              -Dparallel.threads=4
          env:
            BROWSER: ${{ matrix.browser }}

        - name: Upload results
          if: always()
          uses: actions/upload-artifact@v4
          with:
            name: test-results-${{ matrix.browser }}
            path: target/surefire-reports/
  ```

  ```java
  // Browser-aware capability factory
  public class BrowserFactory {

      public static WebDriver create(String browser) {
          return switch (browser) {
              case "chrome" -> {
                  ChromeOptions opts = new ChromeOptions();
                  opts.addArguments("--headless=new", "--window-size=1920,1080");
                  yield new RemoteWebDriver(gridUrl, opts);
              }
              case "firefox" -> {
                  FirefoxOptions opts = new FirefoxOptions();
                  opts.addArguments("--headless", "--width=1920", "--height=1080");
                  yield new RemoteWebDriver(gridUrl, opts);
              }
              case "safari" -> {
                  SafariOptions opts = new SafariOptions();
                  yield new RemoteWebDriver(gridUrl, opts);
              }
              default -> throw new IllegalArgumentException("Unknown: " + browser);
          };
      }
  }
  ```
section: "automation-qa"
order: 28
tags:
  - cross-browser
  - ci-cd
  - selenium-grid
type: "practical"
---
