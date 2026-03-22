---
ua_question: "Як працюють assertions та SLA у навантажувальних тестах?"
en_question: "How do assertions and SLAs work in load tests?"
ua_answer: |
  **Assertions** у навантажувальному тестуванні -- це перевірки, які визначають, чи відповідь сервера відповідає очікуванням. На відміну від функціонального тестування, тут assertions перевіряють не тільки коректність, а й продуктивність: час відповіді, throughput, error rate.

  **SLA (Service Level Agreement)** -- це формалізовані вимоги до продуктивності: "99% запитів повинні виконуватися швидше 500ms", "error rate не повинен перевищувати 0.1%". Assertions автоматизують перевірку SLA і можуть зупиняти тест або повертати ненульовий exit code для CI/CD.

  У Locust assertions реалізуються через `catch_response=True` для перевірки окремих запитів та через event listener `quitting` для глобальних SLA.

  ```python
  from locust import HttpUser, task, between, events

  class SlaUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def get_product(self):
          # Per-request assertion
          with self.client.get("/api/products/1", catch_response=True) as resp:
              if resp.status_code != 200:
                  resp.failure(f"Expected 200, got {resp.status_code}")
              elif resp.elapsed.total_seconds() > 1.0:
                  resp.failure(f"SLA breach: {resp.elapsed.total_seconds():.2f}s > 1.0s")
              else:
                  data = resp.json()
                  if "id" not in data:
                      resp.failure("Response missing 'id' field")

  @events.quitting.add_listener
  def check_sla(environment, **kwargs):
      stats = environment.runner.stats.total
      fail_ratio = stats.fail_ratio

      # SLA: error rate < 1%
      if fail_ratio > 0.01:
          print(f"SLA FAILED: error rate {fail_ratio:.2%} > 1%")
          environment.process_exit_code = 1

      # SLA: p95 response time < 800ms
      if stats.get_response_time_percentile(0.95) > 800:
          p95 = stats.get_response_time_percentile(0.95)
          print(f"SLA FAILED: p95 {p95}ms > 800ms")
          environment.process_exit_code = 1

      # SLA: avg response time < 300ms
      if stats.avg_response_time > 300:
          print(f"SLA FAILED: avg {stats.avg_response_time:.0f}ms > 300ms")
          environment.process_exit_code = 1
  ```

  Ненульовий `process_exit_code` дозволяє CI/CD pipeline (GitHub Actions, Jenkins) автоматично зупиняти деплой при порушенні SLA. Це основа performance gates у CD процесі.
en_answer: |
  **Assertions** in load testing are checks that determine whether the server response meets expectations. Unlike functional testing, assertions here verify not only correctness but also performance: response time, throughput, and error rate.

  **SLA (Service Level Agreement)** represents formalized performance requirements: "99% of requests must complete within 500ms", "error rate must not exceed 0.1%". Assertions automate SLA verification and can stop the test or return a non-zero exit code for CI/CD.

  In Locust, assertions are implemented via `catch_response=True` for individual request checks and via the `quitting` event listener for global SLAs.

  ```python
  from locust import HttpUser, task, between, events

  class SlaUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def get_product(self):
          # Per-request assertion
          with self.client.get("/api/products/1", catch_response=True) as resp:
              if resp.status_code != 200:
                  resp.failure(f"Expected 200, got {resp.status_code}")
              elif resp.elapsed.total_seconds() > 1.0:
                  resp.failure(f"SLA breach: {resp.elapsed.total_seconds():.2f}s > 1.0s")
              else:
                  data = resp.json()
                  if "id" not in data:
                      resp.failure("Response missing 'id' field")

  @events.quitting.add_listener
  def check_sla(environment, **kwargs):
      stats = environment.runner.stats.total
      fail_ratio = stats.fail_ratio

      # SLA: error rate < 1%
      if fail_ratio > 0.01:
          print(f"SLA FAILED: error rate {fail_ratio:.2%} > 1%")
          environment.process_exit_code = 1

      # SLA: p95 response time < 800ms
      if stats.get_response_time_percentile(0.95) > 800:
          p95 = stats.get_response_time_percentile(0.95)
          print(f"SLA FAILED: p95 {p95}ms > 800ms")
          environment.process_exit_code = 1

      # SLA: avg response time < 300ms
      if stats.avg_response_time > 300:
          print(f"SLA FAILED: avg {stats.avg_response_time:.0f}ms > 300ms")
          environment.process_exit_code = 1
  ```

  A non-zero `process_exit_code` allows CI/CD pipelines (GitHub Actions, Jenkins) to automatically halt deployment on SLA violations. This is the foundation of performance gates in the CD process.
section: "performance-testing"
order: 8
tags:
  - fundamentals
  - metrics
type: "basic"
---
