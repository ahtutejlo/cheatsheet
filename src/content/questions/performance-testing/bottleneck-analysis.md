---
ua_question: "Як проводити аналіз вузьких місць: CPU/IO/memory-bound та USE-методологія?"
en_question: "How to perform bottleneck analysis: CPU/IO/memory-bound and USE methodology?"
ua_answer: |
  **Bottleneck analysis** -- це процес визначення, який ресурс обмежує продуктивність системи. Три основні типи bottleneck: **CPU-bound** (процесор завантажений на 100%, наприклад, складні обчислення або JSON serialization), **IO-bound** (система чекає на диск або мережу -- повільні SQL-запити, зовнішні API), **Memory-bound** (недостатньо RAM, swapping на диск, або GC паузи через заповнений heap).

  **USE-методологія** (Brendan Gregg) -- систематичний підхід до аналізу кожного ресурсу за трьома параметрами: **Utilization** (відсоток використання), **Saturation** (довжина черги очікування), **Errors** (кількість помилок). Перевіряються: CPU, RAM, Disk I/O, Network I/O, з'єднання до БД, thread pool.

  Типовий сценарій: Locust показує зростання p99, але CPU на сервері лише 30%. Перевіряємо IO -- диск idle, мережа в нормі. Перевіряємо connection pool до PostgreSQL -- saturation 100%, черга з 200 запитів. Bottleneck знайдено: потрібно збільшити `max_connections` або оптимізувати SQL.

  ```python
  # Locust test + server monitoring script
  from locust import HttpUser, task, between, events
  import subprocess
  import json

  class BottleneckUser(HttpUser):
      wait_time = between(1, 3)

      @task(3)
      def read_heavy(self):
          """IO-bound: database read."""
          self.client.get("/api/products?limit=100")

      @task(1)
      def compute_heavy(self):
          """CPU-bound: report generation."""
          self.client.get("/api/reports/summary")

      @task(2)
      def memory_heavy(self):
          """Memory-bound: large data export."""
          self.client.get("/api/export/products?format=json")

  # USE methodology checklist as code:
  # Run these commands on the server during load test
  USE_COMMANDS = {
      "cpu_utilization": "mpstat 1 1",
      "cpu_saturation": "vmstat 1 1",          # check 'r' column (run queue)
      "memory_utilization": "free -m",
      "memory_saturation": "vmstat 1 1",        # check 'si/so' (swap)
      "disk_utilization": "iostat -x 1 1",      # check '%util'
      "disk_saturation": "iostat -x 1 1",       # check 'avgqu-sz'
      "network_utilization": "sar -n DEV 1 1",
      "network_errors": "netstat -s | grep -i error",
      "db_connections": "SELECT count(*) FROM pg_stat_activity;",
  }

  @events.test_start.add_listener
  def print_use_checklist(environment, **kwargs):
      print("\n=== USE METHODOLOGY CHECKLIST ===")
      print("Monitor these during the test:")
      for resource, cmd in USE_COMMANDS.items():
          print(f"  {resource}: {cmd}")
  ```

  Ключовий інсайт: bottleneck завжди десь існує (закон Amdahl). Мета -- знайти його та визначити, чи є він прийнятним для бізнесу. Після усунення одного bottleneck наступний ресурс стає новим обмеженням.
en_answer: |
  **Bottleneck analysis** is the process of determining which resource limits system performance. Three main bottleneck types: **CPU-bound** (processor at 100%, e.g., complex calculations or JSON serialization), **IO-bound** (system waiting on disk or network -- slow SQL queries, external APIs), **Memory-bound** (insufficient RAM, swapping to disk, or GC pauses from a full heap).

  The **USE methodology** (Brendan Gregg) is a systematic approach to analyzing each resource by three parameters: **Utilization** (percentage in use), **Saturation** (queue length), **Errors** (error count). Resources checked: CPU, RAM, Disk I/O, Network I/O, database connections, thread pool.

  Typical scenario: Locust shows growing p99, but server CPU is only at 30%. Check IO -- disk idle, network normal. Check PostgreSQL connection pool -- saturation 100%, queue of 200 requests. Bottleneck found: need to increase `max_connections` or optimize SQL.

  ```python
  # Locust test + server monitoring script
  from locust import HttpUser, task, between, events
  import subprocess
  import json

  class BottleneckUser(HttpUser):
      wait_time = between(1, 3)

      @task(3)
      def read_heavy(self):
          """IO-bound: database read."""
          self.client.get("/api/products?limit=100")

      @task(1)
      def compute_heavy(self):
          """CPU-bound: report generation."""
          self.client.get("/api/reports/summary")

      @task(2)
      def memory_heavy(self):
          """Memory-bound: large data export."""
          self.client.get("/api/export/products?format=json")

  # USE methodology checklist as code:
  # Run these commands on the server during load test
  USE_COMMANDS = {
      "cpu_utilization": "mpstat 1 1",
      "cpu_saturation": "vmstat 1 1",          # check 'r' column (run queue)
      "memory_utilization": "free -m",
      "memory_saturation": "vmstat 1 1",        # check 'si/so' (swap)
      "disk_utilization": "iostat -x 1 1",      # check '%util'
      "disk_saturation": "iostat -x 1 1",       # check 'avgqu-sz'
      "network_utilization": "sar -n DEV 1 1",
      "network_errors": "netstat -s | grep -i error",
      "db_connections": "SELECT count(*) FROM pg_stat_activity;",
  }

  @events.test_start.add_listener
  def print_use_checklist(environment, **kwargs):
      print("\n=== USE METHODOLOGY CHECKLIST ===")
      print("Monitor these during the test:")
      for resource, cmd in USE_COMMANDS.items():
          print(f"  {resource}: {cmd}")
  ```

  A key insight: a bottleneck always exists somewhere (Amdahl's Law). The goal is to find it and determine whether it is acceptable for the business. After eliminating one bottleneck, the next resource becomes the new limitation.
section: "performance-testing"
order: 17
tags:
  - analysis
  - monitoring
type: "deep"
---
