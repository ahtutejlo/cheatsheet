---
ua_question: "Що таке health checks в Docker?"
en_question: "What are health checks in Docker?"
ua_answer: |
  Health checks в Docker -- це механізм перевірки працездатності контейнера. Docker періодично виконує команду і на основі результату визначає стан контейнера: **healthy**, **unhealthy** або **starting**.

  **Health check у Dockerfile:**
  ```dockerfile
  FROM nginx:alpine
  HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1
  ```

  **Параметри:**
  - `--interval` -- інтервал між перевірками (за замовчуванням 30s)
  - `--timeout` -- максимальний час виконання команди (за замовчуванням 30s)
  - `--start-period` -- час на запуск контейнера (перевірки не враховуються)
  - `--retries` -- кількість невдалих спроб для статусу unhealthy (за замовчуванням 3)

  **Health check у Docker Compose:**
  ```yaml
  services:
    app:
      image: my-app
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
        interval: 30s
        timeout: 10s
        retries: 3
        start_period: 40s
    db:
      image: postgres
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U postgres"]
        interval: 10s
        timeout: 5s
        retries: 5
  ```

  **Перевірка статусу:**
  ```bash
  docker inspect --format='{{.State.Health.Status}}' container_name
  docker ps  # показує (healthy) або (unhealthy)
  ```

  Health checks особливо важливі для оркестраторів (Docker Swarm, Kubernetes), які використовують їх для перезапуску нездорових контейнерів.
en_answer: |
  Health checks in Docker are a mechanism for verifying container health. Docker periodically executes a command and based on the result determines the container state: **healthy**, **unhealthy**, or **starting**.

  **Health check in Dockerfile:**
  ```dockerfile
  FROM nginx:alpine
  HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1
  ```

  **Parameters:**
  - `--interval` -- interval between checks (default 30s)
  - `--timeout` -- maximum command execution time (default 30s)
  - `--start-period` -- container startup time (checks not counted)
  - `--retries` -- number of failed attempts for unhealthy status (default 3)

  **Health check in Docker Compose:**
  ```yaml
  services:
    app:
      image: my-app
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
        interval: 30s
        timeout: 10s
        retries: 3
        start_period: 40s
    db:
      image: postgres
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U postgres"]
        interval: 10s
        timeout: 5s
        retries: 5
  ```

  **Checking status:**
  ```bash
  docker inspect --format='{{.State.Health.Status}}' container_name
  docker ps  # shows (healthy) or (unhealthy)
  ```

  Health checks are especially important for orchestrators (Docker Swarm, Kubernetes), which use them to restart unhealthy containers.
section: "docker"
order: 10
tags:
  - health-checks
  - monitoring
---
