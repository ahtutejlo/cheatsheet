---
ua_question: "Чим відрізняються ENTRYPOINT та CMD і як вони взаємодіють?"
en_question: "What is the difference between ENTRYPOINT and CMD and how do they interact?"
ua_answer: |
  > **Trap:** Багато хто вважає, що `ENTRYPOINT` та `CMD` -- це альтернативні способи задати команду запуску контейнера. Насправді вони працюють разом: `ENTRYPOINT` визначає виконуваний файл, а `CMD` надає аргументи за замовчуванням.

  Коли Dockerfile містить обидві інструкції, `CMD` стає списком аргументів для `ENTRYPOINT`. При запуску контейнера через `docker run image args`, аргументи `args` замінюють `CMD`, але `ENTRYPOINT` залишається незмінним (якщо не використати `--entrypoint`).

  ```dockerfile
  # Приклад взаємодії ENTRYPOINT та CMD
  FROM alpine:3.19

  # ENTRYPOINT -- фіксований виконуваний файл
  ENTRYPOINT ["curl", "-s"]

  # CMD -- аргументи за замовчуванням
  CMD ["https://httpbin.org/ip"]
  ```

  ```bash
  # Запуск без аргументів -- використовує CMD
  docker run mycurl
  # Виконує: curl -s https://httpbin.org/ip

  # Запуск з аргументами -- CMD замінюється
  docker run mycurl https://example.com
  # Виконує: curl -s https://example.com

  # Заміна ENTRYPOINT потребує явного прапорця
  docker run --entrypoint /bin/sh mycurl -c "echo hello"
  # Виконує: /bin/sh -c "echo hello"
  ```

  **Важливий нюанс:** якщо `ENTRYPOINT` задано у shell form (`ENTRYPOINT curl -s`), то `CMD` ігнорується повністю, оскільки shell form запускає команду через `/bin/sh -c`, який не передає додаткові аргументи. Завжди використовуйте exec form (JSON-масив) для обох інструкцій.

  Ця помилка часто призводить до того, що контейнери ігнорують передані аргументи або працюють не так, як очікувалось.
en_answer: |
  > **Trap:** Many people think that `ENTRYPOINT` and `CMD` are alternative ways to set the container's startup command. In reality, they work together: `ENTRYPOINT` defines the executable, and `CMD` provides default arguments.

  When a Dockerfile contains both instructions, `CMD` becomes the list of arguments for `ENTRYPOINT`. When running a container via `docker run image args`, the `args` replace `CMD`, but `ENTRYPOINT` remains unchanged (unless `--entrypoint` is used).

  ```dockerfile
  # Example of ENTRYPOINT and CMD interaction
  FROM alpine:3.19

  # ENTRYPOINT -- fixed executable
  ENTRYPOINT ["curl", "-s"]

  # CMD -- default arguments
  CMD ["https://httpbin.org/ip"]
  ```

  ```bash
  # Run without arguments -- uses CMD
  docker run mycurl
  # Executes: curl -s https://httpbin.org/ip

  # Run with arguments -- CMD is replaced
  docker run mycurl https://example.com
  # Executes: curl -s https://example.com

  # Replacing ENTRYPOINT requires explicit flag
  docker run --entrypoint /bin/sh mycurl -c "echo hello"
  # Executes: /bin/sh -c "echo hello"
  ```

  **Important nuance:** if `ENTRYPOINT` is set in shell form (`ENTRYPOINT curl -s`), then `CMD` is completely ignored because shell form runs the command via `/bin/sh -c`, which does not pass additional arguments. Always use exec form (JSON array) for both instructions.

  This mistake often leads to containers ignoring passed arguments or behaving unexpectedly.
section: "docker"
order: 22
tags:
  - dockerfile
  - entrypoint
  - cmd
type: "trick"
---
