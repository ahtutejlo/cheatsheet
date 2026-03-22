---
ua_question: "Чи оновлюються Pod автоматично при зміні ConfigMap?"
en_question: "Do Pods automatically update when a ConfigMap changes?"
ua_answer: |
  > **Trap:** Оновлення ConfigMap автоматично перезапускає Pod з новою конфігурацією. Насправді поведінка залежить від способу монтування: змонтовані томи оновлюються з затримкою, а змінні оточення ніколи не оновлюються без перезапуску Pod.

  Якщо ConfigMap підключений як **том (volume mount)**, kubelet періодично синхронізує файли. Затримка може становити до 1 хвилини (configurable через `kubelet --sync-frequency`). Але сам застосунок повинен стежити за змінами файлів -- Kubernetes лише оновлює файл на диску, не надсилає сигнал процесу.

  Якщо ConfigMap використовується через **змінні оточення (env)** або **envFrom**, значення встановлюються одноразово при створенні Pod і ніколи не змінюються. Єдиний спосіб отримати нові значення -- перезапустити Pod. Це найчастіше джерело плутанини.

  ```yaml
  # Volume mount -- updates eventually (up to ~1 min)
  apiVersion: v1
  kind: Pod
  metadata:
    name: volume-consumer
  spec:
    containers:
      - name: app
        image: myapp:v1
        volumeMounts:
          - name: config
            mountPath: /etc/config
    volumes:
      - name: config
        configMap:
          name: app-config
  ---
  # Env var -- NEVER updates without pod restart
  apiVersion: v1
  kind: Pod
  metadata:
    name: env-consumer
  spec:
    containers:
      - name: app
        image: myapp:v1
        envFrom:
          - configMapRef:
              name: app-config
  ```

  ```bash
  # Update ConfigMap
  kubectl edit configmap app-config

  # Force pod restart to pick up env changes
  kubectl rollout restart deployment/my-app

  # Annotation trick to force rollout on ConfigMap change
  kubectl patch deployment my-app -p \
    "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"configmap-hash\":\"$(kubectl get cm app-config -o jsonpath='{.metadata.resourceVersion}')\"}}}}}"
  ```

  Для автоматичного перезапуску при зміні ConfigMap використовуйте інструменти як **Reloader** або додавайте хеш ConfigMap в анотації Pod template -- зміна анотації тригерить rolling update.
en_answer: |
  > **Trap:** Updating a ConfigMap automatically restarts Pods with new configuration. In reality, behavior depends on the mounting method: mounted volumes update with a delay, while environment variables never update without a Pod restart.

  If a ConfigMap is attached as a **volume mount**, kubelet periodically syncs the files. The delay can be up to 1 minute (configurable via `kubelet --sync-frequency`). But the application itself must watch for file changes -- Kubernetes only updates the file on disk, it does not send a signal to the process.

  If a ConfigMap is used via **environment variables (env)** or **envFrom**, values are set once when the Pod is created and never change. The only way to get new values is to restart the Pod. This is the most common source of confusion.

  ```yaml
  # Volume mount -- updates eventually (up to ~1 min)
  apiVersion: v1
  kind: Pod
  metadata:
    name: volume-consumer
  spec:
    containers:
      - name: app
        image: myapp:v1
        volumeMounts:
          - name: config
            mountPath: /etc/config
    volumes:
      - name: config
        configMap:
          name: app-config
  ---
  # Env var -- NEVER updates without pod restart
  apiVersion: v1
  kind: Pod
  metadata:
    name: env-consumer
  spec:
    containers:
      - name: app
        image: myapp:v1
        envFrom:
          - configMapRef:
              name: app-config
  ```

  ```bash
  # Update ConfigMap
  kubectl edit configmap app-config

  # Force pod restart to pick up env changes
  kubectl rollout restart deployment/my-app

  # Annotation trick to force rollout on ConfigMap change
  kubectl patch deployment my-app -p \
    "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"configmap-hash\":\"$(kubectl get cm app-config -o jsonpath='{.metadata.resourceVersion}')\"}}}}}"
  ```

  For automatic restarts on ConfigMap changes, use tools like **Reloader** or add a ConfigMap hash to Pod template annotations -- changing the annotation triggers a rolling update.
section: "kubernetes"
order: 25
tags:
  - configmaps
  - configuration
  - pitfalls
type: "trick"
---
