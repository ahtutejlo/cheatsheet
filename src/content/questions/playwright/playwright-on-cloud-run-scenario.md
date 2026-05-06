---
ua_question: "Як запускати Playwright на Cloud Run / Cloud Build?"
en_question: "How to run Playwright on Cloud Run / Cloud Build?"
ua_answer: |
  **Сценарій:** ваш Playwright suite з 800 тестами зараз бігає 90 хв на GitHub Actions ubuntu-latest. Ціна виросла, потрібен GCP-native запуск з sharding на Cloud Run і артефакти у GCS.

  **Підхід:**
  1. Передзбираний Docker image з Playwright + browsers (не качайте при кожному run)
  2. Cloud Run jobs (НЕ services) для batch test workloads
  3. Sharding через `--shard=N/M`
  4. Artifacts (traces, screenshots) → GCS bucket з TTL

  **Рішення:**

  **Крок 1: Docker image.** Наслідуйте від `mcr.microsoft.com/playwright:v1.51.0-noble` — у ньому вже є browsers і system deps:

  ```dockerfile
  FROM mcr.microsoft.com/playwright/python:v1.51.0-noble

  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt

  COPY . .
  ENV PYTHONUNBUFFERED=1

  CMD ["pytest", "tests/e2e/", "--shard=1/4"]
  ```

  Білдимо в Artifact Registry:
  ```bash
  gcloud builds submit --tag us-docker.pkg.dev/proj/repo/playwright:$SHA
  ```

  **Крок 2: Cloud Run Job (не Service).** Service — для long-running HTTP. Job — для batch workloads, що завершуються:

  ```yaml
  # cloudrun-job.yaml
  apiVersion: run.googleapis.com/v1
  kind: Job
  metadata:
    name: playwright-shard
  spec:
    template:
      spec:
        parallelism: 4   # 4 shards паралельно
        taskCount: 4
        template:
          spec:
            containers:
              - image: us-docker.pkg.dev/proj/repo/playwright:SHA
                env:
                  - name: SHARD_INDEX
                    valueFrom:
                      fieldRef: { fieldPath: "metadata.annotations['run.googleapis.com/task-index']" }
                  - name: SHARD_TOTAL
                    value: "4"
                command: ["bash", "-lc"]
                args:
                  - |
                    pytest tests/e2e/ \
                      --shard=$((SHARD_INDEX+1))/$SHARD_TOTAL \
                      --tracing=retain-on-failure \
                      --output-dir=/tmp/results
                    gsutil -m cp -r /tmp/results gs://test-artifacts/$BUILD_ID/shard-$SHARD_INDEX/
                resources:
                  limits: { cpu: "2", memory: "4Gi" }
            timeoutSeconds: 1800
            maxRetries: 0  # перерuns обходяться flaky-логікою всередині
  ```

  **Крок 3: Тригер з Cloud Build:**
  ```yaml
  # cloudbuild.yaml
  steps:
    - name: gcr.io/cloud-builders/gcloud
      args:
        - run
        - jobs
        - execute
        - playwright-shard
        - --region=us-central1
        - --wait
  ```

  **Крок 4: Збір результатів і репорту:**
  ```python
  # post-process.py
  from google.cloud import storage
  from junitparser import JUnitXml

  client = storage.Client()
  bucket = client.bucket("test-artifacts")
  combined = JUnitXml()
  for blob in bucket.list_blobs(prefix=f"{BUILD_ID}/"):
      if blob.name.endswith(".xml"):
          combined += JUnitXml.fromstring(blob.download_as_string())
  combined.write("combined-results.xml")
  ```

  **Що потрібно врахувати:**
  - **Browser launches під headless Chromium** в контейнері потребують `--no-sandbox` (Docker без user namespace remapping)
  - **Memory** — Chromium + page tabs можуть з'їсти 2Gi легко; виставте 4Gi мінімум
  - **CPU=1 = повільно** — браузер вантажить ядро. CPU=2 — sweet spot
  - **Cloud Run Job timeout 60 хв** на task. Sharding має тримати кожен task під 30 хв
  - **Cold start** — перший shard іноді чекає image pull 10-20 сек. Pre-warm: фейковий run на гарячому Image
  - **Networking** — якщо тестуєте ефемерний preview env, Cloud Run має outbound доступ до нього через VPC connector або direct egress

  **Вартість:** ~$0.40 за 1000 тестів (4 shards × 5 min × 2 vCPU @ $0.024/vCPU·min). У 5-10 разів дешевше за GitHub Actions self-hosted runners.

  **Альтернатива — Selenium Grid на GKE.** Якщо вам потрібні multiple browsers (Chromium + Firefox + WebKit) і custom remote debugging — GKE з Selenoid/Aerokube/Selenium Grid. Cloud Run Jobs підходять для homogeneous Playwright runs.
en_answer: |
  **Scenario:** your 800-test Playwright suite currently takes 90 min on GitHub Actions ubuntu-latest. Cost has grown; you want GCP-native execution with sharding on Cloud Run and artifacts in GCS.

  **Approach:**
  1. Pre-built Docker image with Playwright + browsers (don't download on every run)
  2. Cloud Run **jobs** (not services) for batch test workloads
  3. Sharding via `--shard=N/M`
  4. Artifacts (traces, screenshots) → GCS bucket with TTL

  **Solution:**

  **Step 1: Docker image.** Inherit from `mcr.microsoft.com/playwright:v1.51.0-noble` — it already includes browsers and system deps:

  ```dockerfile
  FROM mcr.microsoft.com/playwright/python:v1.51.0-noble

  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt

  COPY . .
  ENV PYTHONUNBUFFERED=1

  CMD ["pytest", "tests/e2e/", "--shard=1/4"]
  ```

  Build into Artifact Registry:
  ```bash
  gcloud builds submit --tag us-docker.pkg.dev/proj/repo/playwright:$SHA
  ```

  **Step 2: Cloud Run Job (not Service).** Service is for long-running HTTP. Job is for batch workloads that finish:

  ```yaml
  # cloudrun-job.yaml
  apiVersion: run.googleapis.com/v1
  kind: Job
  metadata:
    name: playwright-shard
  spec:
    template:
      spec:
        parallelism: 4   # 4 shards in parallel
        taskCount: 4
        template:
          spec:
            containers:
              - image: us-docker.pkg.dev/proj/repo/playwright:SHA
                env:
                  - name: SHARD_INDEX
                    valueFrom:
                      fieldRef: { fieldPath: "metadata.annotations['run.googleapis.com/task-index']" }
                  - name: SHARD_TOTAL
                    value: "4"
                command: ["bash", "-lc"]
                args:
                  - |
                    pytest tests/e2e/ \
                      --shard=$((SHARD_INDEX+1))/$SHARD_TOTAL \
                      --tracing=retain-on-failure \
                      --output-dir=/tmp/results
                    gsutil -m cp -r /tmp/results gs://test-artifacts/$BUILD_ID/shard-$SHARD_INDEX/
                resources:
                  limits: { cpu: "2", memory: "4Gi" }
            timeoutSeconds: 1800
            maxRetries: 0  # let in-test logic handle flake
  ```

  **Step 3: Trigger from Cloud Build:**
  ```yaml
  # cloudbuild.yaml
  steps:
    - name: gcr.io/cloud-builders/gcloud
      args:
        - run
        - jobs
        - execute
        - playwright-shard
        - --region=us-central1
        - --wait
  ```

  **Step 4: Collect results and report:**
  ```python
  # post-process.py
  from google.cloud import storage
  from junitparser import JUnitXml

  client = storage.Client()
  bucket = client.bucket("test-artifacts")
  combined = JUnitXml()
  for blob in bucket.list_blobs(prefix=f"{BUILD_ID}/"):
      if blob.name.endswith(".xml"):
          combined += JUnitXml.fromstring(blob.download_as_string())
  combined.write("combined-results.xml")
  ```

  **What to keep in mind:**
  - **Headless Chromium browser launches** in containers need `--no-sandbox` (Docker without user namespace remapping)
  - **Memory** — Chromium + page tabs easily consume 2 Gi; set at least 4 Gi
  - **CPU=1 is slow** — the browser hits one core hard. CPU=2 is the sweet spot
  - **Cloud Run Job timeout is 60 min** per task. Sharding should keep each task under 30 min
  - **Cold start** — the first shard sometimes waits 10-20 s for image pull. Pre-warm with a fake run
  - **Networking** — if you test an ephemeral preview env, Cloud Run needs outbound access via a VPC connector or direct egress

  **Cost:** ~$0.40 per 1000 tests (4 shards × 5 min × 2 vCPU @ $0.024/vCPU·min). 5-10× cheaper than GitHub Actions self-hosted runners.

  **Alternative — Selenium Grid on GKE.** If you need multiple browsers (Chromium + Firefox + WebKit) and custom remote debugging — GKE with Selenoid/Aerokube/Selenium Grid. Cloud Run Jobs are best for homogeneous Playwright runs.
section: "playwright"
order: 41
tags: [playwright, cloud-run, gcp, ci-cd]
type: "practical"
---
