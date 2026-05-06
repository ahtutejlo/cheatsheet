---
ua_question: "Як скоротити витрати на CI у GCP?"
en_question: "How to reduce CI cost on GCP?"
ua_answer: |
  **Сценарій:** ваш Cloud Build / GitHub Actions self-hosted runners на GCP коштують $4k/міс і ростуть. CFO просить "ну зробіть щось", але ви не хочете ламати pipeline якістю чи швидкістю.

  **Підхід:**
  1. Виміряти, **що саме** дорого (compute, storage, egress, container builds)
  2. Знайти waste (idle, retries, redundant work)
  3. Оптимізувати без зменшення coverage чи швидкості feedback

  **Рішення — checklist:**

  **A. Caching:**
  - Cloud Build: `disk` cache + `images:` для зкеширування layers між білдами
  - Артефакти Docker: pull base image з Artifact Registry в тому ж регіоні (egress free), не з Docker Hub
  - Dependencies: cache `~/.cache/pip`, `node_modules`, Maven/Gradle home

  ```yaml
  # cloudbuild.yaml — кешуємо pip + Docker layers
  steps:
    - name: gcr.io/cloud-builders/docker
      entrypoint: bash
      args: ['-c', 'docker pull $_IMAGE:cache || exit 0']
    - name: gcr.io/cloud-builders/docker
      args: [
        'build',
        '--cache-from=$_IMAGE:cache',
        '--build-arg', 'BUILDKIT_INLINE_CACHE=1',
        '-t', '$_IMAGE:$SHORT_SHA',
        '-t', '$_IMAGE:cache',
        '.'
      ]
  options:
    machineType: E2_HIGHCPU_8  # дешевший за N1
  ```

  **B. Машинний type:**
  - `E2_HIGHCPU_8` дешевший за `N1_HIGHCPU_8` на ~30%
  - `e2-highcpu-32` для масивних паралельних test runs швидший за дешевшу машину *N* разів — рахуйте `total_minutes × $/min`, не лише ставку
  - Для long jobs — Spot/Preemptible runners (self-hosted GitHub runners на GCE Spot)

  **C. Pipeline architecture:**
  - **Path filters** — не запускайте e2e-suite, якщо змінилась тільки `docs/`
  - **Test sharding** — паралелізм скорочує wall time, тож є шанси на cheaper machine + ширшу matrix
  - **Skip duplicates** — `concurrency:` на гілку (GHA) скасовує застарілі runs того ж PR
  - **Required vs nightly** — perf і smoke на PR, повний regression вночі

  **D. Storage / egress:**
  - Зберігайте artefacts у тому ж регіоні, що й runners
  - Видаляйте старі artifacts (lifecycle policy на GCS bucket: delete after 30 days)
  - Test recordings (Playwright traces) — TTL 7 днів, окрім main branch

  **E. Видимість:**
  - Включіть Cloud Billing labels (`team`, `pipeline`, `branch`) щоб побачити, який pipeline жере найбільше
  - Дашборд: cost per merged PR — це КРАЩА метрика, ніж абсолютний spend

  **Реальний результат на середньому Python+Playwright проєкті:** caching + path filters + concurrency дають 40-60% економії; перехід на E2 + Spot — ще 20-30% поверх. Ціль "<$X на merge" реалістична.
en_answer: |
  **Scenario:** your Cloud Build / GitHub Actions self-hosted runners on GCP cost $4k/month and growing. The CFO wants "something done", but you don't want to break pipeline quality or speed.

  **Approach:**
  1. Measure **what exactly** is expensive (compute, storage, egress, container builds)
  2. Find waste (idle, retries, redundant work)
  3. Optimize without sacrificing coverage or feedback speed

  **Solution — checklist:**

  **A. Caching:**
  - Cloud Build: `disk` cache + `images:` to cache layers between builds
  - Docker artifacts: pull base images from Artifact Registry in the same region (egress free), not Docker Hub
  - Dependencies: cache `~/.cache/pip`, `node_modules`, Maven/Gradle home

  ```yaml
  # cloudbuild.yaml — cache pip + Docker layers
  steps:
    - name: gcr.io/cloud-builders/docker
      entrypoint: bash
      args: ['-c', 'docker pull $_IMAGE:cache || exit 0']
    - name: gcr.io/cloud-builders/docker
      args: [
        'build',
        '--cache-from=$_IMAGE:cache',
        '--build-arg', 'BUILDKIT_INLINE_CACHE=1',
        '-t', '$_IMAGE:$SHORT_SHA',
        '-t', '$_IMAGE:cache',
        '.'
      ]
  options:
    machineType: E2_HIGHCPU_8  # cheaper than N1
  ```

  **B. Machine type:**
  - `E2_HIGHCPU_8` is ~30% cheaper than `N1_HIGHCPU_8`
  - `e2-highcpu-32` for massive parallel test runs may finish *N* times faster than a cheaper machine — calculate `total_minutes × $/min`, not just the rate
  - For long jobs — Spot/Preemptible runners (self-hosted GitHub runners on GCE Spot)

  **C. Pipeline architecture:**
  - **Path filters** — don't run the e2e suite when only `docs/` changed
  - **Test sharding** — parallelism shrinks wall time, allowing cheaper machines and wider matrices
  - **Skip duplicates** — `concurrency:` per branch (GHA) cancels stale runs of the same PR
  - **Required vs nightly** — perf and smoke on PR, full regression overnight

  **D. Storage / egress:**
  - Keep artifacts in the same region as runners
  - Delete old artifacts (GCS bucket lifecycle policy: delete after 30 days)
  - Test recordings (Playwright traces): TTL 7 days, except for main branch

  **E. Visibility:**
  - Enable Cloud Billing labels (`team`, `pipeline`, `branch`) to see which pipeline burns the most
  - Dashboard: cost per merged PR — a better metric than absolute spend

  **Real result on a mid-size Python+Playwright project:** caching + path filters + concurrency give 40-60% savings; switching to E2 + Spot adds another 20-30% on top. A "<$X per merge" target is realistic.
section: "devops"
order: 10
tags: [ci-cd, gcp, cost-optimization, cloud-build]
type: "practical"
---
