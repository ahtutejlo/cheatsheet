---
ua_question: "Що таке CRD та патерн Operator у Kubernetes?"
en_question: "What are CRDs and the Operator pattern in Kubernetes?"
ua_answer: |
  **Custom Resource Definition (CRD)** -- це механізм розширення Kubernetes API власними типами ресурсів. CRD дозволяє визначити новий ресурс (наприклад, `PostgresCluster`), який буде зберігатися в etcd та доступний через стандартний kubectl, як і вбудовані ресурси.

  **Operator** -- це патерн, який поєднує CRD з власним контролером. Контролер спостерігає за змінами у Custom Resource та автоматизує складні операційні завдання: розгортання, масштабування, резервне копіювання, оновлення тощо. По суті, Operator кодифікує знання адміністратора у програму.

  Для створення операторів використовуються фреймворки: **controller-runtime** (Go), **Operator SDK** (scaffold для Go, Ansible, Helm), та **kubebuilder**. Вони надають scaffolding для генерації CRD-маніфестів, контролера з reconcile-функцією та автоматичної генерації RBAC-ролей.

  ```yaml
  # Custom Resource Definition
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: postgresclusters.db.example.com
  spec:
    group: db.example.com
    versions:
      - name: v1
        served: true
        storage: true
        schema:
          openAPIV3Schema:
            type: object
            properties:
              spec:
                type: object
                properties:
                  replicas:
                    type: integer
                    minimum: 1
                  version:
                    type: string
                  storage:
                    type: string
    scope: Namespaced
    names:
      plural: postgresclusters
      singular: postgrescluster
      kind: PostgresCluster
      shortNames:
        - pgc
  ---
  # Custom Resource instance
  apiVersion: db.example.com/v1
  kind: PostgresCluster
  metadata:
    name: production-db
  spec:
    replicas: 3
    version: "15.4"
    storage: "100Gi"
  ```

  ```bash
  # Apply CRD and create custom resource
  kubectl apply -f postgres-crd.yaml
  kubectl apply -f production-db.yaml

  # Interact with custom resource like any K8s resource
  kubectl get postgresclusters
  kubectl describe pgc production-db
  ```

  Знання CRD та Operator pattern є ключовим для Senior-позицій, оскільки це основний спосіб розширення Kubernetes для специфічних потреб організації.
en_answer: |
  **Custom Resource Definition (CRD)** is a mechanism for extending the Kubernetes API with custom resource types. CRD allows you to define a new resource (e.g., `PostgresCluster`) that will be stored in etcd and accessible through standard kubectl, just like built-in resources.

  **Operator** is a pattern that combines a CRD with a custom controller. The controller watches for changes to the Custom Resource and automates complex operational tasks: deployment, scaling, backup, upgrades, and more. Essentially, an Operator codifies an administrator's knowledge into software.

  Popular frameworks for building operators include: **controller-runtime** (Go), **Operator SDK** (scaffolding for Go, Ansible, Helm), and **kubebuilder**. They provide scaffolding for generating CRD manifests, a controller with a reconcile function, and automatic RBAC role generation.

  ```yaml
  # Custom Resource Definition
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: postgresclusters.db.example.com
  spec:
    group: db.example.com
    versions:
      - name: v1
        served: true
        storage: true
        schema:
          openAPIV3Schema:
            type: object
            properties:
              spec:
                type: object
                properties:
                  replicas:
                    type: integer
                    minimum: 1
                  version:
                    type: string
                  storage:
                    type: string
    scope: Namespaced
    names:
      plural: postgresclusters
      singular: postgrescluster
      kind: PostgresCluster
      shortNames:
        - pgc
  ---
  # Custom Resource instance
  apiVersion: db.example.com/v1
  kind: PostgresCluster
  metadata:
    name: production-db
  spec:
    replicas: 3
    version: "15.4"
    storage: "100Gi"
  ```

  ```bash
  # Apply CRD and create custom resource
  kubectl apply -f postgres-crd.yaml
  kubectl apply -f production-db.yaml

  # Interact with custom resource like any K8s resource
  kubectl get postgresclusters
  kubectl describe pgc production-db
  ```

  Knowledge of CRDs and the Operator pattern is essential for Senior positions, as it is the primary way to extend Kubernetes for organization-specific needs.
section: "kubernetes"
order: 20
tags:
  - crd
  - operators
  - extensibility
type: "deep"
---
