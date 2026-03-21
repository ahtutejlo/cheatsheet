---
ua_question: "Що таке multi-stage builds?"
en_question: "What are multi-stage builds?"
ua_answer: |
  Multi-stage builds -- це техніка в Docker, яка дозволяє використовувати кілька `FROM` інструкцій в одному Dockerfile. Кожна `FROM` починає новий етап збірки, і з попередніх етапів можна копіювати лише потрібні артефакти.

  **Навіщо це потрібно:**
  - Зменшення розміру фінального образу
  - Відокремлення середовища збірки від середовища виконання
  - Безпека -- у фінальний образ не потрапляють інструменти збірки

  ```dockerfile
  # Етап 1: Збірка
  FROM maven:3.9-eclipse-temurin-17 AS builder
  WORKDIR /app
  COPY pom.xml .
  RUN mvn dependency:resolve
  COPY src/ ./src/
  RUN mvn package -DskipTests

  # Етап 2: Виконання
  FROM eclipse-temurin:17-jre-alpine
  WORKDIR /app
  COPY --from=builder /app/target/app.jar app.jar
  EXPOSE 8080
  CMD ["java", "-jar", "app.jar"]
  ```

  **Результат:**
  - Образ збірки (maven): ~800 MB
  - Фінальний образ (JRE alpine): ~180 MB

  **Для Node.js:**
  ```dockerfile
  FROM node:20 AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  ```

  Multi-stage builds -- стандартна практика для production Docker образів.
en_answer: |
  Multi-stage builds is a Docker technique that allows using multiple `FROM` instructions in a single Dockerfile. Each `FROM` starts a new build stage, and only needed artifacts can be copied from previous stages.

  **Why it is needed:**
  - Reducing final image size
  - Separating build environment from runtime environment
  - Security -- build tools do not end up in the final image

  ```dockerfile
  # Stage 1: Build
  FROM maven:3.9-eclipse-temurin-17 AS builder
  WORKDIR /app
  COPY pom.xml .
  RUN mvn dependency:resolve
  COPY src/ ./src/
  RUN mvn package -DskipTests

  # Stage 2: Runtime
  FROM eclipse-temurin:17-jre-alpine
  WORKDIR /app
  COPY --from=builder /app/target/app.jar app.jar
  EXPOSE 8080
  CMD ["java", "-jar", "app.jar"]
  ```

  **Result:**
  - Build image (maven): ~800 MB
  - Final image (JRE alpine): ~180 MB

  **For Node.js:**
  ```dockerfile
  FROM node:20 AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  ```

  Multi-stage builds are standard practice for production Docker images.
section: "docker"
order: 7
tags:
  - dockerfile
  - multi-stage
  - optimization
---
