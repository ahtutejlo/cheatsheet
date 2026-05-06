---
ua_question: "Як працюють транзакції в MongoDB?"
en_question: "How do transactions work in MongoDB?"
ua_answer: |
  MongoDB підтримує multi-document ACID транзакції з 4.0 (replica sets) і 4.2 (sharded clusters). Реалізація — через **snapshot isolation** на основі WiredTiger MVCC + transaction coordinator для розподілених кейсів.

  **Базові концепції:**

  **Snapshot isolation** означає, що транзакція бачить consistent snapshot даних на момент її старту. Інші конкурентні транзакції не "просвічуються" — поки ваша не зробить commit, ви бачите свій світ.

  **Storage engine WiredTiger** використовує MVCC: кожен запис має timestamp, читачі читають snapshot за timestamp, нові записи створюють нові версії.

  **Структура коду:**

  ```python
  from pymongo import MongoClient
  from pymongo.errors import OperationFailure, ConnectionFailure

  client = MongoClient("mongodb+srv://cluster/")

  def transfer_funds(from_id, to_id, amount):
      with client.start_session() as session:
          def callback(s):
              accounts = client.bank.accounts
              accounts.update_one(
                  {"_id": from_id, "balance": {"$gte": amount}},
                  {"$inc": {"balance": -amount}},
                  session=s
              )
              accounts.update_one(
                  {"_id": to_id},
                  {"$inc": {"balance": amount}},
                  session=s
              )
              # якщо raise — auto-rollback

          # with_transaction обгортає start/commit/abort + retry
          session.with_transaction(
              callback,
              read_concern=ReadConcern("snapshot"),
              write_concern=WriteConcern("majority"),
              read_preference=ReadPreference.PRIMARY
          )
  ```

  **`with_transaction`** автоматично retry на:
  - `TransientTransactionError` (мережеві спайки, election)
  - `UnknownTransactionCommitResult` (commit прийшов, але ack загубився)

  **Обмеження:**
  - **Транзакція має 60-секундний ліміт** за замовчуванням (`transactionLifetimeLimitSeconds`). Це не replacement для batch jobs.
  - **Не можна виконувати DDL** (createCollection, createIndex) у транзакції в більшості версій
  - **Distributed (cross-shard)** транзакції мають додатковий 2-phase commit overhead — у 5-10 разів повільніше
  - **Write conflicts** — якщо два concurrent writes на той самий документ, один отримає `WriteConflict` і має retry

  **Коли НЕ використовувати:**
  - Якщо документ уже денормалізований і атомарне оновлення на одному документі — не треба транзакції (`$set`, `$inc` атомарні самі по собі)
  - Long-running batch jobs — це не їхня сила
  - Read-only консистенс — використайте `readConcern: "snapshot"` без full транзакції

  **Чому це важливо для тестування:**
  - **Test data setup** — створюйте seed дані в транзакції щоб тести бачили consistent state
  - **Concurrency tests** — два паралельні `with_transaction` на тому ж документі мають детерміновано завершитись (один success, один retry/abort) — добрий test case для race-detection
  - **Read-your-writes** — у тесті ви пишете і одразу читаєте: переконайтеся, що read у тій самій сесії, інакше snapshot може ще не бачити ваш write

  ```python
  # Тест на race condition
  def test_concurrent_transfers():
      with ThreadPoolExecutor(max_workers=2) as ex:
          f1 = ex.submit(transfer_funds, "a", "b", 50)
          f2 = ex.submit(transfer_funds, "a", "c", 50)
          # Обидва не можуть пройти, якщо balance=80
      assert get_balance("a") in (-20, 30)  # один пройшов, інший failed на $gte
  ```
en_answer: |
  MongoDB supports multi-document ACID transactions since 4.0 (replica sets) and 4.2 (sharded clusters). The implementation uses **snapshot isolation** built on WiredTiger MVCC plus a transaction coordinator for distributed cases.

  **Core concepts:**

  **Snapshot isolation** means a transaction sees a consistent snapshot of data at its start time. Concurrent transactions are not visible — until yours commits, you see your own world.

  **Storage engine WiredTiger** uses MVCC: every write has a timestamp, readers read a snapshot by timestamp, new writes create new versions.

  **Code shape:**

  ```python
  from pymongo import MongoClient
  from pymongo.errors import OperationFailure, ConnectionFailure

  client = MongoClient("mongodb+srv://cluster/")

  def transfer_funds(from_id, to_id, amount):
      with client.start_session() as session:
          def callback(s):
              accounts = client.bank.accounts
              accounts.update_one(
                  {"_id": from_id, "balance": {"$gte": amount}},
                  {"$inc": {"balance": -amount}},
                  session=s
              )
              accounts.update_one(
                  {"_id": to_id},
                  {"$inc": {"balance": amount}},
                  session=s
              )
              # raising aborts and rolls back

          # with_transaction wraps start/commit/abort + retry
          session.with_transaction(
              callback,
              read_concern=ReadConcern("snapshot"),
              write_concern=WriteConcern("majority"),
              read_preference=ReadPreference.PRIMARY
          )
  ```

  **`with_transaction`** retries automatically on:
  - `TransientTransactionError` (network blips, elections)
  - `UnknownTransactionCommitResult` (commit landed but the ack got lost)

  **Limits:**
  - **60-second default transaction lifetime** (`transactionLifetimeLimitSeconds`). Not a substitute for batch jobs.
  - **No DDL inside transactions** (createCollection, createIndex) in most versions
  - **Distributed (cross-shard)** transactions add 2-phase commit overhead — 5-10× slower
  - **Write conflicts** — two concurrent writes to the same document: one gets a `WriteConflict` and must retry

  **When NOT to use:**
  - When the document is already denormalized and an atomic single-doc update is enough (`$set`, `$inc` are atomic on their own)
  - Long-running batch jobs — not their strength
  - Read-only consistency — use `readConcern: "snapshot"` without a full transaction

  **Why this matters for testing:**
  - **Test data setup** — create seed data inside a transaction so tests see consistent state
  - **Concurrency tests** — two parallel `with_transaction` on the same document must terminate deterministically (one success, one retry/abort) — a great race-detection case
  - **Read-your-writes** — when a test writes and immediately reads, ensure the read uses the same session, otherwise the snapshot may not see your write yet

  ```python
  # Race condition test
  def test_concurrent_transfers():
      with ThreadPoolExecutor(max_workers=2) as ex:
          f1 = ex.submit(transfer_funds, "a", "b", 50)
          f2 = ex.submit(transfer_funds, "a", "c", 50)
          # Both can't succeed if balance=80
      assert get_balance("a") in (-20, 30)  # one passed, the other failed on $gte
  ```
section: "mongodb"
order: 5
tags: [mongodb, transactions, concurrency, acid]
type: "deep"
---
