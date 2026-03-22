---
ua_question: "Чи завжди bind mount має коректні права доступу всередині контейнера?"
en_question: "Do bind mounts always have correct permissions inside the container?"
ua_answer: |
  > **Trap:** Поширена помилка -- вважати, що якщо файл доступний на хості, то він буде доступний і всередині контейнера при bind mount. Насправді невідповідність UID/GID між хостом та контейнером часто призводить до "Permission denied".

  Коли ви монтуєте директорію з хоста у контейнер через bind mount, файли зберігають свої оригінальні UID/GID з хоста. Але процес всередині контейнера працює під іншим користувачем (часто root з UID 0, або спеціальний користувач типу `node`, `nginx`). Якщо UID процесу в контейнері не збігається з UID власника файлу на хості -- доступ буде заборонено.

  ```bash
  # На хості: файли належать користувачу з UID 1000
  ls -ln ./data/
  # -rw-r--r-- 1 1000 1000 config.json

  # В контейнері: процес працює як UID 101 (nginx)
  docker run -v ./data:/app/data nginx
  # nginx не може читати /app/data/config.json -- Permission denied!

  # Рішення 1: Запустити контейнер з потрібним UID
  docker run -u 1000:1000 -v ./data:/app/data nginx

  # Рішення 2: Використати named volume (Docker керує правами)
  docker volume create mydata
  docker run -v mydata:/app/data nginx

  # Рішення 3: Встановити права в Dockerfile
  # RUN chown -R nginx:nginx /app/data
  ```

  **Named volumes vs bind mounts:**
  Named volumes створюються та управляються Docker, який автоматично встановлює правильні права при першому використанні. Bind mounts безпосередньо прив'язують хостову директорію без жодних модифікацій прав. Для production рекомендується використовувати named volumes для даних додатку.

  Ця проблема особливо часто виникає на macOS та Windows, де Docker Desktop використовує віртуальну машину з іншим маппінгом UID/GID.
en_answer: |
  > **Trap:** A common mistake is assuming that if a file is accessible on the host, it will also be accessible inside the container via bind mount. In reality, UID/GID mismatch between host and container often leads to "Permission denied".

  When you mount a host directory into a container via bind mount, files retain their original UID/GID from the host. But the process inside the container runs under a different user (often root with UID 0, or a dedicated user like `node`, `nginx`). If the container process's UID does not match the file owner's UID on the host -- access is denied.

  ```bash
  # On host: files owned by user with UID 1000
  ls -ln ./data/
  # -rw-r--r-- 1 1000 1000 config.json

  # In container: process runs as UID 101 (nginx)
  docker run -v ./data:/app/data nginx
  # nginx cannot read /app/data/config.json -- Permission denied!

  # Solution 1: Run container with the required UID
  docker run -u 1000:1000 -v ./data:/app/data nginx

  # Solution 2: Use a named volume (Docker manages permissions)
  docker volume create mydata
  docker run -v mydata:/app/data nginx

  # Solution 3: Set permissions in Dockerfile
  # RUN chown -R nginx:nginx /app/data
  ```

  **Named volumes vs bind mounts:**
  Named volumes are created and managed by Docker, which automatically sets correct permissions on first use. Bind mounts directly attach the host directory without any permission modifications. For production, it is recommended to use named volumes for application data.

  This problem is especially common on macOS and Windows, where Docker Desktop uses a virtual machine with different UID/GID mapping.
section: "docker"
order: 24
tags:
  - volumes
  - permissions
  - security
type: "trick"
---
