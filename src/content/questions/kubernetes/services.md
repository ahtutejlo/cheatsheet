---
ua_question: "Що таке Service в Kubernetes?"
en_question: "What is a Service in Kubernetes?"
ua_answer: |
  **Service** -- це абстракція Kubernetes, що надає стабільну мережеву точку доступу до набору Pod. Оскільки Pod є ефемерними і їхні IP-адреси змінюються, Service забезпечує постійну DNS-адресу та балансування навантаження.

  Існує кілька типів Service:
  - **ClusterIP** (за замовчуванням) -- доступний лише всередині кластера
  - **NodePort** -- відкриває порт на кожному вузлі кластера
  - **LoadBalancer** -- створює зовнішній балансувальник навантаження (у хмарних середовищах)
  - **ExternalName** -- створює CNAME-запис для зовнішнього сервісу

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: web-service
  spec:
    type: ClusterIP
    selector:
      app: web-app
    ports:
      - port: 80
        targetPort: 8080
        protocol: TCP
  ```
en_answer: |
  A **Service** is a Kubernetes abstraction that provides a stable network endpoint for a set of Pods. Since Pods are ephemeral and their IP addresses change, a Service provides a consistent DNS address and load balancing.

  There are several types of Services:
  - **ClusterIP** (default) -- accessible only within the cluster
  - **NodePort** -- exposes a port on each cluster node
  - **LoadBalancer** -- creates an external load balancer (in cloud environments)
  - **ExternalName** -- creates a CNAME record for an external service

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: web-service
  spec:
    type: ClusterIP
    selector:
      app: web-app
    ports:
      - port: 80
        targetPort: 8080
        protocol: TCP
  ```
section: "kubernetes"
order: 4
tags:
  - networking
---
