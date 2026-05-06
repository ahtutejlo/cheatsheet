---
ua_question: "Cloud Run vs GKE: коли і що обирати?"
en_question: "Cloud Run vs GKE: when to choose which?"
ua_answer: |
  Cloud Run і GKE — два основні способи запускати контейнери в GCP. Вибір залежить від моделі навантаження, складності оркестрації та операційних витрат.

  **Cloud Run** — fully-managed serverless платформа для контейнерів. Ви даєте Docker-образ, GCP сам масштабує до нуля чи до тисяч інстансів. Ви не керуєте нодами, мережею чи кубернетес-абстракціями.

  **Підходить, коли:**
  - HTTP-сервіси з нерегулярним або bursty трафіком (cold-scale-to-zero — це фіча, не баг)
  - Внутрішні API, тестова інфраструктура, ad-hoc джоби
  - Команда не хоче керувати кластером
  - Час запиту до 60 хв (Cloud Run jobs) або 60 с (Cloud Run services request timeout)

  **GKE (Google Kubernetes Engine)** — повноцінний managed Kubernetes. Дає вам всі K8s API: StatefulSets, DaemonSets, custom controllers, мережеві політики, sidecars.

  **Підходить, коли:**
  - Stateful workloads, складні мережеві топології (service mesh, mTLS між сервісами)
  - Багато сервісів з shared dependencies, яким треба колокація
  - Існуюча K8s-експертиза в команді
  - Потрібен GPU-pool, custom scheduler чи operator pattern
  - Довготривалі workloads (ML training, batch processing)

  ```yaml
  # Cloud Run service deploy
  gcloud run deploy api-test-runner \
    --image=us-docker.pkg.dev/proj/repo/runner:latest \
    --region=us-central1 \
    --max-instances=50 \
    --concurrency=10 \
    --cpu=2 --memory=4Gi
  ```

  **Для тестової інфраструктури:** Cloud Run чудовий для ефемерних preview-середовищ і паралельних тест-runners. GKE — коли потрібні shared services (Redis, Selenium Grid, Locust master/workers).
en_answer: |
  Cloud Run and GKE are the two main ways to run containers on GCP. The choice depends on workload pattern, orchestration complexity, and operational overhead.

  **Cloud Run** — a fully-managed serverless platform for containers. You give it a Docker image; GCP scales from zero to thousands of instances. You don't manage nodes, networking, or Kubernetes abstractions.

  **Pick it when:**
  - HTTP services with irregular or bursty traffic (cold-scale-to-zero is a feature, not a bug)
  - Internal APIs, test infrastructure, ad-hoc jobs
  - The team doesn't want to manage a cluster
  - Up to 60 min per request (Cloud Run jobs) or 60 s (Cloud Run services request timeout)

  **GKE (Google Kubernetes Engine)** — full managed Kubernetes. You get every K8s API: StatefulSets, DaemonSets, custom controllers, network policies, sidecars.

  **Pick it when:**
  - Stateful workloads, complex networking (service mesh, mTLS between services)
  - Many services with shared dependencies that must be colocated
  - Existing K8s expertise on the team
  - You need a GPU pool, custom scheduler, or operator pattern
  - Long-running workloads (ML training, batch processing)

  ```yaml
  # Cloud Run service deploy
  gcloud run deploy api-test-runner \
    --image=us-docker.pkg.dev/proj/repo/runner:latest \
    --region=us-central1 \
    --max-instances=50 \
    --concurrency=10 \
    --cpu=2 --memory=4Gi
  ```

  **For test infrastructure:** Cloud Run is great for ephemeral preview environments and parallel test runners. GKE wins when you need shared services (Redis, Selenium Grid, Locust master/workers).
section: "devops"
order: 1
tags: [gcp, cloud-run, gke, infrastructure]
---
