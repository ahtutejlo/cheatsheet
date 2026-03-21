---
ua_question: "Яка різниця між контейнером та віртуальною машиною?"
en_question: "What is the difference between a container and a VM?"
ua_answer: |
  Контейнери та віртуальні машини (VM) -- це два способи ізоляції додатків, але вони працюють на різних рівнях.

  **Віртуальна машина (VM):**
  - Повна емуляція комп'ютера з **власною ОС** (Guest OS)
  - Використовує **гіпервізор** (VMware, VirtualBox, Hyper-V)
  - Розмір: гігабайти
  - Запуск: хвилини
  - Більша ізоляція

  **Контейнер (Docker):**
  - Використовує **ядро хост ОС** спільно з іншими контейнерами
  - Ізоляція через namespaces та cgroups Linux
  - Розмір: мегабайти
  - Запуск: секунди
  - Менше накладних витрат

  | Критерій | Контейнер | VM |
  |----------|-----------|-----|
  | ОС | Спільне ядро | Власна ОС |
  | Розмір | MBs | GBs |
  | Запуск | Секунди | Хвилини |
  | Продуктивність | Близька до нативної | Нижча |
  | Ізоляція | Процесна | Повна |
  | Щільність | Сотні на хості | Десятки на хості |
  | Портативність | Висока | Середня |

  **Коли що використовувати:**
  - **Контейнери** -- мікросервіси, CI/CD, масштабування, хмарні додатки
  - **VM** -- повна ізоляція, різні ОС, legacy додатки, підвищена безпека

  Контейнери та VM можна комбінувати: контейнери часто запускаються всередині VM у хмарних середовищах.
en_answer: |
  Containers and virtual machines (VMs) are two ways to isolate applications, but they work at different levels.

  **Virtual Machine (VM):**
  - Full computer emulation with its **own OS** (Guest OS)
  - Uses a **hypervisor** (VMware, VirtualBox, Hyper-V)
  - Size: gigabytes
  - Startup: minutes
  - Greater isolation

  **Container (Docker):**
  - Shares the **host OS kernel** with other containers
  - Isolation through Linux namespaces and cgroups
  - Size: megabytes
  - Startup: seconds
  - Less overhead

  | Criterion | Container | VM |
  |-----------|-----------|-----|
  | OS | Shared kernel | Own OS |
  | Size | MBs | GBs |
  | Startup | Seconds | Minutes |
  | Performance | Near native | Lower |
  | Isolation | Process-level | Full |
  | Density | Hundreds per host | Tens per host |
  | Portability | High | Medium |

  **When to use what:**
  - **Containers** -- microservices, CI/CD, scaling, cloud applications
  - **VMs** -- full isolation, different OSes, legacy applications, enhanced security

  Containers and VMs can be combined: containers often run inside VMs in cloud environments.
section: "docker"
order: 14
tags:
  - fundamentals
  - containers-vs-vms
---
