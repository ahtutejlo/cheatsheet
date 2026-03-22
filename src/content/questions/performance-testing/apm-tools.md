---
ua_question: "Що таке APM-інструменти і як вони пов'язані з навантажувальним тестуванням?"
en_question: "What are APM tools and how do they relate to load testing?"
ua_answer: |
  **APM (Application Performance Monitoring)** -- це інструменти для моніторингу продуктивності додатку в реальному часі: Datadog, New Relic, Dynatrace, Elastic APM. Вони збирають метрики зсередини додатку: час виконання SQL-запитів, використання CPU/RAM, трасування запитів через мікросервіси.

  Навантажувальне тестування та APM -- це дві сторони однієї медалі. **Locust/k6** показують зовнішній вигляд: response time, throughput, error rate з точки зору клієнта. **APM** показує внутрішній стан: який SQL-запит сповільнив відповідь, який мікросервіс став bottleneck, де витік пам'яті.

  Найефективніший підхід -- запускати навантажувальний тест та одночасно спостерігати APM-дашборд. Коли Locust показує зростання p99, APM покаже конкретну причину: N+1 запит, повний connection pool або garbage collection pause.

  ```python
  # Locust test with custom Datadog metrics
  from locust import HttpUser, task, between, events
  from datadog import statsd

  class MonitoredUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def get_products(self):
          with self.client.get("/api/products", catch_response=True) as resp:
              # Send custom metric to Datadog
              statsd.histogram(
                  "loadtest.response_time",
                  resp.elapsed.total_seconds() * 1000,
                  tags=["endpoint:products"]
              )

  @events.request.add_listener
  def on_request(request_type, name, response_time, response_length,
                 exception, **kwargs):
      if exception:
          statsd.increment("loadtest.errors", tags=[f"endpoint:{name}"])
      statsd.gauge("loadtest.response_time_ms", response_time,
                   tags=[f"endpoint:{name}"])
  ```

  APM-інструменти також корисні для **baseline** -- визначення нормальної продуктивності перед навантажувальним тестом. Порівняння APM-метрик "до" та "під час" навантаження допомагає швидко знайти деградацію.
en_answer: |
  **APM (Application Performance Monitoring)** tools monitor application performance in real time: Datadog, New Relic, Dynatrace, Elastic APM. They collect metrics from inside the application: SQL query execution time, CPU/RAM usage, request tracing across microservices.

  Load testing and APM are two sides of the same coin. **Locust/k6** show the external view: response time, throughput, error rate from the client's perspective. **APM** shows the internal state: which SQL query slowed the response, which microservice became the bottleneck, where the memory leak is.

  The most effective approach is to run a load test while simultaneously observing the APM dashboard. When Locust shows p99 growth, APM will reveal the specific cause: an N+1 query, exhausted connection pool, or garbage collection pause.

  ```python
  # Locust test with custom Datadog metrics
  from locust import HttpUser, task, between, events
  from datadog import statsd

  class MonitoredUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def get_products(self):
          with self.client.get("/api/products", catch_response=True) as resp:
              # Send custom metric to Datadog
              statsd.histogram(
                  "loadtest.response_time",
                  resp.elapsed.total_seconds() * 1000,
                  tags=["endpoint:products"]
              )

  @events.request.add_listener
  def on_request(request_type, name, response_time, response_length,
                 exception, **kwargs):
      if exception:
          statsd.increment("loadtest.errors", tags=[f"endpoint:{name}"])
      statsd.gauge("loadtest.response_time_ms", response_time,
                   tags=[f"endpoint:{name}"])
  ```

  APM tools are also useful for **baselining** -- determining normal performance before a load test. Comparing APM metrics "before" and "during" load helps quickly identify degradation.
section: "performance-testing"
order: 13
tags:
  - monitoring
  - tools
type: "basic"
---
