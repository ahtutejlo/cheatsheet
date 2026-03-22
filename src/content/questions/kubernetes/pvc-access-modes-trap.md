---
ua_question: "Чи гарантує ReadWriteMany безпечний одночасний запис із кількох Pod?"
en_question: "Does ReadWriteMany guarantee safe concurrent writes from multiple Pods?"
ua_answer: |
  > **Trap:** Режим доступу ReadWriteMany (RWX) означає, що будь-який Pod може безпечно писати одночасно без конфліктів. Насправді RWX надає лише доступ на рівні файлової системи, а не координацію на рівні додатку.

  PersistentVolume Access Modes визначають, скільки вузлів можуть одночасно монтувати том: **ReadWriteOnce (RWO)** -- один вузол для читання та запису, **ReadOnlyMany (ROX)** -- багато вузлів тільки для читання, **ReadWriteMany (RWX)** -- багато вузлів для читання та запису.

  Проблема в тому, що RWX не забезпечує жодного механізму блокування або координації. Якщо два Pod одночасно записують у один файл, результат непередбачуваний -- дані можуть бути пошкоджені. Це особливо критично для баз даних. Наприклад, SQLite на RWX-томі з кількома Pod призведе до корупції бази.

  ```yaml
  # PVC with ReadWriteMany -- filesystem access only
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: shared-data
  spec:
    accessModes:
      - ReadWriteMany
    storageClassName: nfs
    resources:
      requests:
        storage: 10Gi
  ---
  # Safe: multiple readers, single writer pattern
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: log-writer
  spec:
    replicas: 1  # Only ONE writer
    selector:
      matchLabels:
        role: writer
    template:
      metadata:
        labels:
          role: writer
      spec:
        containers:
          - name: writer
            image: app:v1
            volumeMounts:
              - name: shared
                mountPath: /data
        volumes:
          - name: shared
            persistentVolumeClaim:
              claimName: shared-data
  ```

  Безпечні патерни для RWX: один Pod-записувач з кількома Pod-читачами, використання файлового блокування (flock), або розділення файлів за Pod (кожен пише у свій файл). Для баз даних завжди використовуйте ReadWriteOnce з StatefulSet.
en_answer: |
  > **Trap:** ReadWriteMany (RWX) access mode means any Pod can safely write simultaneously without conflicts. In reality, RWX provides only filesystem-level access, not application-level coordination.

  PersistentVolume Access Modes define how many nodes can mount the volume simultaneously: **ReadWriteOnce (RWO)** -- one node for read-write, **ReadOnlyMany (ROX)** -- many nodes read-only, **ReadWriteMany (RWX)** -- many nodes for read-write.

  The problem is that RWX provides no locking or coordination mechanism. If two Pods write to the same file simultaneously, the result is unpredictable -- data can be corrupted. This is especially critical for databases. For example, SQLite on an RWX volume with multiple Pods will lead to database corruption.

  ```yaml
  # PVC with ReadWriteMany -- filesystem access only
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: shared-data
  spec:
    accessModes:
      - ReadWriteMany
    storageClassName: nfs
    resources:
      requests:
        storage: 10Gi
  ---
  # Safe: multiple readers, single writer pattern
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: log-writer
  spec:
    replicas: 1  # Only ONE writer
    selector:
      matchLabels:
        role: writer
    template:
      metadata:
        labels:
          role: writer
      spec:
        containers:
          - name: writer
            image: app:v1
            volumeMounts:
              - name: shared
                mountPath: /data
        volumes:
          - name: shared
            persistentVolumeClaim:
              claimName: shared-data
  ```

  Safe patterns for RWX: single writer Pod with multiple reader Pods, using file locking (flock), or file partitioning per Pod (each writes to its own file). For databases, always use ReadWriteOnce with StatefulSet.
section: "kubernetes"
order: 22
tags:
  - storage
  - pvc
  - pitfalls
type: "trick"
---
