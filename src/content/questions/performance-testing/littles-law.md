---
ua_question: "Що таке закон Літтла і як його застосовувати у тестуванні продуктивності?"
en_question: "What is Little's Law and how to apply it in performance testing?"
ua_answer: |
  **Закон Літтла** (Little's Law) -- фундаментальна формула теорії черг: **L = λ × W**, де **L** -- середня кількість запитів у системі (concurrency), **λ** (лямбда) -- середній throughput (запитів/сек), **W** -- середній час перебування запиту у системі (response time).

  Практичне застосування: якщо SLA вимагає обробляти **λ = 100 RPS** при середньому response time **W = 0.5с**, то потрібна concurrency **L = 100 × 0.5 = 50** одночасних з'єднань. Це визначає кількість віртуальних користувачів у Locust та розмір connection pool на сервері.

  Закон працює і у зворотному напрямку для capacity planning: якщо сервер підтримує максимум 200 одночасних з'єднань при response time 0.2с, то максимальний throughput = 200 / 0.2 = 1000 RPS. Якщо response time зросте до 1с, throughput впаде до 200 RPS.

  ```python
  from locust import HttpUser, task, between, events
  import time

  class LittlesLawUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  @events.quitting.add_listener
  def verify_littles_law(environment, **kwargs):
      """Verify Little's Law: L = lambda * W"""
      stats = environment.runner.stats.total

      # lambda (throughput) = total requests / total time
      total_time = stats.last_request_timestamp - stats.start_time
      if total_time == 0:
          return

      throughput = stats.num_requests / total_time  # requests/sec
      avg_response_time = stats.avg_response_time / 1000  # convert ms to sec
      user_count = environment.runner.user_count

      # Little's Law: L = lambda * W
      predicted_concurrency = throughput * avg_response_time

      print(f"\n=== LITTLE'S LAW VERIFICATION ===")
      print(f"Throughput (lambda): {throughput:.1f} req/s")
      print(f"Avg response time (W): {avg_response_time:.3f}s")
      print(f"Predicted concurrency (L = lambda*W): {predicted_concurrency:.1f}")
      print(f"Actual user count: {user_count}")
      print(f"Note: difference is due to think time between requests")

  # Capacity planning example:
  # Given: max_connections = 500, target_response_time = 200ms
  # Max throughput = 500 / 0.2 = 2500 RPS
  # If response time degrades to 500ms: 500 / 0.5 = 1000 RPS
  # If response time degrades to 2s: 500 / 2 = 250 RPS
  ```

  Закон Літтла допомагає на інтерв'ю пояснити, чому деградація response time призводить до каскадного падіння throughput: коли запити сповільнюються, вони довше займають з'єднання, і нові запити чекають у черзі, що ще більше збільшує response time. Це класичний feedback loop у перевантажених системах.
en_answer: |
  **Little's Law** is a fundamental queuing theory formula: **L = lambda x W**, where **L** is the average number of requests in the system (concurrency), **lambda** is the average throughput (requests/sec), and **W** is the average time a request spends in the system (response time).

  Practical application: if the SLA requires handling **lambda = 100 RPS** with average response time **W = 0.5s**, then the required concurrency is **L = 100 x 0.5 = 50** simultaneous connections. This determines the number of virtual users in Locust and the connection pool size on the server.

  The law works in reverse for capacity planning: if the server supports a maximum of 200 concurrent connections at 0.2s response time, then maximum throughput = 200 / 0.2 = 1000 RPS. If response time increases to 1s, throughput drops to 200 RPS.

  ```python
  from locust import HttpUser, task, between, events
  import time

  class LittlesLawUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  @events.quitting.add_listener
  def verify_littles_law(environment, **kwargs):
      """Verify Little's Law: L = lambda * W"""
      stats = environment.runner.stats.total

      # lambda (throughput) = total requests / total time
      total_time = stats.last_request_timestamp - stats.start_time
      if total_time == 0:
          return

      throughput = stats.num_requests / total_time  # requests/sec
      avg_response_time = stats.avg_response_time / 1000  # convert ms to sec
      user_count = environment.runner.user_count

      # Little's Law: L = lambda * W
      predicted_concurrency = throughput * avg_response_time

      print(f"\n=== LITTLE'S LAW VERIFICATION ===")
      print(f"Throughput (lambda): {throughput:.1f} req/s")
      print(f"Avg response time (W): {avg_response_time:.3f}s")
      print(f"Predicted concurrency (L = lambda*W): {predicted_concurrency:.1f}")
      print(f"Actual user count: {user_count}")
      print(f"Note: difference is due to think time between requests")

  # Capacity planning example:
  # Given: max_connections = 500, target_response_time = 200ms
  # Max throughput = 500 / 0.2 = 2500 RPS
  # If response time degrades to 500ms: 500 / 0.5 = 1000 RPS
  # If response time degrades to 2s: 500 / 2 = 250 RPS
  ```

  Little's Law helps explain in interviews why response time degradation leads to cascading throughput collapse: when requests slow down, they occupy connections longer, and new requests wait in queue, further increasing response time. This is the classic feedback loop in overloaded systems.
section: "performance-testing"
order: 16
tags:
  - metrics
  - capacity-planning
type: "deep"
---
