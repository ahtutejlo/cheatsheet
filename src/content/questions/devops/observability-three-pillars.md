---
ua_question: "Три стовпи observability: logs, metrics, traces — навіщо кожен?"
en_question: "The three pillars of observability: logs, metrics, traces — why each?"
ua_answer: |
  Observability — це здатність відповідати на питання "чому система веде себе саме так" *без* передбачення цих питань заздалегідь. Три стовпи доповнюють одне одного, кожен має свої сильні сторони.

  **Metrics** — числові часові ряди (counter, gauge, histogram). Дешеві за storage, швидкі для запитів, ідеальні для дашбордів і алертів.
  - Питання: "Скільки 5xx за останню годину? Який p99 latency?"
  - Інструменти: Prometheus, Cloud Monitoring, Datadog
  - Обмеження: low cardinality (не можна логувати userID у label — індекс лопне)

  **Logs** — текстові події, опціонально структуровані (JSON). Глибока деталь на рівні одного запиту, але дорогі за storage і повільні в агрегації.
  - Питання: "Що саме сталося з ось цим конкретним запитом?"
  - Інструменти: Cloud Logging, Loki, Elasticsearch, Splunk
  - Обмеження: high-volume — структуруйте, sampling включайте, інакше bill зросте

  **Traces** — потік виконання одного запиту через всі сервіси, з timing на кожному span. Показують **де** в розподіленій системі час витрачається.
  - Питання: "Чому checkout повільний? Який сервіс гальмує?"
  - Інструменти: Cloud Trace, Jaeger, Tempo, Honeycomb
  - Обмеження: instrumentation потрібна (OpenTelemetry SDK), sampling treba налаштувати

  **Як вони працюють разом:**
  1. **Metrics** показують аномалію (spike у 5xx для `/checkout`)
  2. **Traces** локалізують — `/checkout` повільний через `payment-service`, конкретний RPC
  3. **Logs** того trace_id показують точну помилку

  ```python
  # OpenTelemetry: всі три у Python
  from opentelemetry import trace, metrics
  import structlog

  tracer = trace.get_tracer(__name__)
  meter = metrics.get_meter(__name__)
  log = structlog.get_logger()
  request_counter = meter.create_counter("http.requests")

  def handle_checkout(order_id):
      with tracer.start_as_current_span("checkout") as span:
          span.set_attribute("order.id", order_id)
          request_counter.add(1, {"endpoint": "checkout"})
          try:
              process(order_id)
          except Exception:
              log.error("checkout_failed", order_id=order_id, exc_info=True)
              span.record_exception()
              raise
  ```

  **OpenTelemetry** уніфікує emit — одна SDK вміє metrics + traces + logs з shared context (trace_id), що дає cross-pillar correlation.

  **Для тестової інфраструктури:** ті ж три стовпи на тестових пайплайнах — flake rate як metric, log per test step, distributed trace для e2e з кількома сервісами.
en_answer: |
  Observability is the ability to answer "why is the system behaving this way" *without* predicting those questions in advance. The three pillars complement each other; each has its strengths.

  **Metrics** — numeric time series (counter, gauge, histogram). Cheap to store, fast to query, ideal for dashboards and alerts.
  - Answers: "How many 5xx in the last hour? What's p99 latency?"
  - Tools: Prometheus, Cloud Monitoring, Datadog
  - Limitation: low cardinality (don't put userID in labels — index explodes)

  **Logs** — text events, optionally structured (JSON). Deep per-request detail, but expensive to store and slow to aggregate.
  - Answers: "What exactly happened with this one specific request?"
  - Tools: Cloud Logging, Loki, Elasticsearch, Splunk
  - Limitation: high volume — structure them, enable sampling, otherwise the bill balloons

  **Traces** — execution flow of a single request across all services with timing per span. They show **where** in a distributed system time is spent.
  - Answers: "Why is checkout slow? Which service is the bottleneck?"
  - Tools: Cloud Trace, Jaeger, Tempo, Honeycomb
  - Limitation: instrumentation required (OpenTelemetry SDK); sampling must be tuned

  **How they work together:**
  1. **Metrics** show an anomaly (5xx spike on `/checkout`)
  2. **Traces** localize it — `/checkout` is slow because of `payment-service`, a specific RPC
  3. **Logs** for that trace_id reveal the exact error

  ```python
  # OpenTelemetry: all three in Python
  from opentelemetry import trace, metrics
  import structlog

  tracer = trace.get_tracer(__name__)
  meter = metrics.get_meter(__name__)
  log = structlog.get_logger()
  request_counter = meter.create_counter("http.requests")

  def handle_checkout(order_id):
      with tracer.start_as_current_span("checkout") as span:
          span.set_attribute("order.id", order_id)
          request_counter.add(1, {"endpoint": "checkout"})
          try:
              process(order_id)
          except Exception:
              log.error("checkout_failed", order_id=order_id, exc_info=True)
              span.record_exception()
              raise
  ```

  **OpenTelemetry** unifies emit — one SDK handles metrics + traces + logs with shared context (trace_id), giving cross-pillar correlation.

  **For test infrastructure:** the same three pillars apply to test pipelines — flake rate as a metric, logs per test step, distributed traces for e2e flows across multiple services.
section: "devops"
order: 8
tags: [observability, opentelemetry, monitoring, sre]
---
