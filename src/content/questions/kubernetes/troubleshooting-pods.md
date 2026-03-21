---
ua_question: "Як діагностувати проблеми з Pod?"
en_question: "How to troubleshoot Pod issues?"
ua_answer: |
  Діагностика Pod у Kubernetes починається з перевірки стану Pod та аналізу подій. Ось систематичний підхід до вирішення проблем.

  **Крок 1: Перевірка стану Pod**
  ```bash
  kubectl get pods -o wide
  kubectl describe pod my-pod
  ```

  **Крок 2: Аналіз логів**
  ```bash
  kubectl logs my-pod
  kubectl logs my-pod --previous    # Логи попереднього контейнера
  kubectl logs my-pod -c sidecar    # Логи конкретного контейнера
  ```

  **Крок 3: Перевірка всередині контейнера**
  ```bash
  kubectl exec -it my-pod -- bash
  kubectl exec my-pod -- curl localhost:8080/health
  ```

  **Типові проблеми:**
  - **ImagePullBackOff** -- невірне ім'я образу або відсутній доступ до registry
  - **CrashLoopBackOff** -- застосунок падає при старті (перевірте логи)
  - **Pending** -- недостатньо ресурсів або невідповідність nodeSelector
  - **OOMKilled** -- перевищення ліміту пам'яті (збільшіть limits)
  - **Evicted** -- вузол під тиском ресурсів (перевірте `kubectl describe node`)
en_answer: |
  Troubleshooting Pods in Kubernetes starts with checking Pod status and analyzing events. Here is a systematic approach to resolving issues.

  **Step 1: Check Pod status**
  ```bash
  kubectl get pods -o wide
  kubectl describe pod my-pod
  ```

  **Step 2: Analyze logs**
  ```bash
  kubectl logs my-pod
  kubectl logs my-pod --previous    # Previous container logs
  kubectl logs my-pod -c sidecar    # Specific container logs
  ```

  **Step 3: Check inside the container**
  ```bash
  kubectl exec -it my-pod -- bash
  kubectl exec my-pod -- curl localhost:8080/health
  ```

  **Common issues:**
  - **ImagePullBackOff** -- incorrect image name or missing registry access
  - **CrashLoopBackOff** -- application crashes on startup (check logs)
  - **Pending** -- insufficient resources or nodeSelector mismatch
  - **OOMKilled** -- memory limit exceeded (increase limits)
  - **Evicted** -- node under resource pressure (check `kubectl describe node`)
section: "kubernetes"
order: 15
tags:
  - troubleshooting
---
