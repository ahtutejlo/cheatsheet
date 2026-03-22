---
ua_question: "Що таке проблема coordinated omission у навантажувальному тестуванні?"
en_question: "What is the coordinated omission problem in load testing?"
ua_answer: |
  **Coordinated omission** -- це систематична помилка у вимірюванні латентності, описана Gil Tene (Azul Systems). Суть проблеми: коли сервер сповільнюється, більшість інструментів автоматично зменшують швидкість надсилання запитів, бо чекають відповіді перед відправкою наступного. Це "координація" між клієнтом і повільним сервером, яка приховує реальний масштаб проблеми.

  Приклад: якщо сервер зависає на 10 секунд, інструмент, який чекає відповіді, просто не відправить запити протягом цих 10 секунд. У підсумку він виміряє одну повільну відповідь (10с), але пропустить сотні запитів, які мали б прийти за цей час. Реальні p99 будуть значно гіршими, ніж показує тест.

  Це як вимірювати час обслуговування у банку: якщо ви входите тільки коли побачили, що каса вільна, ви ніколи не виміряєте час очікування у черзі. Правильний підхід -- приходити за розкладом незалежно від стану каси.

  ```python
  from locust import HttpUser, task, constant_pacing, events
  import time

  class CorrectedUser(HttpUser):
      # constant_pacing partially mitigates coordinated omission
      # by maintaining fixed iteration rate regardless of response time
      wait_time = constant_pacing(1)  # one iteration per second

      @task
      def timed_request(self):
          start = time.time()
          self.client.get("/api/products")
          elapsed = time.time() - start

          # Log if we're falling behind schedule
          if elapsed > 1.0:
              print(f"WARNING: request took {elapsed:.2f}s, "
                    f"we're falling behind intended pace")

  # Better approach: use k6 which has built-in CO correction
  # k6 measures "iteration_duration" including wait time
  ```

  ```javascript
  // k6 handles coordinated omission better with arrival-rate executors
  import http from 'k6/http';

  export const options = {
    scenarios: {
      constant_arrival: {
        executor: 'constant-arrival-rate',
        rate: 100,           // 100 iterations per timeUnit
        timeUnit: '1s',      // per second
        duration: '5m',
        preAllocatedVUs: 200, // pre-allocate VUs
        maxVUs: 500,          // allow scaling up if needed
      },
    },
  };

  export default function () {
    http.get('http://localhost:8080/api/products');
  }
  ```

  Для захисту від coordinated omission: 1) використовуйте **open-loop** (arrival-rate) модель замість **closed-loop** (одночасні користувачі), 2) у Locust використовуйте `constant_pacing`, 3) у k6 використовуйте `constant-arrival-rate` executor, 4) завжди аналізуйте p99.9 та max response time, не тільки p95.
en_answer: |
  **Coordinated omission** is a systematic latency measurement error described by Gil Tene (Azul Systems). The core issue: when the server slows down, most tools automatically reduce their request sending rate because they wait for a response before sending the next request. This "coordination" between the client and the slow server hides the real scale of the problem.

  Example: if the server hangs for 10 seconds, a tool that waits for a response simply will not send requests during those 10 seconds. As a result, it measures one slow response (10s) but misses hundreds of requests that should have arrived during that time. Real p99 values will be significantly worse than what the test shows.

  This is like measuring service time at a bank: if you only enter when you see the counter is free, you never measure the queue waiting time. The correct approach is to arrive on schedule regardless of the counter's state.

  ```python
  from locust import HttpUser, task, constant_pacing, events
  import time

  class CorrectedUser(HttpUser):
      # constant_pacing partially mitigates coordinated omission
      # by maintaining fixed iteration rate regardless of response time
      wait_time = constant_pacing(1)  # one iteration per second

      @task
      def timed_request(self):
          start = time.time()
          self.client.get("/api/products")
          elapsed = time.time() - start

          # Log if we're falling behind schedule
          if elapsed > 1.0:
              print(f"WARNING: request took {elapsed:.2f}s, "
                    f"we're falling behind intended pace")

  # Better approach: use k6 which has built-in CO correction
  # k6 measures "iteration_duration" including wait time
  ```

  ```javascript
  // k6 handles coordinated omission better with arrival-rate executors
  import http from 'k6/http';

  export const options = {
    scenarios: {
      constant_arrival: {
        executor: 'constant-arrival-rate',
        rate: 100,           // 100 iterations per timeUnit
        timeUnit: '1s',      // per second
        duration: '5m',
        preAllocatedVUs: 200, // pre-allocate VUs
        maxVUs: 500,          // allow scaling up if needed
      },
    },
  };

  export default function () {
    http.get('http://localhost:8080/api/products');
  }
  ```

  To protect against coordinated omission: 1) use an **open-loop** (arrival-rate) model instead of **closed-loop** (concurrent users), 2) in Locust use `constant_pacing`, 3) in k6 use the `constant-arrival-rate` executor, 4) always analyze p99.9 and max response time, not just p95.
section: "performance-testing"
order: 15
tags:
  - metrics
  - internals
type: "deep"
---
