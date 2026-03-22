---
ua_question: "Як діагностувати Pod у стані CrashLoopBackOff?"
en_question: "How do you debug a Pod stuck in CrashLoopBackOff?"
ua_answer: |
  **Scenario:** Після деплою нової версії застосунку Pod постійно перезапускається зі статусом CrashLoopBackOff. У логах з'являється повідомлення "connection refused to database at db-service:5432". Команда не може зрозуміти, чому Pod не може підключитися до бази даних, яка працювала раніше.

  **Approach:**
  1. Перевірити логи Pod для розуміння причини збою
  2. Дослідити стан Pod через describe для виявлення подій та конфігурації
  3. Перевірити існування та доступність Service та Endpoints бази даних
  4. Протестувати мережеве з'єднання та DNS-резолюцію з debug-контейнера

  **Solution:**
  ```bash
  # Step 1: Check pod logs (current and previous crash)
  kubectl logs my-app-pod-xyz
  kubectl logs my-app-pod-xyz --previous

  # Step 2: Describe pod for events and config
  kubectl describe pod my-app-pod-xyz
  # Look for: Events section, env vars, volume mounts

  # Step 3: Verify database service exists and has endpoints
  kubectl get svc db-service
  kubectl get endpoints db-service
  # If endpoints list is empty -- database pods are not running or labels don't match

  # Step 4: Test connectivity from a debug container
  kubectl run debug --rm -it --image=busybox -- sh
  # Inside debug container:
  nslookup db-service
  nc -zv db-service 5432

  # Step 5: Check if database pods are running
  kubectl get pods -l app=database
  kubectl describe pod database-pod-abc

  # Step 6: If DNS works but connection refused -- check NetworkPolicy
  kubectl get networkpolicy -A
  kubectl describe networkpolicy db-policy

  # Common fix: service selector mismatch
  kubectl get svc db-service -o yaml | grep -A5 selector
  kubectl get pods --show-labels | grep database
  ```

  У цьому випадку причиною виявився неправильний selector у Service -- після оновлення Helm-чарту лейбл бази змінився з `app: database` на `app: postgresql`, а Service досі шукав старий лейбл. Виправлення selector у Service вирішило проблему.
en_answer: |
  **Scenario:** After deploying a new application version, the Pod keeps restarting with CrashLoopBackOff status. Logs show "connection refused to database at db-service:5432". The team cannot understand why the Pod cannot connect to the database that was working before.

  **Approach:**
  1. Check Pod logs to understand the crash reason
  2. Investigate Pod state via describe to find events and configuration
  3. Verify the existence and availability of the database Service and Endpoints
  4. Test network connectivity and DNS resolution from a debug container

  **Solution:**
  ```bash
  # Step 1: Check pod logs (current and previous crash)
  kubectl logs my-app-pod-xyz
  kubectl logs my-app-pod-xyz --previous

  # Step 2: Describe pod for events and config
  kubectl describe pod my-app-pod-xyz
  # Look for: Events section, env vars, volume mounts

  # Step 3: Verify database service exists and has endpoints
  kubectl get svc db-service
  kubectl get endpoints db-service
  # If endpoints list is empty -- database pods are not running or labels don't match

  # Step 4: Test connectivity from a debug container
  kubectl run debug --rm -it --image=busybox -- sh
  # Inside debug container:
  nslookup db-service
  nc -zv db-service 5432

  # Step 5: Check if database pods are running
  kubectl get pods -l app=database
  kubectl describe pod database-pod-abc

  # Step 6: If DNS works but connection refused -- check NetworkPolicy
  kubectl get networkpolicy -A
  kubectl describe networkpolicy db-policy

  # Common fix: service selector mismatch
  kubectl get svc db-service -o yaml | grep -A5 selector
  kubectl get pods --show-labels | grep database
  ```

  In this case, the root cause was an incorrect selector in the Service -- after a Helm chart update, the database label changed from `app: database` to `app: postgresql`, but the Service was still looking for the old label. Fixing the Service selector resolved the issue.
section: "kubernetes"
order: 26
tags:
  - debugging
  - troubleshooting
  - pods
type: "practical"
---
