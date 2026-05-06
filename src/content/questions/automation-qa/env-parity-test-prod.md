---
ua_question: "Як забезпечити environment parity між test і prod?"
en_question: "How to ensure environment parity between test and prod?"
ua_answer: |
  Environment parity — наскільки тестове середовище схоже на production. Низька parity означає "passed in test, failed in prod". Висока parity — дорожче, але catches regressions раніше.

  **Дванадцять-фактор каже:** dev/stage/prod мають бути якомога ближчі за infrastructure, dependencies, configuration. На практиці абсолютної parity не буває — вибирайте, де компроміс прийнятний.

  **Що варто тримати identical:**

  **1. Container images.** Той самий Dockerfile, той самий tag pipeline'у білдить, тестує і деплоїть. Не "test image" і окремо "prod image" з двох різних `Dockerfile`.

  **2. Database engine version.** Postgres 15 в prod = Postgres 15 в test. Не Postgres 13 в test "бо швидше".

  **3. Schema і migrations.** Тестова БД мусить бути на тій самій schema version, що prod (з включеними pending migrations PR'у).

  **4. Cloud platform.** GCP test → GCP prod. Не "test на minikube → prod на GKE" — minikube не має CNI, networking quirks різні.

  **5. Service mesh / sidecars.** Якщо prod має Istio, test теж має. Інакше mTLS-related issues не помічаються.

  **6. Resource limits.** Test pods з 4Gi RAM, prod з 1Gi → OOM-кільери срабатують лише в prod.

  **Що можна свідомо різнити (і чому):**

  **1. Scale.** Test з 1 replica, prod з 20. Це нормально, але треба тестувати **resource constraints** на одному node, а не "багато ресурсів".

  **2. Data volume.** Prod має 100M users, test — 1k. Окремий **performance/scale test environment** з продакшн-розмірним dataset (анонімізованим) — рішення.

  **3. Third-party APIs.** Stripe live → Stripe test mode, SendGrid → mock. Ризик: різна поведінка під помилки. Рішення: mock з contract tests, periodic real-API tests на staging.

  **4. Secrets.** Production secrets не повинні bути в test. Окремі secret values, але **той самий механізм доступу** (Workload Identity, не "файлик у Docker image").

  **Як вимірювати parity:**

  ```python
  # parity-checks.py — порівнюємо infra
  def check_image_versions():
      test_image = get_cloud_run_image("test")
      prod_image = get_cloud_run_image("prod")
      # після деплоя test має дорівнювати тому, що йде в prod
      assert test_image.split(":")[0] == prod_image.split(":")[0]

  def check_db_engine():
      assert query("SELECT version()", "test") == query("SELECT version()", "prod")

  def check_resource_limits():
      test_limits = get_pod_limits("test")
      prod_limits = get_pod_limits("prod")
      assert test_limits["cpu"] / prod_limits["cpu"] >= 0.5  # not <50% diff
  ```

  **Поширені root causes "passed in test, failed in prod":**
  1. Різні TLS configurations (managed cert vs self-signed)
  2. Latency tolerance (тест 5ms, prod 100ms через cross-region)
  3. Memory pressure (тест 4Gi, prod 512Mi → garbage collector behaviour)
  4. Concurrency (тест 1 user, prod 1000 → race conditions)
  5. Data shape (тест dataset clean, prod має edge cases)

  **Підхід "production parity by IaC":** test і prod описуються одним і тим самим Terraform-кодом, а різні лише `var.environment` і scale parameters. Це **structural parity** — guarantees, що нема "test-only" code paths.
en_answer: |
  Environment parity is how closely the test environment resembles production. Low parity means "passed in test, failed in prod". High parity is more expensive but catches regressions earlier.

  **Twelve-Factor says:** dev/stage/prod should be as close as possible in infrastructure, dependencies, configuration. In practice, absolute parity isn't possible — choose where compromises are acceptable.

  **What to keep identical:**

  **1. Container images.** Same Dockerfile, same tag — the pipeline builds, tests, and deploys it. Not a "test image" and a "prod image" from two different `Dockerfiles`.

  **2. Database engine version.** Postgres 15 in prod = Postgres 15 in test. Not "Postgres 13 in test because it's faster".

  **3. Schema and migrations.** The test DB must be at the same schema version as prod (including any PR-pending migrations).

  **4. Cloud platform.** GCP test → GCP prod. Not "test on minikube → prod on GKE" — minikube lacks CNI, networking quirks differ.

  **5. Service mesh / sidecars.** If prod has Istio, test does too. Otherwise mTLS-related issues stay hidden.

  **6. Resource limits.** Test pods with 4Gi RAM and prod with 1Gi means OOM killers only trigger in prod.

  **What can intentionally differ (and why):**

  **1. Scale.** Test with 1 replica, prod with 20. That's fine — but test **resource constraints** on a single node, not "plenty of resources".

  **2. Data volume.** Prod has 100M users, test has 1k. A separate **performance/scale test environment** with a prod-sized (anonymized) dataset is the solution.

  **3. Third-party APIs.** Stripe live → Stripe test mode, SendGrid → mock. Risk: different behavior under failures. Mitigation: mocks plus contract tests, periodic real-API tests on staging.

  **4. Secrets.** Production secrets must not be in test. Different secret values but **the same access mechanism** (Workload Identity, not "a file in the Docker image").

  **How to measure parity:**

  ```python
  # parity-checks.py — compare infra
  def check_image_versions():
      test_image = get_cloud_run_image("test")
      prod_image = get_cloud_run_image("prod")
      # after deploy, test must equal what goes to prod
      assert test_image.split(":")[0] == prod_image.split(":")[0]

  def check_db_engine():
      assert query("SELECT version()", "test") == query("SELECT version()", "prod")

  def check_resource_limits():
      test_limits = get_pod_limits("test")
      prod_limits = get_pod_limits("prod")
      assert test_limits["cpu"] / prod_limits["cpu"] >= 0.5  # not <50% diff
  ```

  **Common root causes of "passed in test, failed in prod":**
  1. Different TLS configurations (managed cert vs self-signed)
  2. Latency tolerance (5 ms in test, 100 ms in prod via cross-region)
  3. Memory pressure (4 Gi in test, 512 Mi in prod → garbage collector behavior)
  4. Concurrency (1 user in test, 1000 in prod → race conditions)
  5. Data shape (clean dataset in test, edge cases in prod)

  **The "production parity by IaC" approach:** test and prod are described by the same Terraform code, differing only by `var.environment` and scale parameters. That's **structural parity** — it guarantees no "test-only" code paths exist.
section: "automation-qa"
order: 21
tags: [test-infrastructure, environment-parity, devops]
---
