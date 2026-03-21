---
ua_question: "Як діагностувати проблеми з Docker контейнерами?"
en_question: "How to troubleshoot Docker containers?"
ua_answer: |
  Діагностика проблем з Docker контейнерами включає аналіз логів, стану контейнера, мережі та ресурсів.

  **1. Перевірка стану контейнера:**
  ```bash
  docker ps -a                    # всі контейнери (включно зупинені)
  docker inspect container_name   # детальна інформація
  docker stats                    # використання ресурсів в реальному часі
  ```

  **2. Аналіз логів:**
  ```bash
  docker logs container_name           # всі логи
  docker logs -f container_name        # слідкувати за логами
  docker logs --tail 50 container_name # останні 50 рядків
  ```

  **3. Підключення до контейнера:**
  ```bash
  docker exec -it container_name /bin/sh   # підключитись до shell
  docker exec container_name cat /etc/hosts # виконати команду
  ```

  **4. Мережева діагностика:**
  ```bash
  docker network inspect bridge
  docker exec container_name ping other_container
  docker exec container_name curl http://service:8080/health
  ```

  **5. Проблеми з образами:**
  ```bash
  docker history image_name     # шари образу
  docker image inspect image    # метадані
  ```

  **Типові проблеми та рішення:**
  - **Контейнер зупиняється одразу** -- перевірте логи, можливо CMD/ENTRYPOINT завершується
  - **Порт не доступний** -- перевірте port mapping (`-p`) та firewall
  - **Немає місця** -- `docker system prune` для очищення невикористаних ресурсів
  - **Повільна збірка** -- оптимізуйте Dockerfile шари та `.dockerignore`
  - **Permission denied** -- перевірте USER та права доступу до файлів
en_answer: |
  Troubleshooting Docker containers includes analyzing logs, container state, network, and resources.

  **1. Check container state:**
  ```bash
  docker ps -a                    # all containers (including stopped)
  docker inspect container_name   # detailed information
  docker stats                    # real-time resource usage
  ```

  **2. Log analysis:**
  ```bash
  docker logs container_name           # all logs
  docker logs -f container_name        # follow logs
  docker logs --tail 50 container_name # last 50 lines
  ```

  **3. Connect to container:**
  ```bash
  docker exec -it container_name /bin/sh   # connect to shell
  docker exec container_name cat /etc/hosts # run a command
  ```

  **4. Network diagnostics:**
  ```bash
  docker network inspect bridge
  docker exec container_name ping other_container
  docker exec container_name curl http://service:8080/health
  ```

  **5. Image issues:**
  ```bash
  docker history image_name     # image layers
  docker image inspect image    # metadata
  ```

  **Common problems and solutions:**
  - **Container stops immediately** -- check logs, CMD/ENTRYPOINT might be exiting
  - **Port not accessible** -- check port mapping (`-p`) and firewall
  - **No space left** -- `docker system prune` to clean unused resources
  - **Slow build** -- optimize Dockerfile layers and `.dockerignore`
  - **Permission denied** -- check USER and file permissions
section: "docker"
order: 15
tags:
  - troubleshooting
  - debugging
---
