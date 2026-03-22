---
ua_question: "Як працює цикл узгодження (reconciliation loop) контролерів Kubernetes?"
en_question: "How does the Kubernetes controller reconciliation loop work?"
ua_answer: |
  Контролери Kubernetes реалізують патерн **reconciliation loop** (цикл узгодження), який постійно приводить фактичний стан системи у відповідність з бажаним станом, описаним у ресурсах API. Це основа декларативної моделі Kubernetes.

  Цикл працює за принципом **watch -> diff -> act**: контролер спостерігає за змінами ресурсів через API-сервер (watch), порівнює поточний стан з бажаним (diff) і виконує дії для усунення розбіжностей (act). Наприклад, ReplicaSet контролер перевіряє кількість працюючих Pod і створює або видаляє Pod, щоб досягти заданого числа реплік.

  Важлива відмінність: контролери Kubernetes є **level-triggered** (реагують на стан), а не **edge-triggered** (реагують на подію). Це означає, що навіть якщо контролер пропустив подію, наступна ітерація циклу виявить розбіжність і виправить її. Така модель робить систему самовідновлюваною -- якщо Pod несподівано зупинився, контролер автоматично створить новий.

  ```yaml
  # ReplicaSet controller reconciliation example
  apiVersion: apps/v1
  kind: ReplicaSet
  metadata:
    name: web-rs
  spec:
    replicas: 3  # Desired state: 3 pods
    selector:
      matchLabels:
        app: web
    template:
      metadata:
        labels:
          app: web
      spec:
        containers:
          - name: web
            image: nginx:1.25
  ```

  ```bash
  # Observe controller reconciliation in action
  # Scale up: controller creates 2 new pods
  kubectl scale rs web-rs --replicas=5

  # Delete a pod: controller detects diff and recreates it
  kubectl delete pod web-rs-abc12

  # Watch controller events
  kubectl get events --field-selector reason=SuccessfulCreate --watch
  ```

  На співбесіді цей патерн демонструє глибоке розуміння архітектури Kubernetes. Він пояснює, чому Kubernetes є самовідновлюваною системою та як будувати власні контролери за тим самим принципом.
en_answer: |
  Kubernetes controllers implement the **reconciliation loop** pattern, which continuously brings the actual state of the system in line with the desired state described in API resources. This is the foundation of Kubernetes' declarative model.

  The loop works on the **watch -> diff -> act** principle: the controller watches for resource changes through the API server (watch), compares the current state with the desired state (diff), and performs actions to eliminate discrepancies (act). For example, the ReplicaSet controller checks the number of running Pods and creates or deletes Pods to reach the specified replica count.

  An important distinction: Kubernetes controllers are **level-triggered** (react to state), not **edge-triggered** (react to events). This means that even if a controller missed an event, the next loop iteration will detect the discrepancy and fix it. This model makes the system self-healing -- if a Pod unexpectedly stops, the controller automatically creates a new one.

  ```yaml
  # ReplicaSet controller reconciliation example
  apiVersion: apps/v1
  kind: ReplicaSet
  metadata:
    name: web-rs
  spec:
    replicas: 3  # Desired state: 3 pods
    selector:
      matchLabels:
        app: web
    template:
      metadata:
        labels:
          app: web
      spec:
        containers:
          - name: web
            image: nginx:1.25
  ```

  ```bash
  # Observe controller reconciliation in action
  # Scale up: controller creates 2 new pods
  kubectl scale rs web-rs --replicas=5

  # Delete a pod: controller detects diff and recreates it
  kubectl delete pod web-rs-abc12

  # Watch controller events
  kubectl get events --field-selector reason=SuccessfulCreate --watch
  ```

  In interviews, this pattern demonstrates deep understanding of Kubernetes architecture. It explains why Kubernetes is a self-healing system and how to build custom controllers following the same principle.
section: "kubernetes"
order: 19
tags:
  - controllers
  - architecture
  - reconciliation
type: "deep"
---
