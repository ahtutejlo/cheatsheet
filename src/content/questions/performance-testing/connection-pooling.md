---
ua_question: "Як connection pooling та HTTP keep-alive впливають на результати навантажувального тестування?"
en_question: "How do connection pooling and HTTP keep-alive affect load testing results?"
ua_answer: |
  **Connection pooling** -- це механізм повторного використання існуючих TCP-з'єднань замість створення нових для кожного запиту. Без пулу кожен запит проходить повний TCP handshake (3 пакети) + TLS handshake (ще 2-4 пакети для HTTPS), що додає 50-200ms латентності. У навантажувальному тестуванні це критично, бо може стати bottleneck на стороні клієнта.

  **HTTP Keep-Alive** (persistent connections) -- це механізм HTTP/1.1, який зберігає TCP-з'єднання відкритим для кількох запитів. Без keep-alive сервер закриває з'єднання після кожної відповіді. У HTTP/2 мультиплексування дозволяє відправляти кілька запитів через одне з'єднання паралельно.

  Locust за замовчуванням використовує `requests.Session`, який підтримує keep-alive та connection pooling. Це реалістично імітує поведінку браузера. Але важливо розуміти, що розмір пулу з'єднань на сервері (наприклад, Nginx `worker_connections` або Tomcat `maxConnections`) може стати bottleneck під навантаженням.

  ```python
  from locust import HttpUser, task, between
  import urllib3

  class KeepAliveUser(HttpUser):
      wait_time = between(1, 3)

      # Locust uses requests.Session by default (keep-alive enabled)
      # To customize connection pool size:
      def on_start(self):
          adapter = urllib3.util.retry.Retry(total=3, backoff_factor=0.1)
          # Increase pool size for high-concurrency scenarios
          self.client.mount("http://",
              requests_adapters.HTTPAdapter(
                  pool_connections=20,
                  pool_maxsize=50
              ))

      @task
      def api_call(self):
          self.client.get("/api/products")

  class NoKeepAliveUser(HttpUser):
      """Simulate clients without keep-alive (worst case)."""
      wait_time = between(1, 3)

      @task
      def api_call(self):
          # Force new connection per request
          self.client.get("/api/products",
                         headers={"Connection": "close"})
  ```

  При аналізі результатів порівнюйте тести з keep-alive та без нього. Різниця показує, скільки часу витрачається на встановлення з'єднань. Якщо серверний connection pool вичерпано, з'являються помилки `Connection refused` або різке зростання response time -- це сигнал переглянути конфігурацію `max_connections` на сервері або load balancer.
en_answer: |
  **Connection pooling** is a mechanism for reusing existing TCP connections instead of creating new ones for each request. Without a pool, each request goes through a full TCP handshake (3 packets) + TLS handshake (another 2-4 packets for HTTPS), adding 50-200ms of latency. In load testing, this is critical as it can become a client-side bottleneck.

  **HTTP Keep-Alive** (persistent connections) is an HTTP/1.1 mechanism that keeps the TCP connection open for multiple requests. Without keep-alive, the server closes the connection after each response. In HTTP/2, multiplexing allows sending multiple requests through a single connection in parallel.

  Locust uses `requests.Session` by default, which supports keep-alive and connection pooling. This realistically simulates browser behavior. However, it is important to understand that the server-side connection pool size (e.g., Nginx `worker_connections` or Tomcat `maxConnections`) can become a bottleneck under load.

  ```python
  from locust import HttpUser, task, between
  import urllib3

  class KeepAliveUser(HttpUser):
      wait_time = between(1, 3)

      # Locust uses requests.Session by default (keep-alive enabled)
      # To customize connection pool size:
      def on_start(self):
          adapter = urllib3.util.retry.Retry(total=3, backoff_factor=0.1)
          # Increase pool size for high-concurrency scenarios
          self.client.mount("http://",
              requests_adapters.HTTPAdapter(
                  pool_connections=20,
                  pool_maxsize=50
              ))

      @task
      def api_call(self):
          self.client.get("/api/products")

  class NoKeepAliveUser(HttpUser):
      """Simulate clients without keep-alive (worst case)."""
      wait_time = between(1, 3)

      @task
      def api_call(self):
          # Force new connection per request
          self.client.get("/api/products",
                         headers={"Connection": "close"})
  ```

  When analyzing results, compare tests with and without keep-alive. The difference shows how much time is spent establishing connections. If the server connection pool is exhausted, `Connection refused` errors or a sharp response time increase appear -- this signals the need to review `max_connections` configuration on the server or load balancer.
section: "performance-testing"
order: 14
tags:
  - internals
  - networking
type: "deep"
---
