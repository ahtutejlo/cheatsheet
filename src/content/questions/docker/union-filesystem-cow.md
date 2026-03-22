---
ua_question: "Як працює Union Filesystem та Copy-on-Write у Docker?"
en_question: "How does the Union Filesystem and Copy-on-Write work in Docker?"
ua_answer: |
  Docker використовує Union Filesystem (зазвичай OverlayFS) для побудови образів із шарів (layers). Кожна інструкція в Dockerfile створює новий шар, який є лише набором змін відносно попереднього. Всі шари доступні тільки для читання, крім верхнього контейнерного шару.

  **Як працює OverlayFS:**
  OverlayFS об'єднує два каталоги -- `lowerdir` (read-only шари образу) та `upperdir` (read-write шар контейнера) -- в єдину файлову систему через `merged` точку монтування. Коли процес у контейнері читає файл, OverlayFS шукає його зверху вниз по шарах. Якщо файл знайдено у верхньому шарі, він повертається звідти; якщо ні -- пошук продовжується в нижніх шарах.

  **Copy-on-Write (CoW):**
  Коли контейнер модифікує файл із read-only шару, OverlayFS копіює весь файл у верхній (writable) шар перед записом. Це і є Copy-on-Write. Оригінальний файл у нижньому шарі залишається незмінним, що дозволяє іншим контейнерам використовувати ті самі шари образу.

  ```bash
  # Переглянути шари образу
  docker inspect --format='{{range .RootFS.Layers}}{{println .}}{{end}}' nginx:alpine

  # Переглянути точку монтування OverlayFS контейнера
  docker inspect --format='{{.GraphDriver.Data.MergedDir}}' <container-id>

  # Побачити зміни у верхньому шарі контейнера
  docker diff <container-id>
  ```

  Розуміння CoW пояснює, чому перший запис у великий файл всередині контейнера повільний (копіювання всього файлу), а наступні записи вже швидкі. Це також пояснює, чому контейнери, що активно пишуть на диск, повинні використовувати volumes замість контейнерного шару.
en_answer: |
  Docker uses a Union Filesystem (typically OverlayFS) to build images from layers. Each instruction in a Dockerfile creates a new layer, which is just a set of changes relative to the previous one. All layers are read-only, except for the top container layer.

  **How OverlayFS works:**
  OverlayFS merges two directories -- `lowerdir` (read-only image layers) and `upperdir` (read-write container layer) -- into a single filesystem via a `merged` mount point. When a process in the container reads a file, OverlayFS searches top-down through the layers. If the file is found in the upper layer, it is returned from there; otherwise, the search continues in the lower layers.

  **Copy-on-Write (CoW):**
  When a container modifies a file from a read-only layer, OverlayFS copies the entire file to the upper (writable) layer before writing. This is Copy-on-Write. The original file in the lower layer remains unchanged, allowing other containers to share the same image layers.

  ```bash
  # View image layers
  docker inspect --format='{{range .RootFS.Layers}}{{println .}}{{end}}' nginx:alpine

  # View the OverlayFS mount point of a container
  docker inspect --format='{{.GraphDriver.Data.MergedDir}}' <container-id>

  # See changes in the container's upper layer
  docker diff <container-id>
  ```

  Understanding CoW explains why the first write to a large file inside a container is slow (copying the entire file), while subsequent writes are fast. It also explains why containers that write heavily to disk should use volumes instead of the container layer.
section: "docker"
order: 16
tags:
  - filesystem
  - internals
  - layers
type: "deep"
---
