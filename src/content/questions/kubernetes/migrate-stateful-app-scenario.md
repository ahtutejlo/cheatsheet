---
ua_question: "Як мігрувати PostgreSQL з віртуальної машини в Kubernetes без втрати даних?"
en_question: "How do you migrate PostgreSQL from a VM to Kubernetes with zero data loss?"
ua_answer: |
  **Scenario:** PostgreSQL працює на виділеній VM з 500GB даних. Команда хоче перенести базу в Kubernetes для уніфікації інфраструктури. Критична вимога -- нульова втрата даних та мінімальний простій (менше 5 хвилин).

  **Approach:**
  1. Підготувати StatefulSet з PersistentVolumeClaim та init-контейнером для міграції
  2. Налаштувати потокову реплікацію з VM на K8s Pod для синхронізації даних
  3. Виконати switchover з мінімальним простоєм після повної синхронізації

  **Solution:**
  ```yaml
  # StatefulSet for PostgreSQL
  apiVersion: apps/v1
  kind: StatefulSet
  metadata:
    name: postgresql
  spec:
    serviceName: postgresql
    replicas: 1
    selector:
      matchLabels:
        app: postgresql
    template:
      metadata:
        labels:
          app: postgresql
      spec:
        initContainers:
          - name: restore-backup
            image: postgres:15
            command:
              - sh
              - -c
              - |
                if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
                  echo "Restoring from base backup..."
                  pg_basebackup -h $SOURCE_HOST -U replicator \
                    -D /var/lib/postgresql/data -Fp -Xs -P
                fi
            env:
              - name: SOURCE_HOST
                valueFrom:
                  secretKeyRef:
                    name: migration-secrets
                    key: source-host
              - name: PGPASSWORD
                valueFrom:
                  secretKeyRef:
                    name: migration-secrets
                    key: replicator-password
            volumeMounts:
              - name: pgdata
                mountPath: /var/lib/postgresql/data
        containers:
          - name: postgresql
            image: postgres:15
            ports:
              - containerPort: 5432
            env:
              - name: POSTGRES_PASSWORD
                valueFrom:
                  secretKeyRef:
                    name: postgresql-secrets
                    key: password
              - name: PGDATA
                value: /var/lib/postgresql/data
            volumeMounts:
              - name: pgdata
                mountPath: /var/lib/postgresql/data
            readinessProbe:
              exec:
                command:
                  - pg_isready
                  - -U
                  - postgres
              periodSeconds: 10
    volumeClaimTemplates:
      - metadata:
          name: pgdata
        spec:
          accessModes:
            - ReadWriteOnce
          storageClassName: fast-ssd
          resources:
            requests:
              storage: 600Gi
  ---
  # Headless service for StatefulSet
  apiVersion: v1
  kind: Service
  metadata:
    name: postgresql
  spec:
    type: ClusterIP
    clusterIP: None
    selector:
      app: postgresql
    ports:
      - port: 5432
  ```

  ```bash
  # Step 1: Create secrets
  kubectl create secret generic migration-secrets \
    --from-literal=source-host=10.0.1.50 \
    --from-literal=replicator-password=secret

  # Step 2: Deploy StatefulSet (init container restores base backup)
  kubectl apply -f postgresql-statefulset.yaml

  # Step 3: Verify replication lag
  kubectl exec postgresql-0 -- psql -U postgres -c \
    "SELECT pg_last_wal_replay_lsn(), pg_last_wal_receive_lsn();"

  # Step 4: Switchover (when lag is zero)
  # On source VM: stop writes, verify final sync
  # On K8s: promote to primary
  kubectl exec postgresql-0 -- pg_ctl promote -D /var/lib/postgresql/data

  # Step 5: Verify
  kubectl exec postgresql-0 -- psql -U postgres -c "SELECT count(*) FROM critical_table;"
  ```

  Ключові моменти: використовуйте `ReadWriteOnce` для баз даних (ніколи RWX), `storageClassName` з SSD для продуктивності, та завжди тестуйте процедуру відновлення з бекапу перед продакшн-міграцією.
en_answer: |
  **Scenario:** PostgreSQL runs on a dedicated VM with 500GB of data. The team wants to move the database to Kubernetes to unify infrastructure. Critical requirements: zero data loss and minimal downtime (under 5 minutes).

  **Approach:**
  1. Prepare a StatefulSet with PersistentVolumeClaim and an init container for migration
  2. Set up streaming replication from VM to K8s Pod for data synchronization
  3. Perform switchover with minimal downtime after full synchronization

  **Solution:**
  ```yaml
  # StatefulSet for PostgreSQL
  apiVersion: apps/v1
  kind: StatefulSet
  metadata:
    name: postgresql
  spec:
    serviceName: postgresql
    replicas: 1
    selector:
      matchLabels:
        app: postgresql
    template:
      metadata:
        labels:
          app: postgresql
      spec:
        initContainers:
          - name: restore-backup
            image: postgres:15
            command:
              - sh
              - -c
              - |
                if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
                  echo "Restoring from base backup..."
                  pg_basebackup -h $SOURCE_HOST -U replicator \
                    -D /var/lib/postgresql/data -Fp -Xs -P
                fi
            env:
              - name: SOURCE_HOST
                valueFrom:
                  secretKeyRef:
                    name: migration-secrets
                    key: source-host
              - name: PGPASSWORD
                valueFrom:
                  secretKeyRef:
                    name: migration-secrets
                    key: replicator-password
            volumeMounts:
              - name: pgdata
                mountPath: /var/lib/postgresql/data
        containers:
          - name: postgresql
            image: postgres:15
            ports:
              - containerPort: 5432
            env:
              - name: POSTGRES_PASSWORD
                valueFrom:
                  secretKeyRef:
                    name: postgresql-secrets
                    key: password
              - name: PGDATA
                value: /var/lib/postgresql/data
            volumeMounts:
              - name: pgdata
                mountPath: /var/lib/postgresql/data
            readinessProbe:
              exec:
                command:
                  - pg_isready
                  - -U
                  - postgres
              periodSeconds: 10
    volumeClaimTemplates:
      - metadata:
          name: pgdata
        spec:
          accessModes:
            - ReadWriteOnce
          storageClassName: fast-ssd
          resources:
            requests:
              storage: 600Gi
  ---
  # Headless service for StatefulSet
  apiVersion: v1
  kind: Service
  metadata:
    name: postgresql
  spec:
    type: ClusterIP
    clusterIP: None
    selector:
      app: postgresql
    ports:
      - port: 5432
  ```

  ```bash
  # Step 1: Create secrets
  kubectl create secret generic migration-secrets \
    --from-literal=source-host=10.0.1.50 \
    --from-literal=replicator-password=secret

  # Step 2: Deploy StatefulSet (init container restores base backup)
  kubectl apply -f postgresql-statefulset.yaml

  # Step 3: Verify replication lag
  kubectl exec postgresql-0 -- psql -U postgres -c \
    "SELECT pg_last_wal_replay_lsn(), pg_last_wal_receive_lsn();"

  # Step 4: Switchover (when lag is zero)
  # On source VM: stop writes, verify final sync
  # On K8s: promote to primary
  kubectl exec postgresql-0 -- pg_ctl promote -D /var/lib/postgresql/data

  # Step 5: Verify
  kubectl exec postgresql-0 -- psql -U postgres -c "SELECT count(*) FROM critical_table;"
  ```

  Key points: use `ReadWriteOnce` for databases (never RWX), `storageClassName` with SSD for performance, and always test the backup restore procedure before production migration.
section: "kubernetes"
order: 29
tags:
  - statefulsets
  - migration
  - databases
type: "practical"
---
