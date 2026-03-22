---
ua_question: "Чи гарантує стратегія Rolling Update нульовий простій автоматично?"
en_question: "Does the Rolling Update strategy guarantee zero downtime automatically?"
ua_answer: |
  > **Trap:** Стратегія Rolling Update автоматично забезпечує нульовий простій під час оновлення. Насправді без readiness probes, graceful shutdown та правильної конфігурації запити будуть втрачатися під час розгортання.

  Rolling Update замінює Pod поступово: створює нові Pod з новою версією, чекає їхньої готовності, потім видаляє старі. Але "готовність" за замовчуванням означає лише те, що контейнер запустився -- без readiness probe Kubernetes вважає Pod готовим одразу після старту контейнера, навіть якщо застосунок ще ініціалізується.

  Другий аспект -- **graceful shutdown**. Коли Kubernetes видаляє старий Pod, він надсилає SIGTERM і чекає `terminationGracePeriodSeconds` (за замовчуванням 30с). Але Pod видаляється з endpoints Service не миттєво, а через деякий час. Без **preStop hook** застосунок може завершитися до того, як kube-proxy оновить правила маршрутизації, і нові запити потраплять на Pod, що вже завершується.

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: web-app
  spec:
    replicas: 3
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 0  # Never reduce available pods
    selector:
      matchLabels:
        app: web
    template:
      metadata:
        labels:
          app: web
      spec:
        terminationGracePeriodSeconds: 60
        containers:
          - name: app
            image: web:v2
            ports:
              - containerPort: 8080
            readinessProbe:
              httpGet:
                path: /healthz
                port: 8080
              initialDelaySeconds: 5
              periodSeconds: 3
              failureThreshold: 3
            livenessProbe:
              httpGet:
                path: /healthz
                port: 8080
              initialDelaySeconds: 15
              periodSeconds: 10
            lifecycle:
              preStop:
                exec:
                  command: ["sh", "-c", "sleep 10"]
  ```

  Формула нульового простою: readiness probe (Pod не отримує трафік до готовності) + preStop hook з затримкою (дає час kube-proxy оновити правила) + maxUnavailable: 0 (завжди є доступні Pod) + graceful shutdown в коді застосунку.
en_answer: |
  > **Trap:** The Rolling Update strategy automatically ensures zero downtime during deployments. In reality, without readiness probes, graceful shutdown, and proper configuration, requests will be dropped during rollout.

  Rolling Update replaces Pods gradually: creates new Pods with the new version, waits for them to be ready, then deletes old ones. But "readiness" by default only means the container has started -- without a readiness probe, Kubernetes considers a Pod ready as soon as the container starts, even if the application is still initializing.

  The second aspect is **graceful shutdown**. When Kubernetes deletes an old Pod, it sends SIGTERM and waits for `terminationGracePeriodSeconds` (default 30s). But the Pod is not removed from Service endpoints instantly -- there is a delay. Without a **preStop hook**, the application may terminate before kube-proxy updates routing rules, and new requests will hit a Pod that is already shutting down.

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: web-app
  spec:
    replicas: 3
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 0  # Never reduce available pods
    selector:
      matchLabels:
        app: web
    template:
      metadata:
        labels:
          app: web
      spec:
        terminationGracePeriodSeconds: 60
        containers:
          - name: app
            image: web:v2
            ports:
              - containerPort: 8080
            readinessProbe:
              httpGet:
                path: /healthz
                port: 8080
              initialDelaySeconds: 5
              periodSeconds: 3
              failureThreshold: 3
            livenessProbe:
              httpGet:
                path: /healthz
                port: 8080
              initialDelaySeconds: 15
              periodSeconds: 10
            lifecycle:
              preStop:
                exec:
                  command: ["sh", "-c", "sleep 10"]
  ```

  The zero-downtime formula: readiness probe (Pod does not receive traffic until ready) + preStop hook with delay (gives kube-proxy time to update rules) + maxUnavailable: 0 (always have available Pods) + graceful shutdown in application code.
section: "kubernetes"
order: 24
tags:
  - deployments
  - rolling-updates
  - availability
type: "trick"
---
