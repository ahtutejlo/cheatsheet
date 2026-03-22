---
ua_question: "Як налаштувати multi-stage збірку для Spring Boot додатку з оптимальним кешуванням у CI?"
en_question: "How would you set up a multi-stage build for a Spring Boot application with optimal CI caching?"
ua_answer: |
  **Scenario:** Команда розробляє Spring Boot додаток. CI pipeline збирає Docker-образ при кожному push. Збірка займає 8 хвилин, оскільки Maven завантажує залежності щоразу заново. Потрібно оптимізувати збірку та створити мінімальний production-образ.

  **Approach:**
  1. Розділити збірку на етапи: завантаження залежностей, компіляція, runtime
  2. Використати BuildKit cache mount для кешування Maven репозиторію між збірками
  3. Застосувати Spring Boot layered JAR для оптимального Docker layer caching

  **Solution:**
  ```dockerfile
  # syntax=docker/dockerfile:1

  # Етап 1: Завантаження залежностей (кешується окремо)
  FROM maven:3.9-eclipse-temurin-21 AS deps
  WORKDIR /app
  COPY pom.xml .
  RUN --mount=type=cache,target=/root/.m2/repository \
      mvn dependency:go-offline -B

  # Етап 2: Збірка додатку
  FROM maven:3.9-eclipse-temurin-21 AS builder
  WORKDIR /app
  COPY --from=deps /root/.m2 /root/.m2
  COPY pom.xml .
  COPY src/ ./src/
  RUN --mount=type=cache,target=/root/.m2/repository \
      mvn package -DskipTests -B

  # Розпаковка layered JAR для оптимального кешування шарів
  RUN java -Djarmode=layertools -jar target/*.jar extract --destination /extracted

  # Етап 3: Runtime (мінімальний образ)
  FROM eclipse-temurin:21-jre-alpine
  WORKDIR /app

  # Копіюємо шари Spring Boot окремо (від найменш до найчастіше змінюваного)
  COPY --from=builder /extracted/dependencies/ ./
  COPY --from=builder /extracted/spring-boot-loader/ ./
  COPY --from=builder /extracted/snapshot-dependencies/ ./
  COPY --from=builder /extracted/application/ ./

  RUN addgroup -S spring && adduser -S spring -G spring
  USER spring

  EXPOSE 8080
  ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
  ```

  ```bash
  # Збірка з BuildKit
  DOCKER_BUILDKIT=1 docker build -t myapp:latest .

  # Перевірка розміру образу
  docker images myapp:latest --format "{{.Size}}"
  # Очікуваний результат: ~200-250MB (замість ~800MB з JDK)
  ```

  **Результат:** збірка в CI скорочується до 2-3 хвилин завдяки кешуванню Maven залежностей, а production-образ зменшується до ~200MB завдяки JRE-only Alpine базі та layered JAR оптимізації.
en_answer: |
  **Scenario:** A team is developing a Spring Boot application. The CI pipeline builds a Docker image on every push. The build takes 8 minutes because Maven downloads dependencies from scratch each time. The goal is to optimize the build and create a minimal production image.

  **Approach:**
  1. Split the build into stages: dependency download, compilation, runtime
  2. Use BuildKit cache mount to cache the Maven repository between builds
  3. Apply Spring Boot layered JAR for optimal Docker layer caching

  **Solution:**
  ```dockerfile
  # syntax=docker/dockerfile:1

  # Stage 1: Download dependencies (cached separately)
  FROM maven:3.9-eclipse-temurin-21 AS deps
  WORKDIR /app
  COPY pom.xml .
  RUN --mount=type=cache,target=/root/.m2/repository \
      mvn dependency:go-offline -B

  # Stage 2: Build the application
  FROM maven:3.9-eclipse-temurin-21 AS builder
  WORKDIR /app
  COPY --from=deps /root/.m2 /root/.m2
  COPY pom.xml .
  COPY src/ ./src/
  RUN --mount=type=cache,target=/root/.m2/repository \
      mvn package -DskipTests -B

  # Extract layered JAR for optimal layer caching
  RUN java -Djarmode=layertools -jar target/*.jar extract --destination /extracted

  # Stage 3: Runtime (minimal image)
  FROM eclipse-temurin:21-jre-alpine
  WORKDIR /app

  # Copy Spring Boot layers separately (from least to most frequently changed)
  COPY --from=builder /extracted/dependencies/ ./
  COPY --from=builder /extracted/spring-boot-loader/ ./
  COPY --from=builder /extracted/snapshot-dependencies/ ./
  COPY --from=builder /extracted/application/ ./

  RUN addgroup -S spring && adduser -S spring -G spring
  USER spring

  EXPOSE 8080
  ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
  ```

  ```bash
  # Build with BuildKit
  DOCKER_BUILDKIT=1 docker build -t myapp:latest .

  # Check image size
  docker images myapp:latest --format "{{.Size}}"
  # Expected result: ~200-250MB (instead of ~800MB with JDK)
  ```

  **Result:** CI build time drops to 2-3 minutes thanks to Maven dependency caching, and the production image shrinks to ~200MB thanks to the JRE-only Alpine base and layered JAR optimization.
section: "docker"
order: 28
tags:
  - multi-stage
  - java
  - ci-cd
type: "practical"
---
