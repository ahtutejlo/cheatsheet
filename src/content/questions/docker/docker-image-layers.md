---
ua_question: "Що таке шари образу Docker?"
en_question: "What are Docker image layers?"
ua_answer: |
  Docker образ складається з серії незмінних шарів (layers), кожен з яких представляє інструкцію з Dockerfile. Шари кешуються та повторно використовуються, що прискорює збірку та зменшує розмір.

  **Як створюються шари:**
  ```dockerfile
  FROM openjdk:17-slim       # Шар 1: базовий образ
  WORKDIR /app               # Шар 2: створення директорії
  COPY pom.xml .             # Шар 3: копіювання pom.xml
  RUN mvn dependency:resolve # Шар 4: завантаження залежностей
  COPY src/ ./src/           # Шар 5: копіювання коду
  RUN mvn package            # Шар 6: збірка
  ```

  **Ключові принципи:**
  - Кожна інструкція `RUN`, `COPY`, `ADD` створює новий шар
  - Шари **незмінні (read-only)** -- при запуску контейнера додається записуваний шар зверху
  - Якщо шар не змінився -- він береться з **кешу**
  - Зміна одного шару інвалідує кеш всіх наступних шарів

  **Оптимізація шарів:**
  - Розміщуйте інструкції, що рідко змінюються, **на початку** Dockerfile
  - Копіюйте залежності окремо від коду (для кешування)
  - Об'єднуйте `RUN` команди з `&&` для зменшення кількості шарів

  ```bash
  # Перегляд шарів образу
  docker history my-app:latest
  ```
en_answer: |
  A Docker image consists of a series of immutable layers, each representing an instruction from the Dockerfile. Layers are cached and reused, which speeds up builds and reduces size.

  **How layers are created:**
  ```dockerfile
  FROM openjdk:17-slim       # Layer 1: base image
  WORKDIR /app               # Layer 2: create directory
  COPY pom.xml .             # Layer 3: copy pom.xml
  RUN mvn dependency:resolve # Layer 4: download dependencies
  COPY src/ ./src/           # Layer 5: copy code
  RUN mvn package            # Layer 6: build
  ```

  **Key principles:**
  - Each `RUN`, `COPY`, `ADD` instruction creates a new layer
  - Layers are **immutable (read-only)** -- a writable layer is added on top when a container runs
  - If a layer hasn't changed -- it is taken from **cache**
  - Changing one layer invalidates the cache for all subsequent layers

  **Layer optimization:**
  - Place instructions that change rarely at the **beginning** of the Dockerfile
  - Copy dependencies separately from code (for caching)
  - Combine `RUN` commands with `&&` to reduce the number of layers

  ```bash
  # View image layers
  docker history my-app:latest
  ```
section: "docker"
order: 5
tags:
  - images
  - layers
  - optimization
---
