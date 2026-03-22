---
ua_question: "Чи використовує .dockerignore такий самий синтаксис, як .gitignore?"
en_question: "Does .dockerignore use the same syntax as .gitignore?"
ua_answer: |
  > **Trap:** Поширена помилка -- вважати, що .dockerignore та .gitignore використовують ідентичний синтаксис і поведінку. Хоча вони схожі, є важливі відмінності, які можуть призвести до несподіваних результатів при збірці.

  **.dockerignore** фільтрує файли, що потрапляють у build context -- набір файлів, який Docker CLI надсилає Docker daemon перед збіркою. Це безпосередньо впливає на розмір контексту, швидкість збірки та безпеку (щоб секрети не потрапили в образ).

  **Ключові відмінності від .gitignore:**

  ```bash
  # .gitignore -- заперечення працює інтуїтивно
  *.log
  !important.log    # important.log відстежується

  # .dockerignore -- заперечення з ! має обмеження
  *
  !src/              # Включити src/
  !package.json      # Включити package.json
  # Порядок правил критичний -- останнє правило перемагає
  ```

  ```bash
  # Типовий .dockerignore для Node.js проекту
  node_modules
  npm-debug.log*
  .git
  .gitignore
  .env
  .env.*
  Dockerfile
  docker-compose*.yml
  .dockerignore
  README.md
  .vscode
  coverage
  dist
  ```

  **Важливі нюанси:**
  - Шляхи в .dockerignore відносні до кореня build context, а не до розташування .dockerignore
  - Немає підтримки `#` для коментарів у середині рядка (лише на початку)
  - Файл .dockerignore завжди має бути в корені build context
  - Відсутність .dockerignore означає, що весь build context (включно з `.git/`, `node_modules/`) надсилається daemon -- це може зробити збірку повільною на великих проектах

  Правильний .dockerignore може зменшити build context з гігабайтів до мегабайтів, значно прискоривши збірку.
en_answer: |
  > **Trap:** A common mistake is assuming that .dockerignore and .gitignore use identical syntax and behavior. While they are similar, there are important differences that can lead to unexpected results during builds.

  **.dockerignore** filters files that enter the build context -- the set of files that the Docker CLI sends to the Docker daemon before building. This directly affects context size, build speed, and security (preventing secrets from leaking into the image).

  **Key differences from .gitignore:**

  ```bash
  # .gitignore -- negation works intuitively
  *.log
  !important.log    # important.log is tracked

  # .dockerignore -- negation with ! has limitations
  *
  !src/              # Include src/
  !package.json      # Include package.json
  # Order of rules is critical -- last matching rule wins
  ```

  ```bash
  # Typical .dockerignore for a Node.js project
  node_modules
  npm-debug.log*
  .git
  .gitignore
  .env
  .env.*
  Dockerfile
  docker-compose*.yml
  .dockerignore
  README.md
  .vscode
  coverage
  dist
  ```

  **Important nuances:**
  - Paths in .dockerignore are relative to the root of the build context, not to the location of .dockerignore
  - No support for `#` comments in the middle of a line (only at the beginning)
  - The .dockerignore file must always be at the root of the build context
  - Absence of .dockerignore means the entire build context (including `.git/`, `node_modules/`) is sent to the daemon -- this can make builds slow on large projects

  A proper .dockerignore can reduce build context from gigabytes to megabytes, significantly speeding up the build.
section: "docker"
order: 25
tags:
  - dockerfile
  - build-context
  - pitfalls
type: "trick"
---
