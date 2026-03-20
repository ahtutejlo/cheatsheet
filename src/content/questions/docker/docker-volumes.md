---
ua_question: "Що таке Docker volumes?"
en_question: "What are Docker volumes?"
ua_answer: |
  Docker volumes -- це механізм збереження даних за межами контейнера. Коли контейнер видаляється, дані у volume залишаються.

  Типи монтування:
  - **Named volumes** -- керуються Docker, зберігаються в `/var/lib/docker/volumes/`
  - **Bind mounts** -- прив'язка до конкретної директорії хоста
  - **tmpfs** -- зберігання в оперативній пам'яті

  ```bash
  # Створення named volume
  docker volume create my-data

  # Запуск з named volume
  docker run -v my-data:/app/data postgres:16

  # Запуск з bind mount
  docker run -v $(pwd)/config:/app/config nginx

  # Перегляд volumes
  docker volume ls
  ```
en_answer: |
  Docker volumes are a mechanism for persisting data outside of containers. When a container is removed, data in the volume remains.

  Mount types:
  - **Named volumes** -- managed by Docker, stored in `/var/lib/docker/volumes/`
  - **Bind mounts** -- binding to a specific host directory
  - **tmpfs** -- storage in RAM

  ```bash
  # Create named volume
  docker volume create my-data

  # Run with named volume
  docker run -v my-data:/app/data postgres:16

  # Run with bind mount
  docker run -v $(pwd)/config:/app/config nginx

  # List volumes
  docker volume ls
  ```
section: "docker"
order: 3
tags:
  - volumes
  - storage
---
