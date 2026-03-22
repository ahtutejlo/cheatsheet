---
ua_question: "Як вирішити проблему, коли контейнер додатку стартує раніше, ніж база даних готова приймати з'єднання?"
en_question: "How would you solve the problem of an application container starting before the database is ready to accept connections?"
ua_answer: |
  **Scenario:** В Docker Compose проекті контейнер бекенд-додатку стартує одночасно з контейнером PostgreSQL. Додаток намагається підключитися до бази при старті, отримує "Connection refused" і падає з помилкою. Перезапуск через `restart: always` допомагає, але створює зайві помилки в логах та затримку.

  **Approach:**
  1. Додати HEALTHCHECK до контейнера бази даних для моніторингу реальної готовності
  2. Використати `depends_on` з condition `service_healthy` для контролю порядку старту
  3. Додати retry-логіку в сам додаток як додатковий рівень захисту

  **Solution:**
  ```yaml
  # docker-compose.yml
  services:
    db:
      image: postgres:16-alpine
      environment:
        POSTGRES_DB: myapp
        POSTGRES_USER: app
        POSTGRES_PASSWORD: secret
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U app -d myapp"]
        interval: 5s
        timeout: 3s
        retries: 5
        start_period: 10s
      volumes:
        - pgdata:/var/lib/postgresql/data

    app:
      build: .
      ports:
        - "8080:8080"
      environment:
        DATABASE_URL: "postgresql://app:secret@db:5432/myapp"
      depends_on:
        db:
          condition: service_healthy
      restart: on-failure

  volumes:
    pgdata:
  ```

  ```dockerfile
  # Dockerfile з власним HEALTHCHECK для додатку
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --production
  COPY . .

  HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

  EXPOSE 8080
  CMD ["node", "server.js"]
  ```

  **Важливо:** `depends_on` з condition гарантує порядок старту лише в Docker Compose. В Kubernetes використовуються init containers та readiness probes для аналогічної мети. Додаток все одно повинен мати retry-логіку підключення до бази, оскільки мережеві проблеми можуть виникнути в будь-який момент.
en_answer: |
  **Scenario:** In a Docker Compose project, a backend application container starts simultaneously with a PostgreSQL container. The application tries to connect to the database at startup, gets "Connection refused", and crashes with an error. Restarting via `restart: always` helps but creates unnecessary log errors and delays.

  **Approach:**
  1. Add HEALTHCHECK to the database container to monitor actual readiness
  2. Use `depends_on` with condition `service_healthy` to control startup order
  3. Add retry logic in the application itself as an additional safety layer

  **Solution:**
  ```yaml
  # docker-compose.yml
  services:
    db:
      image: postgres:16-alpine
      environment:
        POSTGRES_DB: myapp
        POSTGRES_USER: app
        POSTGRES_PASSWORD: secret
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U app -d myapp"]
        interval: 5s
        timeout: 3s
        retries: 5
        start_period: 10s
      volumes:
        - pgdata:/var/lib/postgresql/data

    app:
      build: .
      ports:
        - "8080:8080"
      environment:
        DATABASE_URL: "postgresql://app:secret@db:5432/myapp"
      depends_on:
        db:
          condition: service_healthy
      restart: on-failure

  volumes:
    pgdata:
  ```

  ```dockerfile
  # Dockerfile with custom HEALTHCHECK for the application
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --production
  COPY . .

  HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

  EXPOSE 8080
  CMD ["node", "server.js"]
  ```

  **Important:** `depends_on` with condition guarantees startup order only in Docker Compose. In Kubernetes, init containers and readiness probes serve the same purpose. The application should still have retry logic for database connections, since network issues can occur at any time.
section: "docker"
order: 29
tags:
  - health-checks
  - compose
  - dependencies
type: "practical"
---
