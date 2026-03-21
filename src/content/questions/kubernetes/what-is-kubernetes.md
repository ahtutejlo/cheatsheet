---
ua_question: "Що таке Kubernetes?"
en_question: "What is Kubernetes?"
ua_answer: |
  **Kubernetes** (K8s) -- це платформа з відкритим кодом для автоматизації розгортання, масштабування та управління контейнеризованими застосунками. Розроблений Google та переданий Cloud Native Computing Foundation (CNCF).

  Kubernetes організовує контейнери у логічні одиниці для легкого управління та виявлення сервісів. Він автоматично розподіляє навантаження між вузлами кластера, забезпечує самовідновлення при збоях та дозволяє оновлювати застосунки без простоїв.

  Основні компоненти кластера включають **Control Plane** (API Server, Scheduler, Controller Manager, etcd) та **Worker Nodes** (kubelet, kube-proxy, container runtime).

  ```bash
  # Перевірка стану кластера
  kubectl cluster-info
  kubectl get nodes
  ```
en_answer: |
  **Kubernetes** (K8s) is an open-source platform for automating the deployment, scaling, and management of containerized applications. It was developed by Google and donated to the Cloud Native Computing Foundation (CNCF).

  Kubernetes organizes containers into logical units for easy management and service discovery. It automatically distributes workloads across cluster nodes, provides self-healing on failures, and allows updating applications with zero downtime.

  Core cluster components include the **Control Plane** (API Server, Scheduler, Controller Manager, etcd) and **Worker Nodes** (kubelet, kube-proxy, container runtime).

  ```bash
  # Check cluster status
  kubectl cluster-info
  kubectl get nodes
  ```
section: "kubernetes"
order: 1
tags:
  - fundamentals
---
