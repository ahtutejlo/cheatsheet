---
ua_question: "Чим відрізняється тестування продуктивності фронтенду від бекенду?"
en_question: "What is the difference between frontend and backend performance testing?"
ua_answer: |
  **Backend performance testing** (навантажувальне тестування) -- це перевірка серверної частини під великою кількістю одночасних запитів. Метрики: RPS, response time, error rate, CPU/memory використання сервера. Інструменти: Locust, k6, JMeter, Gatling.

  **Frontend performance testing** -- це оцінка швидкості завантаження та відображення сторінки у браузері одного користувача. Метрики: **Core Web Vitals** -- LCP (Largest Contentful Paint), FID/INP (First Input Delay / Interaction to Next Paint), CLS (Cumulative Layout Shift). Інструменти: Lighthouse, WebPageTest, Chrome DevTools.

  Ключова різниця: backend тестування перевіряє "чи витримає сервер 10,000 користувачів?", frontend -- "чи побачить один користувач сторінку швидше 2.5 секунд?". Обидва типи потрібні для повної картини продуктивності.

  ```python
  # Backend: Locust load test
  from locust import HttpUser, task, between

  class BackendLoadTest(HttpUser):
      wait_time = between(1, 3)

      @task
      def api_call(self):
          self.client.get("/api/products")
  ```

  ```javascript
  // Frontend: Lighthouse CI configuration
  // lighthouserc.js
  module.exports = {
    ci: {
      collect: {
        url: ['http://localhost:3000/', 'http://localhost:3000/products'],
        numberOfRuns: 3,
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
          'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
          'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        },
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };
  ```

  Повна стратегія включає обидва типи: Lighthouse у CI/CD для кожного PR (frontend) та регулярні навантажувальні тести на staging перед релізом (backend). Повільний API може маскуватися швидким фронтендом з кешуванням, і навпаки.
en_answer: |
  **Backend performance testing** (load testing) verifies the server side under a high number of concurrent requests. Metrics: RPS, response time, error rate, server CPU/memory usage. Tools: Locust, k6, JMeter, Gatling.

  **Frontend performance testing** evaluates page load and rendering speed in a single user's browser. Metrics: **Core Web Vitals** -- LCP (Largest Contentful Paint), FID/INP (First Input Delay / Interaction to Next Paint), CLS (Cumulative Layout Shift). Tools: Lighthouse, WebPageTest, Chrome DevTools.

  The key difference: backend testing checks "can the server handle 10,000 users?", frontend checks "will a single user see the page in under 2.5 seconds?". Both types are needed for a complete performance picture.

  ```python
  # Backend: Locust load test
  from locust import HttpUser, task, between

  class BackendLoadTest(HttpUser):
      wait_time = between(1, 3)

      @task
      def api_call(self):
          self.client.get("/api/products")
  ```

  ```javascript
  // Frontend: Lighthouse CI configuration
  // lighthouserc.js
  module.exports = {
    ci: {
      collect: {
        url: ['http://localhost:3000/', 'http://localhost:3000/products'],
        numberOfRuns: 3,
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
          'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
          'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        },
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };
  ```

  A complete strategy includes both types: Lighthouse in CI/CD for every PR (frontend) and regular load tests on staging before release (backend). A slow API can be masked by a fast frontend with caching, and vice versa.
section: "performance-testing"
order: 12
tags:
  - fundamentals
  - metrics
type: "basic"
---
