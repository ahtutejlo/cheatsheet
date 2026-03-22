---
ua_question: "Як інтегрувати навантажувальні тести у CI/CD з автоматичними performance gates?"
en_question: "How to integrate load tests into CI/CD with automatic performance gates?"
ua_answer: |
  **Сценарій:** Команда хоче автоматично блокувати деплой, якщо новий реліз погіршує продуктивність. Потрібно інтегрувати Locust у GitHub Actions з performance gates: p95 < 500ms, error rate < 1%, throughput не впав більш ніж на 10% від baseline.

  **Підхід:** Locust у headless режимі повертає non-zero exit code при порушенні SLA. GitHub Actions step завершується з помилкою, блокуючи merge або deploy. Baseline зберігається як артефакт попереднього успішного тесту.

  Performance gates повинні бути достатньо строгими для виявлення регресій, але з деяким допуском для нормальної варіативності (flakiness). Типовий допуск -- 10-20% від baseline.

  ```python
  # perf_test.py - CI/CD-ready load test
  from locust import HttpUser, task, between, events
  import json
  import sys
  import os

  class CiCdUser(HttpUser):
      wait_time = between(1, 3)

      @task(5)
      def get_products(self):
          self.client.get("/api/products")

      @task(2)
      def get_product(self):
          self.client.get("/api/products/1", name="/api/products/[id]")

      @task(1)
      def search(self):
          self.client.get("/api/search?q=test")

  @events.quitting.add_listener
  def performance_gate(environment, **kwargs):
      stats = environment.runner.stats.total

      # Load baseline from previous run
      baseline_path = os.environ.get("BASELINE_PATH", "baseline.json")
      baseline = {}
      try:
          with open(baseline_path) as f:
              baseline = json.load(f)
      except FileNotFoundError:
          print("No baseline found, saving current as baseline")

      results = {
          "p95": stats.get_response_time_percentile(0.95),
          "p99": stats.get_response_time_percentile(0.99),
          "avg": stats.avg_response_time,
          "error_rate": stats.fail_ratio,
          "rps": stats.total_rps,
      }

      # Save current results as potential next baseline
      with open("current_results.json", "w") as f:
          json.dump(results, f, indent=2)

      print("\n=== PERFORMANCE GATE CHECK ===")
      gate_passed = True

      # Gate 1: Absolute SLA
      if results["p95"] > 500:
          print(f"FAIL: p95 {results['p95']:.0f}ms > 500ms")
          gate_passed = False

      if results["error_rate"] > 0.01:
          print(f"FAIL: error rate {results['error_rate']:.2%} > 1%")
          gate_passed = False

      # Gate 2: Regression vs baseline (if available)
      if baseline:
          if results["p95"] > baseline["p95"] * 1.2:
              print(f"FAIL: p95 regressed {results['p95']:.0f}ms "
                    f"vs baseline {baseline['p95']:.0f}ms (+20% threshold)")
              gate_passed = False

          if results["rps"] < baseline["rps"] * 0.9:
              print(f"FAIL: throughput dropped {results['rps']:.1f} "
                    f"vs baseline {baseline['rps']:.1f} (-10% threshold)")
              gate_passed = False

      if gate_passed:
          print("ALL GATES PASSED")
          environment.process_exit_code = 0
      else:
          print("GATES FAILED - blocking deployment")
          environment.process_exit_code = 1
  ```

  ```yaml
  # .github/workflows/performance.yml
  name: Performance Tests
  on:
    pull_request:
      branches: [main]

  jobs:
    load-test:
      runs-on: ubuntu-latest
      services:
        app:
          image: myapp:${{ github.sha }}
          ports: ["8080:8080"]
      steps:
        - uses: actions/checkout@v4

        - name: Install dependencies
          run: pip install locust

        - name: Download baseline
          uses: actions/download-artifact@v4
          with:
            name: perf-baseline
            path: .
          continue-on-error: true

        - name: Run load test
          run: |
            locust -f perf_test.py \
              --headless \
              --users 50 --spawn-rate 5 --run-time 3m \
              --host http://localhost:8080 \
              --csv results/perf

        - name: Upload results
          if: success()
          uses: actions/upload-artifact@v4
          with:
            name: perf-baseline
            path: current_results.json

        - name: Upload CSV reports
          if: always()
          uses: actions/upload-artifact@v4
          with:
            name: perf-results
            path: results/
  ```

  Для production-ready pipeline додайте: 1) сповіщення у Slack при порушенні gate, 2) автоматичне порівняння з кількома попередніми запусками (а не одним baseline), 3) можливість skip для hotfix-гілок, 4) окремі gate для різних ендпоінтів.
en_answer: |
  **Scenario:** The team wants to automatically block deployment if a new release degrades performance. You need to integrate Locust into GitHub Actions with performance gates: p95 < 500ms, error rate < 1%, throughput not dropped more than 10% from baseline.

  **Approach:** Locust in headless mode returns a non-zero exit code on SLA violation. The GitHub Actions step fails, blocking merge or deploy. The baseline is stored as an artifact from the previous successful test.

  Performance gates should be strict enough to catch regressions but with some tolerance for normal variability (flakiness). Typical tolerance is 10-20% from baseline.

  ```python
  # perf_test.py - CI/CD-ready load test
  from locust import HttpUser, task, between, events
  import json
  import sys
  import os

  class CiCdUser(HttpUser):
      wait_time = between(1, 3)

      @task(5)
      def get_products(self):
          self.client.get("/api/products")

      @task(2)
      def get_product(self):
          self.client.get("/api/products/1", name="/api/products/[id]")

      @task(1)
      def search(self):
          self.client.get("/api/search?q=test")

  @events.quitting.add_listener
  def performance_gate(environment, **kwargs):
      stats = environment.runner.stats.total

      # Load baseline from previous run
      baseline_path = os.environ.get("BASELINE_PATH", "baseline.json")
      baseline = {}
      try:
          with open(baseline_path) as f:
              baseline = json.load(f)
      except FileNotFoundError:
          print("No baseline found, saving current as baseline")

      results = {
          "p95": stats.get_response_time_percentile(0.95),
          "p99": stats.get_response_time_percentile(0.99),
          "avg": stats.avg_response_time,
          "error_rate": stats.fail_ratio,
          "rps": stats.total_rps,
      }

      # Save current results as potential next baseline
      with open("current_results.json", "w") as f:
          json.dump(results, f, indent=2)

      print("\n=== PERFORMANCE GATE CHECK ===")
      gate_passed = True

      # Gate 1: Absolute SLA
      if results["p95"] > 500:
          print(f"FAIL: p95 {results['p95']:.0f}ms > 500ms")
          gate_passed = False

      if results["error_rate"] > 0.01:
          print(f"FAIL: error rate {results['error_rate']:.2%} > 1%")
          gate_passed = False

      # Gate 2: Regression vs baseline (if available)
      if baseline:
          if results["p95"] > baseline["p95"] * 1.2:
              print(f"FAIL: p95 regressed {results['p95']:.0f}ms "
                    f"vs baseline {baseline['p95']:.0f}ms (+20% threshold)")
              gate_passed = False

          if results["rps"] < baseline["rps"] * 0.9:
              print(f"FAIL: throughput dropped {results['rps']:.1f} "
                    f"vs baseline {baseline['rps']:.1f} (-10% threshold)")
              gate_passed = False

      if gate_passed:
          print("ALL GATES PASSED")
          environment.process_exit_code = 0
      else:
          print("GATES FAILED - blocking deployment")
          environment.process_exit_code = 1
  ```

  ```yaml
  # .github/workflows/performance.yml
  name: Performance Tests
  on:
    pull_request:
      branches: [main]

  jobs:
    load-test:
      runs-on: ubuntu-latest
      services:
        app:
          image: myapp:${{ github.sha }}
          ports: ["8080:8080"]
      steps:
        - uses: actions/checkout@v4

        - name: Install dependencies
          run: pip install locust

        - name: Download baseline
          uses: actions/download-artifact@v4
          with:
            name: perf-baseline
            path: .
          continue-on-error: true

        - name: Run load test
          run: |
            locust -f perf_test.py \
              --headless \
              --users 50 --spawn-rate 5 --run-time 3m \
              --host http://localhost:8080 \
              --csv results/perf

        - name: Upload results
          if: success()
          uses: actions/upload-artifact@v4
          with:
            name: perf-baseline
            path: current_results.json

        - name: Upload CSV reports
          if: always()
          uses: actions/upload-artifact@v4
          with:
            name: perf-results
            path: results/
  ```

  For a production-ready pipeline, add: 1) Slack notifications on gate violations, 2) automatic comparison with multiple previous runs (not just one baseline), 3) skip option for hotfix branches, 4) separate gates for different endpoints.
section: "performance-testing"
order: 28
tags:
  - ci-cd
  - automation
type: "practical"
---
