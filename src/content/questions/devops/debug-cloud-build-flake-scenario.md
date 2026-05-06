---
ua_question: "Як дебажити флак, який падає тільки в Cloud Build?"
en_question: "How to debug a flake that only fails in Cloud Build?"
ua_answer: |
  **Сценарій:** інтеграційний тест зелений локально і в GitHub Actions, але падає 1 з 4 разів у Cloud Build. Команда вже двічі додавала `pytest --rerun-failures=2` — flake затихає, але по факту в проді є race condition.

  **Підхід:**
  1. Не маскувати, а ізолювати різницю середовищ
  2. Зібрати повний artifact (logs, traces, system info) при падінні
  3. Відтворити локально, тоді чинити

  **Рішення:**

  **Крок 1 — diff середовищ.** Cloud Build runs all но containerized, зазвичай на GCE worker VM. Локально тест бігає на macOS/Linux dev. Що відрізняється:
  - **CPU/memory** — Cloud Build за замовчуванням E2_MEDIUM (1vCPU, 4GB), локально 8 cores
  - **Network latency** — у Cloud Build тести б'ють у Cloud SQL у тому ж регіоні (5-15ms), локально часто proxy через IAP (50-100ms)
  - **Filesystem** — Cloud Build робочий каталог `/workspace`, перемонтований; деякі CI кешують `~`
  - **Time precision** — на повільнішому CPU `time.time()` тіки рідше → race у "wait 0.1s then check"

  **Крок 2 — повний дамп при падінні.** Збирайте все, навіть коли тест зелений:

  ```yaml
  # cloudbuild.yaml
  steps:
    - name: python:3.12
      entrypoint: bash
      args:
        - -c
        - |
          set -e
          mkdir -p /workspace/diag
          # System info
          uname -a > /workspace/diag/sys.txt
          free -m >> /workspace/diag/sys.txt
          nproc >> /workspace/diag/sys.txt
          # Run tests
          pytest --tb=long -v \
            --junitxml=/workspace/diag/junit.xml \
            -o log_cli=true \
            -o log_cli_level=DEBUG \
            -o log_file=/workspace/diag/pytest.log
        # On failure, capture extras
    - name: gcr.io/cloud-builders/gsutil
      entrypoint: bash
      args: ['-c', 'gsutil -m cp -r /workspace/diag gs://test-artifacts/$BUILD_ID/']
      # always run this step:
      waitFor: ['-']
  ```

  **Крок 3 — локально відтворити умови.** Запустіть той самий контейнер з тими самими CPU limits:

  ```bash
  docker run --rm -it \
    --cpus=1 --memory=4g \
    -v $(pwd):/workspace -w /workspace \
    python:3.12 bash -c "pip install -e . && pytest test_flaky.py -v"
  ```

  **Часті причини flake саме в Cloud Build:**
  - **Implicit timeouts** — `time.sleep(0.5)` не вистачає на 1vCPU machine. Замініть на explicit polling з retry.
  - **Concurrency** — pytest-xdist стартує `N=cpu_count` workers, у Cloud Build це 1 → повільніше → race condition не висвічується. Зафіксуйте `-n 4` всюди.
  - **DNS / IAM warmup** — перший запит до Cloud SQL з Cloud Build може взяти 3-5s через IAM cache miss. Зробіть warmup-запит у setUp.
  - **Cloud Logging eventual consistency** — тест "logs were written" іноді читає лог раніше за flush. Чекайте з retry, не з sleep.

  **Не робіть:** просто `flaky-marker` + retry. Це ховає bug і додає шуму у CI.
en_answer: |
  **Scenario:** an integration test passes locally and in GitHub Actions but fails 1 in 4 runs in Cloud Build. The team has already added `pytest --rerun-failures=2` twice — the flake quiets down, but the underlying race condition is still live in prod.

  **Approach:**
  1. Don't mask — isolate the environment difference
  2. Collect a full artifact bundle (logs, traces, system info) on failure
  3. Reproduce locally, then fix

  **Solution:**

  **Step 1 — diff the environments.** Cloud Build runs are containerized, usually on a GCE worker VM. Locally the test runs on macOS/Linux dev. What differs:
  - **CPU/memory** — Cloud Build defaults to E2_MEDIUM (1 vCPU, 4 GB); locally you have 8 cores
  - **Network latency** — Cloud Build tests hit Cloud SQL in the same region (5-15 ms), locally often via IAP proxy (50-100 ms)
  - **Filesystem** — Cloud Build's `/workspace` is remounted; some CIs cache `~`
  - **Time precision** — on a slower CPU `time.time()` ticks less often → race in "wait 0.1 s then check"

  **Step 2 — full dump on failure.** Collect everything, even when the test passes:

  ```yaml
  # cloudbuild.yaml
  steps:
    - name: python:3.12
      entrypoint: bash
      args:
        - -c
        - |
          set -e
          mkdir -p /workspace/diag
          # System info
          uname -a > /workspace/diag/sys.txt
          free -m >> /workspace/diag/sys.txt
          nproc >> /workspace/diag/sys.txt
          # Run tests
          pytest --tb=long -v \
            --junitxml=/workspace/diag/junit.xml \
            -o log_cli=true \
            -o log_cli_level=DEBUG \
            -o log_file=/workspace/diag/pytest.log
    - name: gcr.io/cloud-builders/gsutil
      entrypoint: bash
      args: ['-c', 'gsutil -m cp -r /workspace/diag gs://test-artifacts/$BUILD_ID/']
      waitFor: ['-']  # always run
  ```

  **Step 3 — reproduce locally.** Run the same container with the same CPU limits:

  ```bash
  docker run --rm -it \
    --cpus=1 --memory=4g \
    -v $(pwd):/workspace -w /workspace \
    python:3.12 bash -c "pip install -e . && pytest test_flaky.py -v"
  ```

  **Common Cloud-Build-specific flake causes:**
  - **Implicit timeouts** — `time.sleep(0.5)` isn't enough on a 1 vCPU machine. Replace with explicit polling + retry.
  - **Concurrency** — pytest-xdist spins up `N=cpu_count` workers; in Cloud Build that's 1, so the race condition stays hidden. Pin `-n 4` everywhere.
  - **DNS / IAM warmup** — the first Cloud SQL request from Cloud Build can take 3-5 s due to an IAM cache miss. Do a warmup request in setup.
  - **Cloud Logging eventual consistency** — a "logs were written" test sometimes reads the log before the flush. Wait with retry, not sleep.

  **Don't:** just slap `flaky-marker` + retry. That hides the bug and adds noise to CI.
section: "devops"
order: 11
tags: [debugging, ci-cd, cloud-build, flake]
type: "practical"
---
