---
ua_question: "Як працює мережа в Docker?"
en_question: "How does Docker networking work?"
ua_answer: |
  Docker надає кілька мережевих драйверів для з'єднання контейнерів між собою та із зовнішнім світом.

  **Типи мереж Docker:**

  **1. bridge (за замовчуванням)**
  - Ізольована мережа на хості
  - Контейнери спілкуються через внутрішні IP
  - Для доступу ззовні потрібен port mapping

  **2. host**
  - Контейнер використовує мережу хоста напряму
  - Немає ізоляції, але максимальна продуктивність

  **3. none**
  - Повна ізоляція, без мережі

  **4. overlay**
  - Для з'єднання контейнерів між різними хостами (Docker Swarm)

  ```bash
  # Створення кастомної мережі
  docker network create my-network

  # Запуск контейнерів в одній мережі
  docker run -d --name db --network my-network postgres
  docker run -d --name app --network my-network -p 8080:8080 my-app

  # Контейнер app може звертатися до db за іменем: "db:5432"
  ```

  **Docker Compose мережі:**
  ```yaml
  services:
    app:
      build: .
      ports:
        - "8080:8080"
    db:
      image: postgres
      # app звертається до db як "db:5432"
  ```

  В Docker Compose всі сервіси автоматично підключаються до спільної мережі і можуть знаходити один одного за іменем сервісу.
en_answer: |
  Docker provides several network drivers for connecting containers to each other and to the outside world.

  **Docker network types:**

  **1. bridge (default)**
  - Isolated network on the host
  - Containers communicate via internal IP
  - Port mapping needed for external access

  **2. host**
  - Container uses the host's network directly
  - No isolation, but maximum performance

  **3. none**
  - Complete isolation, no network

  **4. overlay**
  - For connecting containers across different hosts (Docker Swarm)

  ```bash
  # Create a custom network
  docker network create my-network

  # Run containers in the same network
  docker run -d --name db --network my-network postgres
  docker run -d --name app --network my-network -p 8080:8080 my-app

  # Container app can reach db by name: "db:5432"
  ```

  **Docker Compose networks:**
  ```yaml
  services:
    app:
      build: .
      ports:
        - "8080:8080"
    db:
      image: postgres
      # app reaches db as "db:5432"
  ```

  In Docker Compose, all services are automatically connected to a shared network and can find each other by service name.
section: "docker"
order: 4
tags:
  - networking
  - docker-compose
---
