---
ua_question: "Що таке Deployment в Kubernetes?"
en_question: "What is a Deployment in Kubernetes?"
ua_answer: |
  **Deployment** -- це контролер Kubernetes, який забезпечує декларативне управління Pod та ReplicaSet. Він дозволяє описати бажаний стан застосунку, а Kubernetes автоматично приводить поточний стан до бажаного.

  Deployment підтримує **Rolling Updates** для оновлення без простоїв, **Rollback** для відкату до попередньої версії та **масштабування** для збільшення або зменшення кількості реплік.

  Коли ви створюєте Deployment, він автоматично створює ReplicaSet, який, у свою чергу, створює та контролює необхідну кількість Pod.

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: web-app
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: web-app
    template:
      metadata:
        labels:
          app: web-app
      spec:
        containers:
          - name: web
            image: my-app:v2
            ports:
              - containerPort: 8080
  ```

  ```bash
  # Створення та управління Deployment
  kubectl apply -f deployment.yaml
  kubectl rollout status deployment/web-app
  kubectl scale deployment web-app --replicas=5
  ```
en_answer: |
  A **Deployment** is a Kubernetes controller that provides declarative management of Pods and ReplicaSets. It allows you to describe the desired state of your application, and Kubernetes automatically brings the current state to the desired one.

  Deployments support **Rolling Updates** for zero-downtime updates, **Rollback** to revert to a previous version, and **scaling** to increase or decrease the number of replicas.

  When you create a Deployment, it automatically creates a ReplicaSet, which in turn creates and manages the required number of Pods.

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: web-app
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: web-app
    template:
      metadata:
        labels:
          app: web-app
      spec:
        containers:
          - name: web
            image: my-app:v2
            ports:
              - containerPort: 8080
  ```

  ```bash
  # Create and manage Deployment
  kubectl apply -f deployment.yaml
  kubectl rollout status deployment/web-app
  kubectl scale deployment web-app --replicas=5
  ```
section: "kubernetes"
order: 3
tags:
  - workloads
---
