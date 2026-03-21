---
ua_question: "Що таке Docker Swarm?"
en_question: "What is Docker Swarm?"
ua_answer: |
  Docker Swarm -- це вбудований інструмент оркестрації контейнерів у Docker. Він дозволяє об'єднати кілька Docker хостів у кластер та управляти розгортанням сервісів.

  **Основні концепції:**
  - **Node** -- окремий Docker хост у кластері
  - **Manager node** -- управляє кластером, приймає рішення
  - **Worker node** -- виконує контейнери
  - **Service** -- визначення задачі (образ, кількість реплік, мережі)
  - **Task** -- один екземпляр контейнера

  **Основні команди:**
  ```bash
  # Ініціалізація Swarm
  docker swarm init

  # Додавання worker node
  docker swarm join --token <token> <manager-ip>:2377

  # Створення сервісу з 3 репліками
  docker service create --name web --replicas 3 -p 80:80 nginx

  # Масштабування
  docker service scale web=5

  # Перегляд сервісів
  docker service ls
  docker service ps web
  ```

  **Docker Stack (Compose для Swarm):**
  ```yaml
  version: "3.8"
  services:
    web:
      image: nginx
      deploy:
        replicas: 3
        update_config:
          parallelism: 1
          delay: 10s
        restart_policy:
          condition: on-failure
      ports:
        - "80:80"
  ```

  **Swarm vs Kubernetes:** Swarm простіший у налаштуванні, Kubernetes -- потужніший та більш гнучкий для великих production систем.
en_answer: |
  Docker Swarm is a built-in container orchestration tool in Docker. It allows combining multiple Docker hosts into a cluster and managing service deployment.

  **Core concepts:**
  - **Node** -- an individual Docker host in the cluster
  - **Manager node** -- manages the cluster, makes decisions
  - **Worker node** -- runs containers
  - **Service** -- task definition (image, replica count, networks)
  - **Task** -- a single container instance

  **Main commands:**
  ```bash
  # Initialize Swarm
  docker swarm init

  # Add a worker node
  docker swarm join --token <token> <manager-ip>:2377

  # Create a service with 3 replicas
  docker service create --name web --replicas 3 -p 80:80 nginx

  # Scaling
  docker service scale web=5

  # View services
  docker service ls
  docker service ps web
  ```

  **Docker Stack (Compose for Swarm):**
  ```yaml
  version: "3.8"
  services:
    web:
      image: nginx
      deploy:
        replicas: 3
        update_config:
          parallelism: 1
          delay: 10s
        restart_policy:
          condition: on-failure
      ports:
        - "80:80"
  ```

  **Swarm vs Kubernetes:** Swarm is simpler to set up, Kubernetes is more powerful and flexible for large production systems.
section: "docker"
order: 12
tags:
  - swarm
  - orchestration
---
