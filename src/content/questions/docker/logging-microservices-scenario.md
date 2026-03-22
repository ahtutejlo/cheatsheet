---
ua_question: "Як організувати централізоване логування для 12 мікросервісів у Docker?"
en_question: "How would you set up centralized logging for 12 microservices in Docker?"
ua_answer: |
  **Scenario:** Команда керує 12 мікросервісами в Docker. Кожен сервіс пише логи в stdout, але для діагностики проблем потрібно переглядати логи на кожному контейнері окремо. Потрібно централізоване рішення з можливістю пошуку та кореляції запитів між сервісами.

  **Approach:**
  1. Перейти на структуроване JSON-логування з correlation ID у кожному сервісі
  2. Налаштувати Docker logging driver для відправки логів у агрегатор
  3. Розгорнути стек агрегації логів (Loki + Grafana або ELK)

  **Solution:**
  ```json
  // Формат структурованого логу (однаковий для всіх сервісів)
  {
    "timestamp": "2025-01-15T10:30:00.123Z",
    "level": "ERROR",
    "service": "order-service",
    "correlation_id": "req-abc-123",
    "message": "Failed to process order",
    "error": "Connection timeout to payment-service",
    "duration_ms": 5023
  }
  ```

  ```yaml
  # docker-compose.yml з Loki logging driver
  services:
    order-service:
      image: myapp/order-service:latest
      logging:
        driver: loki
        options:
          loki-url: "http://loki:3100/loki/api/v1/push"
          loki-batch-size: "400"
          labels: "service=order-service,env=production"

    payment-service:
      image: myapp/payment-service:latest
      logging:
        driver: loki
        options:
          loki-url: "http://loki:3100/loki/api/v1/push"
          labels: "service=payment-service,env=production"

    # Стек логування
    loki:
      image: grafana/loki:2.9.0
      ports:
        - "3100:3100"
      volumes:
        - loki-data:/loki

    grafana:
      image: grafana/grafana:10.0.0
      ports:
        - "3000:3000"
      environment:
        - GF_SECURITY_ADMIN_PASSWORD=admin
      volumes:
        - grafana-data:/var/lib/grafana

  volumes:
    loki-data:
    grafana-data:
  ```

  ```bash
  # Встановлення Loki Docker plugin
  docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions

  # Пошук логів за correlation ID через LogQL
  # В Grafana: {service="order-service"} |= "req-abc-123"

  # Або глобальний logging driver для всіх контейнерів
  # /etc/docker/daemon.json
  # { "log-driver": "loki", "log-opts": { "loki-url": "http://localhost:3100/loki/api/v1/push" } }
  ```

  **Ключовий момент:** correlation ID повинен генеруватися на API gateway та передаватися через всі сервіси у HTTP заголовку (наприклад, `X-Correlation-ID`). Це дозволяє відстежити повний шлях запиту через всі 12 мікросервісів в одному пошуковому запиті.
en_answer: |
  **Scenario:** A team manages 12 microservices in Docker. Each service writes logs to stdout, but diagnosing issues requires checking logs on each container separately. A centralized solution is needed with search capabilities and request correlation across services.

  **Approach:**
  1. Switch to structured JSON logging with correlation ID in every service
  2. Configure a Docker logging driver to send logs to an aggregator
  3. Deploy a log aggregation stack (Loki + Grafana or ELK)

  **Solution:**
  ```json
  // Structured log format (same across all services)
  {
    "timestamp": "2025-01-15T10:30:00.123Z",
    "level": "ERROR",
    "service": "order-service",
    "correlation_id": "req-abc-123",
    "message": "Failed to process order",
    "error": "Connection timeout to payment-service",
    "duration_ms": 5023
  }
  ```

  ```yaml
  # docker-compose.yml with Loki logging driver
  services:
    order-service:
      image: myapp/order-service:latest
      logging:
        driver: loki
        options:
          loki-url: "http://loki:3100/loki/api/v1/push"
          loki-batch-size: "400"
          labels: "service=order-service,env=production"

    payment-service:
      image: myapp/payment-service:latest
      logging:
        driver: loki
        options:
          loki-url: "http://loki:3100/loki/api/v1/push"
          labels: "service=payment-service,env=production"

    # Logging stack
    loki:
      image: grafana/loki:2.9.0
      ports:
        - "3100:3100"
      volumes:
        - loki-data:/loki

    grafana:
      image: grafana/grafana:10.0.0
      ports:
        - "3000:3000"
      environment:
        - GF_SECURITY_ADMIN_PASSWORD=admin
      volumes:
        - grafana-data:/var/lib/grafana

  volumes:
    loki-data:
    grafana-data:
  ```

  ```bash
  # Install Loki Docker plugin
  docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions

  # Search logs by correlation ID via LogQL
  # In Grafana: {service="order-service"} |= "req-abc-123"

  # Or set a global logging driver for all containers
  # /etc/docker/daemon.json
  # { "log-driver": "loki", "log-opts": { "loki-url": "http://localhost:3100/loki/api/v1/push" } }
  ```

  **Key point:** the correlation ID should be generated at the API gateway and passed through all services via an HTTP header (e.g., `X-Correlation-ID`). This allows tracing the full path of a request through all 12 microservices in a single search query.
section: "docker"
order: 30
tags:
  - logging
  - microservices
  - observability
type: "practical"
---
