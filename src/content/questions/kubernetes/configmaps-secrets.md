---
ua_question: "Яка різниця між ConfigMap та Secret?"
en_question: "What is the difference between ConfigMap and Secret?"
ua_answer: |
  **ConfigMap** та **Secret** -- це об'єкти Kubernetes для зберігання конфігураційних даних окремо від коду застосунку. Основна різниця полягає у рівні конфіденційності даних.

  **ConfigMap** зберігає нечутливі дані у вигляді пар ключ-значення: URL-адреси API, налаштування логування, параметри конфігурації. Дані зберігаються у відкритому вигляді.

  **Secret** зберігає конфіденційні дані: паролі, токени, ключі SSH, TLS-сертифікати. Дані кодуються у Base64 (але не шифруються за замовчуванням). Для справжнього шифрування потрібно увімкнути **Encryption at Rest**.

  ```yaml
  # ConfigMap
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: app-config
  data:
    DATABASE_HOST: "db.example.com"
    LOG_LEVEL: "info"

  ---
  # Secret
  apiVersion: v1
  kind: Secret
  metadata:
    name: app-secret
  type: Opaque
  data:
    DB_PASSWORD: cGFzc3dvcmQxMjM=  # base64
  ```

  ```yaml
  # Використання у Pod
  spec:
    containers:
      - name: app
        envFrom:
          - configMapRef:
              name: app-config
          - secretRef:
              name: app-secret
  ```
en_answer: |
  **ConfigMap** and **Secret** are Kubernetes objects for storing configuration data separately from application code. The main difference lies in the sensitivity level of the data.

  **ConfigMap** stores non-sensitive data as key-value pairs: API URLs, logging settings, configuration parameters. Data is stored in plain text.

  **Secret** stores sensitive data: passwords, tokens, SSH keys, TLS certificates. Data is encoded in Base64 (but not encrypted by default). For actual encryption, you need to enable **Encryption at Rest**.

  ```yaml
  # ConfigMap
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: app-config
  data:
    DATABASE_HOST: "db.example.com"
    LOG_LEVEL: "info"

  ---
  # Secret
  apiVersion: v1
  kind: Secret
  metadata:
    name: app-secret
  type: Opaque
  data:
    DB_PASSWORD: cGFzc3dvcmQxMjM=  # base64
  ```

  ```yaml
  # Usage in Pod
  spec:
    containers:
      - name: app
        envFrom:
          - configMapRef:
              name: app-config
          - secretRef:
              name: app-secret
  ```
section: "kubernetes"
order: 6
tags:
  - configuration
---
