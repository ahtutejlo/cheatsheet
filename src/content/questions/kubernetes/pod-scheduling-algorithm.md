---
ua_question: "Як працює алгоритм планування Pod у Kubernetes?"
en_question: "How does the Pod scheduling algorithm work in Kubernetes?"
ua_answer: |
  Планувальник Kubernetes (kube-scheduler) відповідає за призначення Pod на вузли кластера. Він працює у два основних етапи: **фільтрація (predicates)** та **оцінювання (priorities)**.

  На етапі **фільтрації** планувальник відсіює вузли, які не відповідають вимогам Pod. Це включає перевірку достатності ресурсів (CPU, пам'ять), відповідність taints/tolerations, node affinity/anti-affinity правил, перевірку портів та обмежень топології. Після фільтрації залишаються лише вузли-кандидати.

  На етапі **оцінювання** кожен вузол-кандидат отримує бал за різними критеріями: рівномірність розподілу ресурсів (LeastRequestedPriority), розміщення pod affinity, мінімізація мережевих затримок та інші. Вузол з найвищим сумарним балом обирається для розміщення Pod.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: scheduling-example
  spec:
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
            - matchExpressions:
                - key: topology.kubernetes.io/zone
                  operator: In
                  values:
                    - eu-west-1a
                    - eu-west-1b
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                  - key: app
                    operator: In
                    values:
                      - web
              topologyKey: kubernetes.io/hostname
    tolerations:
      - key: "dedicated"
        operator: "Equal"
        value: "gpu"
        effect: "NoSchedule"
    containers:
      - name: app
        image: myapp:v1
        resources:
          requests:
            cpu: "500m"
            memory: "256Mi"
          limits:
            cpu: "1000m"
            memory: "512Mi"
  ```

  Розуміння алгоритму планування критичне для оптимізації розміщення робочих навантажень, забезпечення високої доступності та ефективного використання ресурсів кластера на співбесідах рівня Senior.
en_answer: |
  The Kubernetes scheduler (kube-scheduler) is responsible for assigning Pods to cluster nodes. It operates in two main phases: **filtering (predicates)** and **scoring (priorities)**.

  During the **filtering** phase, the scheduler eliminates nodes that do not meet the Pod's requirements. This includes checking resource sufficiency (CPU, memory), taint/toleration compatibility, node affinity/anti-affinity rules, port availability, and topology constraints. After filtering, only candidate nodes remain.

  During the **scoring** phase, each candidate node receives a score based on various criteria: resource distribution evenness (LeastRequestedPriority), pod affinity placement, network latency minimization, and others. The node with the highest total score is selected for Pod placement.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: scheduling-example
  spec:
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
            - matchExpressions:
                - key: topology.kubernetes.io/zone
                  operator: In
                  values:
                    - eu-west-1a
                    - eu-west-1b
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                  - key: app
                    operator: In
                    values:
                      - web
              topologyKey: kubernetes.io/hostname
    tolerations:
      - key: "dedicated"
        operator: "Equal"
        value: "gpu"
        effect: "NoSchedule"
    containers:
      - name: app
        image: myapp:v1
        resources:
          requests:
            cpu: "500m"
            memory: "256Mi"
          limits:
            cpu: "1000m"
            memory: "512Mi"
  ```

  Understanding the scheduling algorithm is critical for optimizing workload placement, ensuring high availability, and efficient cluster resource utilization in Senior-level interviews.
section: "kubernetes"
order: 16
tags:
  - scheduling
  - pods
  - architecture
type: "deep"
---
