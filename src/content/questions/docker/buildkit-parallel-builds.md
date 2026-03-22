---
ua_question: "Як BuildKit виконує паралельні збірки та які можливості він додає?"
en_question: "How does BuildKit perform parallel builds and what capabilities does it add?"
ua_answer: |
  BuildKit -- це сучасний движок збірки Docker, який замінив legacy builder. Замість послідовного виконання інструкцій Dockerfile, BuildKit аналізує залежності між етапами та будує DAG (Directed Acyclic Graph), що дозволяє виконувати незалежні етапи паралельно.

  **DAG-based виконання:**
  У multi-stage Dockerfile кожен `FROM` починає новий етап. Якщо етапи не залежать один від одного (немає `COPY --from=`), BuildKit запускає їх одночасно. Навіть всередині одного етапу BuildKit може паралелізувати операції, наприклад, завантаження базових образів.

  **Ексклюзивні можливості BuildKit:**
  BuildKit підтримує build secrets (передача секретів без збереження в шарах), SSH forwarding (доступ до приватних репозиторіїв під час збірки), та cache mounts (збереження кешу пакетних менеджерів між збірками).

  ```dockerfile
  # syntax=docker/dockerfile:1
  # Увімкнення BuildKit-специфічного синтаксису

  # Етап 1: Backend (виконується паралельно з frontend)
  FROM golang:1.22-alpine AS backend
  WORKDIR /app
  COPY go.* ./
  # Cache mount для Go модулів
  RUN --mount=type=cache,target=/go/pkg/mod go mod download
  COPY . .
  RUN go build -o server .

  # Етап 2: Frontend (виконується паралельно з backend)
  FROM node:20-alpine AS frontend
  WORKDIR /app
  COPY package*.json ./
  # Cache mount для npm
  RUN --mount=type=cache,target=/root/.npm npm ci
  COPY . .
  RUN npm run build

  # Етап 3: Runtime (залежить від обох попередніх)
  FROM alpine:3.19
  # Build secret -- не зберігається в шарі
  RUN --mount=type=secret,id=api_key cat /run/secrets/api_key > /dev/null
  COPY --from=backend /app/server /usr/local/bin/
  COPY --from=frontend /app/dist /var/www/html/
  CMD ["server"]
  ```

  ```bash
  # Збірка з BuildKit та передача секрету
  DOCKER_BUILDKIT=1 docker build --secret id=api_key,src=./api_key.txt -t myapp .

  # Експорт/імпорт кешу для CI
  docker buildx build --cache-to=type=registry,ref=myrepo/cache --cache-from=type=registry,ref=myrepo/cache -t myapp .
  ```

  BuildKit є стандартом для Docker 23+ і забезпечує значне прискорення збірок у CI/CD завдяки паралелізму та кешуванню між запусками.
en_answer: |
  BuildKit is the modern Docker build engine that replaced the legacy builder. Instead of executing Dockerfile instructions sequentially, BuildKit analyzes dependencies between stages and builds a DAG (Directed Acyclic Graph), allowing independent stages to run in parallel.

  **DAG-based execution:**
  In a multi-stage Dockerfile, each `FROM` starts a new stage. If stages do not depend on each other (no `COPY --from=`), BuildKit runs them simultaneously. Even within a single stage, BuildKit can parallelize operations, such as downloading base images.

  **BuildKit-exclusive capabilities:**
  BuildKit supports build secrets (passing secrets without saving them in layers), SSH forwarding (access to private repositories during builds), and cache mounts (preserving package manager caches between builds).

  ```dockerfile
  # syntax=docker/dockerfile:1
  # Enable BuildKit-specific syntax

  # Stage 1: Backend (runs in parallel with frontend)
  FROM golang:1.22-alpine AS backend
  WORKDIR /app
  COPY go.* ./
  # Cache mount for Go modules
  RUN --mount=type=cache,target=/go/pkg/mod go mod download
  COPY . .
  RUN go build -o server .

  # Stage 2: Frontend (runs in parallel with backend)
  FROM node:20-alpine AS frontend
  WORKDIR /app
  COPY package*.json ./
  # Cache mount for npm
  RUN --mount=type=cache,target=/root/.npm npm ci
  COPY . .
  RUN npm run build

  # Stage 3: Runtime (depends on both previous stages)
  FROM alpine:3.19
  # Build secret -- not saved in layer
  RUN --mount=type=secret,id=api_key cat /run/secrets/api_key > /dev/null
  COPY --from=backend /app/server /usr/local/bin/
  COPY --from=frontend /app/dist /var/www/html/
  CMD ["server"]
  ```

  ```bash
  # Build with BuildKit and pass a secret
  DOCKER_BUILDKIT=1 docker build --secret id=api_key,src=./api_key.txt -t myapp .

  # Export/import cache for CI
  docker buildx build --cache-to=type=registry,ref=myrepo/cache --cache-from=type=registry,ref=myrepo/cache -t myapp .
  ```

  BuildKit is the default for Docker 23+ and provides significant build speedups in CI/CD through parallelism and cross-run caching.
section: "docker"
order: 20
tags:
  - buildkit
  - build-optimization
  - advanced
type: "deep"
---
