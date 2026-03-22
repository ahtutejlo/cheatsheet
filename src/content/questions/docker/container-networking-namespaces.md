---
ua_question: "Як працюють мережеві namespaces у контейнерах Docker?"
en_question: "How do network namespaces work in Docker containers?"
ua_answer: |
  Docker використовує мережеві namespaces ядра Linux для ізоляції мережевого стеку кожного контейнера. Кожен контейнер отримує власний мережевий namespace з окремими інтерфейсами, таблицею маршрутизації, правилами iptables та портами.

  **Як Docker створює мережу контейнера:**
  При запуску контейнера в bridge-мережі Docker створює пару віртуальних інтерфейсів (veth pair). Один кінець veth розміщується всередині мережевого namespace контейнера як `eth0`, інший -- підключається до віртуального мосту `docker0` на хості. Всі контейнери в одній bridge-мережі під'єднані до спільного мосту і можуть спілкуватися між собою через нього.

  **Комунікація між контейнерами:**
  Коли контейнер A відправляє пакет контейнеру B в тій самій мережі, пакет проходить через veth пару контейнера A до мосту docker0, а потім через veth пару контейнера B до його мережевого namespace. DNS-резолюція імен контейнерів забезпечується вбудованим DNS-сервером Docker (127.0.0.11).

  ```bash
  # Переглянути мережеві namespaces
  sudo ls /var/run/docker/netns/

  # Переглянути інтерфейси всередині контейнера
  docker exec <container-id> ip addr show

  # Переглянути veth пари на хості
  ip link show type veth

  # Переглянути правила мосту docker0
  brctl show docker0

  # Переглянути iptables NAT правила для port mapping
  sudo iptables -t nat -L -n | grep DNAT
  ```

  Розуміння мережевих namespaces допомагає діагностувати проблеми з мережею між контейнерами -- якщо контейнер не може досягти іншого, варто перевірити, чи обидва підключені до однієї мережі, чи працює DNS-резолюція, та чи немає конфліктів iptables.
en_answer: |
  Docker uses Linux kernel network namespaces to isolate the network stack of each container. Each container gets its own network namespace with separate interfaces, routing table, iptables rules, and ports.

  **How Docker creates a container's network:**
  When starting a container in a bridge network, Docker creates a virtual interface pair (veth pair). One end of the veth is placed inside the container's network namespace as `eth0`, the other is connected to the `docker0` virtual bridge on the host. All containers in the same bridge network are attached to a shared bridge and can communicate through it.

  **Container-to-container communication:**
  When container A sends a packet to container B on the same network, the packet travels through container A's veth pair to the docker0 bridge, then through container B's veth pair into its network namespace. DNS resolution of container names is provided by Docker's embedded DNS server (127.0.0.11).

  ```bash
  # View network namespaces
  sudo ls /var/run/docker/netns/

  # View interfaces inside a container
  docker exec <container-id> ip addr show

  # View veth pairs on the host
  ip link show type veth

  # View docker0 bridge rules
  brctl show docker0

  # View iptables NAT rules for port mapping
  sudo iptables -t nat -L -n | grep DNAT
  ```

  Understanding network namespaces helps diagnose networking issues between containers -- if a container cannot reach another, you should check whether both are attached to the same network, whether DNS resolution works, and whether there are iptables conflicts.
section: "docker"
order: 18
tags:
  - networking
  - namespaces
  - internals
type: "deep"
---
