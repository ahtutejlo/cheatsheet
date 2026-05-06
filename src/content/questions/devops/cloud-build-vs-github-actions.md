---
ua_question: "Cloud Build vs GitHub Actions: що обрати для тестового CI?"
en_question: "Cloud Build vs GitHub Actions: which to pick for test CI?"
ua_answer: |
  Обидва — managed CI системи, але вони оптимізовані під різні сценарії.

  **GitHub Actions** живе в GitHub, тригериться з PR-івент'ів, має величезний marketplace actions, безкоштовний tier для public repos, runners в Azure-центрах. Сила — у developer-experience: PR checks, summary annotations, deployments, code-review інтеграція.

  **Cloud Build** живе в GCP, тригериться з Cloud Source / GitHub / Bitbucket, тісно інтегрований з усіма GCP-сервісами (Artifact Registry, Cloud Run deploy, Secret Manager, Workload Identity). Сила — у GCP-нативності: build на VM поряд з production data, мінімальні egress costs, IAM працює без додаткових ключів.

  **Коли Cloud Build виграє:**
  - Білд великих образів (ARM/AMD64), бо нативні машини в GCP, без overhead
  - Pipeline, який після білду одразу деплоїть у Cloud Run/GKE — IAM federation вже на місці
  - Інтеграційні тести, які роблять багато запитів у GCP services (BigQuery, Pub/Sub, Firestore) — egress всередині мережі безкоштовний
  - Великі кеші (Cloud Storage) і артефакти (Artifact Registry) — без додаткового pricing
  - Compliance-середовища, де код не може покидати GCP

  **Коли GitHub Actions виграє:**
  - Repo живе на GitHub, треба швидкий PR feedback
  - Багато matrix-комбінацій з open-source actions
  - Cross-platform тести (Windows/macOS runners з коробки)
  - Artifacts і test reports у GitHub UI

  **Гібрид** — типовий і робочий: GitHub Actions для PR-checks і unit/integration, Cloud Build для release pipelines і тяжких e2e з повним GCP-середовищем.

  ```yaml
  # cloudbuild.yaml - простий приклад test + deploy
  steps:
    - name: python:3.12-slim
      entrypoint: bash
      args: ['-c', 'pip install -e ".[dev]" && pytest -m "not slow"']
    - name: gcr.io/cloud-builders/docker
      args: ['build', '-t', '$_IMAGE', '.']
    - name: gcr.io/cloud-builders/docker
      args: ['push', '$_IMAGE']
    - name: gcr.io/google.com/cloudsdktool/cloud-sdk
      args: ['gcloud', 'run', 'deploy', 'api', '--image=$_IMAGE']
  substitutions:
    _IMAGE: us-docker.pkg.dev/$PROJECT_ID/repo/api:$SHORT_SHA
  options:
    logging: CLOUD_LOGGING_ONLY
  ```

  **Ціна:** GitHub Actions має безкоштовну квоту хвилин, але великі workloads дорожчі за self-hosted; Cloud Build дешевший на масштабі завдяки vCPU-based pricing і відсутності egress.
en_answer: |
  Both are managed CI systems, but optimized for different scenarios.

  **GitHub Actions** lives in GitHub, triggers from PR events, has a huge marketplace, free tier for public repos, runners in Azure data centers. Its strength is developer experience: PR checks, summary annotations, deployments, code-review integration.

  **Cloud Build** lives in GCP, triggers from Cloud Source / GitHub / Bitbucket, is tightly integrated with every GCP service (Artifact Registry, Cloud Run deploy, Secret Manager, Workload Identity). Its strength is GCP-native execution: building on a VM next to production data, minimal egress cost, IAM works without extra keys.

  **When Cloud Build wins:**
  - Building large images (ARM/AMD64) — native GCP machines, no overhead
  - Pipeline that builds and immediately deploys to Cloud Run / GKE — IAM federation already in place
  - Integration tests that hit many GCP services (BigQuery, Pub/Sub, Firestore) — in-network egress is free
  - Large caches (Cloud Storage) and artifacts (Artifact Registry) without extra pricing
  - Compliance environments where code must not leave GCP

  **When GitHub Actions wins:**
  - Repo lives on GitHub, fast PR feedback matters
  - Many matrix combinations with open-source actions
  - Cross-platform tests (Windows/macOS runners out of the box)
  - Artifacts and test reports in GitHub UI

  **The pragmatic hybrid:** GitHub Actions for PR checks and unit/integration tests, Cloud Build for release pipelines and heavy e2e with full GCP context.

  ```yaml
  # cloudbuild.yaml — simple test + deploy
  steps:
    - name: python:3.12-slim
      entrypoint: bash
      args: ['-c', 'pip install -e ".[dev]" && pytest -m "not slow"']
    - name: gcr.io/cloud-builders/docker
      args: ['build', '-t', '$_IMAGE', '.']
    - name: gcr.io/cloud-builders/docker
      args: ['push', '$_IMAGE']
    - name: gcr.io/google.com/cloudsdktool/cloud-sdk
      args: ['gcloud', 'run', 'deploy', 'api', '--image=$_IMAGE']
  substitutions:
    _IMAGE: us-docker.pkg.dev/$PROJECT_ID/repo/api:$SHORT_SHA
  options:
    logging: CLOUD_LOGGING_ONLY
  ```

  **Cost:** GitHub Actions has a free minute quota, but big workloads get pricey vs self-hosted; Cloud Build is cheaper at scale thanks to vCPU-based pricing and no egress charges.
section: "devops"
order: 5
tags: [cloud-build, github-actions, ci-cd, gcp]
---
