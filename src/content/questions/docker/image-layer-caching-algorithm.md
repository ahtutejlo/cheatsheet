---
ua_question: "Як працює алгоритм кешування шарів Docker при збірці образів?"
en_question: "How does the Docker image layer caching algorithm work during builds?"
ua_answer: |
  Docker кешує кожен шар (layer) образу за результатом виконання інструкції Dockerfile. При повторній збірці Docker перевіряє, чи можна повторно використати кешований шар замість повторного виконання інструкції. Це значно прискорює збірки, але алгоритм має нюанси.

  **Правила кеш-попадання:**
  Для більшості інструкцій (`RUN`, `ENV`, `WORKDIR`) Docker порівнює текст самої інструкції з кешем. Якщо інструкція ідентична і всі попередні шари також з кешу -- це cache hit. Для `COPY` та `ADD` Docker додатково обчислює контрольну суму (checksum) кожного файлу, що копіюється -- якщо хоча б один файл змінився, кеш інвалідується.

  **Каскадна інвалідація:**
  Ключова особливість -- якщо один шар втрачає кеш, ВСІ наступні шари також перебудовуються, навіть якщо їхні інструкції не змінились. Тому порядок інструкцій у Dockerfile критично важливий для ефективного кешування.

  ```dockerfile
  # Поганий порядок -- будь-яка зміна коду інвалідує кеш залежностей
  FROM node:20-alpine
  WORKDIR /app
  COPY . .
  RUN npm ci
  RUN npm run build

  # Оптимальний порядок -- залежності кешуються окремо від коду
  FROM node:20-alpine
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  ```

  **Вплив ARG та ENV:**
  Інструкція `ARG` до `FROM` впливає на вибір базового образу. `ARG` після `FROM` стає частиною ключа кешу -- зміна значення аргументу інвалідує кеш цього шару та всіх наступних. `ENV` також впливає на кеш, оскільки змінює середовище виконання `RUN` команд.

  Для максимальної ефективності збірки розміщуйте інструкції, що рідко змінюються (залежності), на початку Dockerfile, а ті, що змінюються часто (код додатку), -- наприкінці.
en_answer: |
  Docker caches each image layer based on the result of executing a Dockerfile instruction. During a rebuild, Docker checks whether a cached layer can be reused instead of re-executing the instruction. This significantly speeds up builds, but the algorithm has important nuances.

  **Cache hit rules:**
  For most instructions (`RUN`, `ENV`, `WORKDIR`), Docker compares the instruction text against the cache. If the instruction is identical and all previous layers are also from cache -- it is a cache hit. For `COPY` and `ADD`, Docker additionally computes a checksum of each file being copied -- if even one file has changed, the cache is invalidated.

  **Cascade invalidation:**
  A key behavior -- if one layer loses its cache, ALL subsequent layers are also rebuilt, even if their instructions have not changed. This is why the order of instructions in a Dockerfile is critical for efficient caching.

  ```dockerfile
  # Bad order -- any code change invalidates the dependency cache
  FROM node:20-alpine
  WORKDIR /app
  COPY . .
  RUN npm ci
  RUN npm run build

  # Optimal order -- dependencies cached separately from code
  FROM node:20-alpine
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  ```

  **Impact of ARG and ENV:**
  An `ARG` before `FROM` affects base image selection. An `ARG` after `FROM` becomes part of the cache key -- changing its value invalidates that layer's cache and all subsequent layers. `ENV` also affects caching because it changes the execution environment of `RUN` commands.

  For maximum build efficiency, place instructions that rarely change (dependencies) at the beginning of the Dockerfile and those that change frequently (application code) at the end.
section: "docker"
order: 19
tags:
  - caching
  - layers
  - build-optimization
type: "deep"
---
