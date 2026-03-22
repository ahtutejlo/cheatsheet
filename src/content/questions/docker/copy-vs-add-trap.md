---
ua_question: "Чи є COPY та ADD взаємозамінними інструкціями в Dockerfile?"
en_question: "Are COPY and ADD interchangeable instructions in a Dockerfile?"
ua_answer: |
  > **Trap:** Поширена помилка -- вважати, що `ADD` та `COPY` роблять одне й те саме і відрізняються лише назвою. Насправді `ADD` має додаткову поведінку, яка може створити несподівані проблеми.

  `COPY` виконує просте копіювання файлів або директорій з build context у файлову систему образу. `ADD` робить те саме, але має дві додаткові можливості: автоматична розпаковка tar-архівів (gzip, bzip2, xz) та підтримка URL як джерела. Саме ці "зручності" часто стають джерелом помилок.

  ```dockerfile
  # COPY -- передбачувана поведінка
  COPY app.tar.gz /opt/
  # Результат: файл app.tar.gz скопійовано як є

  # ADD -- несподівана розпаковка
  ADD app.tar.gz /opt/
  # Результат: архів автоматично розпаковано в /opt/

  # ADD з URL -- завантажує файл (але НЕ розпаковує!)
  ADD https://example.com/file.tar.gz /opt/
  # Результат: файл завантажено, але НЕ розпаковано (URL + tar = без розпаковки)
  ```

  **Best practice:** завжди використовуйте `COPY`, якщо вам не потрібна саме автоматична розпаковка локального tar-архіву. Для завантаження файлів з URL краще використовувати `RUN curl` або `RUN wget`, оскільки це дозволяє в тій самій інструкції розпакувати архів та видалити його, зменшуючи розмір шару.

  Ця відмінність часто з'являється на співбесідах як перевірка розуміння Dockerfile best practices.
en_answer: |
  > **Trap:** A common mistake is thinking that `ADD` and `COPY` do the same thing and only differ in name. In reality, `ADD` has additional behavior that can create unexpected problems.

  `COPY` performs a straightforward copy of files or directories from the build context into the image filesystem. `ADD` does the same but has two additional capabilities: automatic extraction of tar archives (gzip, bzip2, xz) and support for URLs as a source. These "conveniences" are often the source of bugs.

  ```dockerfile
  # COPY -- predictable behavior
  COPY app.tar.gz /opt/
  # Result: file app.tar.gz copied as-is

  # ADD -- unexpected extraction
  ADD app.tar.gz /opt/
  # Result: archive automatically extracted to /opt/

  # ADD with URL -- downloads the file (but does NOT extract!)
  ADD https://example.com/file.tar.gz /opt/
  # Result: file downloaded, but NOT extracted (URL + tar = no extraction)
  ```

  **Best practice:** always use `COPY` unless you specifically need automatic extraction of a local tar archive. For downloading files from URLs, prefer `RUN curl` or `RUN wget`, as this allows you to extract the archive and delete it in the same instruction, reducing the layer size.

  This distinction often appears in interviews as a test of understanding Dockerfile best practices.
section: "docker"
order: 21
tags:
  - dockerfile
  - pitfalls
  - best-practices
type: "trick"
---
