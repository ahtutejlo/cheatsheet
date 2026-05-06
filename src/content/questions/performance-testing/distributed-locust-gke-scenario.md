---
ua_question: "Як розгорнути distributed Locust на GKE?"
en_question: "How to run distributed Locust on GKE?"
ua_answer: |
  **Сценарій:** ваш performance test потребує 50 000 одночасних користувачів. Один Locust-instance дотягне максимум 1500 (single-process Python обмежений GIL). Треба distributed setup: master + N workers.

  **Підхід:**
  1. Master coordinates і збирає stats
  2. Workers генерують load (1 worker ≈ 1000-3000 RPS)
  3. GKE pods для масштабованого worker pool
  4. Result export до GCS / Cloud Monitoring

  **Рішення:**

  **Архітектура:**

  ```
  ┌──────────┐    coordination     ┌──────────┐
  │ Locust   │ ────────────────►  │ Locust   │
  │ master   │  (port 5557/5558)  │ worker   │ × N
  │ :8089 UI │                     │          │
  └──────────┘                     └──────────┘
       │                                  │
       │ HTTP load                        │
       ▼                                  ▼
       SUT (Cloud Run / GKE service under test)
  ```

  **Локустfile (test scenarios):**

  ```python
  # locustfile.py
  from locust import HttpUser, task, between

  class ApiUser(HttpUser):
      wait_time = between(1, 3)
      host = "https://api.example.com"

      def on_start(self):
          r = self.client.post("/auth", json={
              "email": "load-test@example.com",
              "password": "LoadTest!"
          })
          self.token = r.json()["token"]
          self.client.headers.update({"Authorization": f"Bearer {self.token}"})

      @task(3)
      def list_orders(self):
          self.client.get("/orders?limit=20", name="/orders")

      @task(1)
      def create_order(self):
          self.client.post("/orders", json={"item_id": "sku_123", "qty": 1})
  ```

  **Docker image:**

  ```dockerfile
  # Dockerfile.locust
  FROM python:3.12-slim
  RUN pip install --no-cache-dir locust==2.30.0
  WORKDIR /app
  COPY locustfile.py .
  EXPOSE 8089 5557 5558
  ```

  **K8s manifests (master + workers):**

  ```yaml
  # locust-master.yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata: { name: locust-master }
  spec:
    replicas: 1
    selector: { matchLabels: { app: locust-master } }
    template:
      metadata: { labels: { app: locust-master } }
      spec:
        containers:
          - name: locust
            image: us-docker.pkg.dev/proj/repo/locust:latest
            args: ["-f", "/app/locustfile.py", "--master"]
            ports:
              - { containerPort: 8089, name: web }
              - { containerPort: 5557, name: coord-1 }
              - { containerPort: 5558, name: coord-2 }
  ---
  apiVersion: v1
  kind: Service
  metadata: { name: locust-master }
  spec:
    selector: { app: locust-master }
    ports:
      - { name: web,    port: 8089 }
      - { name: coord-1, port: 5557 }
      - { name: coord-2, port: 5558 }
  ---
  # locust-worker.yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata: { name: locust-worker }
  spec:
    replicas: 50  # масштабована — kubectl scale
    selector: { matchLabels: { app: locust-worker } }
    template:
      metadata: { labels: { app: locust-worker } }
      spec:
        containers:
          - name: locust
            image: us-docker.pkg.dev/proj/repo/locust:latest
            args:
              - "-f"
              - "/app/locustfile.py"
              - "--worker"
              - "--master-host"
              - "locust-master"
            resources:
              limits: { cpu: "2", memory: "1Gi" }
  ```

  **Запуск і scale:**

  ```bash
  kubectl apply -f locust-master.yaml
  kubectl apply -f locust-worker.yaml
  # Scale workers
  kubectl scale deployment/locust-worker --replicas=100
  # UI port-forward
  kubectl port-forward svc/locust-master 8089:8089
  # Або headless run з CLI:
  kubectl exec deploy/locust-master -- \
    locust -f /app/locustfile.py --headless -u 50000 -r 500 --run-time 10m \
    --csv=results --html=report.html
  ```

  **Result export:**

  ```python
  # post-run job
  from google.cloud import storage, monitoring_v3

  client = storage.Client()
  bucket = client.bucket("perf-results")
  bucket.blob(f"{run_id}/results_stats.csv").upload_from_filename("/results_stats.csv")
  bucket.blob(f"{run_id}/report.html").upload_from_filename("/report.html")

  # Push key metrics до Cloud Monitoring як custom metric
  monitoring = monitoring_v3.MetricServiceClient()
  # ... write_time_series with p95 latency, RPS, error rate
  ```

  **Sizing:**
  - 1 vCPU worker → ~1000-2000 RPS залежно від complexity
  - master needs 2-4 vCPU для stats aggregation з 50+ workers
  - Network egress часто bottleneck — пам'ятайте про Cloud NAT pricing

  **Підводні камені:**
  - **Coordinated omission** — Locust default не captures latency для requests, що випали через "queue full". Use `--exclude-tags` чи custom event handlers
  - **Worker death** — pod evict спричиняє втрату in-flight users. Master coordinator цього не helpаєт.
  - **DNS rate limits** — 50 workers роблять 10k DNS lookups/sec проти GCP DNS — ловить throttling. Use IP-based hosts або local DNS cache (CoreDNS у GKE).
  - **SUT must be ready** — кок-старт + autoscale lag робить перші 60 секунд load ramp нестабільними. Прогрів запитами перед stat capture.
en_answer: |
  **Scenario:** your performance test needs 50,000 concurrent users. A single Locust instance tops out at ~1500 (single-process Python is GIL-bound). You need a distributed setup: master + N workers.

  **Approach:**
  1. Master coordinates and aggregates stats
  2. Workers generate load (1 worker ≈ 1000-3000 RPS)
  3. GKE pods for the scalable worker pool
  4. Result export to GCS / Cloud Monitoring

  **Solution:**

  **Architecture:**

  ```
  ┌──────────┐    coordination     ┌──────────┐
  │ Locust   │ ────────────────►  │ Locust   │
  │ master   │  (port 5557/5558)  │ worker   │ × N
  │ :8089 UI │                     │          │
  └──────────┘                     └──────────┘
       │                                  │
       │ HTTP load                        │
       ▼                                  ▼
       SUT (Cloud Run / GKE service under test)
  ```

  **Locustfile (test scenarios):**

  ```python
  # locustfile.py
  from locust import HttpUser, task, between

  class ApiUser(HttpUser):
      wait_time = between(1, 3)
      host = "https://api.example.com"

      def on_start(self):
          r = self.client.post("/auth", json={
              "email": "load-test@example.com",
              "password": "LoadTest!"
          })
          self.token = r.json()["token"]
          self.client.headers.update({"Authorization": f"Bearer {self.token}"})

      @task(3)
      def list_orders(self):
          self.client.get("/orders?limit=20", name="/orders")

      @task(1)
      def create_order(self):
          self.client.post("/orders", json={"item_id": "sku_123", "qty": 1})
  ```

  **Docker image:**

  ```dockerfile
  # Dockerfile.locust
  FROM python:3.12-slim
  RUN pip install --no-cache-dir locust==2.30.0
  WORKDIR /app
  COPY locustfile.py .
  EXPOSE 8089 5557 5558
  ```

  **K8s manifests (master + workers):**

  ```yaml
  # locust-master.yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata: { name: locust-master }
  spec:
    replicas: 1
    selector: { matchLabels: { app: locust-master } }
    template:
      metadata: { labels: { app: locust-master } }
      spec:
        containers:
          - name: locust
            image: us-docker.pkg.dev/proj/repo/locust:latest
            args: ["-f", "/app/locustfile.py", "--master"]
            ports:
              - { containerPort: 8089, name: web }
              - { containerPort: 5557, name: coord-1 }
              - { containerPort: 5558, name: coord-2 }
  ---
  apiVersion: v1
  kind: Service
  metadata: { name: locust-master }
  spec:
    selector: { app: locust-master }
    ports:
      - { name: web,    port: 8089 }
      - { name: coord-1, port: 5557 }
      - { name: coord-2, port: 5558 }
  ---
  # locust-worker.yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata: { name: locust-worker }
  spec:
    replicas: 50  # scalable via kubectl scale
    selector: { matchLabels: { app: locust-worker } }
    template:
      metadata: { labels: { app: locust-worker } }
      spec:
        containers:
          - name: locust
            image: us-docker.pkg.dev/proj/repo/locust:latest
            args:
              - "-f"
              - "/app/locustfile.py"
              - "--worker"
              - "--master-host"
              - "locust-master"
            resources:
              limits: { cpu: "2", memory: "1Gi" }
  ```

  **Run and scale:**

  ```bash
  kubectl apply -f locust-master.yaml
  kubectl apply -f locust-worker.yaml
  # Scale workers
  kubectl scale deployment/locust-worker --replicas=100
  # UI port-forward
  kubectl port-forward svc/locust-master 8089:8089
  # Or headless run via CLI:
  kubectl exec deploy/locust-master -- \
    locust -f /app/locustfile.py --headless -u 50000 -r 500 --run-time 10m \
    --csv=results --html=report.html
  ```

  **Result export:**

  ```python
  # post-run job
  from google.cloud import storage, monitoring_v3

  client = storage.Client()
  bucket = client.bucket("perf-results")
  bucket.blob(f"{run_id}/results_stats.csv").upload_from_filename("/results_stats.csv")
  bucket.blob(f"{run_id}/report.html").upload_from_filename("/report.html")

  # Push key metrics to Cloud Monitoring as a custom metric
  monitoring = monitoring_v3.MetricServiceClient()
  # ... write_time_series with p95 latency, RPS, error rate
  ```

  **Sizing:**
  - 1 vCPU worker → ~1000-2000 RPS depending on complexity
  - Master needs 2-4 vCPU for stats aggregation across 50+ workers
  - Network egress is often the bottleneck — mind Cloud NAT pricing

  **Pitfalls:**
  - **Coordinated omission** — Locust by default doesn't capture latency for requests that fell out due to "queue full". Use `--exclude-tags` or custom event handlers
  - **Worker death** — a pod evict drops in-flight users. The master coordinator doesn't help here.
  - **DNS rate limits** — 50 workers doing 10k DNS lookups/sec against GCP DNS will hit throttling. Use IP-based hosts or a local DNS cache (CoreDNS in GKE).
  - **SUT must be ready** — cold start + autoscale lag makes the first 60 s of load ramp unstable. Warm up with requests before capturing stats.
section: "performance-testing"
order: 29
tags: [locust, gke, distributed-testing, gcp]
type: "practical"
---
