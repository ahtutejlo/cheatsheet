---
ua_question: "Що таке Docker Registry?"
en_question: "What is a Docker Registry?"
ua_answer: |
  Docker Registry -- це сховище для зберігання та розповсюдження Docker образів. Це як "GitHub для Docker образів".

  **Типи реєстрів:**
  - **Docker Hub** -- публічний реєстр за замовчуванням (hub.docker.com)
  - **AWS ECR** -- Amazon Elastic Container Registry
  - **Google GCR** -- Google Container Registry
  - **Azure ACR** -- Azure Container Registry
  - **Harbor** -- приватний open-source реєстр
  - **GitHub Container Registry (ghcr.io)** -- реєстр GitHub

  **Основні операції:**
  ```bash
  # Вхід до реєстру
  docker login registry.example.com

  # Тегування образу
  docker tag my-app:latest registry.example.com/my-app:1.0

  # Push (завантаження) образу
  docker push registry.example.com/my-app:1.0

  # Pull (завантаження) образу
  docker pull registry.example.com/my-app:1.0
  ```

  **Тегування образів:**
  - `latest` -- за замовчуванням, але не рекомендується для production
  - Семантичне версіонування: `1.0`, `1.0.1`, `1.1`
  - Git commit hash: `my-app:a1b2c3d`

  **Приватний реєстр:**
  ```bash
  # Запуск власного реєстру
  docker run -d -p 5000:5000 --name registry registry:2
  docker tag my-app localhost:5000/my-app:1.0
  docker push localhost:5000/my-app:1.0
  ```
en_answer: |
  Docker Registry is a storage for storing and distributing Docker images. It is like "GitHub for Docker images".

  **Types of registries:**
  - **Docker Hub** -- default public registry (hub.docker.com)
  - **AWS ECR** -- Amazon Elastic Container Registry
  - **Google GCR** -- Google Container Registry
  - **Azure ACR** -- Azure Container Registry
  - **Harbor** -- private open-source registry
  - **GitHub Container Registry (ghcr.io)** -- GitHub registry

  **Main operations:**
  ```bash
  # Login to registry
  docker login registry.example.com

  # Tag an image
  docker tag my-app:latest registry.example.com/my-app:1.0

  # Push image
  docker push registry.example.com/my-app:1.0

  # Pull image
  docker pull registry.example.com/my-app:1.0
  ```

  **Image tagging:**
  - `latest` -- default, but not recommended for production
  - Semantic versioning: `1.0`, `1.0.1`, `1.1`
  - Git commit hash: `my-app:a1b2c3d`

  **Private registry:**
  ```bash
  # Run your own registry
  docker run -d -p 5000:5000 --name registry registry:2
  docker tag my-app localhost:5000/my-app:1.0
  docker push localhost:5000/my-app:1.0
  ```
section: "docker"
order: 6
tags:
  - registry
  - docker-hub
---
