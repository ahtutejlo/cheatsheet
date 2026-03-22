---
ua_question: "Як Docker використовує cgroups для ізоляції ресурсів?"
en_question: "How does Docker use cgroups for resource isolation?"
ua_answer: |
  Control Groups (cgroups) -- це механізм ядра Linux, який дозволяє обмежувати та моніторити використання ресурсів (CPU, пам'ять, I/O) групами процесів. Docker використовує cgroups для створення ресурсних обмежень кожного контейнера.

  **CPU обмеження:**
  Docker дозволяє задавати CPU shares (відносна вага), CPU quota (жорсткий ліміт) та прив'язку до конкретних ядер. CPU shares працюють лише при конкуренції за ресурси -- якщо інші контейнери не навантажені, контейнер може використовувати всі доступні ядра.

  **Обмеження пам'яті та OOM Killer:**
  Коли контейнер перевищує встановлений ліміт пам'яті, ядро Linux викликає OOM Killer, який завершує процес контейнера. Docker дозволяє налаштувати як жорсткий ліміт (`--memory`), так і м'який (`--memory-reservation`), а також вимкнути OOM Killer для критичних контейнерів.

  ```bash
  # CPU: 1.5 ядра максимум, прив'язка до ядер 0 та 1
  docker run -d --cpus="1.5" --cpuset-cpus="0,1" nginx

  # Пам'ять: 512MB жорсткий ліміт, 256MB м'який ліміт
  docker run -d --memory="512m" --memory-reservation="256m" nginx

  # Перевірити використання ресурсів контейнером
  docker stats --no-stream <container-id>

  # Переглянути cgroup ліміти контейнера (cgroups v2)
  cat /sys/fs/cgroup/docker/<container-id>/memory.max
  cat /sys/fs/cgroup/docker/<container-id>/cpu.max
  ```

  Моніторинг cgroup статистики важливий для production -- `docker stats` або читання файлів із `/sys/fs/cgroup/` дозволяє відстежувати реальне споживання ресурсів та виявляти контейнери, що наближаються до лімітів.
en_answer: |
  Control Groups (cgroups) are a Linux kernel mechanism that allows limiting and monitoring resource usage (CPU, memory, I/O) for groups of processes. Docker uses cgroups to create resource constraints for each container.

  **CPU limits:**
  Docker allows setting CPU shares (relative weight), CPU quota (hard limit), and pinning to specific cores. CPU shares only take effect under contention -- if other containers are idle, a container can use all available cores.

  **Memory limits and OOM Killer:**
  When a container exceeds its memory limit, the Linux kernel invokes the OOM Killer, which terminates the container's process. Docker allows configuring both a hard limit (`--memory`) and a soft limit (`--memory-reservation`), as well as disabling the OOM Killer for critical containers.

  ```bash
  # CPU: 1.5 cores maximum, pinned to cores 0 and 1
  docker run -d --cpus="1.5" --cpuset-cpus="0,1" nginx

  # Memory: 512MB hard limit, 256MB soft limit
  docker run -d --memory="512m" --memory-reservation="256m" nginx

  # Check container resource usage
  docker stats --no-stream <container-id>

  # View container cgroup limits (cgroups v2)
  cat /sys/fs/cgroup/docker/<container-id>/memory.max
  cat /sys/fs/cgroup/docker/<container-id>/cpu.max
  ```

  Monitoring cgroup statistics is important for production -- `docker stats` or reading files from `/sys/fs/cgroup/` allows tracking actual resource consumption and detecting containers approaching their limits.
section: "docker"
order: 17
tags:
  - cgroups
  - isolation
  - resources
type: "deep"
---
