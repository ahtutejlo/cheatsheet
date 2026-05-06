---
ua_question: "Replica sets, write concern, read preference — як це працює?"
en_question: "Replica sets, write concern, read preference — how does it work?"
ua_answer: |
  Replica set — група MongoDB-вузлів з одним **primary** і кількома **secondaries**, які реплікують дані з primary. Це базис High Availability в Mongo: failover автоматичний, мінімум 3 ноди (для majority elections).

  **Як працює реплікація:**
  1. Клієнт пише на primary
  2. Primary логує оп у **oplog** (capped collection `local.oplog.rs`)
  3. Secondaries поллять oplog і програють у себе
  4. Якщо primary упав — secondaries проводять election, новий primary вибирається

  **Write concern** — наскільки міцно ви хочете, щоб запис був "записаний" перш ніж клієнт отримає ack:

  ```javascript
  // Тільки primary прийняв (ризиковано — primary впаде, дані втрачені)
  db.orders.insertOne({...}, { writeConcern: { w: 1 } })

  // Most popular default — більшість нод підтвердили
  db.orders.insertOne({...}, { writeConcern: { w: "majority", wtimeout: 5000 } })

  // Усі secondaries у списку
  db.orders.insertOne({...}, { writeConcern: { w: 3, j: true } })  // j = journal flushed
  ```

  **Read preference** — звідки читати:
  - **`primary`** (default) — завжди з primary, strong consistency
  - **`primaryPreferred`** — primary якщо доступний, інакше secondary
  - **`secondary`** — тільки з secondaries (offload analytics)
  - **`secondaryPreferred`**
  - **`nearest`** — найменша network latency

  ```python
  # PyMongo
  from pymongo import MongoClient, ReadPreference
  from pymongo.read_concern import ReadConcern
  from pymongo.write_concern import WriteConcern

  client = MongoClient("mongodb+srv://cluster/")
  analytics_db = client.get_database(
      "analytics",
      read_preference=ReadPreference.SECONDARY_PREFERRED,
      read_concern=ReadConcern("majority")
  )

  orders_db = client.get_database(
      "orders",
      write_concern=WriteConcern(w="majority", j=True, wtimeout=5000)
  )
  ```

  **Read concern** — наскільки "видимий" має бути запис:
  - **`local`** — те, що бачить нода (може бути unconfirmed, може rollback)
  - **`majority`** — підтверджено більшістю (стійко до partitions)
  - **`linearizable`** — найсильніше, найдорожче (потрібно для consensus reads)

  **Trade-offs для тестування:**
  - Е2Е тести з `w: 1` можуть проходити, але дані іноді не доїжджають до secondaries → flake. Тест з `w: "majority"` повільніший, але стабільний.
  - Якщо ваш read preference = `secondaryPreferred`, тест "write then read" на одному з'єднанні може повернути stale data — у тестах фіксуйте `primary` reads.
  - Для load-тестів імітуйте production read preference щоб побачити реальну latency.

  **Failover behavior:**
  - При втраті primary, retryable writes автоматично перепосилаються (PyMongo робить це за замовчуванням)
  - Election зазвичай 10-12 секунд — клієнт має retry policy довшу за це
en_answer: |
  A replica set is a group of MongoDB nodes with one **primary** and several **secondaries** that replicate data from the primary. It's the foundation of High Availability in Mongo: failover is automatic, minimum 3 nodes (for majority elections).

  **How replication works:**
  1. Client writes to primary
  2. Primary logs the op in the **oplog** (capped collection `local.oplog.rs`)
  3. Secondaries poll the oplog and replay it
  4. If primary dies, secondaries hold an election; a new primary takes over

  **Write concern** — how durable do you want the write to be before the client gets ack:

  ```javascript
  // Only primary accepted (risky — if primary dies, data is gone)
  db.orders.insertOne({...}, { writeConcern: { w: 1 } })

  // Most popular default — majority of nodes confirmed
  db.orders.insertOne({...}, { writeConcern: { w: "majority", wtimeout: 5000 } })

  // All secondaries in the set
  db.orders.insertOne({...}, { writeConcern: { w: 3, j: true } })  // j = journal flushed
  ```

  **Read preference** — where to read from:
  - **`primary`** (default) — always primary, strong consistency
  - **`primaryPreferred`** — primary if available, otherwise secondary
  - **`secondary`** — only from secondaries (offload analytics)
  - **`secondaryPreferred`**
  - **`nearest`** — lowest network latency

  ```python
  # PyMongo
  from pymongo import MongoClient, ReadPreference
  from pymongo.read_concern import ReadConcern
  from pymongo.write_concern import WriteConcern

  client = MongoClient("mongodb+srv://cluster/")
  analytics_db = client.get_database(
      "analytics",
      read_preference=ReadPreference.SECONDARY_PREFERRED,
      read_concern=ReadConcern("majority")
  )

  orders_db = client.get_database(
      "orders",
      write_concern=WriteConcern(w="majority", j=True, wtimeout=5000)
  )
  ```

  **Read concern** — how "visible" the write must be:
  - **`local`** — whatever the node sees (could be unconfirmed, could roll back)
  - **`majority`** — confirmed by majority (partition-resistant)
  - **`linearizable`** — strongest, most expensive (needed for consensus reads)

  **Trade-offs for testing:**
  - End-to-end tests with `w: 1` may pass, but data sometimes doesn't reach secondaries → flake. A test with `w: "majority"` is slower but stable.
  - If your read preference is `secondaryPreferred`, a "write then read" test on the same connection may return stale data — pin tests to `primary` reads.
  - For load tests, mirror production read preference to see realistic latency.

  **Failover behavior:**
  - On primary loss, retryable writes are automatically resent (PyMongo does this by default)
  - Election usually takes 10-12 seconds — clients need a retry policy longer than that
section: "mongodb"
order: 4
tags: [mongodb, replication, consistency, high-availability]
---
