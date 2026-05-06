---
ua_question: "Prometheus + Grafana: як це працює і що знати інженеру з тест-автоматизації?"
en_question: "Prometheus + Grafana: how it works and what a test automation engineer should know"
ua_answer: |
  Prometheus — pull-based time-series база. Grafana — UI поверх неї (та інших джерел) для дашбордів і алертів. Разом — стандарт індустрії для metrics-based observability.

  **Pull-based** означає: Prometheus сам ходить і скрейпить `/metrics` ендпоінти ваших сервісів кожні N секунд. Сервіс — це **target**, ендпоінт — `/metrics` у форматі OpenMetrics. Це навпаки до push-based систем (StatsD), і має кілька наслідків:
  - Prometheus сам знає, чи "живий" target (фіча up=0)
  - Сервіс не повинен знати куди слати — простіша конфігурація
  - Для short-lived jobs (CI runs) є **Pushgateway** як адаптер

  **Чотири типи метрик:**
  - **Counter** — монотонно зростаючий (requests_total, errors_total)
  - **Gauge** — піднімається і опускається (queue_depth, memory_bytes)
  - **Histogram** — buckets (request_duration_seconds_bucket{le="0.5"}=42)
  - **Summary** — pre-computed quantiles (рідше використовується)

  **PromQL** — мова запитів:

  ```promql
  # request rate за 5 хв
  rate(http_requests_total[5m])

  # 5xx error ratio
  sum(rate(http_requests_total{code=~"5.."}[5m]))
    /
  sum(rate(http_requests_total[5m]))

  # p95 latency з histogram
  histogram_quantile(0.95,
    sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
  )

  # тест pipeline flake rate
  sum(rate(test_results_total{status="flake"}[1h]))
    / sum(rate(test_results_total[1h]))
  ```

  **Інструментація сервісу:**
  ```python
  from prometheus_client import Counter, Histogram, start_http_server

  REQUESTS = Counter("http_requests_total", "Requests", ["method", "code"])
  LATENCY = Histogram("http_request_duration_seconds", "Request latency")

  @LATENCY.time()
  def handle(request):
      REQUESTS.labels(method=request.method, code=200).inc()
      ...

  start_http_server(8000)  # /metrics на :8000
  ```

  **Grafana** додає:
  - Дашборди з PromQL/SQL/Loki queries
  - Alerts (зараз можна і в Prometheus Alertmanager напряму)
  - Anonymous read-only dashboards для поширення

  **Для тестових пайплайнів:**
  - Експортуйте flake rate, test duration p95, queue size як Prometheus metrics — тригерте алерти, коли flake rate >5% або queue depth >100
  - Grafana дашборд "Test Pipeline Health" з трендами на 30 днів — побачите регресії раніше ніж QA лід приходить зі скаргами
en_answer: |
  Prometheus is a pull-based time-series database. Grafana is a UI on top of it (and other sources) for dashboards and alerts. Together they're the industry standard for metrics-based observability.

  **Pull-based** means Prometheus walks out and scrapes the `/metrics` endpoints of your services every N seconds. A service is a **target**; the endpoint is `/metrics` in OpenMetrics format. This is the opposite of push-based systems (StatsD) and has consequences:
  - Prometheus naturally knows whether a target is alive (the up=0 indicator)
  - The service doesn't need to know where to send — simpler config
  - For short-lived jobs (CI runs) use the **Pushgateway** as an adapter

  **Four metric types:**
  - **Counter** — monotonically increasing (requests_total, errors_total)
  - **Gauge** — goes up and down (queue_depth, memory_bytes)
  - **Histogram** — buckets (request_duration_seconds_bucket{le="0.5"}=42)
  - **Summary** — pre-computed quantiles (less used)

  **PromQL** — the query language:

  ```promql
  # request rate over 5 min
  rate(http_requests_total[5m])

  # 5xx error ratio
  sum(rate(http_requests_total{code=~"5.."}[5m]))
    /
  sum(rate(http_requests_total[5m]))

  # p95 latency from histogram
  histogram_quantile(0.95,
    sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
  )

  # test pipeline flake rate
  sum(rate(test_results_total{status="flake"}[1h]))
    / sum(rate(test_results_total[1h]))
  ```

  **Service instrumentation:**
  ```python
  from prometheus_client import Counter, Histogram, start_http_server

  REQUESTS = Counter("http_requests_total", "Requests", ["method", "code"])
  LATENCY = Histogram("http_request_duration_seconds", "Request latency")

  @LATENCY.time()
  def handle(request):
      REQUESTS.labels(method=request.method, code=200).inc()
      ...

  start_http_server(8000)  # /metrics on :8000
  ```

  **Grafana** adds:
  - Dashboards with PromQL/SQL/Loki queries
  - Alerts (also possible in Prometheus Alertmanager directly)
  - Anonymous read-only dashboards for sharing

  **For test pipelines:**
  - Export flake rate, test duration p95, queue size as Prometheus metrics — trigger alerts when flake rate >5% or queue depth >100
  - A Grafana "Test Pipeline Health" dashboard with 30-day trends shows regressions before the QA lead complains
section: "devops"
order: 9
tags: [prometheus, grafana, observability, monitoring]
---
