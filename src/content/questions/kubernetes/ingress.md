---
ua_question: "Що таке Ingress в Kubernetes?"
en_question: "What is Ingress in Kubernetes?"
ua_answer: |
  **Ingress** -- це об'єкт Kubernetes, який управляє зовнішнім HTTP/HTTPS доступом до сервісів у кластері. Він забезпечує маршрутизацію на основі URL-шляхів або доменних імен, SSL/TLS термінацію та балансування навантаження.

  На відміну від Service типу LoadBalancer, який створює окремий балансувальник для кожного сервісу, Ingress дозволяє використовувати один зовнішній IP для маршрутизації трафіку до багатьох сервісів.

  Для роботи Ingress потрібен **Ingress Controller** -- це програмний компонент, який реалізує правила Ingress. Популярні контролери: **NGINX Ingress Controller**, **Traefik**, **HAProxy**.

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: app-ingress
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    tls:
      - hosts:
          - app.example.com
        secretName: tls-secret
    rules:
      - host: app.example.com
        http:
          paths:
            - path: /api
              pathType: Prefix
              backend:
                service:
                  name: api-service
                  port:
                    number: 80
            - path: /
              pathType: Prefix
              backend:
                service:
                  name: frontend-service
                  port:
                    number: 80
  ```
en_answer: |
  **Ingress** is a Kubernetes object that manages external HTTP/HTTPS access to services within the cluster. It provides URL path-based or hostname-based routing, SSL/TLS termination, and load balancing.

  Unlike a LoadBalancer-type Service that creates a separate load balancer for each service, Ingress allows using a single external IP to route traffic to multiple services.

  Ingress requires an **Ingress Controller** -- a software component that implements Ingress rules. Popular controllers include **NGINX Ingress Controller**, **Traefik**, and **HAProxy**.

  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: app-ingress
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    tls:
      - hosts:
          - app.example.com
        secretName: tls-secret
    rules:
      - host: app.example.com
        http:
          paths:
            - path: /api
              pathType: Prefix
              backend:
                service:
                  name: api-service
                  port:
                    number: 80
            - path: /
              pathType: Prefix
              backend:
                service:
                  name: frontend-service
                  port:
                    number: 80
  ```
section: "kubernetes"
order: 8
tags:
  - networking
---
