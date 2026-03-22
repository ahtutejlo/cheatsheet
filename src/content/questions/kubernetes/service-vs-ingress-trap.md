---
ua_question: "Чи можна використовувати Ingress замість Service для доступу до застосунку?"
en_question: "Can you use Ingress instead of Service to access an application?"
ua_answer: |
  > **Trap:** Ingress та Service є взаємозамінними способами надання доступу до застосунків у Kubernetes. Насправді вони працюють на різних рівнях мережевої моделі та вирішують різні завдання.

  **Service** працює на рівні L4 (TCP/UDP) і забезпечує стабільну мережеву точку доступу до набору Pod. Він балансує трафік між Pod за IP-адресою та портом. Тип `ClusterIP` доступний лише всередині кластера, `NodePort` відкриває порт на кожному вузлі, а `LoadBalancer` створює зовнішній балансувальник.

  **Ingress** працює на рівні L7 (HTTP/HTTPS) і потребує Ingress Controller (nginx, traefik, istio). Ingress надає маршрутизацію на основі хосту та шляху URL, TLS-термінацію, та інші HTTP-специфічні функції. Важливо: Ingress не працює без Service -- він маршрутизує трафік на Service, який вже розподіляє його між Pod.

  ```yaml
  # Service -- L4 load balancing
  apiVersion: v1
  kind: Service
  metadata:
    name: web-service
  spec:
    type: ClusterIP
    selector:
      app: web
    ports:
      - port: 80
        targetPort: 8080
  ---
  # Ingress -- L7 HTTP routing (requires Service above)
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: web-ingress
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    ingressClassName: nginx
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
                  name: web-service
                  port:
                    number: 80
  ```

  Ця плутанина поширена, бо обидва пов'язані з мережевим доступом. Ключове правило: Service -- обов'язковий компонент, Ingress -- додатковий шар маршрутизації поверх нього.
en_answer: |
  > **Trap:** Ingress and Service are interchangeable ways of providing access to applications in Kubernetes. In reality, they operate at different network layers and solve different problems.

  **Service** operates at L4 (TCP/UDP) and provides a stable network endpoint for a set of Pods. It balances traffic between Pods by IP address and port. `ClusterIP` type is accessible only within the cluster, `NodePort` exposes a port on each node, and `LoadBalancer` creates an external load balancer.

  **Ingress** operates at L7 (HTTP/HTTPS) and requires an Ingress Controller (nginx, traefik, istio). Ingress provides host-based and path-based URL routing, TLS termination, and other HTTP-specific features. Importantly: Ingress does not work without a Service -- it routes traffic to a Service, which then distributes it among Pods.

  ```yaml
  # Service -- L4 load balancing
  apiVersion: v1
  kind: Service
  metadata:
    name: web-service
  spec:
    type: ClusterIP
    selector:
      app: web
    ports:
      - port: 80
        targetPort: 8080
  ---
  # Ingress -- L7 HTTP routing (requires Service above)
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: web-ingress
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    ingressClassName: nginx
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
                  name: web-service
                  port:
                    number: 80
  ```

  This confusion is common because both relate to network access. The key rule: Service is a mandatory component, Ingress is an additional routing layer on top of it.
section: "kubernetes"
order: 21
tags:
  - services
  - ingress
  - networking
type: "trick"
---
