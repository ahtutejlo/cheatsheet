---
ua_question: "Як працюють Rolling Updates?"
en_question: "How do Rolling Updates work?"
ua_answer: |
  **Rolling Updates** -- це стратегія оновлення Deployment у Kubernetes, яка поступово замінює старі Pod на нові без простою застосунку. Це стратегія за замовчуванням для Deployment.

  Під час Rolling Update Kubernetes створює нові Pod з оновленим образом та поступово зупиняє старі. Параметри `maxSurge` та `maxUnavailable` контролюють швидкість оновлення: `maxSurge` визначає, скільки додаткових Pod можна створити, а `maxUnavailable` -- скільки Pod можуть бути недоступними одночасно.

  Якщо нова версія має помилки, можна виконати **rollback** до попередньої версії однією командою.

  ```yaml
  spec:
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 0
  ```

  ```bash
  # Оновлення образу
  kubectl set image deployment/web app=my-app:v3

  # Перевірка статусу оновлення
  kubectl rollout status deployment/web

  # Відкат до попередньої версії
  kubectl rollout undo deployment/web

  # Історія оновлень
  kubectl rollout history deployment/web
  ```
en_answer: |
  **Rolling Updates** are a Deployment update strategy in Kubernetes that gradually replaces old Pods with new ones without application downtime. This is the default strategy for Deployments.

  During a Rolling Update, Kubernetes creates new Pods with the updated image and gradually terminates old ones. The `maxSurge` and `maxUnavailable` parameters control the update speed: `maxSurge` defines how many extra Pods can be created, and `maxUnavailable` defines how many Pods can be unavailable simultaneously.

  If the new version has issues, you can perform a **rollback** to the previous version with a single command.

  ```yaml
  spec:
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 0
  ```

  ```bash
  # Update image
  kubectl set image deployment/web app=my-app:v3

  # Check update status
  kubectl rollout status deployment/web

  # Rollback to previous version
  kubectl rollout undo deployment/web

  # Update history
  kubectl rollout history deployment/web
  ```
section: "kubernetes"
order: 10
tags:
  - deployments
---
