---
ua_question: "Що таке Namespaces в Kubernetes?"
en_question: "What are Namespaces in Kubernetes?"
ua_answer: |
  **Namespaces** -- це механізм логічної ізоляції ресурсів у кластері Kubernetes. Вони дозволяють розділити один фізичний кластер на кілька віртуальних кластерів для різних команд, проектів або середовищ.

  Kubernetes має кілька вбудованих Namespaces: `default` (для ресурсів без явного namespace), `kube-system` (для системних компонентів), `kube-public` (для публічних ресурсів) та `kube-node-lease` (для heartbeat вузлів).

  Namespaces дозволяють встановлювати **ResourceQuotas** для обмеження ресурсів та **NetworkPolicies** для контролю мережевого трафіку між namespace.

  ```bash
  # Управління Namespaces
  kubectl get namespaces
  kubectl create namespace staging
  kubectl get pods -n staging
  kubectl config set-context --current --namespace=staging
  ```

  ```yaml
  apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: dev-quota
    namespace: development
  spec:
    hard:
      pods: "20"
      requests.cpu: "4"
      requests.memory: 8Gi
  ```
en_answer: |
  **Namespaces** are a mechanism for logical isolation of resources within a Kubernetes cluster. They allow you to divide a single physical cluster into multiple virtual clusters for different teams, projects, or environments.

  Kubernetes has several built-in Namespaces: `default` (for resources without an explicit namespace), `kube-system` (for system components), `kube-public` (for public resources), and `kube-node-lease` (for node heartbeats).

  Namespaces allow setting **ResourceQuotas** to limit resources and **NetworkPolicies** to control network traffic between namespaces.

  ```bash
  # Managing Namespaces
  kubectl get namespaces
  kubectl create namespace staging
  kubectl get pods -n staging
  kubectl config set-context --current --namespace=staging
  ```

  ```yaml
  apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: dev-quota
    namespace: development
  spec:
    hard:
      pods: "20"
      requests.cpu: "4"
      requests.memory: 8Gi
  ```
section: "kubernetes"
order: 5
tags:
  - cluster-management
---
