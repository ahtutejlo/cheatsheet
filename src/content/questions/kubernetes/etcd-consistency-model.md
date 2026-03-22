---
ua_question: "Як etcd забезпечує консистентність даних у Kubernetes?"
en_question: "How does etcd ensure data consistency in Kubernetes?"
ua_answer: |
  **etcd** -- це розподілене сховище ключ-значення, яке зберігає весь стан кластера Kubernetes. Воно використовує алгоритм консенсусу **Raft** для забезпечення сильної консистентності між усіма вузлами etcd-кластера.

  Raft працює за принципом обрання лідера: один вузол обирається лідером, і всі операції запису проходять через нього. Лідер реплікує зміни на більшість (quorum) вузлів, перш ніж підтвердити запис. Це означає, що кластер з 3 вузлів витримує відмову 1 вузла, а кластер з 5 -- відмову 2 вузлів. Kubernetes API-сервер читає та записує дані виключно через etcd.

  etcd підтримує **лінеаризовані читання** (linearizable reads), які гарантують, що клієнт завжди бачить найсвіжіший стан. Також etcd надає механізм **watch**, який дозволяє компонентам Kubernetes (контролерам, планувальнику) отримувати сповіщення про зміни в реальному часі без постійного опитування.

  ```bash
  # Check etcd cluster health
  etcdctl endpoint health --cluster

  # Read a key with linearizable consistency
  etcdctl get /registry/pods/default/my-pod --consistency=l

  # Watch for changes on a key prefix
  etcdctl watch /registry/pods/ --prefix

  # Check etcd cluster member list
  etcdctl member list -w table

  # Compact and defragment etcd (maintenance)
  etcdctl compact $(etcdctl endpoint status -w json | jq '.[0].Status.header.revision')
  etcdctl defrag --cluster
  ```

  На співбесіді розуміння ролі etcd допомагає пояснити, чому кластер Kubernetes не може працювати без etcd, як забезпечується відмовостійкість та чому непарна кількість вузлів etcd є стандартною практикою.
en_answer: |
  **etcd** is a distributed key-value store that holds the entire state of a Kubernetes cluster. It uses the **Raft** consensus algorithm to ensure strong consistency across all etcd cluster nodes.

  Raft works on a leader election principle: one node is elected as the leader, and all write operations go through it. The leader replicates changes to a majority (quorum) of nodes before confirming the write. This means a 3-node cluster tolerates 1 node failure, and a 5-node cluster tolerates 2 node failures. The Kubernetes API server reads and writes data exclusively through etcd.

  etcd supports **linearizable reads**, which guarantee that the client always sees the most recent state. etcd also provides a **watch** mechanism that allows Kubernetes components (controllers, scheduler) to receive real-time notifications about changes without constant polling.

  ```bash
  # Check etcd cluster health
  etcdctl endpoint health --cluster

  # Read a key with linearizable consistency
  etcdctl get /registry/pods/default/my-pod --consistency=l

  # Watch for changes on a key prefix
  etcdctl watch /registry/pods/ --prefix

  # Check etcd cluster member list
  etcdctl member list -w table

  # Compact and defragment etcd (maintenance)
  etcdctl compact $(etcdctl endpoint status -w json | jq '.[0].Status.header.revision')
  etcdctl defrag --cluster
  ```

  In interviews, understanding etcd's role helps explain why a Kubernetes cluster cannot operate without etcd, how fault tolerance is achieved, and why an odd number of etcd nodes is standard practice.
section: "kubernetes"
order: 17
tags:
  - etcd
  - consensus
  - storage
type: "deep"
---
