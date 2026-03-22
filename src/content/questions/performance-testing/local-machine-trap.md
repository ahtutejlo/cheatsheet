---
ua_question: "Чому запуск навантажувального тесту з локальної машини дає хибні результати?"
en_question: "Why does running a load test from a local machine give misleading results?"
ua_answer: |
  > **Trap:** "Я запустив Locust на своєму ноутбуці і отримав 500 RPS -- сервер повільний." Локальна машина як генератор навантаження створює кілька серйозних проблем.

  **Client-side bottleneck:** ваш ноутбук може бути слабшим ланкою. CPU на 100% через gevent, вичерпані file descriptors, обмежена пропускна здатність Wi-Fi -- все це обмежує генерацію навантаження, а не сервер. Ви тестуєте свій ноутбук, а не сервер.

  **Відсутність мережевої латентності:** при локальному тестуванні (localhost або LAN) мережева затримка < 1ms. У продакшені користувачі мають 50-200ms латентності. Це кардинально змінює concurrency та поведінку connection pool. Тест на localhost з response time 5ms і throughput 2000 RPS може перетворитися на response time 200ms і throughput 100 RPS у реальній мережі.

  **Спільні ресурси:** якщо сервер і клієнт на одній машині (Docker Compose), вони конкурують за CPU та RAM. Locust споживає ресурси, залишаючи менше для сервера.

  ```python
  from locust import HttpUser, task, between, events
  import platform
  import psutil

  class ProductionLikeUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  @events.test_start.add_listener
  def check_client_resources(environment, **kwargs):
      """Warn if client machine might be the bottleneck."""
      cpu_count = psutil.cpu_count()
      ram_gb = psutil.virtual_memory().total / (1024**3)
      print(f"\n=== CLIENT MACHINE CHECK ===")
      print(f"CPU cores: {cpu_count}")
      print(f"RAM: {ram_gb:.1f} GB")
      print(f"Platform: {platform.system()}")

      if cpu_count < 4:
          print("WARNING: < 4 CPU cores - client may bottleneck!")
      if ram_gb < 8:
          print("WARNING: < 8 GB RAM - client may bottleneck!")

  @events.request.add_listener
  def check_client_cpu(request_type, name, response_time, **kwargs):
      cpu_percent = psutil.cpu_percent()
      if cpu_percent > 80:
          print(f"WARNING: Client CPU at {cpu_percent}% - "
                f"results unreliable! Use distributed mode.")

  # CORRECT approach: run load generators close to the server
  # Option 1: Same cloud region, different machine
  # locust -f locustfile.py --master --host http://app-server:8080

  # Option 2: Kubernetes pod in same cluster
  # kubectl apply -f locust-deployment.yaml

  # Option 3: CI/CD runner in same network
  # (see ci-cd-gates-scenario.md)
  ```

  Правило: генератор навантаження повинен бути в тій самій мережі (або регіоні), що й сервер, але на окремій машині. Для серйозних тестів використовуйте виділені сервери з достатніми ресурсами та моніторингом CPU/RAM клієнтської машини.
en_answer: |
  > **Trap:** "I ran Locust on my laptop and got 500 RPS -- the server is slow." Using a local machine as a load generator creates several serious problems.

  **Client-side bottleneck:** your laptop may be the weak link. CPU at 100% due to gevent, exhausted file descriptors, limited Wi-Fi bandwidth -- all of this limits load generation, not the server. You are testing your laptop, not the server.

  **Missing network latency:** with local testing (localhost or LAN), network latency is < 1ms. In production, users have 50-200ms latency. This fundamentally changes concurrency and connection pool behavior. A localhost test with 5ms response time and 2000 RPS throughput can turn into 200ms response time and 100 RPS in a real network.

  **Shared resources:** if the server and client are on the same machine (Docker Compose), they compete for CPU and RAM. Locust consumes resources, leaving less for the server.

  ```python
  from locust import HttpUser, task, between, events
  import platform
  import psutil

  class ProductionLikeUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")

  @events.test_start.add_listener
  def check_client_resources(environment, **kwargs):
      """Warn if client machine might be the bottleneck."""
      cpu_count = psutil.cpu_count()
      ram_gb = psutil.virtual_memory().total / (1024**3)
      print(f"\n=== CLIENT MACHINE CHECK ===")
      print(f"CPU cores: {cpu_count}")
      print(f"RAM: {ram_gb:.1f} GB")
      print(f"Platform: {platform.system()}")

      if cpu_count < 4:
          print("WARNING: < 4 CPU cores - client may bottleneck!")
      if ram_gb < 8:
          print("WARNING: < 8 GB RAM - client may bottleneck!")

  @events.request.add_listener
  def check_client_cpu(request_type, name, response_time, **kwargs):
      cpu_percent = psutil.cpu_percent()
      if cpu_percent > 80:
          print(f"WARNING: Client CPU at {cpu_percent}% - "
                f"results unreliable! Use distributed mode.")

  # CORRECT approach: run load generators close to the server
  # Option 1: Same cloud region, different machine
  # locust -f locustfile.py --master --host http://app-server:8080

  # Option 2: Kubernetes pod in same cluster
  # kubectl apply -f locust-deployment.yaml

  # Option 3: CI/CD runner in same network
  # (see ci-cd-gates-scenario.md)
  ```

  Rule: the load generator should be in the same network (or region) as the server, but on a separate machine. For serious tests, use dedicated servers with sufficient resources and monitor the client machine's CPU/RAM.
section: "performance-testing"
order: 22
tags:
  - infrastructure
  - gotchas
type: "trick"
---
