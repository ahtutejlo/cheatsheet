---
ua_question: "Які ключові метрики тестування продуктивності?"
en_question: "What are the key performance testing metrics?"
ua_answer: |
  Ключові метрики продуктивності дозволяють об'єктивно оцінити поведінку системи під навантаженням та прийняти рішення про готовність до продакшену.

  **Throughput (пропускна здатність)** -- кількість запитів, які система обробляє за одиницю часу (RPS -- requests per second). **Response Time (час відповіді)** -- час від відправки запиту до отримання відповіді. Замість середнього значення використовують перцентилі: **p50** (медіана), **p95** та **p99** -- час, у який вкладаються 95% та 99% запитів відповідно.

  **Error Rate (частка помилок)** -- відсоток запитів, що повернули помилку (4xx/5xx). **Concurrency (паралельність)** -- кількість одночасних активних запитів. **Latency** -- мережева затримка, часто плутають з response time, але latency -- це лише час передачі, без обробки на сервері.

  ```python
  from locust import HttpUser, task, between, events
  import time

  class MetricsUser(HttpUser):
      wait_time = between(1, 2)

      @task
      def get_product(self):
          with self.client.get("/api/products/1", catch_response=True) as resp:
              if resp.elapsed.total_seconds() > 2.0:
                  resp.failure(f"Too slow: {resp.elapsed.total_seconds():.2f}s")
              elif resp.status_code != 200:
                  resp.failure(f"Status {resp.status_code}")

  @events.quitting.add_listener
  def check_results(environment, **kwargs):
      stats = environment.runner.stats.total
      if stats.avg_response_time > 500:
          environment.process_exit_code = 1
      if stats.fail_ratio > 0.01:
          environment.process_exit_code = 1
  ```

  На практиці SLA зазвичай формулюється через перцентилі: "p99 response time < 500ms при 1000 RPS з error rate < 0.1%". Саме ці метрики є основою для прийняття рішень.
en_answer: |
  Key performance metrics allow you to objectively evaluate system behavior under load and make decisions about production readiness.

  **Throughput** -- the number of requests the system processes per unit of time (RPS -- requests per second). **Response Time** -- the time from sending a request to receiving the response. Instead of the average, percentiles are used: **p50** (median), **p95** and **p99** -- the time within which 95% and 99% of requests complete respectively.

  **Error Rate** -- the percentage of requests that returned an error (4xx/5xx). **Concurrency** -- the number of simultaneous active requests. **Latency** -- network delay, often confused with response time, but latency is only the transmission time without server processing.

  ```python
  from locust import HttpUser, task, between, events
  import time

  class MetricsUser(HttpUser):
      wait_time = between(1, 2)

      @task
      def get_product(self):
          with self.client.get("/api/products/1", catch_response=True) as resp:
              if resp.elapsed.total_seconds() > 2.0:
                  resp.failure(f"Too slow: {resp.elapsed.total_seconds():.2f}s")
              elif resp.status_code != 200:
                  resp.failure(f"Status {resp.status_code}")

  @events.quitting.add_listener
  def check_results(environment, **kwargs):
      stats = environment.runner.stats.total
      if stats.avg_response_time > 500:
          environment.process_exit_code = 1
      if stats.fail_ratio > 0.01:
          environment.process_exit_code = 1
  ```

  In practice, SLAs are typically defined through percentiles: "p99 response time < 500ms at 1000 RPS with error rate < 0.1%". These metrics form the basis for go/no-go decisions.
section: "performance-testing"
order: 2
tags:
  - metrics
  - fundamentals
type: "basic"
---
