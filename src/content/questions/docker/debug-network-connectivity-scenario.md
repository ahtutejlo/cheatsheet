---
ua_question: "Як діагностувати проблему, коли один контейнер не може з'єднатися з іншим у Docker-мережі?"
en_question: "How would you debug a container that cannot connect to another container on the same Docker network?"
ua_answer: |
  **Scenario:** Контейнер з бекенд-додатком (app) не може з'єднатися з контейнером бази даних (db) в одній Docker-мережі. Команда `curl db:5432` з контейнера app завершується таймаутом.

  **Approach:**
  1. Перевірити, що обидва контейнери підключені до однієї мережі
  2. Верифікувати DNS-резолюцію імен контейнерів
  3. Перевірити порти, firewall-правила та стан цільового контейнера

  **Solution:**
  ```bash
  # Крок 1: Перевірити мережі обох контейнерів
  docker inspect app --format='{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
  docker inspect db --format='{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
  # Обидва повинні бути в одній мережі

  # Крок 2: Перевірити IP-адреси в мережі
  docker network inspect my-network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'

  # Крок 3: Перевірити DNS-резолюцію з контейнера app
  docker exec app nslookup db
  # Якщо DNS не працює -- контейнери в різних мережах

  # Крок 4: Перевірити з'єднання на рівні мережі
  docker exec app ping -c 3 db
  docker exec app nc -zv db 5432

  # Крок 5: Перевірити, що порт прослуховується в контейнері db
  docker exec db ss -tlnp | grep 5432

  # Крок 6: Перевірити логи контейнера db
  docker logs db --tail 50
  ```

  ```bash
  # Типові рішення:

  # Проблема: контейнери в різних мережах
  docker network connect my-network app

  # Проблема: контейнер db не прослуховує 0.0.0.0
  # В конфігурації PostgreSQL: listen_addresses = '*'

  # Проблема: docker-compose створив мережу з префіксом проєкту
  # Ім'я мережі: projectname_default, а не просто default
  docker network ls | grep projectname
  ```

  **Ключовий момент:** Docker DNS працює лише в user-defined мережах. У default bridge мережі контейнери можуть спілкуватися лише через IP-адреси, а не через імена. Завжди створюйте custom network або використовуйте Docker Compose.
en_answer: |
  **Scenario:** A backend application container (app) cannot connect to a database container (db) on the same Docker network. Running `curl db:5432` from the app container results in a timeout.

  **Approach:**
  1. Verify that both containers are attached to the same network
  2. Verify DNS resolution of container names
  3. Check ports, firewall rules, and the target container's status

  **Solution:**
  ```bash
  # Step 1: Check networks of both containers
  docker inspect app --format='{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
  docker inspect db --format='{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
  # Both must be on the same network

  # Step 2: Check IP addresses in the network
  docker network inspect my-network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'

  # Step 3: Verify DNS resolution from the app container
  docker exec app nslookup db
  # If DNS fails -- containers are on different networks

  # Step 4: Test connectivity at network level
  docker exec app ping -c 3 db
  docker exec app nc -zv db 5432

  # Step 5: Check that the port is listening in the db container
  docker exec db ss -tlnp | grep 5432

  # Step 6: Check db container logs
  docker logs db --tail 50
  ```

  ```bash
  # Common fixes:

  # Problem: containers on different networks
  docker network connect my-network app

  # Problem: db container not listening on 0.0.0.0
  # In PostgreSQL config: listen_addresses = '*'

  # Problem: docker-compose created a network with project prefix
  # Network name: projectname_default, not just default
  docker network ls | grep projectname
  ```

  **Key point:** Docker DNS only works in user-defined networks. In the default bridge network, containers can only communicate via IP addresses, not names. Always create a custom network or use Docker Compose.
section: "docker"
order: 27
tags:
  - networking
  - debugging
  - troubleshooting
type: "practical"
---
