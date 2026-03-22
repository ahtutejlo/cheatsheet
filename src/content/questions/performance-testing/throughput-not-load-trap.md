---
ua_question: "Чи означає високий RPS, що система справляється з навантаженням?"
en_question: "Does high RPS mean the system is handling the load?"
ua_answer: |
  > **Trap:** "Ми досягли 5000 RPS -- система працює чудово!" Високий throughput не означає, що система справляється з реальним навантаженням.

  Перша пастка: сервер може повертати **помилки дуже швидко**. Якщо 80% відповідей -- це HTTP 500 за 5ms, throughput буде високим, але система фактично зламана. Throughput без error rate -- безглузда метрика. Завжди дивіться на RPS успішних запитів окремо від загального RPS.

  Друга пастка: **порожні або кешовані відповіді**. Якщо load balancer або CDN повертає кешовану відповідь, трафік навіть не доходить до серверу. 10,000 RPS на CDN не означає, що сервер витримає 10,000 RPS. Третя пастка: **degraded responses** -- сервер повертає 200 OK, але з неповними даними або fallback-значеннями.

  ```python
  from locust import HttpUser, task, between, events

  class ThroughputTrapUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def get_products(self):
          with self.client.get("/api/products", catch_response=True) as resp:
              # Trap 1: Server returns 500 fast - high RPS but broken
              if resp.status_code >= 500:
                  resp.failure(f"Server error: {resp.status_code}")
                  return

              # Trap 2: Empty or degraded response
              data = resp.json()
              if not data.get("products"):
                  resp.failure("Empty response - might be hitting cache only")
                  return

              # Trap 3: Response is valid but incomplete
              if len(data["products"]) < 10:
                  resp.failure(f"Degraded: only {len(data['products'])} products")

  @events.quitting.add_listener
  def validate_throughput(environment, **kwargs):
      stats = environment.runner.stats.total
      total_rps = stats.total_rps
      fail_ratio = stats.fail_ratio
      success_rps = total_rps * (1 - fail_ratio)

      print(f"\n=== THROUGHPUT REALITY CHECK ===")
      print(f"Total RPS:      {total_rps:.1f}")
      print(f"Error rate:     {fail_ratio:.2%}")
      print(f"Successful RPS: {success_rps:.1f}")  # This is what matters!

      if fail_ratio > 0.05:
          print("WARNING: High RPS is meaningless with >5% error rate!")
          environment.process_exit_code = 1
  ```

  Правильний підхід до оцінки throughput: 1) фільтруйте тільки успішні запити (2xx), 2) перевіряйте повноту відповідей, 3) корелюйте RPS з response time -- якщо throughput високий, але p99 зростає, система на межі. Метрика "goodput" (successful throughput) -- це те, що реально важливо.
en_answer: |
  > **Trap:** "We achieved 5000 RPS -- the system is working great!" High throughput does not mean the system is handling real load.

  First trap: the server may be **returning errors very fast**. If 80% of responses are HTTP 500 in 5ms, throughput will be high, but the system is essentially broken. Throughput without error rate is a meaningless metric. Always look at successful request RPS separately from total RPS.

  Second trap: **empty or cached responses**. If a load balancer or CDN returns a cached response, traffic never reaches the server. 10,000 RPS on CDN does not mean the server can handle 10,000 RPS. Third trap: **degraded responses** -- the server returns 200 OK but with incomplete data or fallback values.

  ```python
  from locust import HttpUser, task, between, events

  class ThroughputTrapUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def get_products(self):
          with self.client.get("/api/products", catch_response=True) as resp:
              # Trap 1: Server returns 500 fast - high RPS but broken
              if resp.status_code >= 500:
                  resp.failure(f"Server error: {resp.status_code}")
                  return

              # Trap 2: Empty or degraded response
              data = resp.json()
              if not data.get("products"):
                  resp.failure("Empty response - might be hitting cache only")
                  return

              # Trap 3: Response is valid but incomplete
              if len(data["products"]) < 10:
                  resp.failure(f"Degraded: only {len(data['products'])} products")

  @events.quitting.add_listener
  def validate_throughput(environment, **kwargs):
      stats = environment.runner.stats.total
      total_rps = stats.total_rps
      fail_ratio = stats.fail_ratio
      success_rps = total_rps * (1 - fail_ratio)

      print(f"\n=== THROUGHPUT REALITY CHECK ===")
      print(f"Total RPS:      {total_rps:.1f}")
      print(f"Error rate:     {fail_ratio:.2%}")
      print(f"Successful RPS: {success_rps:.1f}")  # This is what matters!

      if fail_ratio > 0.05:
          print("WARNING: High RPS is meaningless with >5% error rate!")
          environment.process_exit_code = 1
  ```

  The correct approach to evaluating throughput: 1) filter only successful requests (2xx), 2) verify response completeness, 3) correlate RPS with response time -- if throughput is high but p99 is growing, the system is at its limit. The "goodput" metric (successful throughput) is what truly matters.
section: "performance-testing"
order: 20
tags:
  - metrics
  - gotchas
type: "trick"
---
