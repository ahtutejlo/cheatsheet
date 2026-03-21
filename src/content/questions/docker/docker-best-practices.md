---
ua_question: "Які найкращі практики написання Dockerfile?"
en_question: "What are Dockerfile best practices?"
ua_answer: |
  Дотримання найкращих практик при написанні Dockerfile забезпечує менші, швидші та безпечніші Docker образи.

  **1. Використовуйте мінімальні базові образи:**
  ```dockerfile
  # Погано
  FROM ubuntu:22.04

  # Добре
  FROM node:20-alpine
  ```

  **2. Multi-stage builds для зменшення розміру:**
  ```dockerfile
  FROM node:20 AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production

  FROM node:20-alpine
  COPY --from=builder /app/node_modules ./node_modules
  COPY . .
  CMD ["node", "server.js"]
  ```

  **3. Оптимізуйте кешування шарів:**
  ```dockerfile
  # Спочатку залежності (змінюються рідко)
  COPY package*.json ./
  RUN npm ci
  # Потім код (змінюється часто)
  COPY . .
  ```

  **4. Не запускайте від root:**
  ```dockerfile
  RUN adduser --disabled-password appuser
  USER appuser
  ```

  **5. Використовуйте .dockerignore:**
  ```
  node_modules
  .git
  .env
  *.md
  ```

  **6. Об'єднуйте RUN команди:**
  ```dockerfile
  RUN apt-get update && \
      apt-get install -y curl && \
      rm -rf /var/lib/apt/lists/*
  ```

  **7. Фіксуйте версії:** `FROM node:20.11-alpine` замість `FROM node:latest`

  **8. Один процес на контейнер** -- кожен контейнер повинен виконувати одну задачу.
en_answer: |
  Following best practices when writing Dockerfiles ensures smaller, faster, and more secure Docker images.

  **1. Use minimal base images:**
  ```dockerfile
  # Bad
  FROM ubuntu:22.04

  # Good
  FROM node:20-alpine
  ```

  **2. Multi-stage builds to reduce size:**
  ```dockerfile
  FROM node:20 AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production

  FROM node:20-alpine
  COPY --from=builder /app/node_modules ./node_modules
  COPY . .
  CMD ["node", "server.js"]
  ```

  **3. Optimize layer caching:**
  ```dockerfile
  # Dependencies first (change rarely)
  COPY package*.json ./
  RUN npm ci
  # Then code (changes frequently)
  COPY . .
  ```

  **4. Do not run as root:**
  ```dockerfile
  RUN adduser --disabled-password appuser
  USER appuser
  ```

  **5. Use .dockerignore:**
  ```
  node_modules
  .git
  .env
  *.md
  ```

  **6. Combine RUN commands:**
  ```dockerfile
  RUN apt-get update && \
      apt-get install -y curl && \
      rm -rf /var/lib/apt/lists/*
  ```

  **7. Pin versions:** `FROM node:20.11-alpine` instead of `FROM node:latest`

  **8. One process per container** -- each container should perform one task.
section: "docker"
order: 13
tags:
  - dockerfile
  - best-practices
---
