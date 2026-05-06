---
ua_question: "Що таке observability для test pipeline і які метрики важливі?"
en_question: "What's test pipeline observability and which metrics matter?"
ua_answer: |
  Observability на тест-pipeline — це здатність відповісти на питання "чому naш CI повільний / нестабільний / невідповідний", не запускаючи pipeline 50 разів вручну. Те саме фреймворк metrics/logs/traces, що для production, перенесений на CI-інфраструктуру.

  **Чому це важливо для DevOps & Test Automation Engineer:**
  Тест-pipeline — це **продукт** для розробників. Якщо він повільний або flaky, продуктивність всієї команди падає. Observability дає data, які дозволяють робити improvements системно, а не reactive.

  **Базові метрики (KPIs):**

  **1. Pipeline duration** — час від push до результату
  - p50, p95, p99 окремо (середнє ховає хвости)
  - Розбивка по stages (build, unit, integration, e2e)
  - Тренд за 30 днів — реліз сповільнився?

  **2. Flake rate** — % runs, де той самий test упав і потім пройшов на retry
  - Ціль <2% для критичних тестів
  - **Top-flaky tests** — список тестів з найбільшим flake-внеском (Pareto: 5% тестів дають 80% flake)

  **3. Pass rate** — % зелених pipelines, окремо для PR vs main
  - Низький pass rate на main → виявити який stage найчастіше валиться

  **4. Coverage delta** — як змінюється покриття між merges
  - Тренд: чи зростає / падає за 30 днів

  **5. Cost per run / cost per merged PR** — $$ метрика
  - $$ / merged PR — найкраща бізнес-метрика, яка пов'язує CI з value

  **6. Queue time** — час очікування runner'а
  - Якщо queue > 2 min → треба збільшити parallelism / runner pool

  **Як збирати:**

  ```python
  # CI emits metrics через Prometheus pushgateway або Cloud Monitoring
  from prometheus_client import Counter, Histogram, push_to_gateway, CollectorRegistry

  registry = CollectorRegistry()
  TEST_DURATION = Histogram(
      "test_duration_seconds",
      "Test duration",
      ["test_id", "branch", "outcome"],
      registry=registry
  )
  TEST_RESULT = Counter(
      "test_results_total",
      "Test results",
      ["test_id", "outcome"],  # outcome: passed | failed | flaked
      registry=registry
  )

  # У pytest plugin
  def pytest_runtest_logreport(report):
      if report.when == "call":
          TEST_DURATION.labels(test_id=report.nodeid, branch=BRANCH, outcome=report.outcome).observe(report.duration)
          TEST_RESULT.labels(test_id=report.nodeid, outcome=report.outcome).inc()

  def pytest_sessionfinish():
      push_to_gateway("pushgateway:9091", job="ci-tests", registry=registry)
  ```

  **Логи:**
  - Структуровані JSON логи з `trace_id` (correlate з production traces, якщо тест е2е)
  - Сервіси шиплять до Cloud Logging / Loki з GitHub run_id як label
  - **Не логуйте PII / secrets** — у CI це особливо легко зіпсувати

  **Traces:**
  - OpenTelemetry-instrumented тести → Cloud Trace
  - Bachelor-rule: один tested user-action = один trace span tree
  - Корисно щоб бачити "тест гальмує — чому", без gut feeling

  **Дашборд "Test Pipeline Health":**
  - Top 10 longest tests (рекомендація: split or optimize)
  - Top 10 flakiest (фікс або quarantine)
  - 30-day duration trend per branch
  - Cost trend
  - Pass rate розбитий за stage

  **Алерти:**
  - **Flake rate > 5%** на main за останній 24h → page QA lead
  - **p95 duration > 2× baseline** → page DevOps
  - **Cost per merged PR > $X** → notification to engineering manager (не page)
  - **Pipeline broken on main** > 30 хв → page on-call

  **Anti-patterns:**
  - Збирати метрики в Excel, оновлювати руками — нікого не врятує
  - Лише retroactive дашборди без alerts — проблеми ловляться тиждень потім
  - Один runner на все → не видно, що саме гальмує
en_answer: |
  Test-pipeline observability is the ability to answer "why is our CI slow / unstable / inconsistent" without running the pipeline 50 times manually. It's the same metrics/logs/traces framework as for production, applied to CI infrastructure.

  **Why it matters for a DevOps & Test Automation Engineer:**
  The test pipeline is a **product** for developers. If it's slow or flaky, the entire team's productivity drops. Observability provides data that lets you improve systematically instead of reactively.

  **Core metrics (KPIs):**

  **1. Pipeline duration** — time from push to result
  - p50, p95, p99 separately (averages hide tails)
  - Breakdown by stage (build, unit, integration, e2e)
  - 30-day trend — has the release slowed down?

  **2. Flake rate** — % of runs where the same test failed and later passed on retry
  - Target <2% for critical tests
  - **Top-flaky tests** — Pareto: 5% of tests cause 80% of flake

  **3. Pass rate** — % of green pipelines, separate for PR vs main
  - Low pass rate on main → find which stage fails most often

  **4. Coverage delta** — how coverage changes between merges
  - 30-day trend — growing or shrinking?

  **5. Cost per run / cost per merged PR** — the dollar metric
  - $$ / merged PR is the best business metric that ties CI to value

  **6. Queue time** — time waiting for a runner
  - If queue > 2 min → increase parallelism / runner pool

  **How to collect:**

  ```python
  # CI emits metrics via Prometheus Pushgateway or Cloud Monitoring
  from prometheus_client import Counter, Histogram, push_to_gateway, CollectorRegistry

  registry = CollectorRegistry()
  TEST_DURATION = Histogram(
      "test_duration_seconds",
      "Test duration",
      ["test_id", "branch", "outcome"],
      registry=registry
  )
  TEST_RESULT = Counter(
      "test_results_total",
      "Test results",
      ["test_id", "outcome"],  # outcome: passed | failed | flaked
      registry=registry
  )

  # In a pytest plugin
  def pytest_runtest_logreport(report):
      if report.when == "call":
          TEST_DURATION.labels(test_id=report.nodeid, branch=BRANCH, outcome=report.outcome).observe(report.duration)
          TEST_RESULT.labels(test_id=report.nodeid, outcome=report.outcome).inc()

  def pytest_sessionfinish():
      push_to_gateway("pushgateway:9091", job="ci-tests", registry=registry)
  ```

  **Logs:**
  - Structured JSON logs with `trace_id` (correlate with production traces if the test is e2e)
  - Services ship to Cloud Logging / Loki with GitHub run_id as a label
  - **Don't log PII / secrets** — easy to ruin in CI

  **Traces:**
  - OpenTelemetry-instrumented tests → Cloud Trace
  - Rule of thumb: one tested user action = one trace span tree
  - Useful for "this test is slow — why" without guessing

  **"Test Pipeline Health" dashboard:**
  - Top 10 longest tests (recommendation: split or optimize)
  - Top 10 flakiest (fix or quarantine)
  - 30-day duration trend per branch
  - Cost trend
  - Pass rate broken down by stage

  **Alerts:**
  - **Flake rate > 5%** on main over 24h → page QA lead
  - **p95 duration > 2× baseline** → page DevOps
  - **Cost per merged PR > $X** → notify engineering manager (not page)
  - **Pipeline broken on main** > 30 min → page on-call

  **Anti-patterns:**
  - Tracking metrics in Excel, updating by hand — won't save anyone
  - Only retroactive dashboards with no alerts — problems caught a week later
  - One runner for everything → no visibility into what slows it down
section: "automation-qa"
order: 23
tags: [observability, test-infrastructure, metrics, ci-cd]
---
