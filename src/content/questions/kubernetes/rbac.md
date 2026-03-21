---
ua_question: "Як працює RBAC в Kubernetes?"
en_question: "How does RBAC work in Kubernetes?"
ua_answer: |
  **RBAC** (Role-Based Access Control) -- це механізм контролю доступу в Kubernetes, що дозволяє визначати, хто і які операції може виконувати з ресурсами кластера.

  RBAC складається з чотирьох основних об'єктів:
  - **Role** -- визначає набір дозволів у межах одного namespace
  - **ClusterRole** -- визначає дозволи на рівні всього кластера
  - **RoleBinding** -- прив'язує Role до користувача або групи у namespace
  - **ClusterRoleBinding** -- прив'язує ClusterRole на рівні всього кластера

  Кожне правило у Role визначає **apiGroups** (API групу ресурсу), **resources** (тип ресурсу) та **verbs** (дозволені операції: get, list, create, update, delete).

  ```yaml
  # Role для читання Pod
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: pod-reader
    namespace: development
  rules:
    - apiGroups: [""]
      resources: ["pods", "pods/log"]
      verbs: ["get", "list", "watch"]

  ---
  # RoleBinding
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: read-pods
    namespace: development
  subjects:
    - kind: User
      name: developer@example.com
      apiGroup: rbac.authorization.k8s.io
  roleRef:
    kind: Role
    name: pod-reader
    apiGroup: rbac.authorization.k8s.io
  ```

  ```bash
  # Перевірка дозволів
  kubectl auth can-i get pods --namespace development
  kubectl auth can-i create deployments --as developer@example.com
  ```
en_answer: |
  **RBAC** (Role-Based Access Control) is an access control mechanism in Kubernetes that allows you to define who can perform which operations on cluster resources.

  RBAC consists of four main objects:
  - **Role** -- defines a set of permissions within a single namespace
  - **ClusterRole** -- defines permissions at the cluster level
  - **RoleBinding** -- binds a Role to a user or group in a namespace
  - **ClusterRoleBinding** -- binds a ClusterRole at the cluster level

  Each rule in a Role defines **apiGroups** (resource API group), **resources** (resource type), and **verbs** (allowed operations: get, list, create, update, delete).

  ```yaml
  # Role for reading Pods
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: pod-reader
    namespace: development
  rules:
    - apiGroups: [""]
      resources: ["pods", "pods/log"]
      verbs: ["get", "list", "watch"]

  ---
  # RoleBinding
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: read-pods
    namespace: development
  subjects:
    - kind: User
      name: developer@example.com
      apiGroup: rbac.authorization.k8s.io
  roleRef:
    kind: Role
    name: pod-reader
    apiGroup: rbac.authorization.k8s.io
  ```

  ```bash
  # Check permissions
  kubectl auth can-i get pods --namespace development
  kubectl auth can-i create deployments --as developer@example.com
  ```
section: "kubernetes"
order: 14
tags:
  - security
---
