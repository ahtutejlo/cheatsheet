---
ua_question: "Як працює логування в Docker?"
en_question: "How does logging work in Docker?"
ua_answer: |
  Docker перехоплює стандартні потоки виводу (stdout та stderr) контейнера і зберігає їх як логи. Це основний механізм логування в Docker.

  **Перегляд логів:**
  ```bash
  # Останні логи
  docker logs container_name

  # Слідкувати за логами в реальному часі
  docker logs -f container_name

  # Останні 100 рядків
  docker logs --tail 100 container_name

  # Логи з часовими мітками
  docker logs -t container_name

  # Логи за період
  docker logs --since 2024-01-01T00:00:00 container_name
  ```

  **Logging drivers (драйвери логування):**
  - **json-file** -- за замовчуванням, зберігає логи в JSON файлах
  - **syslog** -- відправляє в syslog
  - **fluentd** -- відправляє у Fluentd
  - **awslogs** -- відправляє в AWS CloudWatch
  - **gelf** -- для Graylog

  **Обмеження розміру логів (важливо для production):**
  ```json
  {
    "log-driver": "json-file",
    "log-opts": {
      "max-size": "10m",
      "max-file": "3"
    }
  }
  ```

  **Рекомендації:**
  - Додаток повинен писати логи в **stdout/stderr**, а не у файли
  - Налаштуйте ротацію логів для запобігання заповнення диска
  - Для production використовуйте централізоване логування (ELK, Grafana Loki)
en_answer: |
  Docker captures standard output streams (stdout and stderr) from containers and stores them as logs. This is the main logging mechanism in Docker.

  **Viewing logs:**
  ```bash
  # Latest logs
  docker logs container_name

  # Follow logs in real time
  docker logs -f container_name

  # Last 100 lines
  docker logs --tail 100 container_name

  # Logs with timestamps
  docker logs -t container_name

  # Logs for a period
  docker logs --since 2024-01-01T00:00:00 container_name
  ```

  **Logging drivers:**
  - **json-file** -- default, stores logs in JSON files
  - **syslog** -- sends to syslog
  - **fluentd** -- sends to Fluentd
  - **awslogs** -- sends to AWS CloudWatch
  - **gelf** -- for Graylog

  **Log size limits (important for production):**
  ```json
  {
    "log-driver": "json-file",
    "log-opts": {
      "max-size": "10m",
      "max-file": "3"
    }
  }
  ```

  **Recommendations:**
  - Application should write logs to **stdout/stderr**, not to files
  - Configure log rotation to prevent disk filling
  - For production use centralized logging (ELK, Grafana Loki)
section: "docker"
order: 9
tags:
  - logging
  - monitoring
---
