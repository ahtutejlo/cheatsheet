---
ua_question: "Як реалізувати blue-green деплоймент у Kubernetes?"
en_question: "How do you implement a blue-green deployment in Kubernetes?"
ua_answer: |
  **Scenario:** Критичний платіжний сервіс потребує оновлення до нової версії з можливістю миттєвого відкату. Стратегія Rolling Update не підходить, бо під час розгортання працюватимуть обидві версії одночасно, що може спричинити несумісність у обробці платежів.

  **Approach:**
  1. Створити два окремі Deployment (blue -- поточна версія, green -- нова версія)
  2. Після успішної перевірки green-середовища переключити Service selector на green
  3. У разі проблем -- миттєво переключити selector назад на blue

  **Solution:**
  ```yaml
  # Blue deployment (current version)
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: payment-blue
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: payment
        version: blue
    template:
      metadata:
        labels:
          app: payment
          version: blue
      spec:
        containers:
          - name: payment
            image: payment-service:v1.4.0
            ports:
              - containerPort: 8080
            readinessProbe:
              httpGet:
                path: /health
                port: 8080
  ---
  # Green deployment (new version)
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: payment-green
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: payment
        version: green
    template:
      metadata:
        labels:
          app: payment
          version: green
      spec:
        containers:
          - name: payment
            image: payment-service:v1.5.0
            ports:
              - containerPort: 8080
            readinessProbe:
              httpGet:
                path: /health
                port: 8080
  ---
  # Service -- switch between blue and green
  apiVersion: v1
  kind: Service
  metadata:
    name: payment-service
  spec:
    selector:
      app: payment
      version: blue  # Change to "green" to switch
    ports:
      - port: 80
        targetPort: 8080
  ```

  ```bash
  # Deploy green version alongside blue
  kubectl apply -f payment-green.yaml

  # Verify green is healthy
  kubectl get pods -l version=green
  kubectl port-forward svc/payment-green-test 9090:80

  # Switch traffic to green
  kubectl patch svc payment-service -p '{"spec":{"selector":{"version":"green"}}}'

  # Instant rollback if needed
  kubectl patch svc payment-service -p '{"spec":{"selector":{"version":"blue"}}}'

  # Clean up old blue after verification
  kubectl delete deployment payment-blue
  ```

  Перевага blue-green: перемикання відбувається миттєво (зміна selector), і обидві версії повністю ізольовані. Недолік -- подвійне споживання ресурсів під час деплою.
en_answer: |
  **Scenario:** A critical payment service needs to be updated to a new version with instant rollback capability. The Rolling Update strategy is not suitable because during rollout both versions would run simultaneously, potentially causing payment processing incompatibilities.

  **Approach:**
  1. Create two separate Deployments (blue -- current version, green -- new version)
  2. After successfully verifying the green environment, switch the Service selector to green
  3. In case of problems -- instantly switch the selector back to blue

  **Solution:**
  ```yaml
  # Blue deployment (current version)
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: payment-blue
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: payment
        version: blue
    template:
      metadata:
        labels:
          app: payment
          version: blue
      spec:
        containers:
          - name: payment
            image: payment-service:v1.4.0
            ports:
              - containerPort: 8080
            readinessProbe:
              httpGet:
                path: /health
                port: 8080
  ---
  # Green deployment (new version)
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: payment-green
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: payment
        version: green
    template:
      metadata:
        labels:
          app: payment
          version: green
      spec:
        containers:
          - name: payment
            image: payment-service:v1.5.0
            ports:
              - containerPort: 8080
            readinessProbe:
              httpGet:
                path: /health
                port: 8080
  ---
  # Service -- switch between blue and green
  apiVersion: v1
  kind: Service
  metadata:
    name: payment-service
  spec:
    selector:
      app: payment
      version: blue  # Change to "green" to switch
    ports:
      - port: 80
        targetPort: 8080
  ```

  ```bash
  # Deploy green version alongside blue
  kubectl apply -f payment-green.yaml

  # Verify green is healthy
  kubectl get pods -l version=green
  kubectl port-forward svc/payment-green-test 9090:80

  # Switch traffic to green
  kubectl patch svc payment-service -p '{"spec":{"selector":{"version":"green"}}}'

  # Instant rollback if needed
  kubectl patch svc payment-service -p '{"spec":{"selector":{"version":"blue"}}}'

  # Clean up old blue after verification
  kubectl delete deployment payment-blue
  ```

  The advantage of blue-green: switching happens instantly (selector change), and both versions are fully isolated. The downside is double resource consumption during deployment.
section: "kubernetes"
order: 27
tags:
  - deployments
  - blue-green
  - release-strategy
type: "practical"
---
