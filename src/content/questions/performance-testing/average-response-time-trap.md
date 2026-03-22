---
ua_question: "Чому середній час відповіді -- погана метрика для оцінки продуктивності?"
en_question: "Why is average response time a poor metric for evaluating performance?"
ua_answer: |
  > **Trap:** На інтерв'ю кандидат може сказати "наш середній response time -- 200ms, все добре". Це оманлива метрика, яка приховує реальні проблеми продуктивності.

  Середнє значення (average/mean) чутливе до розподілу та приховує "хвіст" повільних запитів. Приклад: 99 запитів за 100ms і 1 запит за 10,000ms дають середнє 199ms -- виглядає прийнятно. Але 1% користувачів чекає 10 секунд! Ці "tail latencies" часто стосуються найважливіших користувачів -- тих, хто робить складніші операції або має більше даних.

  Правильний підхід -- використовувати **перцентилі**: **p50** (медіана -- половина запитів швидше), **p95** (95% запитів швидше), **p99** (99% запитів швидше). SLA формулюються через перцентилі: "p99 < 500ms" означає, що навіть найповільніший 1% запитів вкладається у 500ms.

  ```python
  from locust import HttpUser, task, between, events
  import numpy as np

  class PercentileUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  @events.quitting.add_listener
  def show_percentiles(environment, **kwargs):
      stats = environment.runner.stats.total

      print("\n=== WHY AVERAGES LIE ===")
      print(f"Average response time: {stats.avg_response_time:.0f}ms")
      print(f"Median (p50):          {stats.get_response_time_percentile(0.50):.0f}ms")
      print(f"p90:                   {stats.get_response_time_percentile(0.90):.0f}ms")
      print(f"p95:                   {stats.get_response_time_percentile(0.95):.0f}ms")
      print(f"p99:                   {stats.get_response_time_percentile(0.99):.0f}ms")
      print(f"Max:                   {stats.max_response_time:.0f}ms")
      print(f"\nIf avg=200ms but p99=5000ms, 1% of users wait 25x longer!")
      print(f"At 1M requests/day, that's 10,000 terrible experiences.")

  # Example output:
  # Average response time: 185ms    <-- looks great!
  # Median (p50):          120ms
  # p90:                   250ms
  # p95:                   450ms
  # p99:                   3200ms   <-- 1% of users suffer
  # Max:                   12500ms  <-- worst case is awful
  ```

  На інтерв'ю завжди говоріть про перцентилі, а не середнє. Це демонструє глибоке розуміння метрик продуктивності. Amazon внутрішньо використовує p99.9 як основну метрику, бо повільні запити часто стосуються користувачів з великими кошиками -- найцінніших клієнтів.
en_answer: |
  > **Trap:** In an interview, a candidate might say "our average response time is 200ms, everything is fine". This is a deceptive metric that hides real performance problems.

  The average (mean) is sensitive to distribution and hides the "tail" of slow requests. Example: 99 requests at 100ms and 1 request at 10,000ms give an average of 199ms -- looks acceptable. But 1% of users wait 10 seconds! These "tail latencies" often affect the most important users -- those performing more complex operations or having more data.

  The correct approach is to use **percentiles**: **p50** (median -- half of requests are faster), **p95** (95% of requests are faster), **p99** (99% of requests are faster). SLAs are defined through percentiles: "p99 < 500ms" means even the slowest 1% of requests complete within 500ms.

  ```python
  from locust import HttpUser, task, between, events
  import numpy as np

  class PercentileUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  @events.quitting.add_listener
  def show_percentiles(environment, **kwargs):
      stats = environment.runner.stats.total

      print("\n=== WHY AVERAGES LIE ===")
      print(f"Average response time: {stats.avg_response_time:.0f}ms")
      print(f"Median (p50):          {stats.get_response_time_percentile(0.50):.0f}ms")
      print(f"p90:                   {stats.get_response_time_percentile(0.90):.0f}ms")
      print(f"p95:                   {stats.get_response_time_percentile(0.95):.0f}ms")
      print(f"p99:                   {stats.get_response_time_percentile(0.99):.0f}ms")
      print(f"Max:                   {stats.max_response_time:.0f}ms")
      print(f"\nIf avg=200ms but p99=5000ms, 1% of users wait 25x longer!")
      print(f"At 1M requests/day, that's 10,000 terrible experiences.")

  # Example output:
  # Average response time: 185ms    <-- looks great!
  # Median (p50):          120ms
  # p90:                   250ms
  # p95:                   450ms
  # p99:                   3200ms   <-- 1% of users suffer
  # Max:                   12500ms  <-- worst case is awful
  ```

  In interviews, always talk about percentiles, not averages. This demonstrates deep understanding of performance metrics. Amazon internally uses p99.9 as the primary metric because slow requests often affect users with large carts -- the most valuable customers.
section: "performance-testing"
order: 19
tags:
  - metrics
  - gotchas
type: "trick"
---
