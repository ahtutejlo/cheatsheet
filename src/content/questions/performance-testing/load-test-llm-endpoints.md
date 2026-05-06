---
ua_question: "Як load-testити LLM-ендпоінти?"
en_question: "How to load test LLM endpoints?"
ua_answer: |
  Load testing LLM API відрізняється від звичайних REST API. Latency зазвичай 1-30 секунд (не мс), bottleneck — це GPU inference або сторонній provider rate limit, response не fixed-size, cost залежить від tokens, а не requests.

  **Що варто вимірювати специфічно для LLM:**

  - **Time to first token (TTFT)** — як швидко модель почала стрімити
  - **Inter-token latency** — час між токенами при streaming
  - **Total response time** — від request до останнього токена
  - **Tokens per second (TPS)** — output throughput
  - **Cost per request** — токени × $/1k tokens
  - **Rate limit hits** — 429 errors per minute
  - **Context utilization** — input tokens / max context

  **Архітектура load test:**

  Звичайний Locust HttpUser працює, але треба адаптувати — особливо для streaming responses.

  ```python
  # locustfile_llm.py
  from locust import HttpUser, task, between, events
  import time, json

  class LLMUser(HttpUser):
      wait_time = between(2, 5)
      host = "https://api.example.com"

      @task
      def chat_completion(self):
          payload = {
              "model": "claude-sonnet-4-6",
              "messages": [{"role": "user", "content": "Explain MongoDB indexes briefly."}],
              "stream": True,
              "max_tokens": 500
          }
          headers = {
              "Authorization": f"Bearer {self.api_key}",
              "Accept": "text/event-stream"
          }

          start = time.time()
          first_token_time = None
          token_count = 0

          with self.client.post(
              "/v1/chat/completions",
              json=payload,
              headers=headers,
              stream=True,
              catch_response=True,
              name="/v1/chat/completions [stream]"
          ) as response:
              for line in response.iter_lines():
                  if not line:
                      continue
                  if first_token_time is None:
                      first_token_time = time.time()
                      ttft_ms = (first_token_time - start) * 1000
                      events.request.fire(
                          request_type="LLM_TTFT",
                          name="time_to_first_token",
                          response_time=ttft_ms,
                          response_length=0,
                          exception=None
                      )

                  if line.startswith(b"data: "):
                      chunk = line[6:]
                      if chunk == b"[DONE]":
                          break
                      try:
                          token_count += 1
                      except Exception:
                          pass

              total_time = (time.time() - start) * 1000
              tps = token_count / ((total_time / 1000) or 1)
              events.request.fire(
                  request_type="LLM_TPS",
                  name="tokens_per_sec",
                  response_time=tps,
                  response_length=token_count,
                  exception=None
              )
              response.success()
  ```

  **Сценарії, які треба покрити:**

  **1. Steady-state load** — sustainable RPS під цільовим SLA. "Чи витримає система 100 RPS з p95 TTFT < 2s протягом 10 хв?"

  **2. Spike test** — раптовий burst (наприклад, viral demo). 0 → 500 RPS за 10 секунд. Часто провокує rate limits на provider, autoscaling lag.

  **3. Cost-stress test** — максимальний context length × max RPS. Перевіряє, чи бюджет protections спрацьовують (token limits per user, rate limits).

  **4. Long-context test** — input близький до 128k tokens. Перформанс деградує сильніше за лінійно.

  **5. Mixed-pattern test** — 80% short prompts (chat), 20% long-context (summarization). Реалістичніше, ніж uniform pattern.

  **Підводні камені:**

  **Rate limits** від provider. OpenAI / Anthropic мають TPM (tokens per minute) і RPM (requests per minute) limits per organization. Якщо ваш load test перевершує — отримаєте 429, і це **не** real bottleneck вашого system. Або use prod-tier API key з більшою quota, або mockайте провайдера для performance testing.

  **GPU contention** at provider — навіть з зарезервованими reserved-capacity, fluctuations latency 2-5× можуть проявитися. Don't assert hard p95 — assert distribution shape.

  **Streaming complications** — latency-based asserts на full response time приховують real UX (TTFT). Завжди separately track TTFT, total time, TPS.

  **Token cost explosion** — 50 workers × 10 RPS × 500 output tokens × 60 хв = ~1.5B tokens. Якщо це OpenAI gpt-4o, це $5K-7K за один прогон. Sandbox API або mock-provider настійно рекомендується.

  **Caching** — багато LLM API мають prompt caching. Якщо ваш test шле 100% identical prompt, ви тестуєте cache, не модель. Use varied prompts.

  **Метрики у Cloud Monitoring custom metric:**
  ```python
  # post-run aggregation
  from google.cloud import monitoring_v3
  client = monitoring_v3.MetricServiceClient()
  # write_time_series("custom.googleapis.com/llm/ttft_p95", value=p95)
  # write_time_series("custom.googleapis.com/llm/tps_avg", value=avg_tps)
  # write_time_series("custom.googleapis.com/llm/cost_usd", value=total_cost)
  ```
en_answer: |
  Load testing an LLM API is different from regular REST. Latency is usually 1-30 seconds (not ms), the bottleneck is GPU inference or a third-party provider rate limit, response is not fixed-size, and cost is by tokens, not requests.

  **LLM-specific metrics worth measuring:**

  - **Time to first token (TTFT)** — how fast streaming begins
  - **Inter-token latency** — time between tokens while streaming
  - **Total response time** — from request to the last token
  - **Tokens per second (TPS)** — output throughput
  - **Cost per request** — tokens × $/1k tokens
  - **Rate limit hits** — 429s per minute
  - **Context utilization** — input tokens / max context

  **Load test architecture:**

  A regular Locust HttpUser works, but it must be adapted — especially for streaming responses.

  ```python
  # locustfile_llm.py
  from locust import HttpUser, task, between, events
  import time, json

  class LLMUser(HttpUser):
      wait_time = between(2, 5)
      host = "https://api.example.com"

      @task
      def chat_completion(self):
          payload = {
              "model": "claude-sonnet-4-6",
              "messages": [{"role": "user", "content": "Explain MongoDB indexes briefly."}],
              "stream": True,
              "max_tokens": 500
          }
          headers = {
              "Authorization": f"Bearer {self.api_key}",
              "Accept": "text/event-stream"
          }

          start = time.time()
          first_token_time = None
          token_count = 0

          with self.client.post(
              "/v1/chat/completions",
              json=payload,
              headers=headers,
              stream=True,
              catch_response=True,
              name="/v1/chat/completions [stream]"
          ) as response:
              for line in response.iter_lines():
                  if not line:
                      continue
                  if first_token_time is None:
                      first_token_time = time.time()
                      ttft_ms = (first_token_time - start) * 1000
                      events.request.fire(
                          request_type="LLM_TTFT",
                          name="time_to_first_token",
                          response_time=ttft_ms,
                          response_length=0,
                          exception=None
                      )

                  if line.startswith(b"data: "):
                      chunk = line[6:]
                      if chunk == b"[DONE]":
                          break
                      try:
                          token_count += 1
                      except Exception:
                          pass

              total_time = (time.time() - start) * 1000
              tps = token_count / ((total_time / 1000) or 1)
              events.request.fire(
                  request_type="LLM_TPS",
                  name="tokens_per_sec",
                  response_time=tps,
                  response_length=token_count,
                  exception=None
              )
              response.success()
  ```

  **Scenarios you must cover:**

  **1. Steady-state load** — sustainable RPS under the target SLA. "Will the system hold 100 RPS with p95 TTFT < 2s for 10 minutes?"

  **2. Spike test** — sudden burst (e.g., viral demo). 0 → 500 RPS in 10 seconds. Often triggers provider rate limits, autoscaling lag.

  **3. Cost-stress test** — maximum context length × max RPS. Validates budget protections (token limits per user, rate limits).

  **4. Long-context test** — input near 128k tokens. Performance degrades worse than linear.

  **5. Mixed-pattern test** — 80% short prompts (chat), 20% long-context (summarization). More realistic than uniform load.

  **Pitfalls:**

  **Provider rate limits.** OpenAI / Anthropic have TPM (tokens per minute) and RPM (requests per minute) per organization. If your load test exceeds them, you get 429s — and that's **not** your system's real bottleneck. Use a prod-tier API key with higher quota or mock the provider for performance testing.

  **GPU contention** at the provider — even with reserved capacity, latency fluctuations of 2-5× can show. Don't assert a hard p95 — assert distribution shape.

  **Streaming complications** — latency asserts on full response time hide the real UX (TTFT). Always track TTFT, total time, and TPS separately.

  **Token cost explosion** — 50 workers × 10 RPS × 500 output tokens × 60 min ≈ 1.5B tokens. On OpenAI gpt-4o that's $5K-7K per run. A sandbox API or mock provider is strongly recommended.

  **Caching** — many LLM APIs implement prompt caching. If your test sends 100% identical prompts, you're testing the cache, not the model. Use varied prompts.

  **Metrics into a Cloud Monitoring custom metric:**
  ```python
  # post-run aggregation
  from google.cloud import monitoring_v3
  client = monitoring_v3.MetricServiceClient()
  # write_time_series("custom.googleapis.com/llm/ttft_p95", value=p95)
  # write_time_series("custom.googleapis.com/llm/tps_avg", value=avg_tps)
  # write_time_series("custom.googleapis.com/llm/cost_usd", value=total_cost)
  ```
section: "performance-testing"
order: 30
tags: [load-testing, llm, locust, performance]
type: "deep"
---
