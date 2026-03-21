---
ua_question: "Що таке liveness та readiness probes?"
en_question: "What are liveness and readiness probes?"
ua_answer: |
  **Health probes** -- це механізми Kubernetes для моніторингу стану контейнерів. Вони дозволяють автоматично виявляти та вирішувати проблеми зі здоров'ям застосунків.

  **Liveness Probe** перевіряє, чи контейнер все ще працює. Якщо перевірка не проходить, Kubernetes перезапускає контейнер. Використовується для виявлення deadlock або зависання.

  **Readiness Probe** перевіряє, чи контейнер готовий приймати трафік. Якщо перевірка не проходить, Pod видаляється з Service endpoints, але не перезапускається. Використовується під час завантаження або тимчасового перевантаження.

  **Startup Probe** перевіряє, чи застосунок вже запустився. Корисний для застосунків з довгим стартом, щоб liveness probe не перезапустив контейнер передчасно.

  ```yaml
  spec:
    containers:
      - name: app
        image: my-app:v1
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /healthz
            port: 8080
          failureThreshold: 30
          periodSeconds: 10
  ```
en_answer: |
  **Health probes** are Kubernetes mechanisms for monitoring container health. They allow automatic detection and resolution of application health issues.

  **Liveness Probe** checks if a container is still running. If the check fails, Kubernetes restarts the container. Used to detect deadlocks or hangs.

  **Readiness Probe** checks if a container is ready to accept traffic. If the check fails, the Pod is removed from Service endpoints but is not restarted. Used during startup or temporary overload.

  **Startup Probe** checks whether the application has started. Useful for applications with long startup times to prevent the liveness probe from restarting the container prematurely.

  ```yaml
  spec:
    containers:
      - name: app
        image: my-app:v1
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /healthz
            port: 8080
          failureThreshold: 30
          periodSeconds: 10
  ```
section: "kubernetes"
order: 11
tags:
  - monitoring
---
