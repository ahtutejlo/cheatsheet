---
ua_question: "Які основні команди kubectl?"
en_question: "What are the essential kubectl commands?"
ua_answer: |
  **kubectl** -- це інструмент командного рядка для взаємодії з Kubernetes кластером. Ось найважливіші команди, згруповані за категоріями.

  **Отримання інформації:**
  ```bash
  kubectl get pods                    # Список Pod
  kubectl get services               # Список Service
  kubectl get deployments            # Список Deployment
  kubectl get all -n my-namespace    # Всі ресурси у namespace
  kubectl describe pod my-pod        # Детальна інформація про Pod
  ```

  **Створення та управління:**
  ```bash
  kubectl apply -f manifest.yaml     # Створити/оновити ресурс
  kubectl delete -f manifest.yaml    # Видалити ресурс
  kubectl scale deployment web --replicas=5  # Масштабування
  kubectl edit deployment web        # Редагування ресурсу
  ```

  **Діагностика:**
  ```bash
  kubectl logs my-pod                # Логи Pod
  kubectl logs my-pod -c sidecar     # Логи конкретного контейнера
  kubectl exec -it my-pod -- bash    # Вхід у контейнер
  kubectl port-forward svc/web 8080:80  # Перенаправлення порту
  kubectl top pods                   # Використання ресурсів
  ```
en_answer: |
  **kubectl** is the command-line tool for interacting with a Kubernetes cluster. Here are the most important commands grouped by category.

  **Getting information:**
  ```bash
  kubectl get pods                    # List Pods
  kubectl get services               # List Services
  kubectl get deployments            # List Deployments
  kubectl get all -n my-namespace    # All resources in a namespace
  kubectl describe pod my-pod        # Detailed Pod information
  ```

  **Creating and managing:**
  ```bash
  kubectl apply -f manifest.yaml     # Create/update a resource
  kubectl delete -f manifest.yaml    # Delete a resource
  kubectl scale deployment web --replicas=5  # Scaling
  kubectl edit deployment web        # Edit a resource
  ```

  **Diagnostics:**
  ```bash
  kubectl logs my-pod                # Pod logs
  kubectl logs my-pod -c sidecar     # Specific container logs
  kubectl exec -it my-pod -- bash    # Enter a container
  kubectl port-forward svc/web 8080:80  # Port forwarding
  kubectl top pods                   # Resource usage
  ```
section: "kubernetes"
order: 9
tags:
  - cli
---
