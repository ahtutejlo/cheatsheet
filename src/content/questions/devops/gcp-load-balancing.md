---
ua_question: "Як влаштовано load balancing у GCP?"
en_question: "How does load balancing work in GCP?"
ua_answer: |
  GCP має кілька типів load balancers, які діляться за **рівнем** (L4 vs L7) і **scope** (global vs regional). Правильний вибір впливає на latency, cost і доступні фічі (TLS, WAF, edge caching).

  **L4 (Network) Load Balancer** — балансує TCP/UDP трафік за IP+port, без розуміння HTTP. Швидкий, простий, але не вміє path-based routing чи TLS termination.

  **L7 (Application) Load Balancer** — розуміє HTTP/HTTPS, дає:
  - URL-based routing (`/api/*` → backend A, `/static/*` → backend B)
  - TLS termination з managed certs
  - Cloud Armor (WAF, DDoS protection)
  - Cloud CDN integration
  - HTTP/2, gRPC, WebSocket

  **Global vs Regional:**
  - **Global** LB — anycast IP, користувачі підключаються до найближчого PoP, GCP бекбоном везе до бекенду в будь-якому регіоні. Ідеально для public-facing сервісів.
  - **Regional** LB — IP прив'язаний до регіону. Дешевший, простіший, підходить для internal services.

  **Backends:**
  - Managed Instance Groups (MIG)
  - Network Endpoint Groups (NEG) — для Cloud Run, GKE Gateway, hybrid
  - Cloud Storage bucket (для static)

  ```hcl
  # Terraform: external HTTPS LB перед Cloud Run
  resource "google_compute_region_network_endpoint_group" "cr_neg" {
    name                  = "cr-neg"
    region                = "us-central1"
    network_endpoint_type = "SERVERLESS"
    cloud_run { service = google_cloud_run_v2_service.api.name }
  }

  resource "google_compute_backend_service" "api" {
    name        = "api-backend"
    protocol    = "HTTPS"
    backend { group = google_compute_region_network_endpoint_group.cr_neg.id }
  }
  ```

  **Для тестової інфраструктури:** ефемерним preview-середовищам зазвичай вистачає Cloud Run defaults (built-in LB), а складна архітектура з кількома регіонами вимагає Global L7 LB з NEG-бекендами.
en_answer: |
  GCP offers several load balancer types categorized by **layer** (L4 vs L7) and **scope** (global vs regional). The right pick affects latency, cost, and available features (TLS, WAF, edge caching).

  **L4 (Network) Load Balancer** — balances TCP/UDP traffic by IP+port without HTTP awareness. Fast, simple, but can't do path-based routing or TLS termination.

  **L7 (Application) Load Balancer** — understands HTTP/HTTPS and provides:
  - URL-based routing (`/api/*` → backend A, `/static/*` → backend B)
  - TLS termination with managed certs
  - Cloud Armor (WAF, DDoS protection)
  - Cloud CDN integration
  - HTTP/2, gRPC, WebSocket

  **Global vs Regional:**
  - **Global** LB — anycast IP, users connect to the nearest PoP, GCP backbone carries traffic to a backend in any region. Ideal for public-facing services.
  - **Regional** LB — IP is tied to a region. Cheaper, simpler, good for internal services.

  **Backends:**
  - Managed Instance Groups (MIG)
  - Network Endpoint Groups (NEG) — for Cloud Run, GKE Gateway, hybrid
  - Cloud Storage bucket (for static content)

  ```hcl
  # Terraform: external HTTPS LB in front of Cloud Run
  resource "google_compute_region_network_endpoint_group" "cr_neg" {
    name                  = "cr-neg"
    region                = "us-central1"
    network_endpoint_type = "SERVERLESS"
    cloud_run { service = google_cloud_run_v2_service.api.name }
  }

  resource "google_compute_backend_service" "api" {
    name        = "api-backend"
    protocol    = "HTTPS"
    backend { group = google_compute_region_network_endpoint_group.cr_neg.id }
  }
  ```

  **For test infrastructure:** ephemeral preview environments are usually fine with Cloud Run defaults (built-in LB), while complex multi-region setups need a Global L7 LB with NEG backends.
section: "devops"
order: 3
tags: [gcp, load-balancing, networking]
---
