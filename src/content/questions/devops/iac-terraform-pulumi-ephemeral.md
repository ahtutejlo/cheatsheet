---
ua_question: "Terraform vs Pulumi для ефемерних середовищ"
en_question: "Terraform vs Pulumi for ephemeral environments"
ua_answer: |
  Ефемерне середовище — це повний стек (БД, бекенд, фронтенд, секрети, мережа), який живе годинами/днями для одного PR і знищується після merge. IaC — основний інструмент щоб робити це безпечно і повторювано.

  **Terraform** — HCL, declarative, immutable state у бекенді (GCS, S3). Найзріліше: provider-екосистема велика, документація глибока, безліч прикладів. Workspaces або окремі state-файли дозволяють паралельні envs.

  **Pulumi** — той самий граф ресурсів, але мова — TypeScript/Python/Go. Дає логіку, цикли, тести через Jest/pytest. Підходить, коли infrastructure code тісно сплетений з application code, або команда — програмісти, не інфра.

  **Шаблон ефемерного env через Terraform workspaces:**

  ```hcl
  # main.tf
  locals {
    env_name = terraform.workspace  # "pr-1234", "pr-1235"
    is_pr    = startswith(local.env_name, "pr-")
  }

  resource "google_cloud_run_v2_service" "api" {
    name     = "api-${local.env_name}"
    location = "us-central1"
    template {
      labels = { ephemeral = local.is_pr ? "true" : "false" }
      containers { image = var.image }
    }
  }

  resource "google_sql_database" "db" {
    name     = "app-${local.env_name}"
    instance = google_sql_database_instance.shared.name
  }
  ```

  ```bash
  terraform workspace new "pr-${PR_NUMBER}"
  terraform apply -var="image=${IMAGE}"
  # після merge:
  terraform workspace select "pr-${PR_NUMBER}"
  terraform destroy -auto-approve
  terraform workspace delete "pr-${PR_NUMBER}"
  ```

  **Поради:**
  1. **Один shared expensive ресурс** (Cloud SQL instance, GKE cluster) на проєкт, ефемерні створюють тільки логічні юніти (databases, namespaces, services). Інакше тарифи злетять.
  2. **TTL-сенітайзер** — Cloud Function/Cron, який видаляє envs старші Х годин (на випадок зависання GitHub Actions)
  3. **Маркуйте labels** для звітів cost-attribution
  4. **State per env** або workspace per env — щоб паралельні PR не блокувалися

  **Pulumi виграє**, коли треба генерувати конфіги динамічно (наприклад, зчитати GraphQL schema і створити Pub/Sub топіки під кожен event-type), або коли тестова інфра має складні calculated dependencies.
en_answer: |
  An ephemeral environment is a full stack (DB, backend, frontend, secrets, network) that lives for hours/days for a single PR and is destroyed after merge. IaC is the primary tool to make this safe and reproducible.

  **Terraform** — HCL, declarative, immutable state in a backend (GCS, S3). Most mature: huge provider ecosystem, deep docs, countless examples. Workspaces or separate state files allow parallel envs.

  **Pulumi** — the same resource graph, but the language is TypeScript / Python / Go. You get logic, loops, tests via Jest/pytest. Fits when infrastructure code is tightly intertwined with application code, or when the team is software engineers rather than infra specialists.

  **Ephemeral env pattern with Terraform workspaces:**

  ```hcl
  # main.tf
  locals {
    env_name = terraform.workspace  # "pr-1234", "pr-1235"
    is_pr    = startswith(local.env_name, "pr-")
  }

  resource "google_cloud_run_v2_service" "api" {
    name     = "api-${local.env_name}"
    location = "us-central1"
    template {
      labels = { ephemeral = local.is_pr ? "true" : "false" }
      containers { image = var.image }
    }
  }

  resource "google_sql_database" "db" {
    name     = "app-${local.env_name}"
    instance = google_sql_database_instance.shared.name
  }
  ```

  ```bash
  terraform workspace new "pr-${PR_NUMBER}"
  terraform apply -var="image=${IMAGE}"
  # after merge:
  terraform workspace select "pr-${PR_NUMBER}"
  terraform destroy -auto-approve
  terraform workspace delete "pr-${PR_NUMBER}"
  ```

  **Tips:**
  1. **One shared expensive resource** (Cloud SQL instance, GKE cluster) per project; ephemeral envs create only logical units (databases, namespaces, services). Otherwise the bill explodes.
  2. **TTL janitor** — a Cloud Function / Cron that destroys envs older than X hours (in case GitHub Actions hangs)
  3. **Label everything** for cost-attribution reporting
  4. **State per env** or workspace-per-env so parallel PRs don't block each other

  **Pulumi wins** when configs must be generated dynamically (e.g., read a GraphQL schema and create Pub/Sub topics per event type), or when test infra has complex calculated dependencies.
section: "devops"
order: 6
tags: [iac, terraform, pulumi, ephemeral-environments]
---
