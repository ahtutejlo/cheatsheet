---
ua_question: "Чи завжди безпечно встановлювати limits рівними requests для Pod?"
en_question: "Is it always safe to set resource limits equal to requests for Pods?"
ua_answer: |
  > **Trap:** Встановлення limits рівними requests -- найбезпечніший підхід, який гарантує стабільність Pod. Насправді це створює Guaranteed QoS клас, який запобігає burstable поведінці та може значно марнувати ресурси кластера.

  Kubernetes визначає три **Quality of Service (QoS)** класи на основі requests та limits: **Guaranteed** (limits == requests для всіх контейнерів), **Burstable** (requests < limits або limits не задані для частини контейнерів), **BestEffort** (жодних requests/limits). При нестачі пам'яті на вузлі Kubernetes першими видаляє BestEffort Pod, потім Burstable, і останніми Guaranteed.

  Проблема limits == requests: якщо Pod зазвичай використовує 100m CPU, але інколи потребує 500m для обробки піків, встановлення limits: 500m та requests: 500m резервує 500m постійно, навіть коли Pod простоює. Це означає, що 5 таких Pod займуть 2500m CPU, хоча реально використовують лише 500m. Натомість requests: 100m з limits: 500m дозволяє Pod використовувати піковий CPU за потреби, а планувальнику -- ефективніше розподіляти ресурси.

  ```yaml
  # Anti-pattern: wastes resources
  apiVersion: v1
  kind: Pod
  metadata:
    name: overprovisioned
  spec:
    containers:
      - name: app
        image: web:v1
        resources:
          requests:
            cpu: "1000m"    # Reserves 1 full CPU
            memory: "1Gi"
          limits:
            cpu: "1000m"    # Cannot burst above 1 CPU
            memory: "1Gi"   # OOMKilled if exceeds 1Gi
  ---
  # Better: burstable with realistic requests
  apiVersion: v1
  kind: Pod
  metadata:
    name: efficient
  spec:
    containers:
      - name: app
        image: web:v1
        resources:
          requests:
            cpu: "200m"     # Guaranteed baseline
            memory: "256Mi"
          limits:
            cpu: "1000m"    # Can burst to 1 CPU
            memory: "512Mi" # Hard memory ceiling
  ```

  Правильний підхід: використовуйте Guaranteed QoS тільки для критичних сервісів, де передбачуваність важливіша за ефективність. Для більшості робочих навантажень Burstable QoS з реалістичними requests є оптимальним вибором.
en_answer: |
  > **Trap:** Setting limits equal to requests is the safest approach that guarantees Pod stability. In reality, this creates a Guaranteed QoS class that prevents burstable behavior and can significantly waste cluster resources.

  Kubernetes defines three **Quality of Service (QoS)** classes based on requests and limits: **Guaranteed** (limits == requests for all containers), **Burstable** (requests < limits or limits not set for some containers), **BestEffort** (no requests/limits at all). When a node runs low on memory, Kubernetes evicts BestEffort Pods first, then Burstable, and Guaranteed last.

  The problem with limits == requests: if a Pod typically uses 100m CPU but occasionally needs 500m for handling spikes, setting limits: 500m and requests: 500m reserves 500m permanently, even when the Pod is idle. This means 5 such Pods occupy 2500m CPU while actually using only 500m. Instead, requests: 100m with limits: 500m allows the Pod to use peak CPU when needed while letting the scheduler allocate resources more efficiently.

  ```yaml
  # Anti-pattern: wastes resources
  apiVersion: v1
  kind: Pod
  metadata:
    name: overprovisioned
  spec:
    containers:
      - name: app
        image: web:v1
        resources:
          requests:
            cpu: "1000m"    # Reserves 1 full CPU
            memory: "1Gi"
          limits:
            cpu: "1000m"    # Cannot burst above 1 CPU
            memory: "1Gi"   # OOMKilled if exceeds 1Gi
  ---
  # Better: burstable with realistic requests
  apiVersion: v1
  kind: Pod
  metadata:
    name: efficient
  spec:
    containers:
      - name: app
        image: web:v1
        resources:
          requests:
            cpu: "200m"     # Guaranteed baseline
            memory: "256Mi"
          limits:
            cpu: "1000m"    # Can burst to 1 CPU
            memory: "512Mi" # Hard memory ceiling
  ```

  The right approach: use Guaranteed QoS only for critical services where predictability matters more than efficiency. For most workloads, Burstable QoS with realistic requests is the optimal choice.
section: "kubernetes"
order: 23
tags:
  - resources
  - qos
  - scheduling
type: "trick"
---
