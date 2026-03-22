---
ua_question: "Як event loop та асинхронність впливають на генерацію навантаження у Locust та k6?"
en_question: "How do event loops and asynchronous execution affect load generation in Locust and k6?"
ua_answer: |
  Різні інструменти навантажувального тестування використовують різні моделі конкурентності, що безпосередньо впливає на кількість віртуальних користувачів, які може підтримувати один процес.

  **Locust** використовує **gevent** -- бібліотеку кооперативної багатозадачності на основі greenlets. Greenlets -- це легковагі "зелені потоки", які перемикаються при IO-операціях (мережеві запити, sleep). Один процес Locust може підтримувати тисячі greenlets, але CPU-bound операції блокують весь event loop, бо Python GIL дозволяє лише один потік.

  **k6** побудований на **Go goroutines** -- легковагих потоках, які Go runtime автоматично розподіляє між OS-потоками. Це дає k6 перевагу: він може використовувати всі CPU ядра без додаткової конфігурації, тоді як Locust потребує master/worker для використання кількох ядер.

  Розуміння моделі конкурентності критичне для інтерпретації результатів: якщо ваш Locust-сценарій містить CPU-bound логіку (парсинг великого JSON, криптографія), це може стати bottleneck на стороні клієнта.

  ```python
  # Locust: gevent-based cooperative multitasking
  from locust import HttpUser, task, between
  import gevent

  class GeventUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def parallel_requests(self):
          """Use gevent.pool for parallel requests within one user."""
          from gevent.pool import Group
          group = Group()

          def fetch_product(product_id):
              self.client.get(
                  f"/api/products/{product_id}",
                  name="/api/products/[id]"
              )

          # Fire 5 requests concurrently within one greenlet
          for pid in range(1, 6):
              group.spawn(fetch_product, pid)
          group.join()

      @task
      def cpu_bound_danger(self):
          """WARNING: CPU-bound work blocks the gevent event loop!"""
          resp = self.client.get("/api/data")
          # This blocks ALL greenlets in this worker:
          # data = heavy_json_parsing(resp.text)
          #
          # Better: keep processing light or offload to thread
          data = resp.json()  # built-in json is fast enough
  ```

  ```javascript
  // k6: Go goroutines - true parallelism across CPU cores
  import http from 'k6/http';
  import { sleep } from 'k6';

  export const options = {
    scenarios: {
      parallel: {
        executor: 'per-vu-iterations',
        vus: 100,
        iterations: 1000,
        maxDuration: '5m',
      },
    },
  };

  export default function () {
    // k6 automatically schedules goroutines across OS threads
    // No GIL limitation - true multi-core utilization
    const responses = http.batch([
      ['GET', 'http://localhost:8080/api/products/1'],
      ['GET', 'http://localhost:8080/api/products/2'],
      ['GET', 'http://localhost:8080/api/products/3'],
    ]);
    sleep(1);
  }
  ```

  Практичне правило: один worker Locust може ефективно підтримувати 500-5000 користувачів залежно від складності сценарію. Один процес k6 -- до 30,000+ VUs завдяки Go runtime. Для дуже великих тестів обидва інструменти потребують розподіленого запуску, але k6 потребує менше інстансів.
en_answer: |
  Different load testing tools use different concurrency models, which directly affects how many virtual users a single process can support.

  **Locust** uses **gevent** -- a cooperative multitasking library based on greenlets. Greenlets are lightweight "green threads" that switch on IO operations (network requests, sleep). A single Locust process can support thousands of greenlets, but CPU-bound operations block the entire event loop since Python's GIL allows only one thread.

  **k6** is built on **Go goroutines** -- lightweight threads that the Go runtime automatically distributes across OS threads. This gives k6 an advantage: it can utilize all CPU cores without additional configuration, whereas Locust requires master/worker for multi-core usage.

  Understanding the concurrency model is critical for interpreting results: if your Locust scenario contains CPU-bound logic (parsing large JSON, cryptography), it can become a client-side bottleneck.

  ```python
  # Locust: gevent-based cooperative multitasking
  from locust import HttpUser, task, between
  import gevent

  class GeventUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def parallel_requests(self):
          """Use gevent.pool for parallel requests within one user."""
          from gevent.pool import Group
          group = Group()

          def fetch_product(product_id):
              self.client.get(
                  f"/api/products/{product_id}",
                  name="/api/products/[id]"
              )

          # Fire 5 requests concurrently within one greenlet
          for pid in range(1, 6):
              group.spawn(fetch_product, pid)
          group.join()

      @task
      def cpu_bound_danger(self):
          """WARNING: CPU-bound work blocks the gevent event loop!"""
          resp = self.client.get("/api/data")
          # This blocks ALL greenlets in this worker:
          # data = heavy_json_parsing(resp.text)
          #
          # Better: keep processing light or offload to thread
          data = resp.json()  # built-in json is fast enough
  ```

  ```javascript
  // k6: Go goroutines - true parallelism across CPU cores
  import http from 'k6/http';
  import { sleep } from 'k6';

  export const options = {
    scenarios: {
      parallel: {
        executor: 'per-vu-iterations',
        vus: 100,
        iterations: 1000,
        maxDuration: '5m',
      },
    },
  };

  export default function () {
    // k6 automatically schedules goroutines across OS threads
    // No GIL limitation - true multi-core utilization
    const responses = http.batch([
      ['GET', 'http://localhost:8080/api/products/1'],
      ['GET', 'http://localhost:8080/api/products/2'],
      ['GET', 'http://localhost:8080/api/products/3'],
    ]);
    sleep(1);
  }
  ```

  Practical rule: one Locust worker can effectively support 500-5,000 users depending on scenario complexity. A single k6 process can handle 30,000+ VUs thanks to the Go runtime. For very large tests, both tools need distributed execution, but k6 requires fewer instances.
section: "performance-testing"
order: 18
tags:
  - internals
  - architecture
type: "deep"
---
