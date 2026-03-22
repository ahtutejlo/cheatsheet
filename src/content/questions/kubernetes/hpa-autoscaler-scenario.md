---
ua_question: "Як налаштувати автомасштабування Pod для обробки піків трафіку?"
en_question: "How do you configure Pod autoscaling to handle traffic spikes?"
ua_answer: |
  **Scenario:** Веб-застосунок інтернет-магазину повинен витримувати 10-кратне зростання трафіку під час розпродажів. Наразі працюють 3 репліки, які обслуговують нормальне навантаження. Під час піків сервіс стає повільним, а частина запитів повертає 503.

  **Approach:**
  1. Налаштувати Horizontal Pod Autoscaler (HPA) з правильними метриками та порогами
  2. Визначити поведінку масштабування (швидкий scale-up, повільний scale-down)
  3. Переконатися, що metrics-server встановлений і Pod мають requests для CPU/memory

  **Solution:**
  ```yaml
  # HPA with scaling behavior configuration
  apiVersion: autoscaling/v2
  kind: HorizontalPodAutoscaler
  metadata:
    name: web-store-hpa
  spec:
    scaleTargetRef:
      apiVersion: apps/v1
      kind: Deployment
      name: web-store
    minReplicas: 3
    maxReplicas: 30
    metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 60
      - type: Resource
        resource:
          name: memory
          target:
            type: Utilization
            averageUtilization: 70
      - type: Pods
        pods:
          metric:
            name: http_requests_per_second
          target:
            type: AverageValue
            averageValue: "100"
    behavior:
      scaleUp:
        stabilizationWindowSeconds: 30
        policies:
          - type: Percent
            value: 100
            periodSeconds: 60
          - type: Pods
            value: 5
            periodSeconds: 60
        selectPolicy: Max
      scaleDown:
        stabilizationWindowSeconds: 300
        policies:
          - type: Percent
            value: 10
            periodSeconds: 60
  ---
  # Deployment must have resource requests
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: web-store
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: web-store
    template:
      metadata:
        labels:
          app: web-store
      spec:
        containers:
          - name: web
            image: web-store:v2
            resources:
              requests:
                cpu: "200m"
                memory: "256Mi"
              limits:
                cpu: "1000m"
                memory: "512Mi"
  ```

  ```bash
  # Verify metrics-server is running
  kubectl get pods -n kube-system | grep metrics-server

  # Check current HPA status
  kubectl get hpa web-store-hpa

  # Watch scaling events
  kubectl describe hpa web-store-hpa

  # Simulate load for testing
  kubectl run load-test --rm -it --image=busybox -- sh -c \
    "while true; do wget -q -O- http://web-store/; done"
  ```

  Ключові налаштування: швидкий scale-up (подвоєння за 60 секунд) для реакції на піки, повільний scale-down (10% за 60 секунд з вікном стабілізації 5 хвилин) для уникнення передчасного зменшення. Для кращих результатів використовуйте custom-метрики (RPS) замість лише CPU.
en_answer: |
  **Scenario:** An e-commerce web application must handle 10x traffic growth during sales events. Currently 3 replicas serve normal load. During spikes, the service becomes slow and some requests return 503.

  **Approach:**
  1. Configure Horizontal Pod Autoscaler (HPA) with correct metrics and thresholds
  2. Define scaling behavior (fast scale-up, slow scale-down)
  3. Ensure metrics-server is installed and Pods have CPU/memory requests

  **Solution:**
  ```yaml
  # HPA with scaling behavior configuration
  apiVersion: autoscaling/v2
  kind: HorizontalPodAutoscaler
  metadata:
    name: web-store-hpa
  spec:
    scaleTargetRef:
      apiVersion: apps/v1
      kind: Deployment
      name: web-store
    minReplicas: 3
    maxReplicas: 30
    metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 60
      - type: Resource
        resource:
          name: memory
          target:
            type: Utilization
            averageUtilization: 70
      - type: Pods
        pods:
          metric:
            name: http_requests_per_second
          target:
            type: AverageValue
            averageValue: "100"
    behavior:
      scaleUp:
        stabilizationWindowSeconds: 30
        policies:
          - type: Percent
            value: 100
            periodSeconds: 60
          - type: Pods
            value: 5
            periodSeconds: 60
        selectPolicy: Max
      scaleDown:
        stabilizationWindowSeconds: 300
        policies:
          - type: Percent
            value: 10
            periodSeconds: 60
  ---
  # Deployment must have resource requests
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: web-store
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: web-store
    template:
      metadata:
        labels:
          app: web-store
      spec:
        containers:
          - name: web
            image: web-store:v2
            resources:
              requests:
                cpu: "200m"
                memory: "256Mi"
              limits:
                cpu: "1000m"
                memory: "512Mi"
  ```

  ```bash
  # Verify metrics-server is running
  kubectl get pods -n kube-system | grep metrics-server

  # Check current HPA status
  kubectl get hpa web-store-hpa

  # Watch scaling events
  kubectl describe hpa web-store-hpa

  # Simulate load for testing
  kubectl run load-test --rm -it --image=busybox -- sh -c \
    "while true; do wget -q -O- http://web-store/; done"
  ```

  Key settings: fast scale-up (doubling every 60 seconds) for spike response, slow scale-down (10% per 60 seconds with 5-minute stabilization window) to avoid premature reduction. For best results, use custom metrics (RPS) instead of CPU alone.
section: "kubernetes"
order: 28
tags:
  - autoscaling
  - hpa
  - performance
type: "practical"
---
