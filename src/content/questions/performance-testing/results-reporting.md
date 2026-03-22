---
ua_question: "Як аналізувати та візуалізувати результати навантажувальних тестів у Locust?"
en_question: "How to analyze and visualize load test results in Locust?"
ua_answer: |
  Locust надає кілька способів збору та візуалізації результатів: вбудований **веб-інтерфейс**, **CSV-експорт** та інтеграцію з **Grafana** через різні механізми передачі метрик.

  **Веб-інтерфейс** (порт 8089) показує графіки в реальному часі: RPS, response time, кількість користувачів та помилки. Це зручно для ручного аналізу, але не підходить для автоматизації. **CSV-експорт** створює файли зі статистикою, розподілом часу відповіді та помилками -- ідеально для CI/CD та збереження історії.

  Для повноцінного моніторингу найкращий підхід -- відправка метрик Locust у **Prometheus** через бібліотеку `prometheus_client` з подальшою візуалізацією у **Grafana**. Це дозволяє будувати дашборди з кореляцією між навантаженням та серверними метриками.

  ```python
  from locust import HttpUser, task, between, events
  import subprocess
  import os

  class ReportingUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  # CSV export: run Locust in headless mode
  # locust -f locustfile.py --headless \
  #   --users 100 --spawn-rate 10 --run-time 5m \
  #   --csv=results/load_test \
  #   --csv-full-history

  # This creates:
  #   results/load_test_stats.csv          - aggregated stats
  #   results/load_test_stats_history.csv  - stats over time
  #   results/load_test_failures.csv       - error details
  #   results/load_test_exceptions.csv     - Python exceptions

  @events.quitting.add_listener
  def generate_html_report(environment, **kwargs):
      """Generate HTML report from CSV data after test."""
      stats = environment.runner.stats
      print("\n=== LOAD TEST SUMMARY ===")
      print(f"Total requests: {stats.total.num_requests}")
      print(f"Failed requests: {stats.total.num_failures}")
      print(f"Avg response time: {stats.total.avg_response_time:.0f}ms")
      print(f"p95 response time: {stats.total.get_response_time_percentile(0.95):.0f}ms")
      print(f"Requests/s: {stats.total.current_rps:.1f}")
  ```

  Для командного використання рекомендується зберігати CSV-результати у CI/CD артефактах та будувати тренди продуктивності між релізами через Grafana дашборди.
en_answer: |
  Locust provides several ways to collect and visualize results: the built-in **web interface**, **CSV export**, and integration with **Grafana** through various metric delivery mechanisms.

  The **web interface** (port 8089) shows real-time charts: RPS, response time, user count, and errors. This is convenient for manual analysis but not suitable for automation. **CSV export** creates files with statistics, response time distribution, and errors -- ideal for CI/CD and history tracking.

  For full-featured monitoring, the best approach is sending Locust metrics to **Prometheus** via the `prometheus_client` library with subsequent visualization in **Grafana**. This enables building dashboards correlating load with server-side metrics.

  ```python
  from locust import HttpUser, task, between, events
  import subprocess
  import os

  class ReportingUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  # CSV export: run Locust in headless mode
  # locust -f locustfile.py --headless \
  #   --users 100 --spawn-rate 10 --run-time 5m \
  #   --csv=results/load_test \
  #   --csv-full-history

  # This creates:
  #   results/load_test_stats.csv          - aggregated stats
  #   results/load_test_stats_history.csv  - stats over time
  #   results/load_test_failures.csv       - error details
  #   results/load_test_exceptions.csv     - Python exceptions

  @events.quitting.add_listener
  def generate_html_report(environment, **kwargs):
      """Generate HTML report from CSV data after test."""
      stats = environment.runner.stats
      print("\n=== LOAD TEST SUMMARY ===")
      print(f"Total requests: {stats.total.num_requests}")
      print(f"Failed requests: {stats.total.num_failures}")
      print(f"Avg response time: {stats.total.avg_response_time:.0f}ms")
      print(f"p95 response time: {stats.total.get_response_time_percentile(0.95):.0f}ms")
      print(f"Requests/s: {stats.total.current_rps:.1f}")
  ```

  For team use, it is recommended to store CSV results in CI/CD artifacts and build performance trends across releases through Grafana dashboards.
section: "performance-testing"
order: 9
tags:
  - locust
  - monitoring
type: "basic"
---
