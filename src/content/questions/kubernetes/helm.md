---
ua_question: "Що таке Helm?"
en_question: "What is Helm?"
ua_answer: |
  **Helm** -- це пакетний менеджер для Kubernetes, який спрощує встановлення, оновлення та управління застосунками в кластері. Helm використовує **charts** -- пакети, що містять шаблони Kubernetes маніфестів та конфігурацію за замовчуванням.

  **Chart** складається з шаблонів (`templates/`), файлу значень (`values.yaml`) та метаданих (`Chart.yaml`). Шаблони використовують Go template syntax для параметризації маніфестів.

  **Release** -- це екземпляр chart, встановлений у кластері. Один chart можна встановити кілька разів з різними конфігураціями.

  **Helm repositories** -- це сховища chart. Популярні репозиторії: Artifact Hub, Bitnami, official Helm charts.

  ```bash
  # Основні команди Helm
  helm repo add bitnami https://charts.bitnami.com/bitnami
  helm repo update
  helm search repo nginx

  # Встановлення chart
  helm install my-release bitnami/nginx \
    --set service.type=ClusterIP \
    --namespace web

  # Оновлення та управління
  helm upgrade my-release bitnami/nginx -f custom-values.yaml
  helm list
  helm rollback my-release 1
  helm uninstall my-release
  ```
en_answer: |
  **Helm** is a package manager for Kubernetes that simplifies the installation, upgrade, and management of applications in a cluster. Helm uses **charts** -- packages that contain templates of Kubernetes manifests and default configuration.

  A **Chart** consists of templates (`templates/`), a values file (`values.yaml`), and metadata (`Chart.yaml`). Templates use Go template syntax to parameterize manifests.

  A **Release** is an instance of a chart installed in a cluster. A single chart can be installed multiple times with different configurations.

  **Helm repositories** are chart storage locations. Popular repositories include Artifact Hub, Bitnami, and official Helm charts.

  ```bash
  # Essential Helm commands
  helm repo add bitnami https://charts.bitnami.com/bitnami
  helm repo update
  helm search repo nginx

  # Install a chart
  helm install my-release bitnami/nginx \
    --set service.type=ClusterIP \
    --namespace web

  # Upgrade and manage
  helm upgrade my-release bitnami/nginx -f custom-values.yaml
  helm list
  helm rollback my-release 1
  helm uninstall my-release
  ```
section: "kubernetes"
order: 13
tags:
  - tooling
---
