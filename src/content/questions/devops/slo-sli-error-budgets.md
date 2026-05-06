---
ua_question: "Що таке SLO, SLI та error budget?"
en_question: "What are SLO, SLI, and error budgets?"
ua_answer: |
  SLI/SLO/error budget — це фреймворк SRE для прийняття інженерних рішень про релізи на основі даних, а не "ну вродe працює".

  **SLI (Service Level Indicator)** — конкретна метрика поведінки системи. Наприклад: "відсоток HTTP-запитів зі статусом < 500 за 28 днів" або "p99 latency у мс". SLI має бути вимірюваним і відображати user experience, а не CPU/RAM.

  **SLO (Service Level Objective)** — цільове значення SLI. "99.9% запитів успішні за rolling 28 днів". Це не SLA (контрактне зобов'язання з юр.відповідальністю) — це внутрішній bar.

  **Error budget** = `1 - SLO`. Якщо SLO 99.9%, то error budget = 0.1% — це 43 хвилини downtime на місяць, які ви можете "витратити" на ризики (релізи, експерименти).

  **Як це використовується:**
  - **Бюджет вичерпано** → freeze релізів, фокус на надійності, post-mortems
  - **Бюджет цілий** → команда продовжує шипити фічі, експериментувати з міграціями
  - **Бюджет regenererates** з часом — старі помилки "відпадають" з 28-day window

  ```yaml
  # Приклад SLO у Sloth (SLO-as-code) для Prometheus
  service: api
  slos:
    - name: availability
      objective: 99.9
      sli:
        events:
          error_query: sum(rate(http_requests_total{job="api",code=~"5.."}[5m]))
          total_query: sum(rate(http_requests_total{job="api"}[5m]))
      alerting:
        page_alert:
          labels: { severity: page }
        ticket_alert:
          labels: { severity: ticket }
  ```

  **Чому це важливо для тестування:** error budget виражений у "% збоїв на проді", тож тестова інфра має реагувати:
  - **Burn-rate alerts** — якщо за 1 годину "спалили" >5% бюджету, паджер дзвонить
  - **Pre-deploy gates** — реліз блокується, якщо за останні 24 год spent >50% бюджету
  - **Post-deploy canary monitoring** — нова версія порівнюється до baseline на тих самих SLI

  **Поширена помилка:** ставити SLO 99.99% "бо приємно". Реалістичний SLO має відповідати реальним вимогам бізнесу — overshooting означає, що ви ніколи не зможете шипити швидко.
en_answer: |
  SLI/SLO/error budgets are the SRE framework for making release decisions from data, not from "looks fine".

  **SLI (Service Level Indicator)** — a specific metric of system behavior. For example: "percentage of HTTP requests with status < 500 over 28 days" or "p99 latency in ms". SLIs must be measurable and reflect user experience, not CPU/RAM.

  **SLO (Service Level Objective)** — the target value for an SLI. "99.9% of requests succeed over a rolling 28 days." This is not an SLA (a contractual obligation with legal teeth) — it's an internal bar.

  **Error budget** = `1 - SLO`. If SLO is 99.9%, error budget = 0.1% — that's 43 minutes of allowable downtime per month, which you can "spend" on risk (releases, experiments).

  **How teams use it:**
  - **Budget exhausted** → release freeze, focus on reliability, post-mortems
  - **Budget intact** → keep shipping features, run migrations
  - **Budget regenerates** as old errors fall out of the rolling 28-day window

  ```yaml
  # Example SLO in Sloth (SLO-as-code) for Prometheus
  service: api
  slos:
    - name: availability
      objective: 99.9
      sli:
        events:
          error_query: sum(rate(http_requests_total{job="api",code=~"5.."}[5m]))
          total_query: sum(rate(http_requests_total{job="api"}[5m]))
      alerting:
        page_alert:
          labels: { severity: page }
        ticket_alert:
          labels: { severity: ticket }
  ```

  **Why this matters for testing:** the error budget is expressed in "% of prod failures", so test infra has to react:
  - **Burn-rate alerts** — if you spent >5% of the budget in 1 hour, page someone
  - **Pre-deploy gates** — block releases when last 24h spent >50% of the budget
  - **Post-deploy canary monitoring** — new version is compared to baseline on the same SLIs

  **Common mistake:** setting SLO at 99.99% "because it sounds nice". A realistic SLO should match actual business requirements — overshooting means you can never ship fast.
section: "devops"
order: 7
tags: [sre, observability, reliability, slo]
---
