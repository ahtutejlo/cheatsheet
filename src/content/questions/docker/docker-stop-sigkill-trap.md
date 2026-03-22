---
ua_question: "Чи надсилає docker stop сигнал SIGKILL контейнеру?"
en_question: "Does docker stop send SIGKILL to the container?"
ua_answer: |
  > **Trap:** Багато хто вважає, що `docker stop` одразу вбиває контейнер сигналом SIGKILL. Насправді спочатку надсилається SIGTERM.

  `docker stop` працює у два етапи:
  1. Надсилає **SIGTERM** процесу PID 1 у контейнері
  2. Чекає grace period (за замовчуванням 10 секунд)
  3. Якщо процес не завершився -- надсилає **SIGKILL**

  ```bash
  # SIGTERM з 10-секундним grace period (default)
  docker stop mycontainer

  # SIGTERM з 30-секундним grace period
  docker stop -t 30 mycontainer

  # Негайний SIGKILL (без SIGTERM)
  docker kill mycontainer
  ```

  **Чому це критично:**
  Якщо ваш додаток не обробляє SIGTERM, він буде "зависати" на 10 секунд при кожному `docker stop`, поки не отримає SIGKILL. Це уповільнює деплойменти та перезапуски.

  ```dockerfile
  # Проблема: shell form не передає сигнали
  CMD node server.js
  # PID 1 = /bin/sh, Node.js не отримує SIGTERM

  # Рішення: exec form передає сигнали безпосередньо
  CMD ["node", "server.js"]
  # PID 1 = node, отримує SIGTERM напряму
  ```

  Це важливо, бо додаток повинен обробляти SIGTERM для graceful shutdown -- закривати з'єднання, зберігати стан, завершувати транзакції. На співбесіді ця тема перевіряє розуміння lifecycle контейнерів та production-ready практик.
en_answer: |
  > **Trap:** Many people assume `docker stop` immediately kills the container with SIGKILL. In reality, it first sends SIGTERM.

  `docker stop` works in two stages:
  1. Sends **SIGTERM** to PID 1 process in the container
  2. Waits for a grace period (10 seconds by default)
  3. If the process hasn't exited -- sends **SIGKILL**

  ```bash
  # SIGTERM with 10-second grace period (default)
  docker stop mycontainer

  # SIGTERM with 30-second grace period
  docker stop -t 30 mycontainer

  # Immediate SIGKILL (no SIGTERM)
  docker kill mycontainer
  ```

  **Why this is critical:**
  If your application does not handle SIGTERM, it will "hang" for 10 seconds on every `docker stop` until it receives SIGKILL. This slows down deployments and restarts.

  ```dockerfile
  # Problem: shell form does not forward signals
  CMD node server.js
  # PID 1 = /bin/sh, Node.js does not receive SIGTERM

  # Solution: exec form forwards signals directly
  CMD ["node", "server.js"]
  # PID 1 = node, receives SIGTERM directly
  ```

  This matters because the application should handle SIGTERM for graceful shutdown -- closing connections, saving state, completing transactions. In interviews, this topic tests understanding of container lifecycle and production-ready practices.
section: "docker"
order: 23
tags:
  - lifecycle
  - signals
  - graceful-shutdown
type: "trick"
---
