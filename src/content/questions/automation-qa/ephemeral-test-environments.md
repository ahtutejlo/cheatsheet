---
ua_question: "Що таке ефемерні test environments і навіщо вони?"
en_question: "What are ephemeral test environments and why use them?"
ua_answer: |
  Ефемерне середовище — повний стек (frontend, backend, БД, sidecars), який автоматично створюється для одного PR і знищується після merge або через TTL. Це альтернатива моделі "один shared staging", де команди ламають одна одній тести.

  **Що ефемерні середовища дають:**
  - **Ізоляція** — твій PR не ламає чужих E2E
  - **Real environment confidence** — тести бачать справжній GCP, реальну БД, не моки
  - **Preview deployments** — продакт-менеджер кликає на link з PR і дивиться feature живцем
  - **Безпечні migrations** — schema changes тестяться на ізольованій БД, не в shared staging
  - **Паралельність** — 50 PRs можуть мати свої envs, а не чекати чергу

  **Архітектура (типова):**

  ```
  GitHub PR opened
  └─ GitHub Actions trigger
     ├─ Terraform apply: workspace=pr-1234
     │  ├─ Cloud Run service "api-pr-1234"
     │  ├─ Cloud SQL DB "app-pr-1234" (logical, shared instance)
     │  └─ DNS *.pr-1234.preview.example.com
     ├─ Run migrations + seed
     ├─ Deploy frontend bundle to GCS bucket
     ├─ Run E2E против цього env (Playwright)
     └─ Comment on PR with link
  ```

  **Підтримує цикл життя:**
  - **Create** — на open / reopen PR, або slash-command (`/preview`)
  - **Update** — на push до тієї самої гілки (rebuild containers, re-run migrations)
  - **Destroy** — на merge / close PR, або через TTL janitor

  **Що зберегти shared (НЕ ефемерним):**
  - Cloud SQL **instance** — занадто дорого створювати на кожен PR (10-15 хв provisioning, $$). Shared, кожен PR — окрема **database** в інстансі.
  - GKE **cluster** — той самий аргумент, кожен PR — окремий **namespace**.
  - Vector DB / Pinecone / external services — або спільні з namespacing, або mocks.
  - Secret Manager — окрема secret per env, але один Secret Manager.

  **Cost & cleanup:**
  - **Labels** на ресурси (`pr=1234`, `team=qa`) — для billing attribution
  - **TTL janitor** (Cloud Scheduler + Cloud Function) щодня прибирає envs старше N годин — на випадок зависань
  - **Quota guards** — обмежте, скільки envs одночасно (max 50), інакше bill вибухне

  **Підводні камені:**
  - **Cold start** — перший запит до Cloud Run after deploy займає 5-10 сек; Playwright має retry або warmup
  - **Race в migrations** — якщо PR-1 і PR-2 змінюють ту ж saved schema на shared instance, race. Варіант: окрема SQL instance per env (дорожче), або strict per-PR schema
  - **External dependencies** — third-party APIs (Stripe sandbox) не масштабуються по env-ів. Mockуйте або робіть один shared sandbox
  - **Secrets distribution** — як давати ефемерному env access до production-like secrets без leak. Workload Identity + per-env secret name templates

  **Tooling екосистема:** Terraform (IaC), Render / Railway (managed), Vercel (frontend-focused), Argo Rollouts (k8s), Prefect / Dagster (ML pipelines).
en_answer: |
  An ephemeral environment is a full stack (frontend, backend, database, sidecars) that is automatically created for a single PR and destroyed after merge or via TTL. It's an alternative to the "shared staging" model where teams break each other's tests.

  **What ephemeral envs give you:**
  - **Isolation** — your PR doesn't break someone else's E2E
  - **Real environment confidence** — tests hit actual GCP, a real DB, not mocks
  - **Preview deployments** — the PM clicks a link in the PR and sees the feature live
  - **Safe migrations** — schema changes are tested on an isolated DB, not in shared staging
  - **Parallelism** — 50 PRs can have their own envs without queueing

  **Typical architecture:**

  ```
  GitHub PR opened
  └─ GitHub Actions trigger
     ├─ Terraform apply: workspace=pr-1234
     │  ├─ Cloud Run service "api-pr-1234"
     │  ├─ Cloud SQL DB "app-pr-1234" (logical, shared instance)
     │  └─ DNS *.pr-1234.preview.example.com
     ├─ Run migrations + seed
     ├─ Deploy frontend bundle to GCS bucket
     ├─ Run E2E against this env (Playwright)
     └─ Comment on PR with the link
  ```

  **Lifecycle:**
  - **Create** — on PR open / reopen, or a slash command (`/preview`)
  - **Update** — on push to the same branch (rebuild containers, re-run migrations)
  - **Destroy** — on merge / close, or via TTL janitor

  **What to keep shared (NOT ephemeral):**
  - Cloud SQL **instance** — too expensive to create per PR (10-15 min provisioning, $$). Share the instance, give each PR its own **database**.
  - GKE **cluster** — same reasoning; each PR gets its own **namespace**.
  - Vector DB / Pinecone / external services — share with namespacing or use mocks.
  - Secret Manager — separate secret per env, but one Secret Manager.

  **Cost & cleanup:**
  - **Labels** on resources (`pr=1234`, `team=qa`) for billing attribution
  - **TTL janitor** (Cloud Scheduler + Cloud Function) sweeps envs older than N hours every day — for stuck workflows
  - **Quota guards** — cap how many envs run at once (max 50), or the bill explodes

  **Pitfalls:**
  - **Cold start** — the first request to Cloud Run after deploy takes 5-10 s; Playwright needs retry or warmup
  - **Migration races** — if PR-1 and PR-2 both alter the same shared-instance schema, race. Options: separate SQL instance per env (pricier), or strict per-PR schemas
  - **External dependencies** — third-party APIs (Stripe sandbox) don't scale per env. Mock them or share a sandbox
  - **Secrets distribution** — how to give an ephemeral env access to production-like secrets without leaking. Workload Identity + per-env secret name templates

  **Tooling ecosystem:** Terraform (IaC), Render / Railway (managed), Vercel (frontend-focused), Argo Rollouts (K8s), Prefect / Dagster (ML pipelines).
section: "automation-qa"
order: 20
tags: [test-infrastructure, ephemeral-environments, ci-cd]
---
