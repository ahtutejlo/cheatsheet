---
ua_question: "Як працює IAM в GCP і коли використовувати service accounts?"
en_question: "How does GCP IAM work and when to use service accounts?"
ua_answer: |
  GCP IAM (Identity and Access Management) визначає **хто** (identity) має право виконувати **що** (role) на **якому ресурсі** (resource). Без правильного IAM-моделювання тестова інфраструктура або зламається через permission denied, або стане діркою в безпеці.

  **Три типи identities:**
  - **User** — людина (Google account)
  - **Service account** — non-human identity для воркладів (CI runner, Cloud Run service)
  - **Group / Workspace** — колекція юзерів

  **Roles:**
  - **Primitive** (Owner, Editor, Viewer) — застарілі, занадто широкі, уникайте
  - **Predefined** — `roles/run.invoker`, `roles/storage.objectViewer` — конкретні
  - **Custom** — комбінація permissions, коли predefined не підходять

  **Service accounts** — це identity для коду. Замість того щоб embedити сервісний ключ у Docker-образ, прив'язуйте SA до самого ресурсу:
  - Cloud Run service запускається "as" service account → автоматично отримує access tokens
  - GKE pod через **Workload Identity** мапиться на GCP SA, без секретів у пода
  - GitHub Actions через **Workload Identity Federation** автентифікується без service-account key

  ```bash
  # Прив'язати SA до Cloud Run і дати доступ до Storage bucket
  gcloud run services update api-runner \
    --service-account=runner-sa@proj.iam.gserviceaccount.com

  gcloud storage buckets add-iam-policy-binding gs://test-data \
    --member="serviceAccount:runner-sa@proj.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"
  ```

  **Принципи для тестової інфри:**
  1. Один SA на воркладу (test runner, db migrator, log shipper) — а не один SA "на все"
  2. Least privilege: давайте `objectViewer`, а не `admin`
  3. Workload Identity замість service-account keys (.json файлів) — keys тікають через git
  4. Audit logs ввімкнені для всіх admin-ролей
en_answer: |
  GCP IAM (Identity and Access Management) defines **who** (identity) is allowed to do **what** (role) on **which resource**. Without correct IAM modeling, test infrastructure either breaks with permission denied errors or becomes a security hole.

  **Three identity types:**
  - **User** — a human (Google account)
  - **Service account** — non-human identity for workloads (CI runner, Cloud Run service)
  - **Group / Workspace** — a collection of users

  **Roles:**
  - **Primitive** (Owner, Editor, Viewer) — legacy, too broad, avoid
  - **Predefined** — `roles/run.invoker`, `roles/storage.objectViewer` — purpose-built
  - **Custom** — combine permissions when predefined doesn't fit

  **Service accounts** are identities for code. Instead of embedding a service key in a Docker image, attach the SA to the resource itself:
  - A Cloud Run service runs "as" a service account and automatically receives access tokens
  - A GKE pod uses **Workload Identity** to map to a GCP SA — no secrets inside the pod
  - GitHub Actions uses **Workload Identity Federation** to authenticate without a service-account key

  ```bash
  # Attach SA to Cloud Run and grant access to a Storage bucket
  gcloud run services update api-runner \
    --service-account=runner-sa@proj.iam.gserviceaccount.com

  gcloud storage buckets add-iam-policy-binding gs://test-data \
    --member="serviceAccount:runner-sa@proj.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"
  ```

  **Principles for test infrastructure:**
  1. One SA per workload (test runner, db migrator, log shipper) — not one SA for everything
  2. Least privilege: grant `objectViewer`, not `admin`
  3. Workload Identity instead of service-account keys (.json files) — keys leak through git
  4. Audit logs enabled for every admin role
section: "devops"
order: 2
tags: [gcp, iam, security, service-accounts]
---
