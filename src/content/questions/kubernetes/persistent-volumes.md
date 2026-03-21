---
ua_question: "Як працюють Persistent Volumes?"
en_question: "How do Persistent Volumes work?"
ua_answer: |
  **Persistent Volumes (PV)** -- це механізм Kubernetes для управління довготривалим сховищем даних, яке існує незалежно від життєвого циклу Pod. Це дозволяє зберігати дані навіть після видалення Pod.

  Система працює за моделлю **PV/PVC**: адміністратор створює **PersistentVolume** (фізичний ресурс сховища), а розробник створює **PersistentVolumeClaim** (запит на сховище). Kubernetes автоматично зв'язує PVC з відповідним PV.

  **StorageClass** дозволяє динамічне створення PV за запитом. Коли PVC посилається на StorageClass, Kubernetes автоматично створює том потрібного розміру та типу.

  Режими доступу: **ReadWriteOnce** (один вузол), **ReadOnlyMany** (багато вузлів, тільки читання), **ReadWriteMany** (багато вузлів, читання та запис).

  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: data-pvc
  spec:
    accessModes:
      - ReadWriteOnce
    storageClassName: standard
    resources:
      requests:
        storage: 10Gi
  ---
  apiVersion: v1
  kind: Pod
  metadata:
    name: app-with-storage
  spec:
    containers:
      - name: app
        image: postgres:16
        volumeMounts:
          - mountPath: /var/lib/postgresql/data
            name: data-volume
    volumes:
      - name: data-volume
        persistentVolumeClaim:
          claimName: data-pvc
  ```
en_answer: |
  **Persistent Volumes (PV)** are a Kubernetes mechanism for managing long-lived storage that exists independently of Pod lifecycle. This allows data to persist even after a Pod is deleted.

  The system works on a **PV/PVC model**: an administrator creates a **PersistentVolume** (physical storage resource), and a developer creates a **PersistentVolumeClaim** (storage request). Kubernetes automatically binds the PVC to a matching PV.

  **StorageClass** enables dynamic PV provisioning on demand. When a PVC references a StorageClass, Kubernetes automatically creates a volume of the required size and type.

  Access modes: **ReadWriteOnce** (single node), **ReadOnlyMany** (many nodes, read-only), **ReadWriteMany** (many nodes, read-write).

  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: data-pvc
  spec:
    accessModes:
      - ReadWriteOnce
    storageClassName: standard
    resources:
      requests:
        storage: 10Gi
  ---
  apiVersion: v1
  kind: Pod
  metadata:
    name: app-with-storage
  spec:
    containers:
      - name: app
        image: postgres:16
        volumeMounts:
          - mountPath: /var/lib/postgresql/data
            name: data-volume
    volumes:
      - name: data-volume
        persistentVolumeClaim:
          claimName: data-pvc
  ```
section: "kubernetes"
order: 7
tags:
  - storage
---
