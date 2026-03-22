---
ua_question: "Як побудувати моніторинг-пайплайн Locust + Prometheus + Grafana?"
en_question: "How to build a monitoring pipeline with Locust + Prometheus + Grafana?"
ua_answer: |
  **Сценарій:** Команда потребує real-time дашборд з метриками навантажувального тесту, корельованими з серверними метриками. Locust web UI обмежений, потрібна інтеграція з Prometheus та Grafana.

  **Підхід:** Locust експортує метрики через `prometheus_client` на HTTP endpoint, Prometheus scrape-ить цей endpoint, Grafana візуалізує дані поряд з серверними метриками (CPU, RAM, DB connections).

  Ключова перевага: на одному дашборді видно і клієнтські метрики (response time, RPS, errors) і серверні (CPU utilization, DB query time, queue depth). Це дозволяє миттєво корелювати зростання p99 з конкретним серверним bottleneck.

  ```python
  # locustfile_with_prometheus.py
  from locust import HttpUser, task, between, events
  from prometheus_client import start_http_server, Counter, Histogram, Gauge
  import time

  # Prometheus metrics
  REQUEST_COUNT = Counter(
      "locust_requests_total",
      "Total requests",
      ["method", "endpoint", "status"]
  )
  REQUEST_LATENCY = Histogram(
      "locust_request_duration_seconds",
      "Request latency",
      ["method", "endpoint"],
      buckets=[0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
  )
  USER_COUNT = Gauge(
      "locust_users_active",
      "Number of active virtual users"
  )

  @events.init.add_listener
  def on_locust_init(environment, **kwargs):
      """Start Prometheus metrics server on port 9646."""
      start_http_server(9646)

  @events.request.add_listener
  def on_request(request_type, name, response_time, response_length,
                 exception, **kwargs):
      status = "error" if exception else "success"
      REQUEST_COUNT.labels(
          method=request_type, endpoint=name, status=status
      ).inc()
      REQUEST_LATENCY.labels(
          method=request_type, endpoint=name
      ).observe(response_time / 1000)  # ms to seconds

  @events.spawning_complete.add_listener
  def on_spawning_complete(user_count, **kwargs):
      USER_COUNT.set(user_count)

  class MonitoredUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")
  ```

  ```yaml
  # prometheus.yml
  global:
    scrape_interval: 5s

  scrape_configs:
    - job_name: "locust"
      static_configs:
        - targets: ["locust-master:9646"]

    - job_name: "app-server"
      static_configs:
        - targets: ["app-server:9090"]

    - job_name: "postgres"
      static_configs:
        - targets: ["postgres-exporter:9187"]
  ```

  ```yaml
  # docker-compose.yml - full monitoring stack
  version: "3"
  services:
    prometheus:
      image: prom/prometheus
      ports: ["9090:9090"]
      volumes:
        - ./prometheus.yml:/etc/prometheus/prometheus.yml

    grafana:
      image: grafana/grafana
      ports: ["3000:3000"]
      environment:
        - GF_SECURITY_ADMIN_PASSWORD=admin

    locust-master:
      image: locustio/locust
      ports: ["8089:8089", "9646:9646"]
      volumes:
        - ./locustfile_with_prometheus.py:/mnt/locust/locustfile.py
      command: -f /mnt/locust/locustfile.py --master
  ```

  Grafana дашборд включає панелі: RPS (total та per-endpoint), Response Time Percentiles (p50/p95/p99), Error Rate, Active Users, а також серверні метрики: CPU, Memory, DB Connections, Disk I/O. Кореляція цих графіків дає повну картину продуктивності.
en_answer: |
  **Scenario:** The team needs a real-time dashboard with load test metrics correlated with server metrics. The Locust web UI is limited; integration with Prometheus and Grafana is needed.

  **Approach:** Locust exports metrics via `prometheus_client` on an HTTP endpoint, Prometheus scrapes this endpoint, and Grafana visualizes the data alongside server metrics (CPU, RAM, DB connections).

  Key advantage: one dashboard shows both client metrics (response time, RPS, errors) and server metrics (CPU utilization, DB query time, queue depth). This enables instant correlation of p99 growth with a specific server bottleneck.

  ```python
  # locustfile_with_prometheus.py
  from locust import HttpUser, task, between, events
  from prometheus_client import start_http_server, Counter, Histogram, Gauge
  import time

  # Prometheus metrics
  REQUEST_COUNT = Counter(
      "locust_requests_total",
      "Total requests",
      ["method", "endpoint", "status"]
  )
  REQUEST_LATENCY = Histogram(
      "locust_request_duration_seconds",
      "Request latency",
      ["method", "endpoint"],
      buckets=[0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
  )
  USER_COUNT = Gauge(
      "locust_users_active",
      "Number of active virtual users"
  )

  @events.init.add_listener
  def on_locust_init(environment, **kwargs):
      """Start Prometheus metrics server on port 9646."""
      start_http_server(9646)

  @events.request.add_listener
  def on_request(request_type, name, response_time, response_length,
                 exception, **kwargs):
      status = "error" if exception else "success"
      REQUEST_COUNT.labels(
          method=request_type, endpoint=name, status=status
      ).inc()
      REQUEST_LATENCY.labels(
          method=request_type, endpoint=name
      ).observe(response_time / 1000)  # ms to seconds

  @events.spawning_complete.add_listener
  def on_spawning_complete(user_count, **kwargs):
      USER_COUNT.set(user_count)

  class MonitoredUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")
  ```

  ```yaml
  # prometheus.yml
  global:
    scrape_interval: 5s

  scrape_configs:
    - job_name: "locust"
      static_configs:
        - targets: ["locust-master:9646"]

    - job_name: "app-server"
      static_configs:
        - targets: ["app-server:9090"]

    - job_name: "postgres"
      static_configs:
        - targets: ["postgres-exporter:9187"]
  ```

  ```yaml
  # docker-compose.yml - full monitoring stack
  version: "3"
  services:
    prometheus:
      image: prom/prometheus
      ports: ["9090:9090"]
      volumes:
        - ./prometheus.yml:/etc/prometheus/prometheus.yml

    grafana:
      image: grafana/grafana
      ports: ["3000:3000"]
      environment:
        - GF_SECURITY_ADMIN_PASSWORD=admin

    locust-master:
      image: locustio/locust
      ports: ["8089:8089", "9646:9646"]
      volumes:
        - ./locustfile_with_prometheus.py:/mnt/locust/locustfile.py
      command: -f /mnt/locust/locustfile.py --master
  ```

  The Grafana dashboard includes panels for: RPS (total and per-endpoint), Response Time Percentiles (p50/p95/p99), Error Rate, Active Users, plus server metrics: CPU, Memory, DB Connections, Disk I/O. Correlating these graphs provides a complete performance picture.
section: "performance-testing"
order: 26
tags:
  - monitoring
  - infrastructure
type: "practical"
---
