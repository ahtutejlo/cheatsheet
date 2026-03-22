---
ua_question: "Чому перший запуск навантажувального тесту завжди повільніший?"
en_question: "Why is the first load test run always slower?"
ua_answer: |
  > **Trap:** "Ми прогнали тест двічі і отримали різні результати -- щось не так з тестом." Різниця між першим і наступними запусками -- це нормальна поведінка, пов'язана з прогрівом кешів.

  **Cache warming** (прогрів кешів) -- це процес заповнення різних рівнів кешування при перших запитах. Холодний кеш означає: 1) **Database query cache** порожній -- кожен SQL-запит читає з диску; 2) **Application cache** (Redis/Memcached) порожній -- всі запити йдуть до бази; 3) **JIT compilation** -- Java/C# код ще не оптимізований; 4) **OS page cache** порожній -- файли читаються з диску, а не з RAM; 5) **CDN/reverse proxy cache** порожній -- всі запити проходять до origin.

  Проблема в тому, що обидва результати валідні для різних сценаріїв. Cold start показує worst-case після деплою або рестарту. Warm результат показує типову продуктивність. Потрібно тестувати обидва сценарії та чітко розрізняти їх у звітах.

  ```python
  from locust import HttpUser, task, between, LoadTestShape, events
  import time

  class CacheAwareUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  class WarmupThenTestShape(LoadTestShape):
      """
      Phase 1: Warm-up (results discarded)
      Phase 2: Actual test (results collected)
      """
      def tick(self):
          run_time = self.get_run_time()

          if run_time < 60:
              # Warm-up phase: low load to fill caches
              return (10, 5)
          elif run_time < 120:
              # Ramp-up to target load
              users = int(10 + (run_time - 60) * 90 / 60)
              return (users, 5)
          elif run_time < 420:
              # Steady state: actual measurement
              return (100, 5)
          else:
              return None

  warmup_end_time = None

  @events.test_start.add_listener
  def mark_warmup(environment, **kwargs):
      global warmup_end_time
      warmup_end_time = time.time() + 60
      print("=== WARM-UP PHASE (60s) - results should be discarded ===")

  @events.request.add_listener
  def tag_warmup_requests(request_type, name, response_time, **kwargs):
      global warmup_end_time
      if warmup_end_time and time.time() < warmup_end_time:
          pass  # These results are from warm-up phase

  # Alternative: run warm-up as separate Locust invocation
  # Step 1: Warm caches
  # locust -f locustfile.py --headless -u 10 -r 5 -t 60s --csv=warmup
  #
  # Step 2: Actual test (caches are now warm)
  # locust -f locustfile.py --headless -u 100 -r 10 -t 5m --csv=results
  ```

  Рекомендація: завжди включайте warm-up фазу у тестовий план. У звіті чітко вказуйте: "Results after 60s warm-up" або "Cold-start results". Для CI/CD використовуйте warm результати як основний критерій, але додавайте cold-start тест для перевірки сценарію після деплою.
en_answer: |
  > **Trap:** "We ran the test twice and got different results -- something is wrong with the test." The difference between the first and subsequent runs is normal behavior related to cache warming.

  **Cache warming** is the process of filling various caching levels during the first requests. A cold cache means: 1) **Database query cache** is empty -- every SQL query reads from disk; 2) **Application cache** (Redis/Memcached) is empty -- all requests go to the database; 3) **JIT compilation** -- Java/C# code is not yet optimized; 4) **OS page cache** is empty -- files are read from disk, not RAM; 5) **CDN/reverse proxy cache** is empty -- all requests pass through to origin.

  The issue is that both results are valid for different scenarios. Cold start shows the worst-case after deployment or restart. Warm results show typical performance. You need to test both scenarios and clearly distinguish them in reports.

  ```python
  from locust import HttpUser, task, between, LoadTestShape, events
  import time

  class CacheAwareUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  class WarmupThenTestShape(LoadTestShape):
      """
      Phase 1: Warm-up (results discarded)
      Phase 2: Actual test (results collected)
      """
      def tick(self):
          run_time = self.get_run_time()

          if run_time < 60:
              # Warm-up phase: low load to fill caches
              return (10, 5)
          elif run_time < 120:
              # Ramp-up to target load
              users = int(10 + (run_time - 60) * 90 / 60)
              return (users, 5)
          elif run_time < 420:
              # Steady state: actual measurement
              return (100, 5)
          else:
              return None

  warmup_end_time = None

  @events.test_start.add_listener
  def mark_warmup(environment, **kwargs):
      global warmup_end_time
      warmup_end_time = time.time() + 60
      print("=== WARM-UP PHASE (60s) - results should be discarded ===")

  @events.request.add_listener
  def tag_warmup_requests(request_type, name, response_time, **kwargs):
      global warmup_end_time
      if warmup_end_time and time.time() < warmup_end_time:
          pass  # These results are from warm-up phase

  # Alternative: run warm-up as separate Locust invocation
  # Step 1: Warm caches
  # locust -f locustfile.py --headless -u 10 -r 5 -t 60s --csv=warmup
  #
  # Step 2: Actual test (caches are now warm)
  # locust -f locustfile.py --headless -u 100 -r 10 -t 5m --csv=results
  ```

  Recommendation: always include a warm-up phase in the test plan. In the report, clearly state: "Results after 60s warm-up" or "Cold-start results". For CI/CD, use warm results as the primary criterion but add a cold-start test to verify the post-deployment scenario.
section: "performance-testing"
order: 23
tags:
  - analysis
  - gotchas
type: "trick"
---
