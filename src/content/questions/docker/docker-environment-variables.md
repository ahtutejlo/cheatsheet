---
ua_question: "Як передати змінні середовища в контейнер?"
en_question: "How to pass environment variables to a container?"
ua_answer: |
  Змінні середовища (environment variables) -- основний спосіб конфігурації Docker контейнерів. Вони дозволяють змінювати поведінку додатку без перезбірки образу.

  **Способи передачі:**

  **1. Через командний рядок (-e):**
  ```bash
  docker run -e DB_HOST=localhost -e DB_PORT=5432 my-app
  ```

  **2. Через .env файл (--env-file):**
  ```bash
  # .env
  DB_HOST=localhost
  DB_PORT=5432
  DB_PASSWORD=secret

  docker run --env-file .env my-app
  ```

  **3. У Dockerfile (ENV):**
  ```dockerfile
  ENV APP_PORT=8080
  ENV NODE_ENV=production
  ```

  **4. У Docker Compose:**
  ```yaml
  services:
    app:
      image: my-app
      environment:
        - DB_HOST=db
        - DB_PORT=5432
      env_file:
        - .env
  ```

  **Пріоритет:** командний рядок > docker-compose.yml > .env файл > Dockerfile ENV

  **Рекомендації:**
  - **Ніколи** не зберігайте секрети в Dockerfile або образі
  - Використовуйте `.env` файли (додайте в `.gitignore`)
  - Для production: Docker Secrets, Vault або хмарні менеджери секретів
  - Документуйте необхідні змінні в README
en_answer: |
  Environment variables are the main way to configure Docker containers. They allow changing application behavior without rebuilding the image.

  **Ways to pass variables:**

  **1. Via command line (-e):**
  ```bash
  docker run -e DB_HOST=localhost -e DB_PORT=5432 my-app
  ```

  **2. Via .env file (--env-file):**
  ```bash
  # .env
  DB_HOST=localhost
  DB_PORT=5432
  DB_PASSWORD=secret

  docker run --env-file .env my-app
  ```

  **3. In Dockerfile (ENV):**
  ```dockerfile
  ENV APP_PORT=8080
  ENV NODE_ENV=production
  ```

  **4. In Docker Compose:**
  ```yaml
  services:
    app:
      image: my-app
      environment:
        - DB_HOST=db
        - DB_PORT=5432
      env_file:
        - .env
  ```

  **Priority:** command line > docker-compose.yml > .env file > Dockerfile ENV

  **Recommendations:**
  - **Never** store secrets in Dockerfile or image
  - Use `.env` files (add to `.gitignore`)
  - For production: Docker Secrets, Vault or cloud secret managers
  - Document required variables in README
section: "docker"
order: 11
tags:
  - configuration
  - environment-variables
---
