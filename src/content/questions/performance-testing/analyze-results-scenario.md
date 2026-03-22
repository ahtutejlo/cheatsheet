---
ua_question: "Як аналізувати результати навантажувального тесту та знаходити bottleneck?"
en_question: "How to analyze load test results and find the bottleneck?"
ua_answer: |
  **Сценарій:** Навантажувальний тест показав деградацію: при 200 користувачах p95 = 300ms, при 500 -- p95 = 2000ms, при 800 -- помилки timeout. Потрібно знайти причину та запропонувати рішення.

  **Підхід до аналізу:** 1) Визначити точку перегину -- навантаження, при якому метрики почали деградувати. 2) Класифікувати bottleneck (CPU/IO/Memory/Network). 3) Знайти конкретний компонент (SQL-запит, сервіс, connection pool). 4) Запропонувати рішення та перевірити повторним тестом.

  Аналіз починається з кореляції клієнтських метрик (Locust) з серверними (APM/моніторинг). Якщо CPU на 100% -- CPU-bound. Якщо CPU idle, але response time зростає -- IO-bound (database, external API). Якщо RAM зростає лінійно -- memory leak.

  ```python
  # analyze_results.py - Post-test analysis script
  import pandas as pd
  import json

  def analyze_load_test(csv_path):
      """Analyze Locust CSV results to find bottleneck patterns."""
      df = pd.read_csv(csv_path)

      print("=== LOAD TEST ANALYSIS ===\n")

      # 1. Find the inflection point
      print("1. RESPONSE TIME PROGRESSION:")
      for _, row in df.iterrows():
          name = row.get("Name", "")
          avg = row.get("Average Response Time", 0)
          p95 = row.get("95%", 0)
          p99 = row.get("99%", 0)
          fails = row.get("Failure Count", 0)
          print(f"  {name}: avg={avg}ms p95={p95}ms p99={p99}ms failures={fails}")

      # 2. Check for common patterns
      print("\n2. BOTTLENECK PATTERNS:")

      aggregated = df[df["Name"] == "Aggregated"].iloc[0] if "Aggregated" in df["Name"].values else None
      if aggregated is not None:
          avg_rt = aggregated.get("Average Response Time", 0)
          p99_rt = aggregated.get("99%", 0)

          if p99_rt > avg_rt * 10:
              print("  [!] p99 >> average: tail latency issue")
              print("      Likely cause: GC pauses, cold cache, or slow queries")

          fail_count = aggregated.get("Failure Count", 0)
          total = aggregated.get("Request Count", 1)
          error_rate = fail_count / total if total > 0 else 0

          if error_rate > 0.05:
              print(f"  [!] Error rate {error_rate:.1%}: system overloaded")
              print("      Check: connection pool, thread pool, memory")

  def correlate_with_server_metrics(locust_csv, server_metrics_json):
      """Correlate Locust results with server-side metrics."""
      with open(server_metrics_json) as f:
          server = json.load(f)

      print("\n3. SERVER-SIDE CORRELATION:")

      cpu_max = server.get("cpu_max_percent", 0)
      mem_max = server.get("memory_max_percent", 0)
      db_conn_max = server.get("db_connections_max", 0)
      db_conn_limit = server.get("db_connections_limit", 100)

      if cpu_max > 90:
          print(f"  [!] CPU peaked at {cpu_max}% - CPU-bound")
          print("      Fix: optimize code, add caching, scale horizontally")
      elif db_conn_max >= db_conn_limit * 0.9:
          print(f"  [!] DB connections {db_conn_max}/{db_conn_limit} - connection pool exhausted")
          print("      Fix: increase pool size, optimize slow queries, add read replicas")
      elif mem_max > 85:
          print(f"  [!] Memory peaked at {mem_max}% - memory pressure")
          print("      Fix: check for leaks, reduce cache size, scale vertically")
      else:
          print("  Server resources look healthy - check external dependencies")

  if __name__ == "__main__":
      analyze_load_test("results/load_test_stats.csv")
  ```

  **Типові bottleneck та рішення:** 1) Повільний SQL -- додати індекс або переписати запит; 2) Connection pool -- збільшити розмір або оптимізувати час утримання з'єднання; 3) CPU -- кешувати результати або горизонтально масштабувати; 4) Memory leak -- профілювати heap та виправити код; 5) External API -- додати circuit breaker та кеш.
en_answer: |
  **Scenario:** A load test showed degradation: at 200 users p95 = 300ms, at 500 -- p95 = 2000ms, at 800 -- timeout errors. You need to find the cause and propose a solution.

  **Analysis approach:** 1) Identify the inflection point -- the load level where metrics started degrading. 2) Classify the bottleneck (CPU/IO/Memory/Network). 3) Find the specific component (SQL query, service, connection pool). 4) Propose a fix and verify with a retest.

  Analysis starts by correlating client metrics (Locust) with server metrics (APM/monitoring). If CPU is at 100% -- CPU-bound. If CPU is idle but response time grows -- IO-bound (database, external API). If RAM grows linearly -- memory leak.

  ```python
  # analyze_results.py - Post-test analysis script
  import pandas as pd
  import json

  def analyze_load_test(csv_path):
      """Analyze Locust CSV results to find bottleneck patterns."""
      df = pd.read_csv(csv_path)

      print("=== LOAD TEST ANALYSIS ===\n")

      # 1. Find the inflection point
      print("1. RESPONSE TIME PROGRESSION:")
      for _, row in df.iterrows():
          name = row.get("Name", "")
          avg = row.get("Average Response Time", 0)
          p95 = row.get("95%", 0)
          p99 = row.get("99%", 0)
          fails = row.get("Failure Count", 0)
          print(f"  {name}: avg={avg}ms p95={p95}ms p99={p99}ms failures={fails}")

      # 2. Check for common patterns
      print("\n2. BOTTLENECK PATTERNS:")

      aggregated = df[df["Name"] == "Aggregated"].iloc[0] if "Aggregated" in df["Name"].values else None
      if aggregated is not None:
          avg_rt = aggregated.get("Average Response Time", 0)
          p99_rt = aggregated.get("99%", 0)

          if p99_rt > avg_rt * 10:
              print("  [!] p99 >> average: tail latency issue")
              print("      Likely cause: GC pauses, cold cache, or slow queries")

          fail_count = aggregated.get("Failure Count", 0)
          total = aggregated.get("Request Count", 1)
          error_rate = fail_count / total if total > 0 else 0

          if error_rate > 0.05:
              print(f"  [!] Error rate {error_rate:.1%}: system overloaded")
              print("      Check: connection pool, thread pool, memory")

  def correlate_with_server_metrics(locust_csv, server_metrics_json):
      """Correlate Locust results with server-side metrics."""
      with open(server_metrics_json) as f:
          server = json.load(f)

      print("\n3. SERVER-SIDE CORRELATION:")

      cpu_max = server.get("cpu_max_percent", 0)
      mem_max = server.get("memory_max_percent", 0)
      db_conn_max = server.get("db_connections_max", 0)
      db_conn_limit = server.get("db_connections_limit", 100)

      if cpu_max > 90:
          print(f"  [!] CPU peaked at {cpu_max}% - CPU-bound")
          print("      Fix: optimize code, add caching, scale horizontally")
      elif db_conn_max >= db_conn_limit * 0.9:
          print(f"  [!] DB connections {db_conn_max}/{db_conn_limit} - connection pool exhausted")
          print("      Fix: increase pool size, optimize slow queries, add read replicas")
      elif mem_max > 85:
          print(f"  [!] Memory peaked at {mem_max}% - memory pressure")
          print("      Fix: check for leaks, reduce cache size, scale vertically")
      else:
          print("  Server resources look healthy - check external dependencies")

  if __name__ == "__main__":
      analyze_load_test("results/load_test_stats.csv")
  ```

  **Common bottlenecks and solutions:** 1) Slow SQL -- add an index or rewrite the query; 2) Connection pool -- increase the size or optimize connection hold time; 3) CPU -- cache results or scale horizontally; 4) Memory leak -- profile the heap and fix the code; 5) External API -- add a circuit breaker and cache.
section: "performance-testing"
order: 27
tags:
  - analysis
  - metrics
type: "practical"
---
