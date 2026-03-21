---
ua_question: "Як забезпечити безпеку Docker контейнерів?"
en_question: "How to secure Docker containers?"
ua_answer: |
  Безпека Docker контейнерів -- це комплекс практик на різних рівнях: образи, runtime, мережа та хост.

  **Безпека образів:**
  - Використовуйте **офіційні** та **мінімальні** базові образи (alpine, slim, distroless)
  - Скануйте образи на вразливості: `docker scout`, Trivy, Snyk
  - Не зберігайте секрети в Dockerfile або образі
  - Фіксуйте версії базових образів (не використовуйте `latest`)

  **Безпека runtime:**
  - Запускайте контейнер **не від root**:
  ```dockerfile
  FROM node:20-alpine
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser
  WORKDIR /app
  COPY --chown=appuser:appgroup . .
  ```

  - Використовуйте **read-only filesystem**: `--read-only`
  - Обмежуйте ресурси: `--memory`, `--cpus`
  - Вимикайте привілеї: `--security-opt=no-new-privileges`

  **Управління секретами:**
  - Docker Secrets (для Swarm)
  - Environment variables через `.env` файл (не в образі)
  - Зовнішні менеджери секретів (Vault, AWS Secrets Manager)

  **Мережева безпека:**
  - Ізолюйте контейнери в окремих мережах
  - Відкривайте лише необхідні порти
  - Використовуйте TLS для комунікації між сервісами
en_answer: |
  Docker container security is a set of practices at different levels: images, runtime, network, and host.

  **Image security:**
  - Use **official** and **minimal** base images (alpine, slim, distroless)
  - Scan images for vulnerabilities: `docker scout`, Trivy, Snyk
  - Do not store secrets in Dockerfile or image
  - Pin base image versions (do not use `latest`)

  **Runtime security:**
  - Run container **as non-root**:
  ```dockerfile
  FROM node:20-alpine
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser
  WORKDIR /app
  COPY --chown=appuser:appgroup . .
  ```

  - Use **read-only filesystem**: `--read-only`
  - Limit resources: `--memory`, `--cpus`
  - Disable privileges: `--security-opt=no-new-privileges`

  **Secrets management:**
  - Docker Secrets (for Swarm)
  - Environment variables via `.env` file (not in image)
  - External secret managers (Vault, AWS Secrets Manager)

  **Network security:**
  - Isolate containers in separate networks
  - Expose only necessary ports
  - Use TLS for inter-service communication
section: "docker"
order: 8
tags:
  - security
  - best-practices
---
