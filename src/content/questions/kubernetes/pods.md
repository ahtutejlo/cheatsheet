---
ua_question: "Що таке Pod в Kubernetes?"
en_question: "What is a Pod in Kubernetes?"
ua_answer: |
  **Pod** -- це найменша одиниця розгортання в Kubernetes. Pod містить один або кілька контейнерів, які поділяють мережевий простір імен, IP-адресу та файлові томи.

  Контейнери всередині одного Pod можуть спілкуватися через `localhost` і мають доступ до спільних томів. Це робить Pod ідеальним для тісно пов'язаних процесів, таких як основний застосунок та sidecar-контейнер для логування.

  Pod є ефемерними -- вони можуть бути зупинені та перезапущені в будь-який момент. Тому для управління Pod використовуються контролери вищого рівня, такі як Deployment або StatefulSet.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: my-app
    labels:
      app: my-app
  spec:
    containers:
      - name: app
        image: nginx:1.25
        ports:
          - containerPort: 80
  ```
en_answer: |
  A **Pod** is the smallest deployable unit in Kubernetes. A Pod contains one or more containers that share a network namespace, IP address, and storage volumes.

  Containers within the same Pod can communicate via `localhost` and have access to shared volumes. This makes Pods ideal for tightly coupled processes, such as a main application and a sidecar container for logging.

  Pods are ephemeral -- they can be stopped and restarted at any time. Therefore, higher-level controllers like Deployments or StatefulSets are used to manage Pods.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: my-app
    labels:
      app: my-app
  spec:
    containers:
      - name: app
        image: nginx:1.25
        ports:
          - containerPort: 80
  ```
section: "kubernetes"
order: 2
tags:
  - core-concepts
---
