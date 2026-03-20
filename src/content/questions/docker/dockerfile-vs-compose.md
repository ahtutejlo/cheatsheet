---
ua_question: "Яка різниця між Dockerfile і Docker Compose?"
en_question: "What is the difference between Dockerfile and Docker Compose?"
ua_answer: |
  **Dockerfile** -- описує як побудувати один образ контейнера. Це рецепт для створення образу.

  **Docker Compose** -- описує як запустити декілька контейнерів разом. Це оркестрація для локальної розробки.

  ```dockerfile
  # Dockerfile -- один контейнер
  FROM node:22-alpine
  WORKDIR /app
  COPY package.json .
  RUN npm install
  COPY . .
  CMD ["npm", "start"]
  ```

  ```yaml
  # docker-compose.yml -- декілька контейнерів
  services:
    app:
      build: .
      ports:
        - "3000:3000"
    db:
      image: postgres:16
      environment:
        POSTGRES_PASSWORD: secret
  ```
en_answer: |
  **Dockerfile** -- describes how to build a single container image. It is a recipe for creating an image.

  **Docker Compose** -- describes how to run multiple containers together. It is orchestration for local development.

  ```dockerfile
  # Dockerfile -- single container
  FROM node:22-alpine
  WORKDIR /app
  COPY package.json .
  RUN npm install
  COPY . .
  CMD ["npm", "start"]
  ```

  ```yaml
  # docker-compose.yml -- multiple containers
  services:
    app:
      build: .
      ports:
        - "3000:3000"
    db:
      image: postgres:16
      environment:
        POSTGRES_PASSWORD: secret
  ```
section: "docker"
order: 2
tags:
  - fundamentals
  - docker-compose
---
