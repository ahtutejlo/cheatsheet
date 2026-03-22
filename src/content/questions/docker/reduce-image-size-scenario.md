---
ua_question: "Як зменшити розмір Docker-образу Node.js додатку з 1.2GB до менше 200MB?"
en_question: "How would you reduce a Node.js Docker image from 1.2GB to under 200MB?"
ua_answer: |
  **Scenario:** Production Docker-образ Node.js додатку займає 1.2GB, що уповільнює CI/CD pipeline та деплойменти. Команда хоче зменшити розмір до менше 200MB без втрати функціональності.

  **Approach:**
  1. Замінити базовий образ `node:20` на `node:20-alpine` (зменшення з ~1GB до ~130MB)
  2. Використати multi-stage build для відокремлення збірки від runtime
  3. Оптимізувати .dockerignore та видалити dev-залежності з фінального образу

  **Solution:**
  ```dockerfile
  # Етап 1: Збірка
  FROM node:20-alpine AS builder
  WORKDIR /app

  # Спочатку копіюємо лише файли залежностей (кешування шарів)
  COPY package.json package-lock.json ./
  RUN npm ci --ignore-scripts

  # Копіюємо решту коду та збираємо
  COPY . .
  RUN npm run build

  # Видаляємо dev-залежності
  RUN npm prune --production

  # Етап 2: Runtime
  FROM node:20-alpine AS runtime
  WORKDIR /app

  # Копіюємо лише необхідне з етапу збірки
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./

  # Не запускаємо від root
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser

  EXPOSE 3000
  CMD ["node", "dist/index.js"]
  ```

  ```bash
  # .dockerignore
  node_modules
  .git
  .env*
  *.md
  tests/
  coverage/
  .vscode/
  docker-compose*.yml
  Dockerfile
  ```

  **Результат:** фінальний образ містить лише Alpine Linux (~5MB), Node.js runtime (~50MB), production залежності та скомпільований код -- загалом 100-180MB замість початкових 1.2GB.
en_answer: |
  **Scenario:** A production Docker image for a Node.js application is 1.2GB, slowing down the CI/CD pipeline and deployments. The team wants to reduce the size to under 200MB without losing functionality.

  **Approach:**
  1. Replace the base image `node:20` with `node:20-alpine` (reduction from ~1GB to ~130MB)
  2. Use multi-stage build to separate the build from runtime
  3. Optimize .dockerignore and remove dev dependencies from the final image

  **Solution:**
  ```dockerfile
  # Stage 1: Build
  FROM node:20-alpine AS builder
  WORKDIR /app

  # Copy only dependency files first (layer caching)
  COPY package.json package-lock.json ./
  RUN npm ci --ignore-scripts

  # Copy the rest of the code and build
  COPY . .
  RUN npm run build

  # Remove dev dependencies
  RUN npm prune --production

  # Stage 2: Runtime
  FROM node:20-alpine AS runtime
  WORKDIR /app

  # Copy only what is needed from the build stage
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./

  # Do not run as root
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  USER appuser

  EXPOSE 3000
  CMD ["node", "dist/index.js"]
  ```

  ```bash
  # .dockerignore
  node_modules
  .git
  .env*
  *.md
  tests/
  coverage/
  .vscode/
  docker-compose*.yml
  Dockerfile
  ```

  **Result:** the final image contains only Alpine Linux (~5MB), Node.js runtime (~50MB), production dependencies, and compiled code -- totaling 100-180MB instead of the original 1.2GB.
section: "docker"
order: 26
tags:
  - optimization
  - image-size
  - multi-stage
type: "practical"
---
