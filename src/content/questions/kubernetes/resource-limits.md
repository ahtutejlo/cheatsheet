---
ua_question: "Як налаштувати ресурсні ліміти?"
en_question: "How to configure resource limits?"
ua_answer: |
  **Resource limits** в Kubernetes дозволяють контролювати, скільки CPU та пам'яті може використовувати кожний контейнер. Це запобігає ситуації, коли один Pod споживає всі ресурси вузла.

  **Requests** -- це мінімальна кількість ресурсів, яку Kubernetes гарантує контейнеру. Scheduler використовує requests для вибору вузла. **Limits** -- це максимальна кількість ресурсів, яку контейнер може використати.

  Якщо контейнер перевищує ліміт пам'яті, він буде примусово зупинений (OOMKilled). Якщо перевищує ліміт CPU, контейнер буде throttled (сповільнений), але не зупинений.

  **LimitRange** дозволяє встановити стандартні значення для namespace, а **ResourceQuota** обмежує загальне споживання ресурсів у namespace.

  ```yaml
  spec:
    containers:
      - name: app
        image: my-app:v1
        resources:
          requests:
            cpu: "250m"       # 0.25 CPU core
            memory: "128Mi"   # 128 MiB
          limits:
            cpu: "500m"       # 0.5 CPU core
            memory: "256Mi"   # 256 MiB
  ```

  ```bash
  # Перевірка використання ресурсів
  kubectl top pods
  kubectl top nodes
  kubectl describe node my-node | grep -A 5 "Allocated resources"
  ```
en_answer: |
  **Resource limits** in Kubernetes allow you to control how much CPU and memory each container can use. This prevents a single Pod from consuming all node resources.

  **Requests** are the minimum amount of resources Kubernetes guarantees to a container. The Scheduler uses requests to select a node. **Limits** are the maximum amount of resources a container can use.

  If a container exceeds the memory limit, it will be forcefully terminated (OOMKilled). If it exceeds the CPU limit, the container will be throttled (slowed down) but not terminated.

  **LimitRange** allows setting default values for a namespace, and **ResourceQuota** limits total resource consumption in a namespace.

  ```yaml
  spec:
    containers:
      - name: app
        image: my-app:v1
        resources:
          requests:
            cpu: "250m"       # 0.25 CPU core
            memory: "128Mi"   # 128 MiB
          limits:
            cpu: "500m"       # 0.5 CPU core
            memory: "256Mi"   # 256 MiB
  ```

  ```bash
  # Check resource usage
  kubectl top pods
  kubectl top nodes
  kubectl describe node my-node | grep -A 5 "Allocated resources"
  ```
section: "kubernetes"
order: 12
tags:
  - cluster-management
---
